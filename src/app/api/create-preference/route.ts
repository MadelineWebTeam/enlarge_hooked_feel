import { MercadoPagoConfig, Preference } from "mercadopago"
import { NextResponse } from "next/server"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const preference = new Preference(client)
    const price = Number(
        String(body.price)
            .replace("$", "")
            .replace(",", "")
    )
    
    if (!price || isNaN(price)) {
        console.log("Precio inválido:", body.price)
        return NextResponse.json(
            

            { error: "Precio inválido" },
            { status: 400 }
        )
    }
    const cartItems = body.items.map((item: any) => {
    const price = Number(item.price)

    if (isNaN(price)) {
        throw new Error("Precio inválido")
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
            auto_return: "approved",
        },
    })

    console.log("BODY:", body)
    console.log(typeof body.price)
    console.log(body.price)


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
