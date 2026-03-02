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

    const signature = req.headers.get("x-signature")
    const requestId = req.headers.get("x-request-id")

    if (!signature || !requestId) {
      return NextResponse.json({ received: true })
    }

    if (body.type !== "payment") {
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data?.id

    if (!paymentId) {
      return NextResponse.json({ received: true })
    }

    const payment = await new Payment(client).get({
      id: paymentId,
    })

    if (!payment) return NextResponse.json({ received: true })

    const externalReference = payment.external_reference

    if (!externalReference) return NextResponse.json({ received: true })

    const orderId = Number(externalReference)

    // =====================================================
    // 🔒 TRANSACTIONAL PROCESSING (ULTRA SAFE ZONE)
    // =====================================================

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      const preferenceId = (payment as any).preference_id
      
      console.log("ORDER PREF:", order.mercadoPagoPreferenceId)
      console.log("PAYMENT PREF:", preferenceId)

      const externalReference = payment.external_reference

      if (!externalReference) return

      if (!order) return

      // ⭐ Idempotency lock
      if (order.status === "PAID") {
        console.log("Order already paid")
        return
      }

      // ⭐ Amount validation
      if (Number(payment.transaction_amount) !== Number(order.total)) {
        console.log("Amount mismatch")
        return
      }

      // =====================================================
      // PAYMENT APPROVED
      // =====================================================

      if (payment.status === "approved") {
        // Snapshot stock validation
        for (const item of order.items) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          })

          if (!variant) throw new Error("Variant not found")

          if (variant.stock < item.quantity) {
            throw new Error("Stock insuficiente")
          }
        }

        // Atomic stock decrement
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        }

        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            mercadoPagoPaymentId: String(paymentId),
            paidAt: new Date(),
          },
        })
      }

      // =====================================================
      // PAYMENT REJECTED
      // =====================================================

      if (payment.status === "rejected") {
        await tx.order.update({
          where: { id: orderId },
          data: { status: "REJECTED" },
        })
      }

      // =====================================================
      // PAYMENT CANCELLED
      // =====================================================

      if (payment.status === "cancelled") {
        await tx.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        })
      }
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)

    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    )
  }
}