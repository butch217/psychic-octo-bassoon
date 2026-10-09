import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const partnerUrl = "https://carry1st.sng.link/Dz248/s3c7?paffid=2824295&_smtype=3";
const products = [
  { name: "Call of Duty: Mobile", slug: "call-of-duty-mobile", category: "Top-ups", description: "Browse COD Points and Battle Pass offers on Carry1st.", sortOrder: 1 },
  { name: "Free Fire Diamonds", slug: "free-fire-diamonds", category: "Top-ups", description: "Browse available Free Fire diamond top-ups on Carry1st.", sortOrder: 2 },
  { name: "PUBG Mobile UC", slug: "pubg-mobile-uc", category: "Top-ups", description: "Browse PUBG Mobile UC offers on Carry1st.", sortOrder: 3 },
  { name: "Mobile Legends Diamonds", slug: "mobile-legends-diamonds", category: "Top-ups", description: "Explore Mobile Legends diamond top-ups on Carry1st.", sortOrder: 4 },
  { name: "Blood Strike Golds", slug: "blood-strike-golds", category: "Top-ups", description: "Check Blood Strike Gold offers on Carry1st.", sortOrder: 5 },
  { name: "Gaming Gift Cards", slug: "gaming-gift-cards", category: "Gift cards", description: "Browse gaming gift card availability on Carry1st.", sortOrder: 6 },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { name: product.name, category: product.category, description: product.description, partnerUrl, sortOrder: product.sortOrder },
      create: { ...product, partnerUrl, status: "ACTIVE" },
    });
  }
  console.log(`Seeded ${products.length} Sentinel catalogue categories.`);
}

main().catch((error) => {
  console.error("Catalogue seed failed.");
  console.error(error);
  process.exitCode = 1;
}).finally(async () => prisma.$disconnect());
