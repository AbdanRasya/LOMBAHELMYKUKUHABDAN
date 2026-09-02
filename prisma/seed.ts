import { PrismaClient, Role, RFQStatus, QuotationStatus, ProjectStatus, UmkmVerificationStatus, CertificationStatus } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import ws from "ws";

// Required for @neondatabase/serverless to work in Node.js (outside edge runtime)
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seeding...");

  // Clear existing data
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

  console.log("Cleaned up existing database tables.");

  // 1. Seed Categories
  const categoriesData = [
    { name: "Manufaktur & Logam", slug: "manufaktur-logam", icon: "Settings", description: "Bahan logam, pengecoran, CNC, machining, stamping" },
    { name: "Tekstil & Garmen", slug: "tekstil-garmen", icon: "Shirt", description: "Seragam, kaos, kain tenun, bordir, konveksi garmen" },
    { name: "Kemasan & Percetakan", slug: "kemasan-percetakan", icon: "Box", description: "Kardus custom, box kemasan makanan, cetak offset, label" },
    { name: "Pertanian & Pangan", slug: "pertanian-pangan", icon: "Leaf", description: "Bahan baku pangan, pupuk organik, minyak kelapa, rempah-rempah" },
    { name: "Elektronik & Kabel", slug: "elektronik-kabel", icon: "Cpu", description: "Kabel listrik, PCB assembly, panel kontrol elektrik, casing" },
    { name: "Furniture & Kayu", slug: "furniture-kayu", icon: "Home", description: "Meja kantor kayu, kursi kerja, rak kayu pallet, mebel Jepara" },
    { name: "Kimia & Plastik", slug: "kimia-plastik", icon: "FlaskConical", description: "Biji plastik, botol plastik custom, sabun curah, bahan kimia industri" },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories.push(created);
  }
  console.log(`Seeded ${categories.length} product categories.`);

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash("admin12345", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@sourcehub.id",
      name: "Super Admin SourceHub",
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log("Seeded Admin user: admin@sourcehub.id");

  // 3. Create Companies (Buyers)
  const companyPassword = await bcrypt.hash("company12345", 12);
  const companyUsersData = [
    { email: "procurement@bumiteknik.co.id", name: "PT Bumi Teknik Nusantara", industry: "Konstruksi & Infrastruktur", province: "DKI Jakarta", city: "Jakarta Selatan" },
    { email: "sourcing@indofoodcorp.com", name: "PT Indofood Pangan Makmur", industry: "Makanan & Minuman", province: "Banten", city: "Tangerang" },
    { email: "purchasing@nusantara-apparel.com", name: "PT Nusantara Indah Garmen", industry: "Ritel Mode & Fashion", province: "Jawa Tengah", city: "Semarang" },
  ];

  const companyProfiles = [];
  for (const comp of companyUsersData) {
    const user = await prisma.user.create({
      data: {
        email: comp.email,
        name: comp.name,
        password: companyPassword,
        role: Role.COMPANY,
        emailVerified: new Date(),
      },
    });

    const profile = await prisma.companyProfile.create({
      data: {
        userId: user.id,
        companyName: comp.name,
        industry: comp.industry,
        province: comp.province,
        city: comp.city,
        address: `Kawasan Industri Maspion Blok B/12, ${comp.city}`,
        phone: "0217654321",
        website: `https://www.${comp.email.split("@")[1]}`,
        verified: true,
      },
    });
    companyProfiles.push(profile);
  }
  console.log(`Seeded ${companyProfiles.length} Companies.`);

  // 4. Create UMKMs (Suppliers)
  const umkmPassword = await bcrypt.hash("umkm12345", 12);
  const umkmUsersData = [
    {
      email: "kontak@sumbertekstil.com",
      businessName: "PT Sumber Tekstil Indonesia",
      categorySlug: "tekstil-garmen",
      province: "Jawa Barat",
      city: "Bandung",
      lat: -6.9175,
      lon: 107.6191,
      empCount: 120,
      founded: 2012,
      readiness: 94,
    },
    {
      email: "info@majulogam.co.id",
      businessName: "CV Maju Logam Perkasa",
      categorySlug: "manufaktur-logam",
      province: "Jawa Timur",
      city: "Surabaya",
      lat: -7.2575,
      lon: 112.7521,
      empCount: 65,
      founded: 2018,
      readiness: 88,
    },
    {
      email: "berkah@kemasanindo.com",
      businessName: "UD Berkah Kemasan Mandiri",
      categorySlug: "kemasan-percetakan",
      province: "Jawa Tengah",
      city: "Semarang",
      lat: -7.0051,
      lon: 110.4381,
      empCount: 28,
      founded: 2020,
      readiness: 82,
    },
    {
      email: "sales@agrobumi.id",
      businessName: "PT Agro Bumi Nusantara",
      categorySlug: "pertanian-pangan",
      province: "Jawa Barat",
      city: "Bogor",
      lat: -6.5971,
      lon: 106.8060,
      empCount: 80,
      founded: 2015,
      readiness: 91,
    },
  ];

  const umkmProfiles = [];
  for (const umkmData of umkmUsersData) {
    const user = await prisma.user.create({
      data: {
        email: umkmData.email,
        name: umkmData.businessName,
        password: umkmPassword,
        role: Role.UMKM,
        emailVerified: new Date(),
      },
    });

    const category = categories.find((c) => c.slug === umkmData.categorySlug);

    const profile = await prisma.umkmProfile.create({
      data: {
        userId: user.id,
        businessName: umkmData.businessName,
        tagline: `Penyedia ${category?.name} Kualitas Premium Terpercaya`,
        description: `Kami adalah UMKM profesional di bidang ${category?.name} yang didirikan pada tahun ${umkmData.founded}. Kami telah menyuplai ke berbagai perusahaan besar lokal dengan standar QC yang ketat, lead time yang cepat, dan harga yang bersaing. Hubungi kami untuk kebutuhan pengadaan bisnis Anda.`,
        province: umkmData.province,
        city: umkmData.city,
        address: `Jl. Raya Industri Utama No. ${Math.floor(Math.random() * 100) + 1}, ${umkmData.city}`,
        phone: "08123456789",
        email: umkmData.email,
        website: `https://www.${umkmData.email.split("@")[1]}`,
        foundedYear: umkmData.founded,
        employeeCount: umkmData.empCount,
        verificationStatus: UmkmVerificationStatus.APPROVED,
        readinessScore: umkmData.readiness,
        latitude: umkmData.lat,
        longitude: umkmData.lon,
        categories: category ? { connect: { id: category.id } } : undefined,
      },
    });

    // Create 2 products for each UMKM
    await prisma.product.create({
      data: {
        umkmId: profile.id,
        categoryId: category?.id,
        name: `Bahan Baku ${category?.name} Grade A`,
        description: `Bahan berkualitas premium yang telah teruji kualitasnya. Cocok untuk kebutuhan manufaktur skala industri menengah hingga besar.`,
        unit: "kg",
        minOrder: 100,
        maxCapacity: 10000,
        leadTimeDays: 14,
        priceMin: 25000,
        priceMax: 35000,
      },
    });

    await prisma.product.create({
      data: {
        umkmId: profile.id,
        categoryId: category?.id,
        name: `Bahan Baku ${category?.name} Grade B (Ekonomis)`,
        description: `Solusi ekonomis untuk kebutuhan produksi skala besar tanpa menurunkan standar kualitas produk akhir Anda.`,
        unit: "kg",
        minOrder: 250,
        maxCapacity: 25000,
        leadTimeDays: 7,
        priceMin: 15000,
        priceMax: 22000,
      },
    });

    // Create 1 verified certification
    await prisma.certification.create({
      data: {
        umkmId: profile.id,
        name: "Sertifikasi SNI (Standar Nasional Indonesia)",
        issuer: "Badan Standardisasi Nasional",
        number: `SNI-9876-${Math.floor(Math.random() * 9000) + 1000}`,
        issuedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        expiresAt: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000), // 2 years later
        status: CertificationStatus.VERIFIED,
      },
    });

    // Create 1 machine
    await prisma.machine.create({
      data: {
        umkmId: profile.id,
        name: "Mesin Produksi Otomatis Tipe-X",
        brand: "HeavyMachinery Corp",
        model: "HM-XT-2025",
        quantity: 2,
        yearAcquired: 2023,
        capacity: "5,000 kg / hari",
        condition: "Sangat Baik",
      },
    });

    // Create Trust Score
    await prisma.trustScore.create({
      data: {
        umkmId: profile.id,
        overall: umkmData.readiness + 2,
        deliveryScore: 92,
        responsivenessScore: 89,
        qualityScore: 94,
        certificationScore: 95,
        portfolioScore: 85,
        completedProjects: Math.floor(Math.random() * 20) + 5,
        strengths: ["Kualitas Bahan Konsisten", "Sertifikat Lengkap", "Lokasi Strategis"],
        weaknesses: ["Kapasitas Puncak Terbatas"],
        suggestions: ["Tambahkan mesin baru untuk meningkatkan kapasitas"],
      },
    });

    umkmProfiles.push(profile);
  }
  console.log(`Seeded ${umkmProfiles.length} UMKM profiles with products, certifications, machines, and trust scores.`);

  // 5. Seed RFQs (from Companies)
  const rfqData = [
    {
      companyId: companyProfiles[0].id,
      title: "Pengadaan Baut & Mur Baja Karbon Kuantitas Tinggi",
      description: "Kami mencari supplier logam presisi lokal yang dapat menyediakan baut dan mur baja karbon berkekuatan tinggi untuk proyek konstruksi di wilayah Jabodetabek. Harus bersertifikat SNI.",
      categorySlug: "manufaktur-logam",
      quantity: 5000,
      unit: "pcs",
      budgetMin: 50000000,
      budgetMax: 75000000,
      status: RFQStatus.OPEN,
    },
    {
      companyId: companyProfiles[1].id,
      title: "Suplai Kemasan Karton Dus Box Custom untuk Produk Baru",
      description: "Kami membutuhkan produsen dus karton custom untuk kemasan produk makanan baru kami. Spesifikasi: ketebalan duplex 350gsm dengan laminasi glossy bagian luar. Desain sablon 3 warna disediakan oleh kami.",
      categorySlug: "kemasan-percetakan",
      quantity: 10000,
      unit: "pcs",
      budgetMin: 30000000,
      budgetMax: 40000000,
      status: RFQStatus.OPEN,
    },
    {
      companyId: companyProfiles[2].id,
      title: "Kebutuhan Kain Denim Cotton 100% Gulungan Bandung",
      description: "Dibutuhkan supplier kain denim cotton 100% premium grade, tebal 12oz, warna navy blue. Butuh pengiriman berkala per bulan ke workshop kami di Semarang. Silakan kirim penawaran beserta sampel kain.",
      categorySlug: "tekstil-garmen",
      quantity: 1200,
      unit: "yard",
      budgetMin: 90000000,
      budgetMax: 120000000,
      status: RFQStatus.OPEN,
    },
  ];

  const rfqs = [];
  for (const rfqInfo of rfqData) {
    const category = categories.find((c) => c.slug === rfqInfo.categorySlug);
    const createdRfq = await prisma.rFQ.create({
      data: {
        companyId: rfqInfo.companyId,
        title: rfqInfo.title,
        description: rfqInfo.description,
        categoryId: category?.id,
        quantity: rfqInfo.quantity,
        unit: rfqInfo.unit,
        budgetMin: rfqInfo.budgetMin,
        budgetMax: rfqInfo.budgetMax,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        specifications: "Bahan tahan korosi, presisi tinggi, packing kardus aman.",
        status: rfqInfo.status,
      },
    });

    // Create a matching quotation from a matching UMKM
    let matchingUmkm = null;
    if (rfqInfo.categorySlug === "tekstil-garmen") matchingUmkm = umkmProfiles[0];
    else if (rfqInfo.categorySlug === "manufaktur-logam") matchingUmkm = umkmProfiles[1];
    else if (rfqInfo.categorySlug === "kemasan-percetakan") matchingUmkm = umkmProfiles[2];
    else if (rfqInfo.categorySlug === "pertanian-pangan") matchingUmkm = umkmProfiles[3];

    if (matchingUmkm) {
      await prisma.quotation.create({
        data: {
          rfqId: createdRfq.id,
          umkmId: matchingUmkm.id,
          price: (rfqInfo.budgetMin + rfqInfo.budgetMax) / 2,
          leadTimeDays: 10,
          notes: "Kami dapat menyediakan pesanan ini dengan lead time yang cepat dan kualitas terjamin menggunakan material berstandar nasional.",
          status: QuotationStatus.PENDING,
          validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        },
      });

      // Match score cache
      await prisma.aIRecommendation.create({
        data: {
          rfqId: createdRfq.id,
          umkmId: matchingUmkm.id,
          matchScore: 92,
          explanation: "Supplier ini terverifikasi memiliki sertifikasi SNI dan kapasitas produksi bulanan yang mencukupi kuantitas pesanan Anda.",
          reasons: ["Sertifikasi SNI terverifikasi", "Kapasitas produksi memadai", "Kategori produk cocok 100%"],
          rank: 1,
        },
      });
    }

    rfqs.push(createdRfq);
  }
  console.log(`Seeded ${rfqs.length} RFQs with initial quotations and AI recommendation caches.`);

  // 6. Seed Supply Gap Map Data
  const regions = [
    { province: "DKI Jakarta", city: "Jakarta Selatan", categorySlug: "manufaktur-logam", demand: 92, supply: 120 },
    { province: "Jawa Barat", city: "Bandung", categorySlug: "tekstil-garmen", demand: 98, supply: 340 },
    { province: "Jawa Timur", city: "Surabaya", categorySlug: "manufaktur-logam", demand: 85, supply: 220 },
    { province: "Sumatera Utara", city: "Medan", categorySlug: "pertanian-pangan", demand: 75, supply: 45 },
    { province: "Sulawesi Selatan", city: "Makassar", categorySlug: "pertanian-pangan", demand: 80, supply: 25 },
    { province: "Kalimantan Timur", city: "Balikpapan", categorySlug: "manufaktur-logam", demand: 95, supply: 10 },
    { province: "Banten", city: "Tangerang", categorySlug: "kemasan-percetakan", demand: 88, supply: 150 },
    { province: "Jawa Tengah", city: "Semarang", categorySlug: "furniture-kayu", demand: 72, supply: 90 },
    { province: "Papua", city: "Jayapura", categorySlug: "pertanian-pangan", demand: 60, supply: 2 },
    { province: "Kepulauan Riau", city: "Batam", categorySlug: "elektronik-kabel", demand: 94, supply: 8 },
  ];

  let supplyGapCount = 0;
  for (const reg of regions) {
    const category = categories.find((c) => c.slug === reg.categorySlug);

    // Calculate Opportunity Score: (Demand Score * 1.5) - (Supplier Count / 2), capped at 100
    const opportunityScore = Math.min(Math.max(Math.round((reg.demand * 1.2) - (reg.supply / 10)), 0), 100);

    await prisma.supplyGapData.create({
      data: {
        province: reg.province,
        city: reg.city,
        categoryId: category?.id,
        demandScore: reg.demand,
        supplierCount: reg.supply,
        opportunityScore: opportunityScore,
      },
    });
    supplyGapCount++;
  }
  console.log(`Seeded ${supplyGapCount} region supply gap markers for mapping.`);

  console.log("Seeding process completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
