# EducationQ Demo

Website minh họa paper **EducationQ: Evaluating LLMs' Teaching Capabilities Through
Multi-Agent Dialogue Framework** (Shi, Liang, Xu — ACL 2025, arXiv:2504.14928).

Next.js + TypeScript + Tailwind. Không cần backend riêng — gọi thẳng OpenAI/OpenRouter
qua một API route nhỏ chỉ để tránh lộ key ra network tab của trình duyệt.

## Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000.

## Cấu trúc trang

| Route | Nội dung |
| --- | --- |
| `/` | Giới thiệu paper: motivation, 3 giai đoạn tiến hóa đánh giá LLM, kiến trúc 3-agent (Teacher/Student/Evaluator), content boundary design. |
| `/results` | Dashboard kết quả gốc của paper — Table 4 (14 teacher models, ALG/PNIR/CSS/UIC), subject-strength breakdown. Toàn bộ số liệu tĩnh, chép lại từ paper. |
| `/demo` | Demo tương tác, 2 chế độ (xem bên dưới). |

## `/demo` — 2 chế độ

**Replay (mặc định, không cần API key).** Xem lại 2 hội thoại thật, chép nguyên văn
từ Appendix F của paper (Question 240 — Llama 3.1 70B Instruct dạy môn Business,
Question 961 — Gemini 1.5 Pro dạy môn Law). Bấm "▶ Phát hội thoại" để tự động hiện
từng lượt chat, hoặc "Bỏ qua" để xem toàn bộ ngay.

**Live — chat tự do với Teacher LLM thật.** Bạn đóng vai Student, gõ bất kỳ câu hỏi
nào (không giới hạn trong 1 câu hỏi trắc nghiệm cụ thể) và Teacher trả lời ngay như
một chatbot, nhưng theo đúng phong cách sư phạm paper mô tả: đặt câu hỏi gợi mở,
scaffolding, không đưa đáp án trực tiếp trừ khi bạn thực sự bế tắc.

### Lấy API key (miễn phí)

Live mode cần một API key của OpenAI hoặc OpenRouter — key chỉ được gửi trực tiếp
từ trình duyệt tới API route nội bộ rồi forward thẳng tới provider, **không lưu ở
đâu cả** (không cookie, không DB, không log).

Cách nhanh nhất, không tốn tiền:

1. Tạo tài khoản tại [openrouter.ai/keys](https://openrouter.ai/keys).
2. Tạo một key, copy vào ô "API key" trên demo (chọn Provider = OpenRouter).
3. Chọn một model có nhãn 🆓 trong danh sách Teacher model (ví dụ *Llama 3.1 8B
   Instruct (free)*) — các model này không tính phí trên OpenRouter.

Demo tự hiện lại hướng dẫn này ngay trong UI khi bạn bật Live mode mà chưa nhập key.

### Lỗi thường gặp khi gọi Live mode

| Lỗi | Nguyên nhân thường gặp |
| --- | --- |
| `401` — key bị từ chối | Key dán thiếu/thừa ký tự, key hết hạn, hoặc chọn nhầm Provider không khớp định dạng key (OpenRouter key luôn bắt đầu `sk-or-`, OpenAI key bắt đầu `sk-`). |
| `404` — không tìm thấy model | Tên model sai hoặc model đó không khả dụng với tài khoản/key hiện tại. |
| `429` — vượt giới hạn | Tài khoản chưa nạp credit, hoặc gọi quá nhanh (rate limit). Với model free, đợi vài giây rồi thử lại. |

Mỗi lỗi có nút "Thử lại" ngay trong khung chat — không cần gõ lại câu hỏi.

## Dữ liệu & mã nguồn liên quan tới paper

- `src/lib/paperData.ts` — số liệu Table 4 (14 teacher models) và subject-strength
  breakdown, chép lại từ paper, dùng cho `/results`.
- `src/lib/replayCases.ts` — 2 hội thoại đầy đủ (câu hỏi, pre-test, 5 rounds,
  post-test, ALG) chép nguyên văn từ Appendix F (Table 23, 24) của paper, dùng cho
  chế độ Replay.
- `src/lib/prompts.ts` — `freeChatSystemMessage()`: system prompt cho Teacher ở chế
  độ Live, viết theo tinh thần formative-assessment mà paper dùng cho Teacher agent
  (probing questions, feedback, scaffolding trước khi đưa đáp án).
- `public/data/questions.json` — 1,498 câu hỏi gốc của paper (1,300 MMLU-Pro
  Stratified + 198 GPQA Diamond), convert từ `../src/data/dataset/` bằng
  `scripts/build_dataset.py`. Không dùng trực tiếp trong `/demo` hiện tại (chat tự
  do không cần chọn câu hỏi từ dataset) — giữ lại làm nguồn dữ liệu cho các tính
  năng sau này. Chạy lại nếu dataset gốc thay đổi:
  ```bash
  python3 scripts/build_dataset.py
  ```

## Cấu trúc thư mục

```
webapp/
├── public/data/questions.json      # dataset đã convert (xem trên)
├── scripts/build_dataset.py        # script convert dataset gốc -> questions.json
└── src/
    ├── app/
    │   ├── page.tsx                # landing page "/"
    │   ├── results/page.tsx        # dashboard "/results"
    │   ├── demo/                   # "/demo" (page.tsx + DemoClient.tsx)
    │   └── api/teacher/route.ts    # proxy gọi OpenAI/OpenRouter, không lưu key
    ├── components/
    │   ├── NavBar.tsx, BarRow.tsx
    │   └── demo/                   # ChatBubble, FreeChatPanel, ReplayPanel, TeacherConfigPanel
    └── lib/
        ├── paperData.ts, replayCases.ts, prompts.ts
        ├── llmClient.ts            # client gọi /api/teacher + danh sách model preset
        └── types.ts
```
