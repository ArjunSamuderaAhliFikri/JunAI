# JunAI Wireframes — Figma-ready (PRD V1.0.0)

## Isi paket
- 50 file SVG individual, satu file untuk setiap screen S-01 sampai S-50.
- Semua SVG memakai artboard 1440 × 900 px, gaya low-fidelity, komponen berupa shape/text sehingga bisa diimpor dan diedit di Figma.
- `screen-index.csv` berisi ID, nama, kelompok, dan tujuan screen.
- `Design-Tokens.md` berisi palet, ukuran, dan pola komponen.
- `PRD-Assumptions.md` memisahkan aturan yang benar-benar disebut PRD dari asumsi desain.

## Cara memasukkan ke Figma
1. Ekstrak ZIP ini.
2. Di Figma, buat file Design baru.
3. Drag satu atau beberapa file SVG ke canvas, atau gunakan File → Place image untuk memasukkannya.
4. Jika SVG masuk sebagai satu objek, gunakan Ungroup bila tersedia; jika teks/shape tidak terpisah sempurna, gunakan SVG sebagai acuan lalu bangun ulang komponen native.
5. Buat page `01 - Authentication`, `02 - Core`, `03 - Meeting`, `04 - Documents`, `05 - History`, `06 - Scheduling`, `07 - Users & RBAC`, `08 - Follow-up`, `09 - System`; kelompokkan frame berdasarkan prefix ID.

## Catatan
Paket ini adalah wireframe low-fidelity Figma-ready, bukan file `.fig` native dan bukan prototype interaktif. Nama menu, konten, dan data contoh adalah dummy untuk menunjukkan tata letak.
