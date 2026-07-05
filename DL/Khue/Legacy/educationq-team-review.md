# Nhận xét & Đánh giá của nhóm — EducationQ

*Phần này thể hiện góc nhìn phản biện của nhóm với tư cách người đọc, không phải tóm tắt paper.*

---

## 1. Đánh giá tổng quan — Paper này đóng góp gì thực sự?

EducationQ đặt ra một câu hỏi nghiên cứu đúng và quan trọng: "LLM dạy giỏi đến đâu?" — một câu hỏi mà cả cộng đồng đang bỏ qua khi chạy theo MMLU scores. Contribution lớn nhất không phải kết quả thực nghiệm, mà là **việc đặt vấn đề** (problem framing): paper thuyết phục được rằng "biết" và "dạy" là hai năng lực khác nhau, và chúng ta đang thiếu công cụ đo năng lực thứ hai.

Tuy nhiên, khi đi sâu vào methodology và kết quả, nhóm nhận thấy một số điểm cần thảo luận thêm — không phải để phủ nhận paper, mà để hiểu rõ ranh giới của những gì kết quả này thực sự cho biết.

---

## 2. Điểm mạnh — Những gì paper làm tốt

### 2.1 Problem framing xuất sắc

Paper không chỉ nói "benchmark hiện tại chưa đủ" — nó phân tích cụ thể **tại sao** từng paradigm (closed-ended, open-ended, multi-turn) thất bại cho giáo dục, trích dẫn nghiên cứu sư phạm cụ thể cho từng chức năng giảng dạy bị bỏ lỡ. Cách xây dựng motivation rất chặt chẽ và thuyết phục. Đây là kiểu gap analysis mà reviewer khó từ chối.

### 2.2 Thiết kế Content Boundary — Ý tưởng sáng tạo

Việc strip answer options khỏi teacher input là thiết kế đơn giản nhưng elegant. Nó giải quyết một vấn đề rất thực: nếu teacher thấy options, nó có thể "cheat" bằng cách gợi ý trực tiếp đáp án thay vì dạy thật. Cơ chế này buộc teacher phải scaffolding — và điều này được validate bởi chuyên gia (không ai phát hiện answer leakage). Đây là contribution thiết kế đáng ghi nhận.

### 2.3 Mixed-methods approach

Kết hợp quantitative (ALG, PNIR, CSS, UIC) với qualitative (17 chiều đánh giá + expert case studies) cho bức tranh toàn diện. Rất nhiều benchmark papers chỉ có "model A đạt X%, model B đạt Y%" — EducationQ đi xa hơn bằng cách giải thích **tại sao** model này dạy giỏi hơn (questioning vs feedback strategies). Điều này hữu ích hơn nhiều cho cộng đồng.

### 2.4 Robustness checks kỹ lưỡng

Cross-dataset consistency r=0.871, test-retest variance = 0.008, student ablation study — paper không chỉ báo kết quả mà chứng minh kết quả đáng tin. Đây là điểm mà nhiều benchmark papers thiếu.

### 2.5 Reproducibility

Open-source code + dataset trên HuggingFace + student agent là public model (Llama 70B) + temperature 0.0 + chi tiết prompt templates đầy đủ trong Appendix → bất kỳ ai cũng có thể reproduce. Đây là tiêu chuẩn vàng cho benchmark research.

---

## 3. Điểm cần thảo luận — Những câu hỏi nhóm đặt ra

### 3.1 ALG có thực sự đo "teaching effectiveness" không?

**Vấn đề cốt lõi:** ALG = ACC_post − ACC_pre. Post-test cho student truy cập toàn bộ dialogue history trong context window. Câu hỏi: student cải thiện vì **thực sự hiểu hơn** (genuine learning), hay vì **có thêm thông tin trong context** giúp suy luận tốt hơn mà không cần "hiểu" (in-context information augmentation)?

Ví dụ: Nếu teacher giải thích rằng "khi chia 275.08 cho 0.065, cần chú ý rounding error" — student post-test có thể chỉ đơn giản nhớ lại gợi ý này từ dialogue context và áp dụng, mà không thực sự "hiểu" tại sao rounding error xảy ra. Đây là "retrieval from context" chứ không phải "learning."

**Hệ quả:** Nếu ALG phần lớn đo in-context retrieval thay vì genuine learning, thì model nào cung cấp gợi ý rõ ràng nhất sẽ đạt ALG cao nhất — và đó có thể là "dạy tốt" hoặc chỉ là "cung cấp thông tin tốt" (hai thứ khác nhau).

**Cách kiểm chứng (gợi ý của nhóm):** Thêm một "delayed post-test" sau một khoảng thời gian mà dialogue context KHÔNG còn trong context window. Nếu ALG duy trì → genuine learning. Nếu ALG giảm mạnh → chủ yếu là in-context retrieval. Tất nhiên, với LLM agent (không có persistent memory), "delayed test" khó implement — nhưng paper nên acknowledge vấn đề này.

### 3.2 Student cố định — Controlled experiment hay over-simplification?

Paper argue rằng student cố định là "controlled experiment" — giữ student constant để cô lập teacher performance. Ablation study cho thấy ranking không đổi khi đổi student model. Đây là argument hợp lý cho **research methodology**.

**Nhưng:** Trong thực tế, teaching effectiveness phụ thuộc rất nhiều vào **ai là người học**. Một giáo viên giỏi với sinh viên giỏi có thể kém hiệu quả với sinh viên yếu, và ngược lại. Việc chỉ dùng 1 student profile (Llama 70B, graduate-level, English, đặc điểm nhận thức của model cụ thể) nghĩa là kết quả chỉ valid cho "kiểu student" này.

**Gợi ý:** Nên test với ít nhất 3-4 student profiles rõ rệt khác nhau — ví dụ: student "hay hỏi lại" (inquisitive), student "hay đồng ý ngay" (compliant), student "hay hiểu sai" (misconception-prone) — để xem ranking có thay đổi theo loại student không. Ablation hiện tại chỉ đổi model (Qwen, Mistral) chứ không đổi persona — và model khác nhau không nhất thiết mô phỏng kiểu student khác nhau.

### 3.3 GPT-4o đánh giá GPT-4o-mini — Vấn đề evaluator bias

Paper dùng GPT-4o làm evaluator, đánh giá 14 teacher models trong đó có GPT-4o-mini (cùng "dòng" OpenAI). Kết quả: GPT-4o-mini xếp hạng 13/14 — rất thấp. Paper argue "nếu có bias thì bias ngược" (đáng lẽ favor cùng vendor).

**Phản biện của nhóm:** Argument này hơi yếu. Bias không nhất thiết là "favor cùng vendor" — bias có thể là:
- GPT-4o quen với "phong cách" phản hồi của OpenAI models → đánh giá khắt hơn vì nhận ra patterns quen thuộc nhưng áp dụng tiêu chuẩn cao hơn.
- Hoặc ngược lại: GPT-4o có thể đánh giá models có phong cách khác OpenAI (như Llama) một cách "mới mẻ" hơn → score cao hơn.

**78% human agreement** là evidence mạnh nhất chống lại concern này — nhưng chỉ trên 50 pairs, chưa phải full dataset. Sẽ tốt hơn nếu validate trên nhiều pairs hơn hoặc dùng evaluator model từ vendor khác (Claude, Gemini) để cross-check.

### 3.4 Temperature 0.0 — Reproducible nhưng có representative không?

Tất cả agents (teacher, student, evaluator) đều chạy temperature 0.0 — deterministic. Ưu điểm: reproducible. Nhưng T=0.0 có phải là cách người ta dùng LLM trong thực tế? Hầu hết ứng dụng giáo dục dùng T=0.3-0.7 để có variety trong cách dạy. Một teacher model có thể rất giỏi ở T=0.5 (creative questioning) nhưng kém ở T=0.0 (bị "cứng" trong 1 pattern duy nhất).

Kết quả paper có thể thay đổi nếu dùng temperature khác — và paper không report ablation on temperature. Đây là gap nhỏ nhưng cần acknowledge.

### 3.5 5 rounds × 150 tokens — Arbitrary hay principled?

Paper report ablation: 250 tokens → no gain, 70-100 tokens → degraded, 10 rounds → no gain over 5. Kết luận: 5 × 150 là sweet spot.

**Nhận xét:** Ablation này hữu ích nhưng chỉ test trên 1-2 configurations — không phải grid search toàn diện. Quan trọng hơn, 150 tokens rất ngắn cho một giáo viên thực — khoảng 2-3 câu. Giáo viên thật có thể cần giải thích dài hơn nhiều cho một khái niệm phức tạp. Constraint này có thể "favor" models giỏi đặt câu hỏi ngắn (Llama 70B, trung bình 73.6 tokens) so với models muốn giải thích dài hơn.

Nói cách khác: <b>framework có thể đang đo "ai dạy tốt nhất trong 150 tokens" thay vì "ai dạy tốt nhất nói chung."</b> Đây là constraint cần thiết cho tính khả thi (cost, speed) nhưng nên được acknowledge rõ ràng hơn.

### 3.6 Thiếu comparison với baseline quan trọng

Paper không so sánh EducationQ với một baseline đơn giản nhưng mạnh: **"teacher chỉ đưa explanation trực tiếp"** (direct instruction baseline). Nếu thay vì hỏi-đáp 5 rounds, teacher chỉ viết 1 bài giải thích dài về topic → student đọc → post-test — ALG sẽ bao nhiêu?

Nếu direct instruction ALG ≈ IFA-based ALG → IFA framework có thể overcomplicate vấn đề. Nếu IFA ALG >> direct instruction → framework thực sự capture advantage của interactive teaching. Paper thiếu baseline comparison này.

### 3.7 Lựa chọn models đã cũ

14 models được chọn vào khoảng tháng 9-10/2024. Không có GPT-4o (full, không phải mini), Claude 3.5 Opus, Gemini 2.0, DeepSeek V3, Qwen 2.5 Max, Llama 3.3 — tất cả đều ra sau. Đặc biệt, không có model nào được fine-tune hoặc optimized cho giáo dục (như Khanmigo hoặc specialized tutoring models).

Kết quả "Llama 70B dạy giỏi nhất" có thể không còn đúng với generation models mới hơn. Đây là limitation tự nhiên của bất kỳ benchmark paper nào, nhưng cần nhớ khi interpret kết quả.

### 3.8 Evaluator 17 chiều — Dimensional overlap chưa xử lý

Paper tự nhận: "Given the exploratory nature of this component, we did not address the dimensional overlap." Đây là concern thực — ví dụ: "Questioning Effectiveness" (Holistic) và "Question Relevance" + "Cognitive Level" + "Question Diversity" (Teacher-Centric) rõ ràng có overlap lớn. Khi dùng các scores này trong logistic regression/random forest, multicollinearity có thể inflate hoặc distort predictor importance.

---

## 4. Câu hỏi mở — Hướng nghiên cứu tiếp theo

### 4.1 Teaching capability có transfer không?

Nếu Llama 70B dạy giỏi nhất trên GPQA/MMLU-Pro content, liệu nó có dạy giỏi trên K-12 math? Trên language learning? Trên technical onboarding? Teaching capability có phải là general skill hay domain-specific?

### 4.2 Có thể fine-tune cho teaching không?

Paper ngụ ý rằng teaching cần "specialized optimization beyond simple scaling." Nhưng cụ thể thì optimize thế nào? Có thể dùng EducationQ dialogues từ Llama 70B (model dạy giỏi nhất) để fine-tune model khác không? Nếu fine-tune 405B trên dialogues của 70B, liệu 405B có cải thiện teaching không? Đây là câu hỏi tự nhiên mà paper gợi ra nhưng chưa trả lời.

### 4.3 Role của instruction-following

Llama 70B có IFEval 86.96 — instruction-following rất mạnh. Liệu teaching effectiveness có đơn giản là hệ quả của instruction-following tốt (tuân thủ "hỏi câu hỏi, không tiết lộ đáp án, giới hạn 150 tokens") chứ không phải "pedagogical capability" thực sự? Paper không tách biệt hai yếu tố này.

### 4.4 Multimodal teaching

Giáo viên thật dùng bảng, hình vẽ, biểu đồ, cử chỉ — không chỉ text. EducationQ hoàn toàn text-based. Multimodal models (GPT-4V, Gemini với image) có thể dạy hiệu quả hơn nếu được phép dùng visual aids. Đây là hướng mở rộng quan trọng.

---

## 5. Đánh giá theo tiêu chí

| Tiêu chí | Đánh giá | Ghi chú |
|---|---|---|
| **Novelty** | ★★★★☆ | Câu hỏi nghiên cứu mới và quan trọng. Framework design sáng tạo (content boundary). Nhưng multi-agent simulation cho giáo dục không hoàn toàn mới (GPTeach, TeachTune). |
| **Methodology** | ★★★★☆ | Thiết kế chặt chẽ, ablation studies đầy đủ, robustness checks kỹ. Nhưng ALG có thể đo in-context retrieval thay vì genuine learning. |
| **Experimental rigor** | ★★★★★ | 14 models, 1,498 câu hỏi, 19,474 dialogues, cross-dataset validation, test-retest, student ablation, human expert validation. Rất thorough. |
| **Reproducibility** | ★★★★★ | Open-source code, public dataset, deterministic parameters, detailed prompts. Tiêu chuẩn vàng. |
| **Writing quality** | ★★★★☆ | Rõ ràng, có cấu trúc, motivation mạnh. Một số phần Appendix hơi dài. |
| **Impact** | ★★★★☆ | Có thể thay đổi cách chọn model cho educational AI. Nhưng practical adoption cần ecosystem (leaderboard, API, easy integration). |
| **Generalizability** | ★★★☆☆ | Chỉ 1-on-1, text-only, graduate-level, English, MCQ format, fixed student. Nhiều constraints giới hạn applicability. |

**Đánh giá tổng thể: 4/5** — Paper mạnh về problem framing, experimental rigor, và reproducibility. Hạn chế chính là generalizability hẹp và câu hỏi về ALG thực sự đo gì. Worthy of ACL 2025 Main Conference.

---

## 6. Tóm tắt nhận xét — Key takeaways của nhóm

**Đồng ý mạnh nhất với:**
- "Scale ≠ Teaching" — phát hiện quan trọng và được support bằng evidence mạnh.
- Content Boundary Design — ý tưởng sáng tạo, đơn giản, hiệu quả.
- Cần benchmark riêng cho teaching — gap statement rất thuyết phục.

**Skeptical nhất về:**
- ALG có thực sự đo "learning" hay chỉ đo "in-context information utilization."
- 1 student profile cố định có đủ đại diện cho teaching effectiveness không.
- 150 tokens/round có favor certain teaching styles không.

**Muốn thấy thêm:**
- Delayed post-test (không có dialogue context) để phân biệt learning vs retrieval.
- Direct instruction baseline để so sánh IFA approach.
- Diverse student profiles (không chỉ đổi model mà đổi persona/behavior).
- Cross-evaluator validation (dùng Claude hoặc Gemini làm evaluator, so sánh).
- Newer models (GPT-4o full, DeepSeek V3, Claude 3.5 Opus, specialized education models).
