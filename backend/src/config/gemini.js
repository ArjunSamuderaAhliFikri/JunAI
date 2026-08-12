// /** @format */

// const { GoogleGenAI } = require("@google/genai");
// const fs = require("fs");

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// const summarizeGuideline = `
// # Prompt Ringkasan Meeting

// Bisakah Anda merangkum hasil diskusi meeting berikut ke dalam **Bahasa Indonesia** yang **ringkas, jelas, dan mudah dipahami**?

// Instruksi:

// * Fokus pada **inti pembahasan**, jangan menyalin percakapan secara mentah.
// * Hilangkan pengulangan, percakapan kecil (small talk), candaan, atau informasi yang tidak relevan.
// * Jelaskan setiap poin penting secara singkat namun tetap mempertahankan konteks.
// * Jika terdapat keputusan, tugas, atau rencana tindak lanjut, tampilkan secara jelas.
// * Gunakan format berikut:

// # Ringkasan Meeting

// ## Tujuan Meeting

// * Jelaskan tujuan utama meeting dalam 1–3 kalimat.

// ## Poin Pembahasan

// * **Topik 1**

//   * Penjelasan singkat.
//   * Hal penting yang dibahas.
// * **Topik 2**

//   * Penjelasan singkat.
//   * Hal penting yang dibahas.
// * (Lanjutkan sesuai isi meeting.)

// ## Keputusan yang Diambil

// * Keputusan 1
// * Keputusan 2
// * dst.

// ## Action Items (Tindak Lanjut)

// | PIC             | Tugas           | Deadline                  | Status        |
// | --------------- | --------------- | ------------------------- | ------------- |
// | Nama (jika ada) | Deskripsi tugas | Tanggal (jika disebutkan) | Belum/Selesai |

// ## Catatan Penting

// * Risiko, kendala, pertanyaan yang belum terjawab, atau hal yang perlu diperhatikan.

// ## Ringkasan Singkat

// Buat ringkasan akhir dalam 3–5 kalimat yang merangkum keseluruhan meeting.

// **Catatan tambahan:**

// * Jangan membuat informasi yang tidak disebutkan dalam meeting.
// * Jika ada informasi yang kurang jelas atau tidak terdengar, tuliskan **"(tidak terdengar jelas)"** daripada menebak.
// * Jika ada singkatan atau istilah teknis, pertahankan istilah tersebut dan jelaskan secara singkat jika diperlukan.
// * Susun hasil akhir dengan format Markdown yang rapi agar mudah dibaca.
// `;

// const configureGemini = async (req, res) => {
//   try {
//     const interaction = await ai.interactions.create({
//       model: "gemini-3.6-flash",
//       input: [
//         { type: "text", text: summarizeGuideline },
//         {
//           type: "audio",
//           data: fs.readFileSync(req.file.path).toString("base64"),
//           mime_type: "audio/wav",
//         },
//       ],
//     });
//     return res.status(200).json({ interaction: interaction.output_text });
//   } catch (error) {
//     console.error("Error during Gemini interaction:", error);
//     return res.status(500).json({
//       message: ["Error during Gemini interaction", error.message],
//     });
//   }
// };

// module.exports = { configureGemini };
