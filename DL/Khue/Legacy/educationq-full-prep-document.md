# EducationQ — Tài liệu chuẩn bị trình bày & vấn đáp (Phiên bản đầy đủ)

**Paper:** EducationQ: Evaluating LLMs' Teaching Capabilities Through Multi-Agent Dialogue Framework  
**Venue:** ACL 2025 Main Conference — Long Paper (pp. 32799–32828)  
**Authors:** Yao Shi, Rongkeng Liang (equal contribution), Yong Xu  
**Affiliations:** South China University of Technology; Education Innovation Research Institute of Guangdong  
**Resources:** [arXiv:2504.14928](https://arxiv.org/abs/2504.14928) · [GitHub](https://github.com/SunriserFuture/EducationQ) · [HuggingFace Dataset](https://huggingface.co/datasets/SunriserFuture/EducationQ)

---

## MỤC LỤC

1. [MOTIVATION — Vì sao paper tồn tại](#1-motivation)
2. [EDUCATIONAL GROUNDING — Nền tảng lý thuyết](#2-educational-grounding)
3. [TỔNG QUAN FRAMEWORK](#3-tổng-quan-framework)
4. [DATASET](#4-dataset)
5. [EVALUATION METRICS](#5-evaluation-metrics)
6. [KẾT QUẢ & PHÂN TÍCH](#6-kết-quả--phân-tích)
7. [EXPERT VALIDATION](#7-expert-validation)
8. [LIMITATIONS & THẢO LUẬN](#8-limitations--thảo-luận)
9. [CHUẨN BỊ VẤN ĐÁP — Câu hỏi dự kiến](#9-chuẩn-bị-vấn-đáp)

---

## 1. MOTIVATION

### 1.1 Bối cảnh lớn: LLM đang tràn vào giáo dục nhưng không ai biết chúng dạy giỏi đến đâu

Trong 2-3 năm trở lại đây, LLM đã bùng nổ trong giáo dục — làm gia sư (Khan Academy + GPT-4 → Khanmigo), chấm bài tự động, sinh câu hỏi, cung cấp phản hồi cá nhân hóa. Memarian & Doleck (2023) tổng hợp xu hướng này rộng rãi.

Nhưng có một nghịch lý: **chúng ta biết LLM biết gì, nhưng không biết LLM dạy giỏi thế nào.** Toàn bộ hệ thống benchmark hiện tại — MMLU, GPQA, HumanEval, MT-Bench, Chatbot Arena — đều đo khả năng *trả lời* chứ không đo khả năng *dạy*. Đây chính là khoảng trống mà EducationQ lấp vào.

Tại sao khoảng trống này quan trọng? Vì **một người biết rất nhiều không nhất thiết là một giáo viên giỏi.** Một giáo sư giỏi nhất về vật lý lượng tử có thể giảng bài rất tệ nếu không biết cách đặt câu hỏi gợi mở, không biết đánh giá mức hiểu biết của sinh viên, không biết điều chỉnh cách giải thích theo từng người học. Tương tự, một LLM đạt 90% trên MMLU có thể hoàn toàn thất bại trong việc dẫn dắt một học sinh từ "không hiểu" đến "hiểu" — và EducationQ chứng minh điều này bằng dữ liệu thực nghiệm.

### 1.2 Ba giai đoạn tiến hóa — Paper đặt mình ở đâu trong bức tranh lớn

Paper mô tả sự tiến hóa qua ba giai đoạn (Figure 1):

**Giai đoạn A — Individual Single-Turn General LLM Task:** LLM được đánh giá bằng câu hỏi đơn lẻ. MMLU hỏi "Đáp án nào đúng?" — model chọn A/B/C/D — xong. HumanEval cho một bài code — model viết solution — chấm pass/fail. Không có tương tác, không có context phát triển, không có vai trò nào ngoài "người trả lời." Đây là paradigm thống trị cho đến nay.

**Giai đoạn B — Individual Single-Turn Educational Agent Task:** Các nghiên cứu bắt đầu đánh giá LLM trên tác vụ giáo dục cụ thể — nhưng vẫn đơn lẻ. Olney (2023) đánh giá khả năng sinh câu hỏi trắc nghiệm. Shridhar et al. (2022) đánh giá sinh Socratic sub-questions. Nye et al. (2023) đánh giá dialog-based tutoring. Cohn et al. (2024) đánh giá phản hồi formative assessment. Patil et al. (2024) đánh giá chấm bài tự động. Mỗi tác vụ đánh giá *một* năng lực riêng biệt — sinh câu hỏi thì chỉ sinh câu hỏi, chấm bài thì chỉ chấm bài. Không ai kết hợp chúng lại thành "năng lực dạy học tổng hợp."

**Giai đoạn C — Multi-Agent Multi-Turn Dynamic Educational Scenario (EducationQ):** Lần đầu tiên, EducationQ đánh giá năng lực dạy học tổng hợp — trong đó LLM phải đồng thời: đặt câu hỏi thăm dò → đánh giá hiểu biết của student → cung cấp phản hồi → điều chỉnh chiến lược — tất cả trong một cuộc hội thoại nhiều lượt, với student agent tương tác lại thực sự. Đây là bước nhảy paradigm.

**Tại sao bước nhảy này quan trọng?** Vì trong thực tế lớp học, giáo viên không chỉ "biết kiến thức" hay "sinh câu hỏi" — họ phải liên tục đọc phản hồi từ học sinh, điều chỉnh hướng dẫn, quyết định khi nào cần gợi ý thêm và khi nào cần để học sinh tự khám phá. Đây là chu trình phức tạp mà không benchmark đơn lẻ nào capture được.

### 1.3 Phân tích ba paradigm hiện tại — Vì sao tất cả đều thất bại cho giáo dục

Paper phân tích ba paradigm đánh giá LLM và chỉ ra hạn chế cụ thể của từng cái khi áp dụng vào giáo dục:

**Paradigm 1 — Closed-ended benchmarks (MMLU, MMLU-Pro, GPQA, MATH, HumanEval):**

Ưu điểm rõ ràng: tự động hóa hoàn toàn, scale được, reproducible, có thể so sánh trực tiếp giữa các model. Đây là lý do chúng thống trị.

Nhưng hạn chế cốt lõi cho giáo dục: chúng đo *model biết gì* chứ không đo *model dạy giỏi thế nào*. Cụ thể:
- Không có "vai trò giáo viên" — model chỉ là "người thi" (test-taker), không phải "người dạy" (teacher).
- Không có tương tác — một câu hỏi, một câu trả lời, xong. Không có phản hồi, không có điều chỉnh.
- Không đo teacher agency — khả năng chủ động đặt câu hỏi, chọn chiến lược, thích ứng theo phản hồi của người học.

Ví dụ cụ thể: Llama 3.1 405B đạt score cao hơn Llama 3.1 70B trên MMLU và GPQA. Nhưng khi đánh giá bằng EducationQ, 70B dạy hiệu quả gấp ~1.8× so với 405B. Nếu chỉ nhìn vào MMLU score, ta sẽ triển khai sai model cho ứng dụng giáo dục.

**Paradigm 2 — Open-ended / Human preference (MT-Bench, Chatbot Arena, IFEval, FLAN):**

MT-Bench và Chatbot Arena đánh giá LLM qua preference của người dùng — "model nào trả lời hay hơn?" IFEval (Zhou et al., 2023) đánh giá khả năng tuân thủ hướng dẫn. FLAN (Wei et al., 2022) đánh giá zero-shot instruction following.

Hạn chế cho giáo dục:
- **Ưu tiên sai mục tiêu:** MT-Bench/Chatbot Arena đo "general user satisfaction" — tức là người dùng thích câu trả lời nào hơn. Nhưng một câu trả lời "ấn tượng" (eloquent, comprehensive, detailed) không nhất thiết là một bài giảng hiệu quả. Ngược lại, một bài giảng hiệu quả có thể trông "ít ấn tượng" vì giáo viên giỏi không đưa đáp án mà đặt câu hỏi để học sinh tự tìm ra.
- **Không scale:** phụ thuộc human judgment → tốn kém, chậm, không reproducible.
- **Không đo learning outcomes:** Không ai hỏi "sau khi tương tác, người học có hiểu hơn không?" — chỉ hỏi "bạn thích câu trả lời nào hơn?"

**Paradigm 3 — Multi-turn dialogue (MathChat, v.v.):**

MathChat (Liang et al., 2024) đánh giá LLM trên tương tác toán học nhiều lượt — phát hiện rằng models gặp khó khăn với "sustained reasoning across multiple dialogue turns." Nhưng MathChat và các framework tương tự thiếu cơ chế cụ thể để:
- Gợi ra (elicit) hành vi giảng dạy từ LLM.
- Đo lường hiệu quả giảng dạy (teaching effectiveness) thay vì chỉ đo khả năng suy luận.
- Đánh giá chiến lược sư phạm (pedagogical strategies) mà model sử dụng.

Nói cách khác: MathChat có tương tác nhưng không có "vai trò teacher" rõ ràng, không có pre-test/post-test để đo learning gain, và không có evaluator chuyên về giáo dục.

### 1.4 Năm chức năng giảng dạy bị bỏ lỡ

Paper trích dẫn nghiên cứu giáo dục kinh điển để liệt kê những gì benchmark hiện tại không capture:

1. **Dẫn dắt quá trình học** (guiding learning processes) — Palincsar, 1998: giáo viên không chỉ truyền kiến thức mà dẫn dắt quá trình xây dựng hiểu biết.
2. **Tạo điều kiện xây dựng kiến thức** (facilitating knowledge construction) — Hmelo-Silver & Barrows, 2006: kiến thức không được "rót vào" mà được "xây dựng" qua tương tác.
3. **Tổ chức hoạt động giáo dục** (organizing educational activities) — Mercer & Littleton, 2007: cấu trúc cuộc hội thoại giáo dục theo mục tiêu.
4. **Cung cấp phản hồi cá nhân hóa** (providing personalized feedback) — Pardo et al., 2019: phản hồi không generic mà dựa trên hiểu biết hiện tại của từng người học.
5. **Scaffolding phát triển kỹ năng** — Wood, Bruner & Ross, 1976: hỗ trợ tạm thời, thích ứng, gỡ bỏ dần.

**Tại sao điều này quan trọng cho presentation:** Khi bị hỏi "vì sao MMLU không đủ?", đây là câu trả lời có hệ thống — không chỉ "vì MMLU chỉ đo kiến thức" mà vì nó bỏ qua toàn bộ 5 chức năng cốt lõi của giảng dạy, mỗi chức năng đều có nền tảng lý thuyết giáo dục vững chắc.

### 1.5 Gap Statement — Câu tuyên bố trung tâm

Từ Abstract: *"This finding highlights a critical gap in current evaluations that prioritize knowledge recall over interactive pedagogy."*

Từ Conclusion (Section 9): *"The significant performance variations also highlight the inadequacy of traditional LLM metrics for predicting teaching effectiveness, underscoring the critical need for specialized, interaction-based evaluation frameworks like EducationQ to guide the development of effective AI in education."*

Dịch ngắn gọn: **Các benchmark hiện tại đo "nhớ kiến thức" thay vì "sư phạm tương tác" — và khoảng cách giữa hai điều này rất lớn.**

### 1.6 Kết quả phản trực giác — Bằng chứng thực nghiệm cho motivation

Phát hiện mạnh nhất: **teaching effectiveness không tương quan tuyến tính với model scale hay general reasoning capability.**

| Model | Params | MMLU-Pro (knowledge) | ALG (teaching) |
|---|---|---|---|
| Llama 3.1 70B Instruct | 70B | Tốt | **+11.01%** (1st) |
| Llama 3.1 405B Instruct | 405B | Rất tốt | +6.14% (3rd) |
| Claude 3.5 Sonnet | — | Rất tốt | +3.81% (9th) |
| GPT-4o-mini | — | Tốt | +2.44% (13th) |

Llama 70B (open-source, nhỏ hơn 5.8×) dạy hiệu quả gấp ~1.8× so với Llama 405B. Điều này **không thể phát hiện** bằng bất kỳ benchmark nào khác ngoài EducationQ.

**Tại sao 70B dạy giỏi hơn 405B?** Expert case studies cho thấy 70B sử dụng *sophisticated questioning strategies* — dẫn dắt qua nhiều mức nhận thức Bloom (từ "can you explain why" đến "how might this affect"), xây cầu nhận thức giữa hiểu biết hiện tại và mục tiêu. 405B dù biết nhiều hơn nhưng thiên về *repetitive practice* — hỏi lặp đi lặp lại "can you calculate" thay vì nâng dần mức tư duy.

---

## 2. EDUCATIONAL GROUNDING

### 2.1 Tại sao cần nền tảng lý thuyết?

Một câu hỏi tự nhiên: "Tại sao không chỉ cho LLM dạy rồi đo xem student có hiểu hơn không? Sao phải kéo Vygotsky, Bloom vào?" 

Trả lời: Vì không có lý thuyết giáo dục, ta sẽ không biết *thiết kế framework thế nào*. Cụ thể:
- Không có ZPD → không biết cần pre-test/post-test để đo khoảng cách trước/sau.
- Không có Scaffolding → không biết cần cấm teacher tiết lộ đáp án (content boundary design).
- Không có Bloom → không biết đánh giá chất lượng câu hỏi theo chiều nào.
- Không có IFA → không biết interaction protocol nên mô phỏng gì (classroom IFA).

Nói cách khác, bốn lý thuyết không phải "trang trí" — chúng là **nguyên lý thiết kế** (design principles) trực tiếp quyết định cách framework hoạt động.

**Contribution #1 của paper tuyên bố rõ ràng:** *"A theoretical framework integrating formative assessment and Vygotsky's (1978) learning theory to evaluate educational LLMs."*

### 2.2 Zone of Proximal Development (ZPD) — Vygotsky, 1978

**Khái niệm gốc:** Mỗi người học có hai mức: (1) actual development level — những gì tự làm được không cần ai, và (2) potential development level — những gì có thể đạt được với hướng dẫn phù hợp. Khoảng giữa hai mức này là ZPD — vùng mà dạy học hiệu quả nhất.

**Implication cho thiết kế:** Dạy ở dưới ZPD (quá dễ) = lãng phí thời gian, student đã biết rồi. Dạy ở trên ZPD (quá khó) = vô hiệu, student không tiếp nhận được. Dạy *trong* ZPD = hiệu quả tối đa — đó là nơi scaffolding phát huy tác dụng.

**Áp dụng cụ thể trong EducationQ:**
- **Pre-test = đo actual level.** Student agent làm bài kiểm tra, kết quả là baseline accuracy (47.73% với Llama 70B). Đây là "đường dưới" của ZPD.
- **Interaction = hoạt động TRONG ZPD.** Teacher không biết đáp án nên phải scaffolding — dẫn dắt student từ actual level lên cao hơn.
- **Post-test = đo mức đạt được sau hướng dẫn.** Chênh lệch accuracy (ALG) chính là thước đo "teacher đã giúp student tiến bao xa trong ZPD."

**Bằng chứng từ kết quả — Section 7.4:** Hầu hết model dạy tốt nhất ở mức dễ (prior accuracy ~0.8) — tức là chỉ "reinforcing already known zone." Nhưng Llama 3.1 70B và 8B có pattern khác: đạt peak performance ở mức khó trung bình (prior accuracy ~0.5), chiếm 27% tổng ALG cho 70B. Điều này nghĩa là chúng hoạt động hiệu quả nhất *đúng trong ZPD* — scaffolding cho khái niệm thách thức vừa phải, thay vì chỉ ôn lại kiến thức đã biết. Paper gọi đây là "helping students breakthrough current knowledge boundaries."

### 2.3 Scaffolding — Wood, Bruner & Ross, 1976

**Khái niệm gốc:** Scaffolding (giàn giáo) là chiến lược dạy học trong đó người có kinh nghiệm cung cấp hỗ trợ tạm thời, có cấu trúc, thích ứng theo năng lực người học. Đặc điểm quan trọng: (1) hỗ trợ chỉ ở mức cần thiết — không làm thay, (2) gỡ bỏ dần khi người học tiến bộ, (3) mục tiêu cuối cùng là người học tự đứng vững.

**Tại sao quan trọng cho EducationQ:** Nếu teacher chỉ "nói đáp án" thì không phải dạy — đó là "cho copy." Scaffolding buộc teacher phải gợi ý, đặt câu hỏi, dẫn dắt — để student tự tìm ra đáp án.

**Áp dụng — Content Boundary Design (Section 4.8):**

Đây là thiết kế kỹ thuật sáng tạo nhất và cũng bị chất vấn nhiều nhất. Paper implement ba ràng buộc:

**(a) Teacher không thể truy cập answer options.** Trong code, khi gọi API cho teacher agent (`TeacherLLM.generate_question()`), message format chỉ bao gồm: nội dung câu hỏi (raw text, KHÔNG có A/B/C/D), student reasoning, và phán đoán đúng/sai. Options bị strip khỏi input. Điều này nghĩa là teacher biết student sai nhưng không biết đáp án đúng là gì → phải scaffolding bằng cách hỏi, giải thích, gợi ý thay vì "đáp án đúng là C."

**(b) Student không biết kết quả pre-test trong quá trình dialogue.** Student agent (`StudentLLM.answer_question()`) nhận context từ các round trước nhưng KHÔNG biết mình trả lời đúng hay sai ở pre-test. Student chỉ học qua tương tác với teacher. Config parameter `include_pretest_info` kiểm soát điều này.

**(c) Student giữ toàn bộ câu hỏi + options.** Student thấy đầy đủ A/B/C/D → có thể "liên kết kinh nghiệm" (experience association) — tức là khi teacher gợi ý, student có thể tự map vào options và chọn lại.

**Tại sao asymmetry này?** Teacher biết đúng/sai nhưng không biết options → phải dẫn dắt qua khái niệm, không qua lựa chọn. Student biết options nhưng không biết mình sai → phải học qua tương tác, không qua "check đáp án." Đây chính là scaffolding hiện đại hóa.

**Bằng chứng case study — Table 5, Appendix F.2 (Question 240, Business):**

Llama 3.1 70B (Dialogue D1.1): Teacher hỏi "Can you explain why you chose to divide..." → student giải thích → teacher hỏi tiếp "could it be an approximation? How might this affect your calculation?" → student nhận ra rounding error → student tự sửa từ option F sang option E (đúng). Đây là scaffolding kinh điển: teacher KHÔNG nói "đáp án là E" mà dẫn student tự phát hiện lỗi.

Llama 3.1 405B (Dialogue D1.2, cùng câu hỏi): Teacher chỉ hỏi "Can you calculate..." → lặp lại drill → student không phát hiện lỗi → vẫn chọn sai. 405B biết nhiều hơn nhưng scaffolding kém hơn.

**Validation quan trọng (Section 8.2):** Không reviewer nào phát hiện trường hợp teacher tiết lộ đáp án trực tiếp → content boundary design hoạt động.

### 2.4 Bloom's Taxonomy — Bloom (1956), Krathwohl (2002 revised)

**Khái niệm gốc:** Phân loại 6 mức nhận thức từ thấp → cao:
1. **Remember** (Nhớ) — nhận diện, recall facts
2. **Understand** (Hiểu) — giải thích, tóm tắt
3. **Apply** (Áp dụng) — sử dụng kiến thức trong tình huống mới
4. **Analyze** (Phân tích) — chia nhỏ, so sánh, tìm mối quan hệ
5. **Evaluate** (Đánh giá) — phán đoán, biện luận
6. **Create** (Sáng tạo) — tổng hợp, thiết kế giải pháp mới

**Tại sao quan trọng:** Giáo viên giỏi đặt câu hỏi đa dạng qua nhiều mức — không chỉ hỏi "đáp án là gì?" (Remember) mà hỏi "tại sao bạn chọn cách này?" (Analyze), "nếu thay đổi điều kiện thì sao?" (Apply/Evaluate). Giáo viên kém chỉ drill ở mức thấp.

**Áp dụng trong EducationQ:**
- Evaluator agent (`EvaluatorLLM`) đánh giá **"Cognitive Level"** (mức nhận thức) trong cả Teacher-Centric Analysis lẫn Student-Centric Analysis — 2 trong 17 chiều đánh giá.
- **"Knowledge Dimension"** (từ Krathwohl 2002 revised taxonomy) cũng là một chiều — đánh giá loại kiến thức: factual, conceptual, procedural, metacognitive.

**Bằng chứng — Section 8.1:** Experts xác nhận Llama 3.1 70B Instruct *"employed guidance across different cognitive levels (Bloom's Taxonomy) rather than focusing solely on procedural practice"* — trong khi Llama 405B chỉ ở mức "repetitive practice" (Apply level, lặp đi lặp lại). 70B di chuyển từ "can you explain why" (Understand/Analyze) → "how might this affect" (Evaluate) → "what implications" (Create/Evaluate) — đây là progression qua Bloom levels.

### 2.5 Informal Formative Assessment (IFA) — Ruiz-Primo & Furtak, 2007

**Khái niệm gốc:** Có hai loại đánh giá trong giáo dục:
- **Summative assessment** (đánh giá tổng kết): thi cuối kỳ, kiểm tra final — đo kết quả, không can thiệp vào quá trình.
- **Formative assessment** (đánh giá quá trình): đánh giá liên tục trong quá trình dạy — phát hiện lỗ hổng, điều chỉnh chiến lược, cung cấp phản hồi kịp thời.

**Informal** Formative Assessment (IFA) là dạng phổ biến nhất trong lớp học thực: xảy ra tự nhiên trong hội thoại, khi giáo viên hỏi → nghe → đánh giá → phản hồi → hỏi tiếp. Ranh giới giữa "dạy" và "đánh giá" trở nên mờ — giáo viên vừa dạy vừa đánh giá đồng thời (Duschl & Gitomer, 1997).

William (2011) định nghĩa formative assessment gồm 5 chiến lược: (1) làm rõ mục tiêu, (2) thiết kế bằng chứng, (3) phản hồi thúc đẩy, (4) kích hoạt peer-learning, (5) phát triển self-assessment. EducationQ focus vào (2) và (3) thông qua interaction protocol.

**Áp dụng — đây là lý thuyết trung tâm:**

Toàn bộ pipeline 3 pha của EducationQ mô phỏng IFA:
- Pre-test = **summative assessment ban đầu** → xác lập baseline.
- 5 rounds dialogue = **IFA** → teacher hỏi, đánh giá, phản hồi, điều chỉnh.
- Post-test = **summative assessment cuối** → đo learning outcome.

Chênh lệch accuracy (ALG) giữa pre-test và post-test phản ánh trực tiếp hiệu quả của IFA — đây là operationalization của "outcome-aligned perspective" (Gitomer & Duschl, 2007).

**Tại sao IFA chứ không phải summative?** Vì mục tiêu của paper là đánh giá *quá trình dạy* (teaching process) chứ không phải *kết quả thi* (test performance). Summative assessment chỉ cho biết "student biết bao nhiêu" — IFA cho biết "teacher dạy hiệu quả thế nào."

### 2.6 Liên kết giữa 4 lý thuyết — Hệ thống, không rời rạc

```
ZPD → "Dạy ở đâu?" → Xác định vùng học tập lý tưởng
  ↓
IFA → "Đánh giá thế nào?" → Cơ chế liên tục xác định vị trí student trong ZPD
  ↓
Scaffolding → "Hỗ trợ thế nào?" → Chiến lược hành động: gợi ý, không cho đáp án
  ↓
Bloom's → "Đo chất lượng bằng gì?" → Thước đo đa chiều cho câu hỏi/hướng dẫn
```

Khi bị hỏi "4 lý thuyết này có overlap không?" — trả lời: có, nhưng mỗi cái trả lời câu hỏi thiết kế khác nhau. ZPD nói *ở đâu*, IFA nói *bằng cơ chế nào*, Scaffolding nói *hành động ra sao*, Bloom nói *đo bằng thước nào*.

---

## 3. TỔNG QUAN FRAMEWORK

### 3.1 Kiến trúc 3 agents — Thiết kế và lý do

**Student Agent — Llama 3.1 70B Instruct**

Vai trò: mô phỏng hành vi học sinh thực — phân tích vấn đề, diễn đạt suy nghĩ, thể hiện sự không chắc chắn. 

Implementation (`StudentLLM` class, methods: `answer_question()`, `take_test()`):
- Temperature: 0.0 (deterministic — đảm bảo reproducibility)
- Max tokens dialogue: 1,024 / Test: 2,048
- Soft token limit dialogue: 150 tokens (tránh response vô tận nhưng không cắt cứng)
- Token rerun threshold: 80% (nếu response > 80% max_tokens VÀ > soft limit → retry, max 5 lần)

System message: *"You are a student focusing on [CATEGORY]. Analyze the question carefully, explain your thought process ([TOKEN_LIMIT] tokens or less), and try to apply the concepts you've learned to solve problems. If you're unsure, express your uncertainty and explain your reasoning."*

**Tại sao chọn Llama 3.1 70B?** Ba lý do: (1) Open-source → reproducibility — ai cũng có thể chạy lại, (2) Instruction-following mạnh (IFEval 86.96) → tuân thủ soft token limit tốt, (3) Balanced performance/cost — baseline GPQA Diamond 46.97% — đủ "khó" để có room for improvement nhưng không quá thấp khiến teacher không thể dạy.

**Tại sao student cố định?** Vì đây là controlled experiment — biến cần đo là "teacher performance", nên student phải là hằng số. Nếu thay đổi student theo từng experiment, ta không biết improvement là do teacher hay do student.

**Ablation study (Table 2):** Thay student bằng Qwen 2.5 72B hay Mistral Nemo → ranking giữa teachers hầu như không đổi → method cô lập teacher performance hiệu quả.

**Teacher Agent — Model đang bị đánh giá (14 LLMs)**

Vai trò: đánh giá động quá trình tư duy student, sử dụng probing questions, cung cấp phản hồi, sửa lỗi.

Implementation (`TeacherLLM` class, method: `generate_question()`):
- Temperature: 0.0
- Max tokens: 1,024
- Soft token limit: 150 tokens/question (thực tế trung bình 73.6 tokens)
- use_few_shot: false (default) — không cung cấp ví dụ mẫu

System message: *"You are an expert teacher in [CATEGORY] dedicated to enhancing the student's understanding after analyzing the student's response to a pre-test. Your task is to ask [NUM_ROUNDS] rounds of relevant, thought-provoking questions to the student. You should ask one new question per round (and if needed, provide necessary corrections or feedback for the student's previous round's answers), each under [TOKEN_LIMIT] tokens, without revealing the correct answers or specific details of the pre-test questions."*

**Input format cho teacher (Appendix A.2.3):** Teacher nhận pre-test info gồm: Question ID, Question Text (KHÔNG có options), Student's Reasoning, Student's Answer, và Correctness ("Correct." hoặc "Incorrect."). Lưu ý: teacher biết student sai/đúng nhưng KHÔNG biết đáp án đúng là gì.

**Evaluator Agent — GPT-4o**

Vai trò: chuyên gia đánh giá giáo dục — validate dialogue, chấm điểm qua 17 chiều, so sánh giữa hai teachers.

Implementation (`EvaluatorLLM` class, methods: `over_interaction_analysis()`, `teacher_questions_analysis()`, `student_responses_analysis()`):
- Temperature: 0.0
- Max tokens: 4,096
- Output format: Structured JSON schema (enforce qua API `response_format`)

Ba góc phân tích, mỗi góc nhận input khác nhau:
1. **Holistic Interaction** (5 chiều) — input: full dialogue + pre-test context
2. **Teacher-Centric** (6 chiều) — input: CHỈ câu hỏi của teacher
3. **Student-Centric** (6 chiều) — input: CHỉ câu trả lời của student

**Lưu ý quan trọng:** README config template ghi evaluator model là `gpt-4o-mini`, nhưng paper nói rõ dùng `GPT-4o` cho thực nghiệm. Template chỉ là placeholder.

### 3.2 Interaction Protocol — Chi tiết kỹ thuật

**Pre-test:** Student làm bài theo đúng official protocol (MMLU-Pro: CoT + 5-shot format; GPQA Diamond: CoT 0-shot). Response format: reasoning + "The answer is (X)". Evaluator parse đáp án, tính accuracy.

**Interaction (5 rounds/question):** Teacher nhận pre-test results → bắt đầu round 1. Mỗi round:
1. Teacher generate question (`generate_question()`) — prompt cuối: "Generate the round [N] question ([TOKEN_LIMIT] tokens or less) to promote better understanding"
2. Student respond (`answer_question()`) — nhận full dialogue history + system message

API mapping: teacher turns → `{"role": "assistant"}`, student turns → `{"role": "user"}`. Final generation prompt là `{"role": "user"}` message cuối.

**Post-test:** Student làm lại bài, nhưng context window bao gồm: pre-test reasoning + toàn bộ 5 rounds dialogue. Dùng cùng protocol/parameter với pre-test.

**Ablation on interaction parameters (Section 4.9):**
- Tăng token limit lên 250 → no significant learning gains
- Giảm xuống 70-100 → degraded teaching performance  
- Tăng rounds lên 10 (với token halved) → tăng cost nhưng không vượt 5-round/150-token config

→ 5 rounds × 150 tokens là sweet spot.

### 3.3 Data Quality Assurance

Hai cơ chế retry tự động:
1. **Empty Response Detection:** token count = 0 → retry
2. **Anomalous Output Detection:** token count > 80% max limit VÀ > recommended limit → retry (nghĩa là response quá dài, có thể bị truncated hoặc model bị loop)

Max 5 retries/question. Tất cả trigger cases được review thủ công. Token averages: teacher 73.6, student 260, test answers 425.

### 3.4 So sánh với multi-agent orchestration

EducationQ KHÔNG phải agent orchestration (kiểu LangGraph, CrewAI, AutoGen). Khác biệt:
- **Control flow:** cố định (pre-test → 5 rounds → post-test), không có branching/routing động.
- **Quan hệ agent:** ngang hàng (peer), không có orchestrator trung tâm.
- **Mục đích:** mô phỏng kịch bản giáo dục (simulation), không phải giải task (task completion).

Đây là lựa chọn có chủ đích: controlled experiment cần flow cố định để đảm bảo mọi teacher được đánh giá trong cùng điều kiện.

---

## 4. DATASET

### 4.1 Nguồn và lý do chọn

1,498 câu hỏi từ hai benchmark:

**GPQA Diamond (198 câu):** Expert-validated, graduate/PhD level. Đặc biệt: non-experts đạt < 33% — nghĩa là câu hỏi thực sự khó, không thể "đoán mò." Phù hợp đo teaching vì có room lớn để cải thiện.

**MMLU-Pro Stratified (1,300 câu):** Paper tự xây dựng subset mới từ MMLU-Pro (12,032 câu). Lý do: MMLU-Pro gốc phân bố không đều — nhiều câu dễ, ít câu khó, một số môn nhiều hơn môn khác. EducationQ cần *balanced representation* để so sánh công bằng.

Quy trình tạo MMLU-Pro Stratified:
1. Tính mean accuracy của top 10 models cho mỗi câu hỏi → gán difficulty rating
2. Loại category "other" (thiếu clarity) → còn 13 disciplines
3. Chia 10 mức khó (intervals 10%: 0-10%, 10-20%, ..., 90-100%)
4. Sample 10 câu đầu tiên từ mỗi tổ hợp (discipline × difficulty level)

Kết quả: 13 disciplines × 10 difficulty levels × 10 câu = 1,300 câu, phân bố đều hoàn toàn. Dataset trên HuggingFace: `SunriserFuture/EducationQ` (CC-BY-4.0).

### 4.2 13 disciplines

Business, Law, Psychology, Biology, Chemistry, History, Health, Economics, Math, Physics, Engineering, Philosophy, Computer Science. GPQA Diamond bổ sung thêm Physics/Chemistry/Biology ở mức graduate/PhD.

---

## 5. EVALUATION METRICS

### 5.1 Bốn metrics định lượng

**ALG (Absolute Learning Gain):** `ACC_post − ACC_pre`. Metric chính. Đo trực tiếp "student tiến bộ bao nhiêu." Cho phép so sánh trực tiếp với benchmarking truyền thống.

**PNIR (Positive-Negative Impact Ratio):** `N_negative / N_positive` (lower = better). Đo tính nhất quán: có bao nhiêu trường hợp teacher "dạy ngược" (student từ đúng → sai)? Llama 70B: PNIR = 0.18 (36 neg / 200 pos) — rất ổn định. Phi-3.5-mini: PNIR = 0.69 — gần 70% negative so với positive.

**CSS (Cross-Subject Stability):** `σ(learning gains per subject)` (lower = better). Đo "dạy đều các môn không?" Gemini 1.5 Pro: CSS = 0.030 (đồng đều nhất). Phi-3.5-mini: CSS = 0.172 (rất lệch).

**UIC (Unique Improvement Count):** Số câu hỏi mà CHỈ model đó đạt improvement (không model nào khác làm được). Đo năng lực chuyên biệt. Llama 70B và Gemini 1.5 Pro cùng đạt 37 UIC — nhưng pattern khác: Llama cân bằng (σ = 0.036), Gemini tập trung (σ = 0.056, peak 21% ở Biology).

### 5.2 Đánh giá định tính — 17 chiều

17 chiều chia thành 3 góc nhìn, thang 1-10:

*Holistic (5):* Assessment Effectiveness, Questioning Effectiveness, Feedback Effectiveness, Instructional Adaptation Effectiveness, Learning Objective Achievement.

*Teacher-Centric (6):* Question Relevance, Cognitive Level, Knowledge Dimension, Question Diversity, Scaffolding Progression, Metacognitive Promotion.

*Student-Centric (6):* Response Relevance, Cognitive Level Demonstration, Knowledge Dimension Integration, Response Diversity, Elaboration Progression, Metacognitive Reflection.

Paper thừa nhận "dimensional overlap" nhưng không xử lý vì đây là "exploratory component."

---

## 6. KẾT QUẢ & PHÂN TÍCH

### 6.1 Bảng xếp hạng overall (Table 4)

| Rank | Model | ALG | PNIR | CSS | UIC |
|---|---|---|---|---|---|
| 1 | Llama 3.1 70B Instruct | **+11.01%** | **0.18** | 0.041 | **37** |
| 2 | Gemini 1.5 Pro 002 | +7.48% | 0.40 | **0.030** | **37** |
| 3 | Llama 3.1 405B Instruct | +6.14% | 0.28 | 0.045 | 9 |
| 4 | OpenAI o1-mini | +5.84% | 0.25 | 0.051 | 7 |
| 5 | Qwen 2.5 72B Instruct | +5.41% | 0.33 | 0.054 | 7 |
| 6 | Llama 3.1 8B Instruct | +4.87% | 0.40 | 0.051 | 13 |
| 7 | Hermes 3 Llama 3.1 70B | +4.14% | 0.39 | 0.051 | 6 |
| 8 | Mistral Nemo (12B) | +3.94% | 0.44 | 0.058 | 12 |
| 9 | Claude 3.5 Sonnet | +3.81% | 0.30 | 0.059 | 5 |
| 10 | WizardLM-2 8x22B (176B) | +3.67% | 0.34 | 0.047 | 2 |
| 11 | DeepSeek V2.5 | +3.27% | 0.46 | 0.051 | 3 |
| 12 | Command R 08-2024 | +2.94% | 0.53 | 0.057 | 7 |
| 13 | GPT-4o-mini | +2.44% | 0.40 | 0.085 | 2 |
| 14 | Phi-3.5-mini (3.8B) | +1.20% | 0.69 | 0.172 | 4 |

### 6.2 Chuyên môn theo môn học (Appendix E)

- **Knowledge-intensive:** Llama 70B thống trị — Health +24%, Psychology +18%, Philosophy +19%, History +14%
- **Reasoning-intensive:** o1-mini thống trị — Physics +8.6%, Math +9%
- **Applied disciplines:** Gemini 1.5 Pro — Business +8%, Economics +9%
- **Engineering:** Hermes 3 — +10%
- **Chemistry:** Qwen 2.5 72B — +11%

### 6.3 Robustness

- Cross-dataset consistency: r = 0.871, p < 0.001
- Subject-specific: Physics r = 0.904, Chemistry r = 0.917
- Test-retest (Table 3): mean variance = 0.00832 — rất ổn định

### 6.4 Phân tích chiến lược dạy (Section 7.7)

Logistic regression + Random Forest (1000 trees, accuracy = 0.769, AUC = 0.775) trên 148 UIC cases + 148 control dialogues:
- **Llama 70B:** questioning quality là predictor mạnh nhất (Exp(B) = 32.864, p = 0.043; Mean dropout loss 0.363)
- **Gemini 1.5 Pro:** feedback quality là predictor mạnh nhất (Exp(B) = 5227.342, p = 0.019; Mean dropout loss 0.344)

→ Hai model top dùng chiến lược khác nhau để thành công: Llama qua questioning, Gemini qua feedback.

---

## 7. EXPERT VALIDATION

### 7.1 Quy trình

7 giáo viên có chứng chỉ + 1 tác giả đánh giá 50 cặp dialogues (mỗi cặp gồm 1 dialogue có learning gain + 1 không có). Teacher identities ẩn danh. So sánh majority preference của experts vs. evaluator agent verdict.

### 7.2 Kết quả

- **78% agreement** (39/50 cases) giữa human experts và evaluator agent.
- Teachers có learning gain nhận trung bình **7.38/10** từ experts; control group **6.41/10**.
- Không reviewer nào phát hiện teacher tiết lộ đáp án → content boundary hoạt động.

---

## 8. LIMITATIONS & THẢO LUẬN

### 8.1 Limitations paper tự nhận

1. **Kịch bản đơn giản:** 1-on-1 IFA — không capture dynamics lớp học nhiều học sinh, không đo khả năng quản lý nhóm.
2. **Giới hạn round:** 5 rounds cố định — không so sánh được teaching efficiency (model nào cần ít round hơn).
3. **Model selection:** Không include nhiều version trong cùng series → không track evolution của teaching capability theo thời gian. Không có multimodal models hoặc specialized educational models.
4. **Content level:** Chỉ graduate/PhD level — không đánh giá dạy K-12.
5. **Student modeling:** Chỉ 1 student profile cố định — không simulate diverse age groups, cognitive levels, backgrounds, motivations.
6. **Qualitative limitations:** 17 dimensions predefined — có thể bỏ sót aspects khác.

### 8.2 Content moderation issue

OpenAI models (o1-mini, GPT-4o-mini) trả về NoneType cho câu hỏi về Vietnam War (Question 5048). Paper coi đây là limitation của commercial models trong academic evaluation.

### 8.3 Điểm mạnh cần nhấn mạnh

- Framework **automated** — không cần human judges cho quantitative metrics, scale được.
- **Reproducible** — student cố định, temperature 0.0, protocol rõ ràng.
- **Open-source** — code, dataset, paper đều public.
- **Robust** — cross-dataset r = 0.871, test-retest variance = 0.00832.

---

## 9. CHUẨN BỊ VẤN ĐÁP — Câu hỏi dự kiến

### Q: "Student agent cố định Llama 70B — có bias không? Nếu đổi student thì kết quả có thay đổi?"

Trả lời: Paper đã làm ablation (Table 2). Đổi sang Qwen 72B hoặc Mistral Nemo → ranking giữa teachers hầu như không đổi. Điều này cho thấy method cô lập teacher performance hiệu quả, bất kể student model.

### Q: "Temperature 0.0 — tại sao không dùng sampling? Kết quả có quá deterministic?"

Trả lời: Temperature 0.0 đảm bảo reproducibility — chạy lại cùng input → cùng output. Table 3 cho thấy test-retest variance = 0.00832 — rất ổn định, tức là ngay cả với cùng T=0.0, có một chút variance nhưng negligible. Trade-off: deterministic = reproducible nhưng mất diversity. Paper chọn reproducibility vì đây là benchmark evaluation, không phải creative task.

### Q: "5 rounds có đủ không? Tại sao không 10, 20?"

Trả lời: Ablation cho thấy tăng lên 10 rounds (với token halved) → tăng cost nhưng KHÔNG vượt effectiveness của 5-round/150-token config. 5 rounds × 150 tokens là sweet spot — đủ để observe teaching strategy nhưng không gây cost explosion (14 models × 1,498 questions = ~20k dialogues).

### Q: "Evaluator là GPT-4o — có conflict of interest không khi đánh giá GPT-4o-mini?"

Trả lời: GPT-4o đánh giá GPT-4o-mini ở vị trí thấp (rank 13/14) — nếu có bias thì bias ngược (đáng lẽ phải favor "người nhà"). 78% agreement với human experts confirm evaluator reliable. Paper chọn GPT-4o vì "high human-alignment" (Zheng et al., 2023), không phải vì là sản phẩm của cùng vendor.

### Q: "Content boundary — teacher biết đúng/sai nhưng không biết options — trong thực tế giáo viên thật biết đáp án mà?"

Trả lời: Đúng, đây là idealization. Nhưng mục đích là *buộc* teacher scaffolding thay vì shortcut "đáp án là C." Trong lớp học thực, giáo viên giỏi cũng KHÔNG nói đáp án — họ dẫn dắt qua câu hỏi. Content boundary enforce điều này ở mức kỹ thuật.

### Q: "EducationQ đo được gì mà benchmark khác không đo?"

Trả lời tóm gọn: EducationQ đo **interactive pedagogy** — khả năng LLM đặt câu hỏi gợi mở, đánh giá hiểu biết real-time, điều chỉnh chiến lược, và cung cấp phản hồi khiến student thực sự tiến bộ (đo bằng ALG). Không benchmark nào khác đo toàn bộ chuỗi này.

### Q: "Khác gì multi-agent orchestration?"

Trả lời: EducationQ là **role-play simulation** với flow cố định (pre-test → 5 rounds → post-test), agents ngang hàng, mục đích mô phỏng. Orchestration (LangGraph, CrewAI) là **task decomposition** với routing động, orchestrator trung tâm, mục đích giải task. EducationQ chọn flow cố định vì cần controlled experiment — mọi teacher được đánh giá cùng điều kiện.

### Q: "Paper này có applicable trong thực tế không, hay chỉ là academic exercise?"

Trả lời: Framework có thể dùng để: (1) Chọn model phù hợp cho ứng dụng giáo dục — thay vì chọn model có MMLU cao nhất, dùng EducationQ để chọn model dạy giỏi nhất. (2) Evaluate fine-tuned educational models. (3) Benchmark pedagogy-focused training methods. Limitation: chỉ 1-on-1, chỉ text, chỉ MCQ format, chỉ graduate-level.

### Q: "78% human agreement — có đủ cao không?"

Trả lời: Trong educational assessment, 78% là mức "substantial agreement" (thường dùng Cohen's Kappa, nhưng paper report raw agreement). Đặc biệt trên MMLU-Pro content (chuyên sâu, nhiều môn khó) — việc human evaluators có 78% agreement với automated system là impressive. Paper cũng note rằng 50 pairs đại diện ~40% khoảng cách performance giữa best/worst teacher → representative sample.

---

## PHỤ LỤC: THÔNG TIN TỪ REPO

### Cấu trúc code

```
EducationQ/EducationQ_Framework/
├── src/
│   ├── run/main.py                  ← Entry point
│   ├── data/
│   │   ├── input/                   ← YAML configs
│   │   ├── dataset/                 ← GPQA, MMLU-Pro, AGIEval
│   │   └── output/                  ← Results
│   └── (likely: models/, utils/)    ← Agent classes
├── docs/
│   ├── figures/                     ← Hình vẽ cho slide
│   └── 2025.acl-long.1576.pdf
├── README.md
├── requirements.txt
├── setup.py
└── pyproject.toml
```

### Dependencies (từ pyproject.toml)

pandas, numpy, datasets, huggingface-hub, openai (≥1.0.0), tiktoken, PyYAML, pydantic, tqdm, google-auth. → Stack đơn giản: OpenAI-compatible API calls + data processing.

### Classes và methods (từ Paper Appendix A)

- `StudentLLM.answer_question()` — generate student response trong dialogue
- `StudentLLM.take_test()` — student làm bài pre/post-test
- `TeacherLLM.generate_question()` — teacher generate câu hỏi/feedback mỗi round
- `EvaluatorLLM.over_interaction_analysis()` — đánh giá holistic
- `EvaluatorLLM.teacher_questions_analysis()` — đánh giá teacher-centric
- `EvaluatorLLM.student_responses_analysis()` — đánh giá student-centric

### Chạy framework

```bash
git clone https://github.com/SunriserFuture/EducationQ.git
cd EducationQ/EducationQ_Framework
pip install -r requirements.txt

# Full pipeline
python src/run/main.py --config src/data/input/config_template.yaml --mode complete

# Modes: complete | load_pretest | load_interaction | evaluation
```
