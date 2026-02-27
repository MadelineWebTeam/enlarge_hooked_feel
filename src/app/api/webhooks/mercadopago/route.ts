import { MercadoPagoConfig, Payment } from "mercadopago"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK RECIBIDO 🔥")

  try {
    const body = await req.json()
    console.log("BODY:", body)

    const paymentId = body.data?.id

    if (!paymentId) {
      return NextResponse.json({ received: true })
    }

    const payment = await new Payment(client).get({
      id: paymentId,
    })

    const externalReference = payment.external_reference

    if (!externalReference) {
      console.log("No external reference")
      return NextResponse.json({ received: true })
    }

    const orderId = Number(externalReference)

    if (payment.status === "approved") {
      await prisma.$transaction(async (tx) => {

        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        })

        if (!order) {
          console.log("Order not found:", orderId)
          return
        }

        // 🔒 Idempotencia → si ya está pagada, salir
        if (order.status === "PAID") {
          console.log("Order already processed:", orderId)
          return
        }

        // 🔒 Validar stock antes de descontar
        for (const item of order.items) {
          if (!item.variantId) continue

          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId }
          })

          if (!variant) {
            throw new Error("Variant not found")
          }

          if (variant.stock < item.quantity) {
            throw new Error(
              `Stock insuficiente para variante ${variant.id}`
            )
          }
        }

        // 🔥 Descontar stock
        for (const item of order.items) {
          if (!item.variantId) continue

          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        }

        // 🔥 Marcar orden como pagada
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            mercadoPagoPaymentId: String(paymentId),
          },
        })
      })
    }


    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}