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

    console.log("PAYMENT STATUS:", payment.status)

    const externalReference = payment.external_reference

    if (!externalReference) {
      console.log("No external reference")
      return NextResponse.json({ received: true })
    }

    const orderId = Number(externalReference)

    if (payment.status === "approved") {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (!order) {
        console.log("Order not found:", orderId)
        return NextResponse.json({ received: true })
      }

      if (order.status === "PAID") {
        return NextResponse.json({ received: true })
      }

      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          mercadoPagoPaymentId: String(paymentId),
        },
      })

      console.log("✅ ORDER UPDATED TO PAID:", orderId)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}