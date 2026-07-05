# Đính chính report1_metrics.pdf / report2_results.pdf / report3_code.pdf

Đối chiếu trực tiếp với paper gốc (2504.14928v3.pdf, Section 5 "Evaluation Metrics",
Section 7 "Results", Table 4) và code thật trong `education-q/src/run/`. Các mục dưới
đây là chỗ report hiện tại **sai hoặc lệch** — cần sửa trước khi nộp/trình bày.

## 1. PNIR — công thức bị đảo ngược (report1_metrics.pdf)

**Paper (Eq. 2, Section 5):**
```
PNIR = N_neg / N_pos
```
trong đó `N_neg`, `N_pos` là số câu hỏi bị ảnh hưởng tiêu cực / tích cực bởi teaching.
**Lower PNIR = ổn định hơn** (paper ghi rõ: "Lower PNIR indicates more stable teaching
performance").

**Report hiện ghi:** `PNIR = Pos / Neg` — đảo ngược tử số và mẫu số so với paper.

**Sửa:** đổi lại đúng `N_neg / N_pos`, giữ nguyên diễn giải "thấp hơn = ổn định hơn".

Ví dụ số thật từ Table 4 để đối chiếu khi sửa: Llama 3.1 70B Instruct có PNIR = 0.18,
Section 7.5 nói rõ đây là do "36 negative cases against 200 positive improvements"
→ 36/200 = 0.18. Đây chính là bằng chứng xác nhận công thức đúng là `N_neg/N_pos`,
không phải `Pos/Neg` (200/36 = 5.56, không khớp bảng).

## 2. CSS — thừa phần "1 −" không có trong paper (report1_metrics.pdf)

**Paper (Eq. 3, Section 5):**
```
CSS = σ(SLGPD)
```
trong đó `SLGPD` = Subject-wise Learning Gains Percentage Distribution, `σ` là độ
lệch chuẩn. **Không có "1 −" ở đầu công thức.** Lower CSS = ổn định hơn giữa các môn.

**Report hiện ghi:** `CSS = 1 − σ(ALG)` — thêm "1 −" sai, và dùng "ALG" thay vì đúng
"SLGPD" (SLGPD là phân bố ALG theo từng subject, không phải ALG tổng).

**Sửa:** bỏ "1 −", đổi `σ(ALG)` → `σ(SLGPD)`. Số liệu thật để đối chiếu: Llama 3.1 70B
Instruct CSS = 0.041, Gemini 1.5 Pro 002 CSS = 0.030 (Table 4) — đây là độ lệch chuẩn
thật (số nhỏ, gần 0), không phải kết quả của phép "1 − độ lệch chuẩn" (nếu vậy số sẽ
gần 1, không khớp bảng).

## 3. UIC — hiểu sai bản chất định nghĩa (report1_metrics.pdf, report2_results.pdf)

**Paper (Eq. 4, Section 5, và Section 7.6):**
> "Unique Improvement Count (UIC): Identifies questions where **only one specific
> teacher model** achieved improvement."

Tức UIC đếm số câu hỏi mà **chỉ đúng 1 trong 14 teacher model** cải thiện được câu đó
— không phải "tổng số câu 1 teacher cải thiện được" (con số đó chính là positive case
count, không phải UIC).

**Report hiện ghi:** UIC = tổng số câu mà 1 teacher cải thiện — đây là định nghĩa của
"số câu cải thiện", không phải "unique improvement".

**Sửa:** UIC = số câu hỏi mà việc cải thiện chỉ xảy ra với đúng 1 model duy nhất trong
số 14 model, không model nào khác cải thiện được câu đó. Số liệu thật: Llama 3.1 70B
Instruct và Gemini 1.5 Pro 002 cùng dẫn đầu với UIC = 37 (Table 4, Section 7.6) — đây
là 37 câu mà chỉ riêng model đó "gỡ" được, không teacher nào khác làm được.

## 4. Table 4 — không dùng số thật của paper, tự tính sai (report2_results.pdf)

**Paper ghi đúng (Table 4, cột "Overall Δ"):**

| Model | Overall ALG (%) |
|---|---|
| Llama 3.1 70B Instruct | **11.01** |
| Gemini 1.5 Pro 002 | 7.48 |
| Llama 3.1 405B Instruct | 6.14 |
| OpenAI o1-mini | 5.84 |
| Qwen 2.5 72B Instruct | 5.41 |
| Llama 3.1 8B Instruct | 4.87 |
| Hermes 3 Llama 3.1 70B | 4.14 |
| Mistral Nemo | 3.94 |
| Claude 3.5 Sonnet | 3.81 |
| WizardLM-2 8x22B | 3.67 |
| DeepSeek V2.5 | 3.27 |
| Command R 08-2024 | 2.94 |
| GPT-4o-mini | 2.44 |
| Phi-3.5-mini Instruct | 1.20 |

**Report hiện tự tính** trung bình cộng không trọng số của ALG(GPQA) và ALG(MMLU-Pro)
ra 11.7%/6.9% cho Llama 70B/405B — sai vì Table 4 đã có sẵn cột "Overall" (đã tính
đúng theo trọng số 1,498 câu = 198 GPQA + 1,300 MMLU-Pro, không phải trung bình cộng
đơn giản của 2 con số phần trăm).

**Report cũng bỏ sót Gemini 1.5 Pro 002** (#2 quan trọng, +7.48%) khỏi bảng so sánh —
cần thêm lại vì đây là model duy nhất khác cũng đạt UIC=37 ngang Llama 70B.

**Sửa:** dùng thẳng bảng Overall ở trên (copy nguyên từ Table 4), không tự tính lại.

## 5. Số liệu bịa không có trong paper (report1_metrics.pdf)

Report ghi "Human vs. Human ~80%" — **con số này không tồn tại trong paper**. Paper
chỉ có duy nhất một con số alignment: "78% alignment between human judgment and the
evaluator agent's verdict" (Section 8.2, cụ thể 39/50 cặp dialogue). Không có phép so
sánh Human-vs-Human nào được báo cáo trong bài.

**Sửa:** xóa con số "Human vs Human ~80%", chỉ giữ đúng 78% (39/50) là human-vs-evaluator-agent.

## 6. Report3_code.pdf — bỏ sót `tools/` và `output/`

Phần mô tả `main.py` khớp chính xác với code thật (rất tốt, gần như không lệch dòng
nào ở các hàm/class chính). Nhưng đề bài yêu cầu cover cả "main.py, outputs, tools" —
report hiện chỉ có main.py.

**Cần bổ sung:**
- `src/run/tools/process_and_rerun_posttest_v2.py` — script chạy lại (rerun) riêng
  phần post-test khi cần.
- `src/run/tools/process_and_rerun_interaction_posttest_v3.py` — script chạy lại
  interaction + post-test.
- Cấu trúc thư mục `src/data/output/` — mỗi lần chạy tạo ra file JSON transcript đầy
  đủ hội thoại + file XLSX tổng hợp, tổ chức theo
  `{student}/{dataset}/interactions_results/{dataset}_Teacher-{x}_Student-{y}_results_{version}_{timestamp}.json`.

## 7. Phần diễn giải "tại sao model nhỏ dạy tốt hơn" — cần dán nhãn rõ là suy đoán riêng

Report đưa giả thuyết "self-teaching" và "GPT-4o quá giỏi reasoning nên dạy dở" — đây
là **suy luận của nhóm, không có trong paper**. Không sai nếu ghi rõ là ý kiến riêng,
nhưng nên neo thêm vào bằng chứng thống kê thật mà paper đã đưa (Section 8.1):

- Logistic regression: questioning quality của Llama 3.1 70B là predictor có ý nghĩa
  (Exp(B)=32.864, p=0.043); feedback quality của Gemini 1.5 Pro 002 cũng vậy
  (Exp(B)=5227.342, p=0.019).
- Random forest (1000 trees, accuracy=0.769, AUC=0.775): hiệu quả của Llama 70B tương
  quan mạnh với "questioning strategies" (mean dropout loss 0.363), hiệu quả của
  Gemini 1.5 Pro 002 chủ yếu đến từ "feedback" (mean dropout loss 0.344).

Nên dùng 2 con số thống kê này làm bằng chứng chính, rồi mới nêu giả thuyết riêng của
nhóm như một cách diễn giải thêm — đừng để giả thuyết riêng thay thế phần phân tích
thật của paper.
