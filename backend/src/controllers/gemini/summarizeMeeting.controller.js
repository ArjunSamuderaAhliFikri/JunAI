/** @format */

const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const puppeteer = require("puppeteer");

const path = require("path");
const { dispatchNotification } = require("../../services/notification/notificationDispatcher.service");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const summarizeGuideline = `
      Analisis rekaman rapat berikut berdasarkan panduan ini: .
      Kembalikan hasilnya DALAM FORMAT JSON SAJA dengan struktur:
      {
        "title": "Judul Topik Rapat",
        "date": "Tanggal Rapat (misal: 14 September 2026)",
        "summary": "Ringkasan eksekutif 2-3 paragraf...",
        "keyPoints": [
          {"topic": "Topik 1", "description": "Penjelasan poin 1"},
          {"topic": "Topik 2", "description": "Penjelasan poin 2"}
        ],
        "actionItems": [
          {"task": "Tugas 1", "assignee": "Nama PIC", "deadline": "DD-MM-YYYY", "status": "In Progress"},
          {"task": "Tugas 2", "assignee": "Nama PIC", "deadline": "DD-MM-YYYY", "status": "To Do"}
        ]
      }

      Tolong supaya kamu pertegas lagi point point nya disini!
    `;

const summarizeMeetingController = async (req, res) => {
  try {
    const rawSessionId =
      req.body.sessionId || req.body.sessionID || "default_session";
    const sessionFolder = rawSessionId.startsWith("session_")
      ? rawSessionId
      : `session_${rawSessionId}`;

    const filePath =
      req.file?.path ||
      path.resolve(
        __dirname,
        "../../../uploads/meetings/sessions",
        sessionFolder,
        "meeting.wav",
      );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File meeting not found",
      });
    }

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: [
        { type: "text", text: summarizeGuideline },
        {
          type: "audio",
          data: fs.readFileSync(filePath).toString("base64"),
          mime_type: "audio/wav",
        },
      ],
    });

    const rawText = interaction.output_text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(rawText);

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #334155;
          background-color: #ffffff;
          line-height: 1.6;
          -webkit-print-color-adjust: exact;
          padding: 40px;
        }

        /* Header / Masthead */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }

        .header-title h1 {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .header-title p {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }

        .badge {
          background-color: #e0e7ff;
          color: #3730a3;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Section Title */
        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-title::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 16px;
          background-color: #4f46e5;
          border-radius: 2px;
        }

        .section {
          margin-bottom: 28px;
        }

        /* Executive Summary Box */
        .summary-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #4f46e5;
          border-radius: 8px;
          padding: 18px;
          font-size: 13.5px;
          color: #334155;
        }

        /* Key Points Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .point-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }

        .point-card h4 {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .point-card p {
          font-size: 12.5px;
          color: #64748b;
        }

        /* Table Styling */
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          margin-top: 8px;
        }

        th {
          background-color: #f1f5f9;
          color: #475569;
          font-weight: 600;
          text-align: left;
          padding: 10px 14px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #cbd5e1;
        }

        td {
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }

        tr:nth-child(even) {
          background-color: #f8fafc;
        }

        .status-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-in-progress { background-color: #fef3c7; color: #92400e; }
        .status-to-do { background-color: #f1f5f9; color: #475569; }
        .status-done { background-color: #dcfce7; color: #166534; }

        /* Footer */
        .footer {
          margin-top: 40px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>

      <!-- Header -->
      <div class="header">
        <div class="header-title">
          <h1>${data.title || "Notulensi & Rangkuman Rapat"}</h1>
          <p>Tanggal: ${data.date || "September 2026"} | AI Generated Executive Summary</p>
        </div>
        <span class="badge">CONFIDENTIAL</span>
      </div>

      <!-- Ringkasan Eksekutif -->
      <div class="section">
        <div class="section-title">Ringkasan Eksekutif</div>
        <div class="summary-card">
          <p>${data.summary}</p>
        </div>
      </div>

      <!-- Poin-Poin Utama -->
      <div class="section">
        <div class="section-title">Poin Utama Diskusi</div>
        <div class="cards-grid">
          ${
            data.keyPoints
              ?.map(
                (item) => `
            <div class="point-card">
              <h4>${item.topic}</h4>
              <p>${item.description}</p>
            </div>
          `,
              )
              .join("") || ""
          }
        </div>
      </div>

      <!-- Tabel Action Items -->
      <div class="section">
        <div class="section-title">Tindak Lanjut & Action Items</div>
        <table>
          <thead>
            <tr>
              <th>Tugas / Langkah</th>
              <th>PIC</th>
              <th>Tenggat Waktu</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${
              data.actionItems
                ?.map(
                  (item) => `
              <tr>
                <td><strong>${item.task}</strong></td>
                <td>${item.assignee}</td>
                <td>${item.deadline}</td>
                <td>
                  <span class="status-badge status-${(item.status || "to-do").toLowerCase().replace(/\s+/g, "-")}">
                    ${item.status}
                  </span>
                </td>
              </tr>
            `,
                )
                .join("") || ""
            }
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="footer">
        <span>Diproses secara otomatis oleh Gemini AI</span>
        <span>Dokumen Internal</span>
      </div>

    </body>
    </html>
    `;

    console.log("Data : ", data);

    const browser = await puppeteer.launch({ headless: "new" });

    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();

    const filename = `Rangkuman_Rapat_${new Date().toISOString().split("T")[0]}.pdf`;

    const outputFolder = path.resolve(
      __dirname,
      "../../../uploads/meetings/sessions",
      sessionFolder,
    );

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    const fullFilePath = path.join(outputFolder, filename);

    fs.writeFileSync(fullFilePath, pdfBuffer);
    console.log(`PDF berhasil disimpan di: ${fullFilePath}`);

    // Dispatch real-time notification & Discord alert
    const targetUserId = req.body.userId ? parseInt(req.body.userId) : 1;
    dispatchNotification({
      title: `Meeting Selesai: ${data.title || "Notulensi Rapat"}`,
      message: `Rangkuman eksekutif dan PDF meeting berhasil diproses: ${filename}`,
      type: "MEETING_ENDED",
      userId: targetUserId,
      sendDiscord: true,
    }).catch((err) => {
      console.warn("⚠️ Notification dispatch warning:", err.message);
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.status(200).json({
      message: `PDF ${filename} berhasil disimpan!`,
      filePath: `uploads/meetings/sessions/${sessionFolder}/${filename}`,
    });
  } catch (error) {
    console.error("Error during Gemini interaction:", error);
    return res.status(500).json({
      message: ["Error during Gemini interaction", error.message],
    });
  }
};

module.exports = { summarizeMeetingController };
