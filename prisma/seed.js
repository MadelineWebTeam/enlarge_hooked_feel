const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {

  console.log("🌱 Seeding products...")

  await prisma.product.createMany({
    data: [
      {
        brand: "Maison Clone",
        name: "Aventus Inspired",
        description: "Fragancia intensa y sofisticada.",
        notes: "Piña, abedul, almizcle",
        sizeMl: 50,
        price: 899.0,
        stock: 20,
      },
      {
        brand: "Maison Clone",
        name: "Baccarat Rouge Inspired",
        description: "Dulce, elegante y envolvente.",
        notes: "Azafrán, ámbar gris, cedro",
        sizeMl: 50,
        price: 999.0,
        stock: 15,
      },
      {
        brand: "Maison Clone",
        name: "Sauvage Inspired",
        description: "Fresco y especiado.",
        notes: "Bergamota, pimienta, ambroxan",
        sizeMl: 60,
        price: 799.0,
        stock: 25,
      },
    ],
  })

  console.log("✅ Seed completed")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
