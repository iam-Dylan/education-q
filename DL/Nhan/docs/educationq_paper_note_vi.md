# Note tiếng Việt: EducationQ

Paper: **EducationQ: Evaluating LLMs' Teaching Capabilities Through Multi-Agent Dialogue Framework**

Nguồn trong workspace:
- Paper PDF: `2504.14928v3.pdf`
- Dataset/config đã chuẩn bị: `dataset/`, `data/input/`
- Protocol/config note: `docs/benchmark_protocol.md`

## 1. Một câu tóm tắt

Paper đề xuất **EducationQ**, một framework đánh giá LLM như một **giáo viên**, thay vì chỉ đánh giá LLM như một máy trả lời câu hỏi. Thay vì hỏi "model có biết đáp án không?", EducationQ hỏi: **model có giúp học sinh hiểu hơn và làm đúng hơn sau một cuộc hội thoại dạy học hay không?**

## 2. Vấn đề paper muốn giải quyết

Nhiều benchmark LLM hiện nay như MMLU, GPQA, MATH, HumanEval chủ yếu đo các năng lực riêng lẻ:

- Kiến thức.
- Suy luận.
- Lập trình.
- Trả lời câu hỏi một lượt.
- Làm theo instruction.

Nhưng trong giáo dục, một model làm bài giỏi chưa chắc là một teacher tốt. Dạy học cần những năng lực khác:

- Phát hiện học sinh đang hiểu sai ở đâu.
- Đặt câu hỏi gợi mở đúng mức.
- Đưa feedback mà không tiết lộ đáp án.
- Điều chỉnh chiến lược theo phản hồi của học sinh.
- Scaffold, tức là chia nhỏ tri thức và dẫn học sinh từ mức hiện tại đến mức cần đạt.
- Khuyến khích học sinh tự suy nghĩ lại, không chỉ copy lời giải.

Vấn đề của các benchmark cũ là chúng đánh giá **knowledge recall / reasoning correctness**, nhưng không đánh giá được **interactive pedagogy**. Nếu dùng accuracy trên MMLU/GPQA để nói model nào dạy tốt thì khá thiếu chắc chắn.

## 3. Goal của paper

Mục tiêu là tạo một framework benchmark có thể:

1. Mô phỏng tình huống giáo viên - học sinh bằng LLM agents.
2. Đo teaching effectiveness bằng kết quả học tập trước/sau tương tác.
3. Phân tích cách teacher model dạy: hỏi, feedback, scaffold, adapt.
4. So sánh nhiều LLM ở vai trò teacher trong cùng điều kiện.
5. Kiểm tra giả thuyết: model lớn hơn hoặc giỏi benchmark hơn có thật sự dạy tốt hơn không?

Nói ngắn gọn: **đánh giá LLM-as-Teacher bằng learning gain và chất lượng hội thoại, không chỉ bằng answer accuracy.**

## 4. Điểm mới / đóng góp chính

| Đóng góp | Giải thích |
| --- | --- |
| Multi-agent teaching benchmark | Dùng 3 agent: Teacher, Student, Evaluator để mô phỏng dạy học. |
| Pre-test / interaction / post-test | Student làm bài trước, được teacher dạy qua hội thoại, rồi làm lại. |
| Teaching effectiveness metric | Đo bằng student learning gain, gắn với kết quả học tập hơn là đo teacher trả lời đúng. |
| Content boundary | Teacher không được thấy options/đáp án để tránh lộ đáp án trực tiếp. |
| Mixed-method evaluation | Kết hợp metric định lượng và phân tích định tính bằng evaluator agent + human experts. |
| Dataset cân bằng hơn | Tạo MMLU-Pro Stratified để phủ 13 môn và 10 mức khó, cộng với GPQA Diamond. |

Nhận xét: điểm mới mạnh nhất không phải là "dùng agent" đơn thuần, mà là **gắn agent setup với lý thuyết giáo dục** như formative assessment, scaffolding, Zone of Proximal Development và Bloom's Taxonomy.

## 5. Nền tảng lý thuyết giáo dục

Paper dựa vào các ý tưởng sau:

- **Formative Assessment**: đánh giá trong quá trình học để phát hiện lỗi hiểu và điều chỉnh cách dạy.
- **Informal Formative Assessment (IFA)**: dạng đánh giá diễn ra tự nhiên trong hội thoại lớp học, ví dụ giáo viên hỏi tiếp để kiểm tra học sinh đang nghĩ gì.
- **Zone of Proximal Development (ZPD)**: vùng giữa cái học sinh tự làm được và cái học sinh làm được khi có hỗ trợ.
- **Scaffolding**: giáo viên cho gợi ý/trợ giúp tạm thời, rồi dần dần để học sinh tự làm.
- **Bloom's Taxonomy**: phân biệt mức độ nhận thức như nhớ, hiểu, áp dụng, phân tích, đánh giá.

Ý nghĩa: EducationQ không chỉ đo "teacher có nói nội dung đúng không", mà đo "teacher có đưa học sinh qua vùng phát triển gần nhất bằng hội thoại tốt không".

## 6. Input của framework

### 6.1 Dataset input

EducationQ dùng tổng cộng **1,498 questions** từ 2 nguồn:

| Source | Số lượng gốc | Subset dùng trong paper | Số câu | File local |
| --- | ---: | --- | ---: | --- |
| GPQA | 448 | GPQA Diamond | 198 | `dataset/gpqa/dataset/gpqa_diamond.csv` |
| MMLU-Pro | 12,032 | MMLU-Pro Stratified | 1,300 | `dataset/mmlu-pro/mmlu_pro_stratified.json` |

GPQA Diamond gồm các câu science khó, mức graduate/PhD, đã được expert validate. MMLU-Pro Stratified là subset do tác giả tạo để cân bằng hơn theo môn học và độ khó.

### 6.2 MMLU-Pro Stratified được tạo như thế nào

Quy trình trong Section 3:

1. Bắt đầu từ MMLU-Pro 12,032 câu, 14 categories.
2. Dùng kết quả của top 10 models trên benchmark để tính mean accuracy cho từng câu.
3. Loại category `other` để đảm bảo rõ discipline.
4. Chia câu hỏi thành **10 difficulty levels** theo khoảng accuracy 10%.
5. Với mỗi subject-difficulty combination, lấy 10 câu đầu tiên.
6. Kết quả: 13 disciplines x 10 difficulty levels x 10 câu = 1,300 câu.

Mục đích là tạo bộ test không bị lệch qua một vài môn hoặc một vài mức khó.

### 6.3 Standardized schema

Appendix B.1 chuẩn hóa mỗi câu hỏi thành object:

```python
{
    "question_id": str,
    "question": str,
    "options": list[str],
    "answer": str,
    "answer_index": int,
    "cot_content": str,
    "category": str,
}
```

### 6.4 Model/config input

Ngoài dataset, framework cần:

- Teacher model: model cần đánh giá năng lực dạy học.
- Student model: model đóng vai học sinh.
- Evaluator model: model phân tích/chấm hội thoại.
- Config: số vòng hội thoại, token limit, retry, concurrency, API provider.

Trong paper:

- Student chính: **Llama 3.1 70B Instruct**.
- Teacher models: 14 LLMs.
- Evaluator qualitative: GPT-4o / GPT-4o-mini tùy thiết lập.
- Mỗi task có 5 interaction rounds.
- Token recommendation: 150 tokens cho teacher question và student answer.

## 7. Output của framework

### 7.1 Kết quả định lượng

| Output | Ý nghĩa |
| --- | --- |
| Pre-test accuracy | Student làm đúng bao nhiêu trước khi được dạy. |
| Post-test accuracy | Student làm đúng bao nhiêu sau hội thoại với teacher. |
| ALG | Absolute Learning Gain = Post accuracy - Pre accuracy. |
| PNIR | Positive-Negative Impact Ratio, thấp hơn là tốt hơn. |
| CSS | Cross-Subject Stability, thấp hơn là dạy ổn định hơn giữa các môn. |
| UIC | Số câu chỉ một teacher model duy nhất giúp student cải thiện. |

### 7.2 Kết quả định tính

Evaluator agent đánh giá hội thoại theo 17 dimensions, gồm 3 nhóm:

| Nhóm | Ví dụ dimension |
| --- | --- |
| Interaction-level | Assessment effectiveness, feedback effectiveness, adaptation, learning objective achievement. |
| Teacher-question analysis | Question relevance, cognitive level, question diversity, scaffolding progression, metacognitive promotion. |
| Student-response analysis | Response relevance, cognitive level demonstration, elaboration progression, metacognitive reflection. |

Điểm đánh giá theo thang 1-10:

- 1-2: rất kém.
- 3-4: dưới kỳ vọng.
- 5-6: đạt cơ bản.
- 7-8: vượt kỳ vọng.
- 9-10: rất tốt.

## 8. Benchmark protocol chi tiết

EducationQ chạy theo pipeline:

### Bước 1: Pre-test

Student agent nhận câu hỏi và options, rồi trả lời theo protocol của GPQA/MMLU-Pro. Kết quả này tạo baseline.

### Bước 2: Teacher-student interaction

Teacher agent nhận thông tin về câu hỏi và reasoning của student, nhưng **không được thấy options/đáp án**. Teacher phải dạy bằng câu hỏi, feedback, gợi ý, không được tiết lộ đáp án.

Student agent tham gia hội thoại, phản hồi lại theo cách mình hiểu. Mỗi task có **5 rounds**.

### Bước 3: Post-test

Student làm lại câu hỏi sau khi đã có pre-test reasoning và nội dung hội thoại. Paper vẫn giữ protocol benchmark gốc của GPQA/MMLU-Pro để chấm đáp án.

### Bước 4: Quantitative evaluation

Tính learning gain:

```text
ALG = ACC_post - ACC_pre
```

Nếu post-test đúng hơn pre-test, teacher được xem là có tác động tích cực lên học sinh.

### Bước 5: Qualitative evaluation

Evaluator agent đọc hội thoại và chấm điểm các khía cạnh sư phạm. Sau đó tác giả dùng phân tích thống kê để xem dimension nào giải thích learning gain.

## 9. Content boundary: điểm rất quan trọng

Paper có thiết kế ranh giới thông tin:

- Teacher **không được thấy answer options**.
- Teacher chỉ đưa guidance dựa trên câu hỏi, reasoning của student và tình trạng đúng/sai.
- Student **không được biết pre-test correctness label** trong lúc hội thoại.
- Student vẫn thấy câu hỏi và options đầy đủ khi làm bài.

Lý do: nếu teacher thấy options/đáp án, model có thể "dạy" bằng cách nói gần đáp án, không còn đo teaching skill nữa. Content boundary giúp đo năng lực gợi mở và sửa hiểu sai.

## 10. Experimental setup

Section 6 đánh giá 14 LLMs từ nhiều tổ chức:

| Model | Tổ chức |
| --- | --- |
| Llama 3.1 70B Instruct | Meta |
| Gemini 1.5 Pro 002 | Google |
| Llama 3.1 405B Instruct | Meta |
| OpenAI o1-mini | OpenAI |
| Qwen 2.5 72B Instruct | Alibaba |
| Llama 3.1 8B Instruct | Meta |
| Hermes 3 Llama 3.1 70B | Nous |
| Mistral Nemo | Mistral |
| Claude 3.5 Sonnet | Anthropic |
| WizardLM-2 8x22B | Microsoft |
| DeepSeek V2.5 | DeepSeek |
| Command R 08-2024 | Cohere |
| GPT-4o-mini | OpenAI |
| Phi-3.5-mini Instruct | Microsoft |

Quy mô experiment:

- 1,498 questions.
- 13 disciplines.
- 10 difficulty levels.
- 14 teacher models.
- 5 interaction rounds/task.
- 19,474 valid dialogue sequences.
- 5,032 qualitative analyses trên 296 dialogues.

Appendix B quality control:

- Retry nếu response rỗng.
- Retry nếu response quá dài bất thường.
- Threshold quá dài: 80% max token và vượt recommended token limit.
- Max retries default: 5.
- API backoff: 10s ban đầu, tối đa 320s.
- Parallel tasks default: 5.
- Evaluator output dùng JSON schema.

## 11. Kết quả chính

### 11.1 Overall performance

Kết quả tổng thể:

| Model | Overall pre | Overall post | ALG |
| --- | ---: | ---: | ---: |
| Llama 3.1 70B Instruct | 47.73 | 58.74 | 11.01 |
| Gemini 1.5 Pro 002 | 47.73 | 55.21 | 7.48 |
| Llama 3.1 405B Instruct | 47.73 | 53.87 | 6.14 |
| OpenAI o1-mini | 47.73 | 53.57 | 5.84 |
| Qwen 2.5 72B Instruct | 47.73 | 53.14 | 5.41 |
| Phi-3.5-mini Instruct | 47.73 | 48.93 | 1.20 |

Kết luận quan trọng: **Llama 3.1 70B Instruct dạy tốt nhất trong setup này**, dù không phải model lớn nhất. Llama 3.1 405B lớn hơn nhưng teaching gain thấp hơn.

### 11.2 Cross-dataset stability

Ranking giữa GPQA Diamond và MMLU-Pro Stratified có tương quan cao:

```text
r = 0.871, p < 0.001
```

Điều này gợi ý framework không chỉ vô tình phù hợp với một dataset duy nhất.

### 11.3 Test-retest stability

Khi lặp lại trên GPQA-main với 3 model đại diện, variance ALG trung bình rất thấp:

```text
mean variance = 0.00832
```

Tác giả dùng điểm này để nói framework đo ổn định.

### 11.4 Subject-specific strengths

Mỗi model có môn mạnh khác nhau:

- Llama 3.1 70B Instruct mạnh ở knowledge-intensive subjects:
  - Psychology: ALG 18%.
  - Health: ALG 24%.
  - Law: ALG 11%.
- OpenAI o1-mini mạnh ở reasoning/problem-solving:
  - Physics: ALG 8.6%.
  - Math: ALG 9%.
- Gemini 1.5 Pro 002 mạnh ở applied disciplines:
  - Business: ALG 8%.
  - Economics: ALG 9%.
- Hermes 3 Llama 3.1 70B dẫn đầu Engineering.
- Qwen 2.5 72B dẫn đầu Chemistry trong MMLU-Pro Stratified.

Nhận xét: "teacher tốt" không phải một điểm duy nhất; có tính chuyên môn theo môn học.

### 11.5 Difficulty-level behavior

Phân tích theo 10 mức khó cho thấy:

- Nhiều teacher model cải thiện nhiều ở câu khá dễ, nơi student đã gần hiểu sẵn.
- Llama 3.1 70B và Llama 3.1 8B có pattern hay hơn: đạt peak ở mức khó trung bình, nơi student cần scaffold để vượt qua vùng hiện tại.

Điều này phù hợp với ZPD: teacher tốt nên giúp học sinh ở vùng "gần làm được nếu có hỗ trợ", không chỉ reinforce câu đã dễ.

## 12. Kết quả qualitative / teaching strategy

Paper phân tích 148 UIC cases và paired control dialogues, tổng 296 dialogues.

Một số insight:

- **Llama 3.1 70B Instruct** thành công chủ yếu nhờ questioning strategy.
  - Logistic regression: questioning quality là predictor có ý nghĩa.
  - Random forest cũng cho thấy questioning strategy quan trọng.
  - Cách dạy thường là hỏi tiến trình, dẫn học sinh từ reasoning hiện tại sang concept đúng.

- **Gemini 1.5 Pro 002** thành công chủ yếu nhờ feedback quality.
  - Nó chẩn đoán misconception nhanh.
  - Feedback tập trung, đúng trọng tâm, sửa concept sai.
  - Có khả năng adaptive formative assessment tốt.

- **Llama 3.1 405B Instruct** có thể biết nhiều hơn nhưng không nhất thiết dạy tốt hơn.
  - Trong case study, model lớn hơn có xu hướng lặp lại procedural practice thay vì tạo câu hỏi conceptual scaffolding.

Nhận xét: teaching gain đến từ **chiến lược sư phạm**, không chỉ từ domain knowledge.

## 13. Human evaluation

Tác giả mời 7 nhà giáo dục có chuyên môn và 1 tác giả đánh giá.

Thiết kế:

- Chọn 50 pairs dialogues từ 148 UIC cases.
- Mỗi pair có 1 dialogue tạo learning gain và 1 dialogue không tạo gain.
- Ẩn danh teacher identity.
- Human experts chấm teaching behavior.

Kết quả:

- Human preference trùng với evaluator agent trong **78% cases**.
- Dialogue tạo learning gain có điểm human cao hơn:
  - Improvement group: 7.38/10.
  - Control group: 6.41/10.
- Không reviewer nào phát hiện teacher tiết lộ trực tiếp đáp án.

Ý nghĩa:

- Evaluator agent không hoàn hảo, nhưng khá aligned với human experts.
- Content boundary có vẻ hoạt động tốt.
- Learning gain không phải chỉ là artifact do leak đáp án.

## 14. Kết luận của paper

Paper đưa ra 2 kết luận lớn:

1. **Model scale/general capability không đủ để dự đoán teaching effectiveness.**
   - Model nhỏ/open-source có thể dạy tốt hơn model lớn/commercial nếu chiến lược sư phạm tốt.

2. **LLM-as-Teacher cần được optimize riêng cho teaching.**
   - Cần tập trung vào questioning, feedback, adaptation, scaffolding.
   - Không nên chỉ scale model hoặc tối ưu benchmark QA.

Thông điệp lớn: nếu muốn AI tutor tốt, phải benchmark và train nó theo năng lực dạy học, không chỉ năng lực trả lời.

## 15. Hạn chế

### 15.1 Student agent chưa giống học sinh thật

Student là LLM, không phải người học. Nó không mô phỏng đầy đủ:

- Tuổi.
- Nền tảng kiến thức.
- Động lực học.
- Tâm lý.
- Lỗi sai của học sinh thật.
- Phong cách học khác nhau.

Điều này là hạn chế lớn nếu muốn suy rộng sang lớp học thật.

### 15.2 Scenario chỉ là one-on-one IFA

Framework mô phỏng dạy học 1-1, chưa bao gồm:

- Quản lý lớp học.
- Tương tác nhiều học sinh.
- Hoạt động nhóm.
- Sử dụng lời giải của học sinh này để dạy học sinh khác.
- Thiết kế lesson plan dài hạn.

### 15.3 Số round cố định

Paper dùng 5 rounds. Cách này tốt cho benchmark công bằng, nhưng không đo được:

- Teacher nào dạy nhanh hơn.
- Teacher nào cần ít lượt hơn để tạo gain.
- Ảnh hưởng của hội thoại dài/ngắn.

### 15.4 Model selection chưa đầy đủ

Không bao gồm:

- Nhiều version cũ/mới trong cùng model family.
- Multimodal models.
- Educational-specialized private models.

### 15.5 Nội dung test khá nâng cao

Dataset thiên về undergraduate đến PhD-level. Chưa test:

- Tiểu học.
- THCS/THPT.
- Các nội dung cần giải thích trực quan/đơn giản hơn.

### 15.6 Evaluator agent vẫn có bias

Định tính được validate 78% với human, nhưng:

- 78% không phải tuyệt đối.
- Dimensions được định nghĩa sẵn có thể bỏ sót khía cạnh sư phạm khác.
- LLM evaluator có thể thiên vị theo style viết/hỏi của một số model.

## 16. Nhận xét cá nhân / reviewer-style

### Điểm mạnh

- Bài đặt đúng một vấn đề rất thực tế: AI tutor không chỉ cần biết đáp án.
- Protocol pre-test -> teaching interaction -> post-test rất dễ hiểu và có trực giác mạnh.
- Content boundary là thiết kế quan trọng, giúp giảm answer leakage.
- Kết hợp quantitative và qualitative làm kết quả thuyết phục hơn.
- Human validation 78% làm evaluator-agent analysis đáng tin hơn.
- Finding "70B dạy tốt hơn 405B" rất hay, vì nó phá giả định scale là tất cả.

### Điểm yếu / cần nghi ngờ

- Student là LLM nên learning gain có thể là "LLM bị prompt influence" hơn là học thật.
- Student model có thể có memory/behavior pattern khác người, nên post-test improvement chưa chắc tương đương learning.
- Pre/post cùng một câu hỏi, nên có nguy cơ student bị ảnh hưởng bởi context/recognition.
- Dùng teacher model không thấy options là hợp lý để tránh leak, nhưng trong dạy học thật giáo viên thường biết đáp án/options; setup này đo "guided reasoning under constrained information" nhiều hơn dạy học đầy đủ.
- Qualitative scoring bằng LLM evaluator có thể circular: LLM chấm LLM.
- Dataset nâng cao, chưa chắc đại diện cho tutoring phổ thông.

### Ý nghĩa nếu mình muốn reproduce/làm project

Nếu reproduce, nên tập trung các artifact sau:

1. Dataset:
   - `dataset/gpqa/dataset/gpqa_diamond.csv`
   - `dataset/mmlu-pro/mmlu_pro_stratified.json`

2. Config:
   - `data/input/educationq_benchmark.yaml`
   - `data/input/config_teacher0shot_gpqa_diamond.yaml`
   - `data/input/config_teacher0shot_mmlupro_stratified.yaml`

3. Metrics cần implement trước:
   - Pre accuracy.
   - Post accuracy.
   - ALG.
   - PNIR.
   - CSS.
   - UIC.

4. Nếu hạn chế chi phí API:
   - Chạy subset nhỏ theo subject.
   - Bắt đầu với 2-3 teacher models.
   - Chỉ chạy quantitative trước, qualitative sau.

## 17. Một cách diễn giải ngắn cho báo cáo

EducationQ cho thấy năng lực dạy học của LLM là một năng lực riêng, không thể suy ra trực tiếp từ accuracy trên benchmark kiến thức. Framework mô phỏng quá trình dạy học bằng 3 agent: student làm pre-test, teacher hướng dẫn qua 5 lượt hội thoại, student làm post-test, evaluator đo learning gain và phân tích chất lượng sư phạm. Trên 1,498 câu hỏi từ GPQA Diamond và MMLU-Pro Stratified, Llama 3.1 70B Instruct đạt learning gain cao nhất, vượt một số model lớn hơn. Kết quả gợi ý rằng AI tutor cần được tối ưu theo các chiến lược sư phạm như questioning, feedback, adaptation và scaffolding, thay vì chỉ scale model hoặc tối ưu QA benchmark.

