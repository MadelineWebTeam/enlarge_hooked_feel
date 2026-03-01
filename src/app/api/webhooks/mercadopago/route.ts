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

    // 🔒 Solo procesar eventos de tipo payment
    if (body.type !== "payment") {
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data?.id

    if (!paymentId) {
      return NextResponse.json({ received: true })
    }

    // 🔥 Obtener pago real desde MercadoPago
    const payment = await new Payment(client).get({
      id: paymentId,
    })

    const externalReference = payment.external_reference

    if (!externalReference) {
      console.log("No external reference")
      return NextResponse.json({ received: true })
    }

    const orderId = Number(externalReference)

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      console.log("Order not found:", orderId)
      return NextResponse.json({ received: true })
    }

    // 🔒 Validar que la preference coincida
    if (
      order.mercadoPagoPreferenceId) {
      throw new Error("Preference mismatch")
    }

    // 🔒 Validar monto
    if (Number(payment.transaction_amount) !== Number(order.total)) {
      throw new Error("Payment amount mismatch")
    }

    // =========================================================
    // 🔥 PAGO APROBADO
    // =========================================================
    if (
      payment.status === "approved" &&
      payment.status_detail === "accredited"
    ) {
      await prisma.$transaction(async (tx) => {
        const freshOrder = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        })

        if (!freshOrder) {
          throw new Error("Order disappeared")
        }

        // 🔒 Idempotencia
        if (freshOrder.status === "PAID") {
          console.log("Order already processed:", orderId)
          return
        }

        // 🔒 Validar stock
        for (const item of freshOrder.items) {
          if (!item.variantId) continue

          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
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
        for (const item of freshOrder.items) {
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

    // =========================================================
    // ❌ PAGO RECHAZADO
    // =========================================================
    if (payment.status === "rejected") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "REJECTED" },
      })
    }

    // =========================================================
    // 🚫 PAGO CANCELADO
    // =========================================================
    if (payment.status === "cancelled") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    )
  }
}
