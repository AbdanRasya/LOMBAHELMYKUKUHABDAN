import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning up all dummy data...");

  await prisma.order.deleteMany({});
  await prisma.systemLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.supplyGapData.deleteMany({});
  await prisma.savedSupplier.deleteMany({});
  await prisma.aIRecommendation.deleteMany({});
  await prisma.trustScore.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.rFQ.deleteMany({});
  await prisma.portfolio.deleteMany({});
  await prisma.factoryPhoto.deleteMany({});
  await prisma.machine.deleteMany({});
  await prisma.certification.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.umkmProfile.deleteMany({});
  await prisma.companyProfile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("All dummy products, RFQs, and accounts cleared.");

  // Seed standard categories
  const categoriesData = [
    { name: "Manufaktur & Logam", slug: "manufaktur-logam", icon: "Settings", description: "Bahan logam, pengecoran, CNC, machining, stamping, baut & mur" },
    { name: "Tekstil & Garmen", slug: "tekstil-garmen", icon: "Shirt", description: "Seragam, kaos, kain tenun, bordir, konveksi garmen lokal" },
    { name: "Kemasan & Percetakan", slug: "kemasan-percetakan", icon: "Box", description: "Kardus custom, box kemasan makanan, cetak offset, label packaging" },
    { name: "Pertanian & Pangan", slug: "pertanian-pangan", icon: "Leaf", description: "Bahan baku pangan, pupuk organik, minyak kelapa, rempah-rempah hasil tani" },
    { name: "Elektronik & Kabel", slug: "elektronik-kabel", icon: "Cpu", description: "Kabel listrik, PCB assembly, panel kontrol elektrik, perakitan kabel" },
    { name: "Furniture & Kayu", slug: "furniture-kayu", icon: "Home", description: "Meja kantor kayu, kursi kerja, rak kayu pallet, mebel Jepara, palet kayu ekspor" },
    { name: "Kimia & Plastik", slug: "kimia-plastik", icon: "FlaskConical", description: "Biji plastik, botol plastik custom, sabun curah, bahan kimia industri" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }

  // Create default accounts for testing
  const adminPassword = await bcrypt.hash("admin12345", 12);
  await prisma.user.create({
    data: {
      email: "admin@sourcehub.id",
      name: "Super Admin SourceHub",
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  const companyPassword = await bcrypt.hash("company12345", 12);
  const companyUser = await prisma.user.create({
    data: {
      email: "procurement@bumiteknik.co.id",
      name: "PT Bumi Teknik Nusantara",
      password: companyPassword,
      role: Role.COMPANY,
      emailVerified: new Date(),
    },
  });
  await prisma.companyProfile.create({
    data: {
      userId: companyUser.id,
      companyName: "PT Bumi Teknik Nusantara",
      industry: "Konstruksi & Manufaktur",
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      verified: true,
    },
  });

  const umkmPassword = await bcrypt.hash("umkm12345", 12);
  const umkmUser = await prisma.user.create({
    data: {
      email: "kontak@sumbertekstil.com",
      name: "CV Sumber Tekstil Bandung",
      password: umkmPassword,
      role: Role.UMKM,
      emailVerified: new Date(),
    },
  });
  const umkmCat = await prisma.category.findUnique({ where: { slug: "tekstil-garmen" } });
  await prisma.umkmProfile.create({
    data: {
      userId: umkmUser.id,
      businessName: "CV Sumber Tekstil Bandung",
      tagline: "Sentra Konveksi Kain & Seragam Kerja",
      province: "Jawa Barat",
      city: "Bandung",
      verificationStatus: "APPROVED",
      readinessScore: 90,
      profileCompleteness: 100,
      categories: umkmCat ? { connect: { id: umkmCat.id } } : undefined,
    },
  });

  console.log("Default accounts created. Products database is 100% clean!");
}

main()
  .catch((e) => {
    console.error("Cleanup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
