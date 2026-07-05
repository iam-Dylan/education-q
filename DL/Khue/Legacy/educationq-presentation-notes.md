# EducationQ — Ghi chú trình bày chi tiết

## Phần 1: Motivation — Vì sao paper này tồn tại?

---

### 1.1 Bối cảnh: LLM đang tràn vào giáo dục

LLM ngày càng được triển khai như công cụ giáo dục — làm gia sư, chấm bài, sinh câu hỏi, cung cấp phản hồi cá nhân hóa. Xu hướng này được ghi nhận rộng rãi trong nghiên cứu gần đây (Memarian & Doleck, 2023). Tuy nhiên, có một sự không đối xứng nghiêm trọng: chúng ta có rất nhiều benchmark đo LLM *biết* gì, nhưng gần như không có benchmark nào đo LLM *dạy* giỏi đến đâu.

Paper mô tả sự tiến hóa này qua ba giai đoạn (Figure 1 trong paper):

- **(a) Giai đoạn 1 — Single-turn general task:** LLM được đánh giá qua các tác vụ đơn lẻ như trả lời câu hỏi, suy luận, viết code. Đây là paradigm của MMLU, GPQA, HumanEval, MATH. Mỗi câu hỏi một lượt, không có tương tác.
- **(b) Giai đoạn 2 — Single-turn educational agent task:** LLM được đánh giá trên các tác vụ giáo dục cụ thể nhưng vẫn đơn lẻ — ví dụ: sinh câu hỏi (Olney, 2023; Shridhar et al., 2022), chấm bài tự động (Nye et al., 2023; Patil et al., 2024), cung cấp phản hồi (Cohn et al., 2024). Mỗi tác vụ được đánh giá riêng lẻ.
- **(c) Giai đoạn 3 — Multi-agent, multi-turn dynamic educational scenario:** Đây chính là EducationQ — đánh giá *năng lực dạy học tổng hợp* trong bối cảnh tương tác động, bao gồm đặt câu hỏi, đánh giá, phản hồi, điều chỉnh chiến lược — tất cả trong cùng một cuộc hội thoại nhiều lượt.

### 1.2 Khoảng trống cốt lõi: benchmark hiện tại đo gì sai

Paper chỉ ra ba paradigm đánh giá LLM hiện tại và giải thích tại sao *cả ba đều thất bại* khi đánh giá năng lực dạy học:

**Paradigm 1 — Closed-ended benchmarks (MMLU, MMLU-Pro, GPQA, MATH, HumanEval):**
- Ưu điểm: tự động hóa dễ dàng, có thể scale.
- Hạn chế cho giáo dục: chỉ đo *kiến thức* và *suy luận* của model — tức là model biết gì. Hoàn toàn bỏ qua khả năng *dẫn dắt* học sinh, đặt câu hỏi gợi mở, đánh giá hiểu biết của người học, và điều chỉnh cách dạy theo thời gian thực. Nói cách khác, benchmark này đo "LLM trả lời đúng bao nhiêu câu" chứ không đo "LLM dạy cho học sinh hiểu được bao nhiêu."

**Paradigm 2 — Open-ended evaluation (instruction following, human preference alignment):**
- Gồm IFEval (Zhou et al., 2023), FLAN (Wei et al., 2022), Self-Instruct (Wang et al., 2023), MT-Bench, Chatbot Arena (Zheng et al., 2023).
- Ưu điểm: phản ánh tốt hơn tính tương tác.
- Hạn chế: phụ thuộc vào đánh giá chủ quan của con người → không scale được, không nhất quán. MT-Bench và Chatbot Arena ưu tiên "sự hài lòng chung của người dùng" (general user satisfaction) chứ không đo kết quả học tập (educational outcomes). Một câu trả lời gây ấn tượng (impressive) không nhất thiết là một bài giảng hiệu quả.

**Paradigm 3 — Multi-turn dialogue frameworks (MathChat, v.v.):**
- MathChat (Liang et al., 2024) đánh giá LLM trên tương tác toán học nhiều lượt — cho thấy model gặp khó với suy luận duy trì qua nhiều lượt.
- Hạn chế: *thiếu cơ chế cụ thể* để gợi ra (elicit) và đánh giá hiệu quả dạy học. Có tương tác nhưng không đo teaching effectiveness.

### 1.3 Điều gì bị bỏ lỡ? — Các chức năng cốt lõi của giảng dạy

Paper trích dẫn một loạt nghiên cứu giáo dục kinh điển để liệt kê những gì benchmark hiện tại bỏ lỡ:

- **Dẫn dắt quá trình học** (guiding learning processes) — Palincsar, 1998
- **Tạo điều kiện xây dựng kiến thức** (facilitating knowledge construction) — Hmelo-Silver & Barrows, 2006
- **Tổ chức hoạt động giáo dục** (organizing educational activities) — Mercer & Littleton, 2007
- **Cung cấp phản hồi cá nhân hóa** (providing personalized feedback)
- **Hỗ trợ phát triển kỹ năng qua scaffolding** (scaffolding skill development) — Wood, Bruner & Ross, 1976

Tóm lại: benchmark hiện tại đo LLM như *sinh viên giỏi* (biết nhiều, trả lời đúng), nhưng không đo LLM như *giáo viên giỏi* (biết cách dạy, biết điều chỉnh, biết hỏi đúng câu hỏi).

### 1.4 Tuyên bố khoảng trống (gap statement)

Trích từ abstract: EducationQ *"highlights a critical gap in current evaluations that prioritize knowledge recall over interactive pedagogy"* — tạm dịch: "làm nổi bật một khoảng trống nghiêm trọng trong các phương pháp đánh giá hiện tại, vốn ưu tiên nhớ kiến thức hơn là sư phạm tương tác."

Và từ Conclusion (Section 9): *"The significant performance variations also highlight the inadequacy of traditional LLM metrics for predicting teaching effectiveness, underscoring the critical need for specialized, interaction-based evaluation frameworks like EducationQ."*

### 1.5 Kết quả phản trực giác củng cố motivation

Phát hiện quan trọng nhất của paper: **teaching effectiveness không tương quan tuyến tính với model scale hay general reasoning capability.** Cụ thể:
- Llama 3.1 70B Instruct (open-source, 70B tham số) đạt **ALG = +11.01%** trung bình trên 1,498 câu hỏi — **vượt trội tất cả model lớn hơn** kể cả Llama 3.1 405B (+6.14%), Claude 3.5 Sonnet (+3.81%), GPT-4o-mini (+2.44%).
- Gemini 1.5 Pro 002 đứng thứ hai với +7.48%.
- Phi-3.5-mini Instruct (3.8B) — model nhỏ nhất — chỉ đạt +1.20%.

Điều này cho thấy: **nếu chỉ nhìn vào MMLU score hay model size, ta sẽ chọn sai model để dạy học.** Đó chính là lý do paper tồn tại.

---

## Phần 2: Educational Grounding — Nền tảng lý thuyết giáo dục

---

### 2.1 Tổng quan: Bốn trụ cột lý thuyết

EducationQ không phải là một framework kỹ thuật thuần túy — nó được xây dựng trên bốn lý thuyết giáo dục đã được thiết lập, mỗi lý thuyết ánh xạ trực tiếp vào một thành phần thiết kế cụ thể:

| Lý thuyết | Tác giả gốc | Vai trò trong EducationQ |
|---|---|---|
| Zone of Proximal Development (ZPD) | Vygotsky, 1978 | Xác định không gian học tập lý tưởng — khoảng cách giữa "tự làm được" và "làm được với hỗ trợ" |
| Scaffolding | Wood, Bruner & Ross, 1976 | Hỗ trợ tạm thời, thích ứng — gợi ý thay vì cho đáp án |
| Bloom's Taxonomy | Bloom, 1956; Krathwohl, 2002 (revised) | Đo lường chất lượng câu hỏi qua các mức nhận thức |
| Informal Formative Assessment (IFA) | Ruiz-Primo & Furtak, 2007 | Động cơ chính — đánh giá liên tục trong quá trình dạy |

Contribution #1 của paper được tuyên bố rõ ràng: *"A theoretical framework integrating formative assessment and Vygotsky's (1978) learning theory to evaluate educational LLMs."*

### 2.2 Zone of Proximal Development (ZPD) — Vygotsky, 1978

**Khái niệm:** ZPD là khoảng cách giữa mức phát triển thực tế (actual development level) — những gì người học tự làm được — và mức phát triển tiềm năng (potential development level) — những gì người học có thể đạt được với sự hướng dẫn của người có kinh nghiệm hơn.

**Áp dụng trong EducationQ:**
- Pre-test đo *actual development level* (baseline knowledge) của student agent.
- Interaction (5 rounds hỏi-đáp) là nơi teacher agent hoạt động *trong ZPD* — không dạy quá dễ (đã biết rồi) cũng không quá khó (ngoài tầm hiểu).
- Post-test đo xem student đã tiến bao xa sau khi được hướng dẫn.
- ALG (Absolute Learning Gain) chính là thước đo hiệu quả hoạt động trong ZPD.

**Bằng chứng từ kết quả:** Llama 3.1 70B Instruct và 8B có pattern đặc biệt — đạt hiệu suất cao nhất ở mức độ khó trung bình (prior accuracy ~0.5), chiếm 27% (70B) và 19% (8B) tổng ALG. Điều này cho thấy chúng hoạt động hiệu quả nhất *trong ZPD* — scaffolding cho các khái niệm thách thức vừa phải, thay vì chỉ củng cố kiến thức đã biết.

Ngược lại, hầu hết model khác đạt hiệu suất tốt nhất ở mức dễ (prior accuracy ~0.8) — tức là chỉ "reinforcing already known zone" thay vì đẩy ranh giới hiểu biết.

### 2.3 Scaffolding — Wood, Bruner & Ross, 1976

**Khái niệm:** Scaffolding (giàn giáo) là cung cấp hỗ trợ tạm thời, có cấu trúc, thích ứng theo năng lực người học — hỗ trợ được gỡ bỏ dần khi người học tiến bộ. Quan trọng nhất: **hỗ trợ chứ không làm thay** — gợi ý, không cho đáp án.

**Áp dụng trong EducationQ:**
- **Content Boundary Design** (thiết kế ranh giới nội dung) — đây là cơ chế kỹ thuật sáng tạo nhất của framework:
  - Teacher agent *không thể truy cập* các lựa chọn đáp án (answer options) — chỉ thấy nội dung câu hỏi, câu trả lời của student, và phán đoán đúng/sai.
  - Student agent *không thể thấy* kết quả pre-test (đúng hay sai) trong quá trình dialogue — chỉ học qua tương tác với teacher.
  - Student giữ quyền truy cập đầy đủ nội dung câu hỏi + options → học qua liên kết kinh nghiệm.
- Cơ chế này **buộc** teacher phải scaffolding: không thể "chỉ đáp án" vì chính teacher cũng không biết đáp án nào đúng (về mặt lựa chọn A/B/C/D). Teacher phải dẫn dắt qua câu hỏi, phản hồi, và gợi ý.

**Bằng chứng từ case study (Table 5, Appendix F):**
- Llama 3.1 70B Instruct (Dialogue D1.1, Question 240 — Business): sử dụng chuỗi câu hỏi tiến dần — "can you explain why you chose to divide..." → "could it be an approximation? How might this affect your calculation?" — xây *cầu nhận thức* (cognitive bridges) giữa hiểu biết hiện tại và kiến thức mục tiêu. Đây là scaffolding kinh điển.
- So sánh: Llama 3.1 405B Instruct (D1.2, cùng câu hỏi) — mặc dù model lớn hơn 5.8 lần, chỉ hỏi "Can you calculate..." — tập trung vào luyện tập lặp lại (repetitive practice) thay vì hiểu khái niệm. Đây là ví dụ rõ ràng về "model lớn hơn ≠ dạy giỏi hơn."

### 2.4 Bloom's Taxonomy — Bloom (1956), Krathwohl (2002 revised)

**Khái niệm:** Phân loại mức nhận thức từ thấp đến cao: Nhớ → Hiểu → Áp dụng → Phân tích → Đánh giá → Sáng tạo. Giáo viên giỏi đặt câu hỏi đa dạng qua nhiều mức, không chỉ hỏi ở mức "nhớ."

**Áp dụng trong EducationQ:**
- Evaluator agent sử dụng "Cognitive Level" và "Knowledge Dimension" (trích từ Krathwohl, 2002) làm hai trong 17 chiều đánh giá.
- Teacher-Centric Question Analysis bao gồm: Question Relevance, **Cognitive Level**, **Knowledge Dimension**, Question Diversity, Scaffolding Progression, Metacognitive Promotion.

**Bằng chứng:** Expert case studies xác nhận Llama 3.1 70B Instruct "employed guidance across different cognitive levels (Bloom's Taxonomy) rather than focusing solely on procedural practice" — nghĩa là model này dẫn dắt qua nhiều mức Bloom thay vì chỉ drill ở mức thấp.

### 2.5 Informal Formative Assessment (IFA) — Ruiz-Primo & Furtak, 2007

**Khái niệm:** Formative assessment (đánh giá quá trình) là quá trình liên tục đánh giá tiến bộ người học, phát hiện lỗ hổng, và điều chỉnh chiến lược dạy (William, 2011). IFA là hình thức phổ biến nhất trong lớp học thực tế — xảy ra tự nhiên trong dialogue giảng dạy, nơi giáo viên hỏi → đánh giá hiểu biết → phản hồi kịp thời (Sezen-Barrie & Kelly, 2017; Guskey, 2005). Ranh giới giữa chương trình giảng dạy, hướng dẫn, và đánh giá trở nên linh hoạt (Duschl & Gitomer, 1997).

**Áp dụng trong EducationQ — đây là lý thuyết trung tâm:**
- Toàn bộ interaction protocol mô phỏng IFA trong lớp học:
  - Pre-test = summative assessment ban đầu (đánh giá tổng kết)
  - 5 rounds dialogue = IFA (đánh giá quá trình, liên tục)
  - Post-test = summative assessment cuối (đo kết quả)
- ALG (chênh lệch accuracy giữa post-test và pre-test) phản ánh thay đổi performance trước và sau teacher dialogue — đây là thước đo "outcome-aligned" theo Gitomer & Duschl (2007).

**Tại sao IFA chứ không phải summative?** Summative assessment (thi cuối kỳ) chỉ đo kết quả, không đo quá trình. IFA đo *cách giáo viên tương tác* trong quá trình dạy — chính xác là thứ EducationQ muốn capture.

### 2.6 Liên kết giữa các lý thuyết

Bốn lý thuyết không hoạt động riêng lẻ mà tạo thành một hệ thống:

```
ZPD xác định "khoảng nào cần dạy"
    ↓
IFA cung cấp "cơ chế đánh giá liên tục" để xác định vị trí người học trong ZPD
    ↓
Scaffolding là "chiến lược hành động" — hỗ trợ tạm thời trong ZPD
    ↓
Bloom's Taxonomy là "thước đo chất lượng" — câu hỏi/hướng dẫn ở mức nhận thức nào
```

---

## Phần 3: Tổng quan EducationQ — Kiến trúc framework

---

### 3.1 Ba agent chuyên biệt

EducationQ sử dụng hệ thống ba agent (triadic system):

**① Student Agent — "Người học"**
- Model: **Llama 3.1 70B Instruct**
- Lý do chọn: open-source (reproducibility), instruction-following mạnh (IFEval 86.96), cân bằng performance/cost ở 70B, baseline GPQA Diamond = 46.97%
- Hành vi: tập trung vào chủ đề, phân tích vấn đề, diễn đạt suy nghĩ và sự không chắc chắn — mô phỏng hành vi học sinh thực
- Token limit: soft limit ~150 tokens/lượt dialogue, ~1,024 tokens/lượt test
- Temperature: 0.0 (deterministic)
- **Ablation study** (Table 2): thay student bằng Qwen 2.5 72B Instruct hoặc Mistral Nemo 12B → ranking giữa các teacher hầu như không đổi → phương pháp *cô lập hiệu quả* performance của teacher, bất kể student model

**② Teacher Agent — "Giáo viên" (model được đánh giá)**
- Đây là LLM đang bị test. 14 model từ OpenAI, Meta, Google, Anthropic, v.v.
- Prompt yêu cầu: đánh giá động (dynamic assessment) quá trình tư duy của student, sử dụng câu hỏi thăm dò (probing questions) để đo và thúc đẩy hiểu biết, cung cấp phản hồi, sửa lỗi khi cần
- Token limit: soft ~150 tokens/lượt (thực tế trung bình 73.6 tokens)
- Temperature: 0.0
- **Ràng buộc quan trọng:** Teacher KHÔNG thể truy cập các answer options — chỉ thấy: nội dung câu hỏi (không có A/B/C/D), câu trả lời + reasoning của student, và phán đoán đúng/sai. Ràng buộc kỹ thuật (data flow control) + instruction trong prompt.

**③ Evaluator Agent — "Giám khảo"**
- Model: **GPT-4o** (chọn vì human alignment cao, theo Zheng et al., 2023)
- Temperature: 0.0, max 4,096 tokens, output JSON có schema cố định
- Đánh giá qua **17 chiều** (dimensions), chia thành 3 góc nhìn:

*Holistic Interaction Analysis (5 chiều):*
1. Assessment Effectiveness
2. Questioning Effectiveness
3. Feedback Effectiveness
4. Instructional Adaptation Effectiveness
5. Learning Objective Achievement Effectiveness

*Teacher-Centric Question Analysis (6 chiều):*
1. Question Relevance
2. Cognitive Level
3. Knowledge Dimension
4. Question Diversity
5. Scaffolding Progression
6. Metacognitive Promotion

*Student-Centric Response Analysis (6 chiều):*
1. Response Relevance
2. Cognitive Level Demonstration
3. Knowledge Dimension Integration
4. Response Diversity
5. Elaboration Progression
6. Metacognitive Reflection

Thang điểm 1-10 (1-2: significantly below, 3-4: below, 5-6: meets basic, 7-8: exceeds, 9-10: significantly exceeds).

### 3.2 Pipeline ba pha

**Pha 1 — Pre-Test (Kiểm tra trước)**
- Student agent làm bài test theo đúng protocol chính thức của MMLU-Pro/GPQA Diamond
- Evaluator tính accuracy baseline
- Teacher nhận kết quả pre-test (câu hỏi + reasoning + đúng/sai) làm context khởi đầu
- Mục đích: thiết lập "actual development level" (theo ZPD)

**Pha 2 — Interaction (Tương tác IFA)**
- Dialogue tiến hành theo từng câu hỏi, lần lượt
- Teacher nhận: nội dung câu hỏi (không có options), câu trả lời student, phán đoán đúng/sai
- Mỗi câu hỏi: **5 rounds** trao đổi (teacher hỏi → student trả lời = 1 round)
- Token limit/round: teacher ~150 tokens (thực tế trung bình 73.6), student ~260 tokens
- Ablation cho thấy: tăng token lên 250 → không cải thiện đáng kể; giảm xuống 70-100 → giảm teaching performance; tăng rounds lên 10 (với token giảm nửa) → tăng chi phí nhưng không hiệu quả hơn
- **Content boundary đảm bảo:** teacher không thể tiết lộ đáp án vì không biết options

**Pha 3 — Post-Test (Kiểm tra sau)**
- Student làm lại bài test, lần này có thêm context: reasoning từ pre-test + toàn bộ dialogue với teacher
- Dùng protocol giống pre-test (MMLU-Pro/GPQA)
- Evaluator so sánh accuracy trước/sau → tính ALG

### 3.3 Dataset

Paper xây dựng tập dữ liệu từ hai benchmark uy tín:

| Nguồn | Số lượng gốc | Subset sử dụng | Số lượng cuối |
|---|---|---|---|
| GPQA | 448 | GPQA Diamond (expert-validated, <33% non-expert correct) | 198 |
| MMLU-Pro | 12,032 | MMLU-Pro Stratified (stratified sampling mới) | 1,300 |
| **Tổng** | | | **1,498** |

MMLU-Pro Stratified được xây dựng bằng cách:
1. Tính mean accuracy của top 10 model cho mỗi câu hỏi → gán difficulty rating
2. Loại bỏ category "other" → còn 13 disciplines
3. Chia 10 mức khó (intervals 10%)
4. Sample 10 câu đầu tiên từ mỗi tổ hợp (discipline × difficulty)
→ Đảm bảo balanced representation, khắc phục phân bố lệch của MMLU-Pro gốc

**13 disciplines:** Business, Law, Psychology, Biology, Chemistry, History, Health, Economics, Math, Physics, Engineering, Philosophy, Computer Science

**10 difficulty levels:** dựa trên prior accuracy (0-10%, 10-20%, ..., 90-100%)

Baseline accuracy với Llama 3.1 70B Instruct làm student: **47.73%**

### 3.4 Evaluation Metrics — Bốn thước đo định lượng

**① ALG — Absolute Learning Gain**
```
ALG = ACC_post − ACC_pre
```
Đo trực tiếp cải thiện performance của student sau khi được dạy. Đây là metric chính, cho phép so sánh trực tiếp với benchmarking truyền thống.

**② PNIR — Positive-Negative Impact Ratio** (thấp = tốt)
```
PNIR = N_negative / N_positive
```
Đo tính nhất quán: teacher có gây hại (làm student trả lời sai từ đúng) không? PNIR thấp = ít trường hợp "dạy ngược." Llama 3.1 70B Instruct có PNIR = 0.18 (36 negative vs 200 positive) — rất ổn định.

**③ CSS — Cross-Subject Stability** (thấp = tốt)
```
CSS = σ(SLGPD) — độ lệch chuẩn của learning gain theo subject
```
Đo tính đồng đều: teacher có dạy giỏi đều các môn không? Gemini 1.5 Pro 002 có CSS = 0.030 (đồng đều nhất).

**④ UIC — Unique Improvement Count**
```
UIC = số câu hỏi mà CHỈ teacher đó đạt improvement
```
Đo năng lực chuyên biệt: teacher có thế mạnh riêng không? Llama 3.1 70B Instruct và Gemini 1.5 Pro 002 cùng đạt 37 UIC — nhưng pattern khác nhau (Llama cân bằng hơn, Gemini tập trung vào một số môn).

### 3.5 Data Quality Assurance

Hai cơ chế retry tự động đảm bảo chất lượng dữ liệu:
1. **Empty Response Detection:** token count = 0 → retry
2. **Anomalous Output Detection:** token count > 80% max limit VÀ > recommended limit → retry
- Giới hạn: 5 lần retry/câu hỏi
- Tất cả trường hợp trigger retry đều được review thủ công

### 3.6 Robustness — Framework có đáng tin không?

Paper báo cáo nhiều kiểm tra robustness:

- **Cross-dataset consistency:** r = 0.871, p < 0.001 giữa ranking trên GPQA Diamond và MMLU-Pro Stratified
- **Subject-specific consistency:** Physics r = 0.904, Chemistry r = 0.917 giữa hai dataset
- **Test-retest reliability:** chạy lại 3 model (Llama 70B, Llama 405B, Claude 3.5 Sonnet) trên GPQA-main (N=448) với điều kiện giống hệt → mean variance = 0.00832 → rất ổn định
- **Human alignment:** 78% agreement giữa evaluator agent (GPT-4o) và 7 chuyên gia giáo dục + 1 tác giả, trên 50 cặp dialogue

### 3.7 Quy mô thực nghiệm

- **14 teacher models** từ OpenAI, Meta, Google, Anthropic, Alibaba, Microsoft, Nous, Mistral, DeepSeek, Cohere
- **1,498 câu hỏi** × 14 teacher = **19,474 valid dialogue sequences**
- **5,032 qualitative analyses** từ evaluations của 296 dialogues × 17 dimensions
- **14,980 five-round interactions** (dataset released)

---

## Phần 4: Từ Repo GitHub — Code & Resources

---

### 4.1 Cấu trúc repo

Repo: `github.com/SunriserFuture/EducationQ` (MIT License)

Cấu trúc chính:
```
EducationQ/
├── src/
│   ├── run/
│   │   └── main.py          ← Entry point chính
│   ├── models/               ← StudentLLM, TeacherLLM, EvaluatorLLM classes
│   ├── data/                 ← Data loading & processing
│   └── utils/                ← Helpers, metrics
├── configs/
│   ├── config_template.yaml
│   ├── config_teacher0shot_gpqa_diamond.yaml
│   └── config_teacher0shot_mmlupro_stratified.yaml
├── data/                     ← Pre-filtered datasets
│   ├── mmlu_pro_stratified.json (1,300 questions)
│   └── gpqa_diamond.csv
├── docs/
│   ├── figures/              ← Hình vẽ sẵn cho slide
│   │   ├── interaction-process.png
│   │   ├── results-1.png
│   │   ├── results-2.png
│   │   ├── dynamic-educational-scenario-2.png
│   │   ├── mmlu-pro-vs-mmlu-pro-stratifited.png
│   │   ├── dataset-distribution.png
│   │   └── evaluating-metrics.png
│   ├── contributing.md
│   └── 2025.acl-long.1576.pdf   ← Full paper PDF
├── examples/                 ← Demo notebooks/scripts (cần xác nhận)
├── tests/
├── setup.py
├── requirements.txt
└── README.md
```

### 4.2 Cách chạy

```bash
# Clone & install
git clone https://github.com/SunriserFuture/EducationQ.git
cd EducationQ
pip install -r requirements.txt

# Chạy pipeline đầy đủ
python src/run/main.py --config configs/config_template.yaml --mode complete

# Các mode khác
--mode load_pretest      # Load pre-test có sẵn
--mode load_interaction  # Load interaction data có sẵn
--mode evaluation        # Chỉ chạy evaluation
```

Config YAML gồm 4 section: Dataset, Teacher, Student, Evaluator — mỗi section config model, API endpoint, token limits, v.v.

### 4.3 Hình ảnh sẵn có cho slide

Trong `docs/figures/`:
- `dynamic-educational-scenario-2.png` — Figure 1 (evolution 3 giai đoạn) → dùng cho slide Motivation
- `interaction-process.png` — Figure 3 (pre-test → interaction → post-test flow) → dùng cho slide Architecture
- `dataset-distribution.png` — Figure 2 (phân bố dataset) → dùng cho slide Dataset
- `mmlu-pro-vs-mmlu-pro-stratifited.png` — So sánh MMLU-Pro gốc vs Stratified
- `evaluating-metrics.png` — Minh họa 4 metrics
- `results-1.png`, `results-2.png` — Kết quả thực nghiệm

### 4.4 Dataset trên Hugging Face

`huggingface.co/datasets/SunriserFuture/EducationQ` (CC-BY-4.0)
- `educationq_full`: 1.5k rows
- `gpqa_diamond`: 198 rows
- `mmlu_pro_stratified`: 1.3k rows
- Có Data Studio viewer tương tác

---

## Phần 5: Gợi ý cách trình bày

---

### Slide 1 — "Vì sao EducationQ?"
- Mở bằng câu hỏi: "LLM trả lời đúng 90% MMLU. Nhưng nó có *dạy* được không?"
- Dùng hình `dynamic-educational-scenario-2.png` (3 giai đoạn evolution)
- Ba paradigm đánh giá hiện tại và tại sao đều thất bại cho teaching
- Gap statement: "knowledge recall ≠ interactive pedagogy"

### Slide 2 — "Nền tảng giáo dục"
- 4 lý thuyết, mỗi cái một ô với icon/hình minh họa
- ZPD → vùng học tập lý tưởng
- Scaffolding → gợi ý, không cho đáp án
- Bloom → đo chất lượng câu hỏi
- IFA → đánh giá liên tục trong quá trình dạy
- Nhấn mạnh: đây không phải "gắn nhãn lý thuyết cho fancy" — mỗi lý thuyết ánh xạ trực tiếp vào thiết kế kỹ thuật cụ thể

### Slide 3 — "Kiến trúc EducationQ"
- Dùng hình `interaction-process.png` (Figure 3)
- 3 agents, 3 phases, content boundary design
- Highlight: teacher không biết answer options → buộc phải dạy thật

### Slide 4 — "Kết quả bất ngờ" (Payoff)
- Llama 70B > Llama 405B > Claude 3.5 Sonnet > GPT-4o-mini
- "Model nhỏ hơn 5.8× nhưng dạy giỏi hơn"
- 78% human expert agreement validates framework

---

## Lưu ý quan trọng

1. **Evaluator model:** README config template ghi `gpt-4o-mini` nhưng paper dùng `GPT-4o`. Khi trình bày, dùng GPT-4o (đúng theo thực nghiệm).
2. **Số liệu ALG:** Gemini = +7.58% (abstract) vs +7.48% (body text) — không mâu thuẫn, chỉ khác scope (GPQA Diamond vs overall). Nêu rõ scope khi trích dẫn.
3. **14 model đầy đủ** (từ Appendix C/Table 7): Llama 3.1 70B, Gemini 1.5 Pro 002, Llama 3.1 405B, OpenAI o1-mini, Qwen 2.5 72B, Llama 3.1 8B, Hermes 3 Llama 3.1 70B, Mistral Nemo, Claude 3.5 Sonnet, WizardLM-2 8x22B, DeepSeek V2.5, Command R 08-2024, GPT-4o-mini, Phi-3.5-mini Instruct.
4. **examples/ directory:** chưa xác nhận được nội dung cụ thể — cần check repo trực tiếp trước khi trình bày.
5. **Paper đã được accept tại ACL 2025** (Main Conference, Long Paper) — đây là venue hàng đầu.
