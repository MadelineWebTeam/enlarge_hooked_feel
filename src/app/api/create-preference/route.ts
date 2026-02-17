import { MercadoPagoConfig, Preference } from "mercadopago"
import { NextResponse } from "next/server"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const preference = new Preference(client)

    const cartItems = body.items.map((item: any) => {
      const price = Number(item.price)

      if (!price || isNaN(price)) {
        throw new Error("Precio inválido en item")
      }

      return {
        id: String(item.id),
        title: item.name,
        quantity: item.quantity ?? 1,
        unit_price: price,
        currency_id: "MXN",
      }
    })

    const response = await preference.create({
      body: {
        items: cartItems,
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
      },
    })

    return NextResponse.json({
      init_point: response.init_point,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Error creating preference" },
      { status: 500 }
    )
  }
}