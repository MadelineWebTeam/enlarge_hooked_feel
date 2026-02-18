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

    // MercadoPago manda distintos tipos de notificaciones
    if (body.type !== "payment") {
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data.id

    if (!paymentId) {
      return NextResponse.json({ error: "No payment ID" }, { status: 400 })
    }

    // 🔥 1. Obtener datos reales del pago
    const payment = await new Payment(client).get({
      id: paymentId,
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const status = payment.status
    const externalReference = payment.external_reference

    if (!externalReference) {
      return NextResponse.json({ error: "No external reference" }, { status: 400 })
    }

    const orderId = Number(externalReference)

    // 🔥 2. Si el pago fue aprobado
    if (status === "approved") {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      // Evitar procesarlo dos veces
      if (order.status === "PAID") {
        return NextResponse.json({ received: true })
      }

      // 🔥 3. Reducir stock
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

      // 🔥 4. Actualizar orden
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          mercadoPagoPaymentId: String(paymentId),
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
