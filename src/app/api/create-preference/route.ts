import { MercadoPagoConfig, Preference } from "mercadopago"
import { NextResponse } from "next/server"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const preference = new Preference(client)

    const response = await preference.create({
      body: {
        items: [
          {
            title: body.title,
            quantity: 1,
            unit_price: Number(body.price),
            currency_id: "MXN",
          },
        ],
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
        auto_return: "approved",
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
