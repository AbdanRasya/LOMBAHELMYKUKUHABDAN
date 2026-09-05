import { PrismaClient, Role, RFQStatus, QuotationStatus, UmkmVerificationStatus, CertificationStatus } from "@prisma/client";
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
    { name: "Manufaktur & Logam", slug: "manufaktur-logam", icon: "Settings", description: "Bahan logam, pengecoran, CNC, machining, stamping, baut & mur" },
    { name: "Tekstil & Garmen", slug: "tekstil-garmen", icon: "Shirt", description: "Seragam, kaos, kain tenun, bordir, konveksi garmen lokal" },
    { name: "Kemasan & Percetakan", slug: "kemasan-percetakan", icon: "Box", description: "Kardus custom, box kemasan makanan, cetak offset, label packaging" },
    { name: "Pertanian & Pangan", slug: "pertanian-pangan", icon: "Leaf", description: "Bahan baku pangan, pupuk organik, minyak kelapa, rempah-rempah hasil tani" },
    { name: "Elektronik & Kabel", slug: "elektronik-kabel", icon: "Cpu", description: "Kabel listrik, PCB assembly, panel kontrol elektrik, perakitan kabel" },
    { name: "Furniture & Kayu", slug: "furniture-kayu", icon: "Home", description: "Meja kantor kayu, kursi kerja, rak kayu pallet, mebel Jepara, palet kayu ekspor" },
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
  await prisma.user.create({
    data: {
      email: "admin@sourcehub.id",
      name: "Super Admin PUSAKA",
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log("Seeded Admin user: admin@sourcehub.id");

  // 3. Create Companies (Corporate Buyers looking for UMKM Suppliers)
  const companyPassword = await bcrypt.hash("company12345", 12);
  const companyUsersData = [
    {
      email: "procurement@bumiteknik.co.id",
      name: "PT Bumi Teknik Nusantara",
      industry: "Konstruksi & Manufaktur Berat",
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      address: "Gedung Menara Karya Lt. 18, Jl. H.R. Rasuna Said Blok X-5 Kav. 1-2, Jakarta Selatan",
      phone: "02152901234",
    },
    {
      email: "sourcing@indofoodcorp.com",
      name: "PT Indofood Pangan Makmur",
      industry: "Makanan & Minuman (FMCG)",
      province: "Banten",
      city: "Tangerang",
      address: "Kawasan Industri Jatake, Jl. Industri Raya No. 45, Tangerang",
      phone: "0215905678",
    },
    {
      email: "purchasing@nusantara-apparel.com",
      name: "PT Nusantara Indah Garmen",
      industry: "Ritel Mode & Fashion Nasional",
      province: "Jawa Tengah",
      city: "Semarang",
      address: "Kawasan Industri Wijayakusuma Blok C-9, Semarang",
      phone: "0248661234",
    },
    {
      email: "procurement@megakarya.co.id",
      name: "PT Mega Karya Logistik",
      industry: "Logistik & Pergudangan",
      province: "Jawa Timur",
      city: "Surabaya",
      address: "Jl. Perak Timur No. 110, Tanjung Perak, Surabaya",
      phone: "0313298765",
    },
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
        address: comp.address,
        phone: comp.phone,
        website: `https://www.${comp.email.split("@")[1]}`,
        npwp: `01.${Math.floor(Math.random() * 899) + 100}.${Math.floor(Math.random() * 899) + 100}.4-${Math.floor(Math.random() * 899) + 100}.000`,
        description: `${comp.name} adalah perusahaan korporasi terkemuka di sektor ${comp.industry} yang aktif bermitra dan melakukan pengadaan bahan baku serta komponen dari mitra UMKM lokal di seluruh Indonesia.`,
        verified: true,
      },
    });
    companyProfiles.push(profile);
  }
  console.log(`Seeded ${companyProfiles.length} Corporate Buyers (Perusahaan yang mencari UMKM).`);

  // 4. Create UMKMs (Local Suppliers / Bengkel / CV / UD / Koperasi / Sentra Pengrajin)
  const umkmPassword = await bcrypt.hash("umkm12345", 12);
  const umkmUsersData = [
    {
      email: "kontak@sumbertekstil.com",
      businessName: "CV Sumber Tekstil Bandung",
      tagline: "Sentra Konveksi Kain & Seragam Kerja Kualitas Pabrik",
      categorySlug: "tekstil-garmen",
      province: "Jawa Barat",
      city: "Bandung",
      address: "Sentra Rajut Binong Jati No. 42, Batununggal, Bandung",
      phone: "08122334455",
      lat: -6.9175,
      lon: 107.6191,
      empCount: 45,
      founded: 2016,
      readiness: 94,
      desc: "Kami adalah UMKM konveksi & garmen di Bandung dengan 45 penjahit terampil dan mesin jahit high-speed otomatis. Siap memproduksi seragam kerja kantor, seragam pabrik, dan kaos polo dengan kapasitas 25.000 pcs per bulan dengan QC ketat dan pengiriman tepat waktu.",
    },
    {
      email: "info@majulogam.co.id",
      businessName: "CV Maju Logam Perkasa (Bengkel Bubut CNC)",
      tagline: "Bengkel Bubut, Milling & Fabrikasi Logam Presisi Standar SNI",
      categorySlug: "manufaktur-logam",
      province: "Jawa Timur",
      city: "Surabaya",
      address: "Jl. Rungkut Industri Barat VIII No. 14, Rungkut, Surabaya",
      phone: "08133445566",
      lat: -7.2575,
      lon: 112.7521,
      empCount: 35,
      founded: 2018,
      readiness: 90,
      desc: "UMKM bengkel bubut & machining logam presisi dengan mesin CNC Lathe dan Milling modern. Kami melayani pembuatan sparepart custom mesin industri, baut-mur baja kekuatan tinggi, flange pipa, dan komponen fabrikasi logam dengan toleransi hingga 0.01 mm.",
    },
    {
      email: "berkah@kemasanindo.com",
      businessName: "UD Berkah Kemasan Mandiri",
      tagline: "Produsen Dus Karton Corrugated & Box Makanan Food Grade",
      categorySlug: "kemasan-percetakan",
      province: "Jawa Tengah",
      city: "Semarang",
      address: "Jl. Industri Kaligawe Km. 4 No. 88, Genuk, Semarang",
      phone: "08155667788",
      lat: -7.0051,
      lon: 110.4381,
      empCount: 28,
      founded: 2020,
      readiness: 85,
      desc: "Produsen kardus packaging UMKM dan industri skala menengah. Menyediakan kardus box corrugated single-wall/double-wall, dus packaging makanan food grade dengan laminasi, dan cetak sablon flexo/offset kustom.",
    },
    {
      email: "sales@agrobumi.id",
      businessName: "Koperasi Tani Agro Bumi Mandiri",
      tagline: "Pemasok Hasil Bumi, Rempah & Minyak Kelapa Alami Petani Binaan",
      categorySlug: "pertanian-pangan",
      province: "Jawa Barat",
      city: "Bogor",
      address: "Jl. Raya Ciawi-Sukabumi No. 125, Ciawi, Bogor",
      phone: "08177889900",
      lat: -6.5971,
      lon: 106.8060,
      empCount: 50,
      founded: 2017,
      readiness: 92,
      desc: "Koperasi petani lokal yang menaungi 80+ petani di Jawa Barat. Menyediakan pasokan bahan baku pangan bermutu tinggi seperti minyak kelapa murni (VCO), rempah jahe/kunyit kering, serta aneka hasil tani grade industri pangan dengan sertifikasi Halal dan BPOM.",
    },
    {
      email: "order@mebeljepara-asri.com",
      businessName: "Sentra Kayu Mebel Jepara Asri",
      tagline: "Pengrajin Kayu Jati, Palet Kayu Industri & Mebel Kantor Ekspor",
      categorySlug: "furniture-kayu",
      province: "Jawa Tengah",
      city: "Jepara",
      address: "Sentra Ukir Tahunan No. 67, Tahunan, Jepara",
      phone: "08199001122",
      lat: -6.5894,
      lon: 110.6698,
      empCount: 30,
      founded: 2015,
      readiness: 88,
      desc: "UMKM pengrajin kayu Jepara yang memproduksi palet kayu standar ISPM-15 untuk logistik ekspor, perabot kantor berbahan kayu solid, serta custom cabinetry interior berbahan kayu legal terverifikasi SVLK.",
    },
    {
      email: "panel@elektromandiri.com",
      businessName: "UD Panel & Kabel Elektro Mandiri",
      tagline: "Perakitan Panel Listrik Industri, Harness Wiring & Kabel Kontrol",
      categorySlug: "elektronik-kabel",
      province: "Jawa Timur",
      city: "Sidoarjo",
      address: "Kawasan Pergudangan Sirie Blok K-05, Buduran, Sidoarjo",
      phone: "08188990011",
      lat: -7.4478,
      lon: 112.7183,
      empCount: 22,
      founded: 2019,
      readiness: 87,
      desc: "UMKM perakitan panel listrik LVMDP, panel inverter, dan pembuatan wire harness kabel kontrol industri untuk kebutuhan pabrik dan kontraktor instalasi elektrikal.",
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
        tagline: umkmData.tagline,
        description: umkmData.desc,
        province: umkmData.province,
        city: umkmData.city,
        address: umkmData.address,
        phone: umkmData.phone,
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
        name: `Bahan / Produk ${category?.name} Grade Industri A`,
        description: `Produk siap suplai kualitas unggul dari workshop kami. Memenuhi standar sertifikasi nasional dan siap memenuhi kapasitas pengadaan rutin korporasi.`,
        unit: "unit",
        minOrder: 100,
        maxCapacity: 15000,
        leadTimeDays: 10,
        priceMin: 35000,
        priceMax: 85000,
      },
    });

    await prisma.product.create({
      data: {
        umkmId: profile.id,
        categoryId: category?.id,
        name: `Layanan Custom Fabrikasi / Produksi ${category?.name}`,
        description: `Layanan pengerjaan sesuai spesifikasi gambar teknik atau sampel dari pihak buyer perusahaan. Free konsultasi sampel dan estimasi bahan.`,
        unit: "pesanan",
        minOrder: 50,
        maxCapacity: 8000,
        leadTimeDays: 14,
        priceMin: 25000,
        priceMax: 60000,
      },
    });

    // Create 1 verified certification
    await prisma.certification.create({
      data: {
        umkmId: profile.id,
        name: "Sertifikasi SNI (Standar Nasional Indonesia) & NIB Terverifikasi",
        issuer: "Badan Standardisasi Nasional / Kementerian Investasi BKPM",
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
        name: "Mesin Produksi Otomatis Presisi",
        brand: "HeavyTech Machinery",
        model: "HT-2024-X",
        quantity: 3,
        yearAcquired: 2023,
        capacity: "3,000 unit / hari",
        condition: "Sangat Baik",
      },
    });

    // Create Trust Score
    await prisma.trustScore.create({
      data: {
        umkmId: profile.id,
        overall: umkmData.readiness + 2,
        deliveryScore: 94,
        responsivenessScore: 92,
        qualityScore: 95,
        certificationScore: 96,
        portfolioScore: 88,
        completedProjects: Math.floor(Math.random() * 25) + 8,
        suggestions: ["Pertahankan kecepatan respon penawaran RFQ"],
      },
    });

    // Create initial DB Review
    await prisma.review.create({
      data: {
        umkmId: profile.id,
        companyId: companyProfiles[0]?.id || "seed-company",
        rating: 5,
        comment: `Mitra ${profile.businessName} memberikan hasil produksi sangat presisi, responsif, dan pengiriman barang sesuai kesepakatan B2B.`,
      },
    }).catch(() => {});

    umkmProfiles.push(profile);
  }
  console.log(`Seeded ${umkmProfiles.length} UMKM profiles with products, certifications, machines, trust scores, and database reviews.`);

  // 5. Seed RFQs (Created by Corporate Buyers looking for UMKM Suppliers)
  const rfqData = [
    {
      companyId: companyProfiles[0].id, // PT Bumi Teknik Nusantara
      title: "Pengadaan Baut & Mur Baja Karbon Presisi (Dicari Mitra UMKM Logam / Bengkel Bubut)",
      description: "Perusahaan kami membutuhkan pasokan rutin baut & mur baja karbon kekuatan grade 8.8 tahan korosi untuk kebutuhan proyek konstruksi gedung. Kami memprioritaskan bermitra dengan UMKM bengkel bubut lokal yang mampu menjaga presisi dan konsistensi dimensi.",
      categorySlug: "manufaktur-logam",
      quantity: 15000,
      unit: "pcs",
      budgetMin: 65000000,
      budgetMax: 90000000,
      status: RFQStatus.OPEN,
    },
    {
      companyId: companyProfiles[1].id, // PT Indofood Pangan Makmur
      title: "Pengadaan Dus Box Karton Corrugated Food-Grade (Dicari Mitra UMKM Kemasan)",
      description: "Dibutuhkan produsen kemasan dus karton box custom dengan sertifikasi food-grade untuk lini produk makanan baru kami. Ketebalan duplex 350 gsm dengan finishing laminasi glossy dan cetak flexo 3 warna.",
      categorySlug: "kemasan-percetakan",
      quantity: 25000,
      unit: "pcs",
      budgetMin: 45000000,
      budgetMax: 60000000,
      status: RFQStatus.OPEN,
    },
    {
      companyId: companyProfiles[2].id, // PT Nusantara Indah Garmen
      title: "Pengadaan Kain Seragam Cotton Drill & Pengerjaan Jahit (Dicari Mitra Konveksi UMKM)",
      description: "Kami membuka pengadaan seragam kerja lapangan sebanyak 3.000 setel. Dicari konveksi UMKM dengan rekam jejak jahit rapi, kancing press, dan kapasitas penyelesaian dalam 25 hari kerja.",
      categorySlug: "tekstil-garmen",
      quantity: 3000,
      unit: "setel",
      budgetMin: 180000000,
      budgetMax: 240000000,
      status: RFQStatus.OPEN,
    },
    {
      companyId: companyProfiles[3].id, // PT Mega Karya Logistik
      title: "Pengadaan Palet Kayu Standar Ekspor ISPM-15 (Dicari Pengrajin Kayu UMKM)",
      description: "Kebutuhan palet kayu jenis sengon / mahoni kering oven dengan treatment standar ISPM-15 ukuran 1200 x 1000 mm untuk pergudangan logistik di Tanjung Perak.",
      categorySlug: "furniture-kayu",
      quantity: 1000,
      unit: "unit",
      budgetMin: 85000000,
      budgetMax: 110000000,
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
        specifications: "Kualitas memenuhi standar industri, kemasan rapi dan aman dalam pengiriman, garansi retur jika ada cacat produksi.",
        status: rfqInfo.status,
      },
    });

    // Match matching UMKM
    let matchingUmkm = null;
    if (rfqInfo.categorySlug === "manufaktur-logam") matchingUmkm = umkmProfiles[1]; // CV Maju Logam
    else if (rfqInfo.categorySlug === "kemasan-percetakan") matchingUmkm = umkmProfiles[2]; // UD Berkah Kemasan
    else if (rfqInfo.categorySlug === "tekstil-garmen") matchingUmkm = umkmProfiles[0]; // CV Sumber Tekstil
    else if (rfqInfo.categorySlug === "furniture-kayu") matchingUmkm = umkmProfiles[4]; // Sentra Mebel Jepara

    if (matchingUmkm) {
      // 6. Seed Quotations (Submitted by UMKM to Corporate Buyer's RFQ)
      await prisma.quotation.create({
        data: {
          rfqId: createdRfq.id,
          umkmId: matchingUmkm.id,
          price: Math.round((rfqInfo.budgetMin + rfqInfo.budgetMax) / 2),
          leadTimeDays: 12,
          notes: `Halo Bapak/Ibu Procurement, kami dari ${matchingUmkm.businessName} siap memenuhi kebutuhan pengadaan ini. Kami memiliki kapasitas mesin aktif, tenaga ahli berpengalaman, serta jaminan mutu standar SNI. Sampel siap kami kirimkan ke kantor Anda.`,
          status: QuotationStatus.PENDING,
          validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        },
      });

      // Match score recommendation
      await prisma.aIRecommendation.create({
        data: {
          rfqId: createdRfq.id,
          umkmId: matchingUmkm.id,
          matchScore: 95,
          explanation: `UMKM ${matchingUmkm.businessName} sangat direkomendasikan karena memiliki kesesuaian kategori 100%, kapasitas workshop yang terverifikasi, dan sertifikasi mutu yang sesuai dengan syarat pengadaan Anda.`,
          reasons: ["Legalitas & SNI Terverifikasi", "Kapasitas Workshop Memadai", "Kategori Produk & Lokasi Cocok 100%"],
          rank: 1,
        },
      });
    }

    rfqs.push(createdRfq);
  }
  console.log(`Seeded ${rfqs.length} Corporate RFQs with matching UMKM quotations and AI recommendation caches.`);

  // 7. Seed Supply Gap Map Data
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
