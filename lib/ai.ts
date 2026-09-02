import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// ============================================================
// HEURISTIC AI (used when no API key is available)
// ============================================================

function heuristicMatchScore(rfq: any, umkm: any): number {
  let score = 0;

  // Category match (30 points)
  const rfqCategory = rfq.category?.name?.toLowerCase() || "";
  const umkmCategories = umkm.categories?.map((c: any) => c.name.toLowerCase()) || [];
  if (umkmCategories.some((cat: string) => rfqCategory.includes(cat) || cat.includes(rfqCategory))) {
    score += 30;
  }

  // Capacity match (20 points)
  const requiredQty = rfq.quantity || 0;
  const maxCap = umkm.products?.[0]?.maxCapacity || 0;
  if (maxCap >= requiredQty) score += 20;
  else if (maxCap >= requiredQty * 0.7) score += 10;

  // Certifications (15 points)
  const certCount = umkm.certifications?.filter((c: any) => c.status === "VERIFIED").length || 0;
  score += Math.min(certCount * 5, 15);

  // Trust score (20 points)
  if (umkm.trustScore) {
    score += Math.round((umkm.trustScore.overall / 100) * 20);
  }

  // Readiness score (15 points)
  score += Math.round((umkm.readinessScore / 100) * 15);

  return Math.min(score, 100);
}

// ============================================================
// AI SUPPLIER MATCHING
// ============================================================

export async function matchSuppliers(
  rfq: { title: string; description: string; category?: string; quantity?: number; specifications?: string },
  suppliers: any[]
): Promise<{ umkmId: string; matchScore: number; explanation: string; reasons: string[] }[]> {
  if (!genAI) {
    // Use heuristic scoring
    return suppliers.map((s) => ({
      umkmId: s.id,
      matchScore: heuristicMatchScore(rfq, s),
      explanation: `Supplier ${s.businessName} memiliki kapasitas dan kategori yang sesuai dengan kebutuhan Anda.`,
      reasons: [
        "Kategori produk sesuai",
        "Kapasitas produksi memadai",
        s.trustScore?.overall > 70 ? "Skor kepercayaan tinggi" : "Aktif di platform",
      ],
    })).sort((a, b) => b.matchScore - a.matchScore);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
Anda adalah sistem AI untuk platform pengadaan B2B Indonesia bernama SourceHub.
Tugas Anda adalah mencocokkan supplier (UMKM) dengan permintaan pengadaan (RFQ) perusahaan.

RFQ:
- Judul: ${rfq.title}
- Deskripsi: ${rfq.description}
- Kategori: ${rfq.category || "Tidak ditentukan"}
- Kuantitas: ${rfq.quantity || "Tidak ditentukan"}
- Spesifikasi: ${rfq.specifications || "Tidak ada"}

Supplier List (JSON):
${JSON.stringify(suppliers.slice(0, 10).map(s => ({
  id: s.id,
  name: s.businessName,
  categories: s.categories?.map((c: any) => c.name),
  products: s.products?.slice(0, 3).map((p: any) => ({ name: p.name, maxCapacity: p.maxCapacity, leadTime: p.leadTimeDays })),
  certifications: s.certifications?.filter((c: any) => c.status === "VERIFIED").map((c: any) => c.name),
  readinessScore: s.readinessScore,
  trustScore: s.trustScore?.overall,
  province: s.province,
  city: s.city,
})), null, 2)}

Berikan respons dalam format JSON array berikut (tanpa markdown):
[
  {
    "umkmId": "id_supplier",
    "matchScore": 85,
    "explanation": "Penjelasan singkat mengapa supplier ini cocok",
    "reasons": ["Alasan 1", "Alasan 2", "Alasan 3"]
  }
]

Beri skor 0-100 berdasarkan kesesuaian kategori, kapasitas, sertifikasi, lokasi, dan track record.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(text);
    return parsed.sort((a: any, b: any) => b.matchScore - a.matchScore);
  } catch {
    // Fallback to heuristic
    return suppliers.map((s) => ({
      umkmId: s.id,
      matchScore: heuristicMatchScore(rfq, s),
      explanation: `Supplier ${s.businessName} cocok berdasarkan kategori dan kapasitas produksi.`,
      reasons: ["Kategori sesuai", "Kapasitas memadai", "Aktif di platform"],
    })).sort((a, b) => b.matchScore - a.matchScore);
  }
}

// ============================================================
// READINESS SCORE
// ============================================================

export async function generateReadinessAnalysis(umkmProfile: any): Promise<{
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}> {
  const hasNpwp = !!umkmProfile.npwp;
  const hasNib = !!umkmProfile.nib;
  const productCount = umkmProfile.products?.length || 0;
  const certCount = umkmProfile.certifications?.filter((c: any) => c.status === "VERIFIED").length || 0;
  const machineCount = umkmProfile.machines?.length || 0;
  const portfolioCount = umkmProfile.portfolio?.length || 0;
  const photoCount = umkmProfile.factoryPhotos?.length || 0;

  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (hasNpwp) { score += 10; strengths.push("Memiliki NPWP"); }
  else { weaknesses.push("Belum memiliki NPWP"); suggestions.push("Daftarkan NPWP untuk meningkatkan kepercayaan perusahaan"); }

  if (hasNib) { score += 15; strengths.push("Memiliki NIB"); }
  else { weaknesses.push("Belum memiliki NIB"); suggestions.push("Daftarkan NIB melalui OSS (Online Single Submission)"); }

  if (umkmProfile.description?.length > 100) { score += 5; strengths.push("Deskripsi bisnis lengkap"); }
  else { weaknesses.push("Deskripsi bisnis kurang lengkap"); suggestions.push("Lengkapi deskripsi bisnis minimal 100 karakter"); }

  if (umkmProfile.logo) { score += 5; strengths.push("Memiliki logo usaha"); }
  else { suggestions.push("Upload logo usaha untuk tampilan lebih profesional"); }

  if (productCount > 0) { score += Math.min(productCount * 3, 15); strengths.push(`Memiliki ${productCount} produk terdaftar`); }
  else { weaknesses.push("Belum ada produk terdaftar"); suggestions.push("Tambahkan minimal 3 produk unggulan Anda"); }

  if (certCount > 0) { score += Math.min(certCount * 7, 20); strengths.push(`${certCount} sertifikasi terverifikasi`); }
  else { weaknesses.push("Belum memiliki sertifikasi terverifikasi"); suggestions.push("Upload sertifikasi seperti ISO, Halal, atau SNI untuk meningkatkan kepercayaan"); }

  if (machineCount > 0) { score += Math.min(machineCount * 2, 10); strengths.push(`${machineCount} mesin terdaftar`); }
  else { suggestions.push("Tambahkan informasi mesin produksi untuk menunjukkan kapasitas"); }

  if (portfolioCount > 0) { score += Math.min(portfolioCount * 3, 10); strengths.push(`${portfolioCount} portofolio proyek`); }
  else { weaknesses.push("Belum ada portofolio"); suggestions.push("Tambahkan portofolio proyek sebelumnya untuk membangun kepercayaan"); }

  if (photoCount > 0) { score += Math.min(photoCount * 2, 10); strengths.push("Memiliki foto pabrik/produksi"); }
  else { suggestions.push("Upload foto pabrik atau proses produksi"); }

  return {
    score: Math.min(score, 100),
    strengths,
    weaknesses,
    suggestions,
  };
}

// ============================================================
// RFQ FROM NATURAL LANGUAGE
// ============================================================

export async function parseRFQFromText(naturalText: string): Promise<{
  title: string;
  description: string;
  category: string;
  quantity: number | null;
  unit: string;
  budgetMin: number | null;
  budgetMax: number | null;
  specifications: string;
}> {
  const defaultResult = {
    title: naturalText.slice(0, 60),
    description: naturalText,
    category: "",
    quantity: null,
    unit: "unit",
    budgetMin: null,
    budgetMax: null,
    specifications: "",
  };

  if (!genAI) return defaultResult;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
Anda adalah asisten pengadaan untuk platform B2B Indonesia.
Ubah teks berikut menjadi format RFQ terstruktur dalam JSON (tanpa markdown):

Teks: "${naturalText}"

Format JSON yang harus dikembalikan:
{
  "title": "Judul RFQ singkat dan jelas",
  "description": "Deskripsi lengkap kebutuhan",
  "category": "Kategori produk (contoh: Manufaktur, Pertanian, Tekstil, dll)",
  "quantity": 100,
  "unit": "pcs/kg/meter/dll",
  "budgetMin": null,
  "budgetMax": null,
  "specifications": "Spesifikasi teknis jika ada"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
    return { ...defaultResult, ...JSON.parse(text) };
  } catch {
    return defaultResult;
  }
}

// ============================================================
// OPPORTUNITY DETECTOR
// ============================================================

export async function detectOpportunities(analyticsData: {
  topCategories: { name: string; rfqCount: number }[];
  lowCoverageProvinces: { province: string; supplierCount: number; rfqCount: number }[];
}): Promise<{
  opportunities: { title: string; description: string; type: string; priority: string }[];
}> {
  const opportunities = analyticsData.lowCoverageProvinces
    .filter((p) => p.rfqCount > p.supplierCount)
    .map((p) => ({
      title: `Peluang di ${p.province}`,
      description: `Terdapat ${p.rfqCount} permintaan pengadaan namun hanya ${p.supplierCount} supplier tersedia di ${p.province}. Peluang besar untuk UMKM lokal.`,
      type: "regional",
      priority: p.rfqCount > p.supplierCount * 3 ? "HIGH" : "MEDIUM",
    }));

  analyticsData.topCategories.slice(0, 3).forEach((cat) => {
    opportunities.push({
      title: `Permintaan tinggi: ${cat.name}`,
      description: `Kategori ${cat.name} memiliki ${cat.rfqCount} RFQ aktif. Pertimbangkan untuk memperluas produk ke kategori ini.`,
      type: "category",
      priority: "MEDIUM",
    });
  });

  return { opportunities };
}

// ============================================================
// PROCUREMENT ASSISTANT (Chat)
// ============================================================

export async function procurementAssistant(
  messages: { role: "user" | "model"; content: string }[],
  context?: string
): Promise<string> {
  if (!genAI) {
    return "Maaf, fitur AI Assistant memerlukan konfigurasi GEMINI_API_KEY. Silakan hubungi administrator untuk mengaktifkan fitur ini. Sementara itu, Anda dapat mencari supplier menggunakan fitur pencarian manual kami.";
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `Anda adalah asisten pengadaan AI untuk platform SourceHub, platform B2B yang menghubungkan perusahaan Indonesia dengan UMKM lokal. 
    Anda membantu perusahaan menemukan supplier yang tepat, memahami proses pengadaan, membandingkan penawaran, dan membuat keputusan pengadaan yang cerdas.
    Selalu jawab dalam Bahasa Indonesia yang profesional namun ramah.
    ${context ? `Konteks tambahan: ${context}` : ""}`,
  });

  const chat = model.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    })),
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}
