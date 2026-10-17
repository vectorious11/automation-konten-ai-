# Changelog 2026-10-17

## Perubahan di n8n (web: automations.adsbyarief.com)

### 1. Pipeline Harian (ID 0DTvyCMg7usfskeK)
- CTA penutup dihapus dari slide terakhir carousel. Ajakan komen dengan kata kunci tidak dipakai lagi.
- Node "Susun Slide Kartu": instruksi CTA diubah. `cta_title` harus kosong, body berupa ajakan diskusi yang natural.
- Node "Parse Slide Kartu": slide terakhir (jika lebih dari 1 slide) dikosongkan `cta_title`-nya.
- Jadwal aktif: 08:00 dan 16:00 WIB.
- Node "Render Slide" memakai URL `http://renderer:3000/render`. Di web belum ada service renderer, jadi render gagal di web (lihat catatan di bawah).

### 2. Posting Konten Approve (ID h2FNLSkQyJbn2cIB) - workflow baru
- Dipanggil dari agent lewat executeWorkflowTrigger (passthrough).
- Alur: cari baris di Log Konten berdasarkan Message ID, posting ke Threads, lalu Instagram (single atau carousel), lalu update Status menjadi "terposting" dan mengisi Link Post Threads dan Link Post IG.

### 3. Handle Approval (ID U5WXziAdgRJGoI5m)
- Tetap menjadi satu-satunya penerima webhook Telegram untuk bot lama (tombol Approve, Revisi, Lanjut, dan chat revisi).
- Tidak diubah di sisi logika, hanya dipastikan aktif kembali setelah sempat dinonaktifkan sementara.

### 4. Asisten Konten Scalewise (agent, ID Hq4osMOQnJ3w01hp)
- Agent chat baru, status PUBLISHED.
- Tools: `jalankan_pipeline_harian` (Pipeline Harian) dan `posting_konten_approve` (Posting Konten Approve).
- Terhubung ke bot Telegram BARU lewat credential "Telegram account 2" (ID gHQ2WuIOxgFjaqBQ).
- Akses dibatasi: `accessMode: private`, `allowedUsers: 5331390153`.
- Model: openai/gpt-5.4-mini, reasoning medium.

## Arsitektur dua bot

| Bot | Credential n8n | Fungsi |
|---|---|---|
| Bot lama | "Telegram account" (ID 4yNZARBNY2WzSzS8) | Handle Approval: kirim preview, tombol Approve, Revisi, Lanjut, dan balasan revisi |
| Bot baru (agent) | "Telegram account 2" (ID gHQ2WuIOxgFjaqBQ) | Chat dengan agent untuk rencana dan konten baru |

Alasan dipisah: Telegram hanya mengizinkan satu webhook per bot, dan tombol (callback_query) hanya ditangani oleh Handle Approval. Agent tidak menangani tombol.

## Catatan untuk server / update

- Renderer di web belum tersedia. Render slide gagal dengan `EAI_AGAIN n8n-renderer`. Perlu menambahkan service renderer di web atau mengarahkan URL ke renderer yang berjalan.
- Key OpenAI di web perlu dicek saldonya. Sebelumnya ada error 429 "no credits remaining".
- Credential Telegram, Google, OpenAI, dan Header Auth (Threads, Instagram) hanya ada di n8n. Tidak disimpan di repo. Jangan commit token atau secret apa pun.
- Setelah update di server, pastikan Telegram webhook bot lama masih terdaftar ke Handle Approval, dan bot baru terdaftar ke agent.

## Yang belum dikerjakan
- Tes revisi lewat agent (jangan dilakukan sampai ada persetujuan eksplisit, karena bisa memicu posting nyata).
- Renderer untuk web.
- Export JSON workflow ke folder `workflows/` (menunggu file dari n8n).
