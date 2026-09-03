const BASE = "http://localhost:3000/api/ai";

async function test(label, method, path, body = null) {
  console.log(`\n${"=".repeat(60)}\n>>> ${label}\n${"=".repeat(60)}`);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const txt = await res.text();
    let data;
    try { data = JSON.parse(txt); } catch { data = txt; }
    console.log("Status:", res.status);
    console.log("Data (ringkas):");
    console.dir(data, { depth: 4, maxArrayLength: 5, colors: true });
  } catch (e) {
    console.error("❌ ERROR:", e.message);
  }
}

await test("1. SUPPLIER MATCHING (dari teks)", "POST", "/matching/dari-teks",
  { teks: "Saya butuh supplier baja konstruksi SNI 500 ton di Jakarta", top_n: 3 });

await test("2. READINESS SCORE (per umkm)", "GET", "/readiness/demo-u2");
await test("2b. READINESS SCORE (semua)", "GET", "/readiness");

await test("3. DOCUMENT READER (teks)", "POST", "/document-reader",
  { teks: "SERTIFIKAT HALAL No. 0012345/2025 Diterbitkan: 01-01-2025 Berlaku Hingga: 31-12-2027 LPPOM MUI" });

await test("4. DEMAND TREND", "GET", "/demand/tren-kategori");
await test("4b. DEMAND BY REGION", "GET", "/demand/wilayah?top_n=5");
await test("4c. DEMAND KATEGORI x WILAYAH", "GET", "/demand/kategori-wilayah?top_n=5");

await test("5. SUPPLY GAP", "GET", "/supply-gap?top_n=5");

await test("6. RISK DETECTION (per umkm)", "GET", "/risk/demo-u2");
await test("6b. RISK DETECTION (semua)", "GET", "/risk");

await test("7. PRODUCT CATEGORIZATION", "POST", "/categorize",
  { deskripsi: "Kemeja pria lengan panjang bahan katun premium warna biru, ukuran M-XXL, cocok untuk seragam kantor dan acara formal." });
await test("7b. CATEGORIZE MODEL INFO", "GET", "/categorize/model-info");

await test("8. NEGOTIATION ASSISTANT", "GET", "/negotiation/demo-r1/demo-u2");

await test("9. MARKET INSIGHT", "GET", "/market-insight");

console.log("\n🎉 SEMUA TEST SELESAI");
