# Demo EducationQ: show framework hoạt động theo từng bước

Tài liệu này setup một demo có ba lớp:

1. **Demo không gọi API**: dùng output mẫu trong repo và in transcript theo format `ROLE / CONTENT`.
2. **Demo UI trực quan**: dùng Streamlit để phát lại teaching episode như một hệ thống multi-agent đang chạy.
3. **Demo chạy thật mini**: dùng `examples/demo_minimal.yaml` với 1 câu hỏi, 1 Teacher, 1 Student, 2 vòng interaction.

## 1. Demo nhanh không cần API

Chạy từ thư mục `EducationQ`:

```bash
python3 examples/demo_framework_transcript.py --max-chars 900
```

Output sẽ được in theo các block rõ ràng:

```text
ROLE: DATASET / QUESTION
CONTENT:
  ...

ROLE: STUDENT / PRE-TEST RESPONSE
CONTENT:
  ...

ROLE: TEACHER / INTERACTION TURN 1
CONTENT:
  ...

ROLE: STUDENT / INTERACTION TURN 1
CONTENT:
  ...

ROLE: STUDENT / POST-TEST RESPONSE
CONTENT:
  ...

ROLE: FRAMEWORK / LEARNING-GAIN SUMMARY
CONTENT:
  ...
```

Mục tiêu của phần này là show được dữ liệu thật đi qua framework:

- Dataset cung cấp câu hỏi trắc nghiệm.
- Student làm pre-test.
- Teacher hỏi/feedback nhiều vòng.
- Student trả lời từng vòng.
- Student làm lại post-test với interaction history.
- Framework tính learning gain bằng exact-match.

Nếu muốn xem đầy đủ hơn, bỏ giới hạn truncate:

```bash
python3 examples/demo_framework_transcript.py --max-chars 0
```

Nếu muốn chọn file kết quả khác:

```bash
python3 examples/demo_framework_transcript.py \
  --result src/data/output/EduQ-Bench_Student-llama31-70b-instruct/GPQA-diamond/interactions_results/GPQA-diamond_Teacher-hermes3-70b_Student-llama31-70b-instruct_results_1.0.0_142628.json \
  --max-chars 900
```

CLI demo phù hợp để kiểm tra raw transcript và debug dữ liệu JSON. Khi thuyết trình, nên dùng UI demo bên dưới để dễ nhìn trên projector.

## 2. Demo UI trực quan bằng Streamlit

Chạy từ thư mục `EducationQ`:

```bash
streamlit run examples/demo_ui.py
```

Nếu máy bạn không nhận lệnh `streamlit`, dùng dạng chắc ăn hơn:

```bash
python3 -m streamlit run examples/demo_ui.py
```

UI demo có sẵn sample output, nên **không cần API key**. Giao diện hiển thị theo kiểu runtime replay:

- Stage tracker: Dataset → Pre-test → Evaluate pre → Interaction → Post-test → Evaluate gain.
- Agent dashboard: EvalManager, Dataset, TeacherLLM, StudentLLM và EvaluatorLLM; agent đang hoạt động sẽ được highlight.
- Console phát lại từng event một, có nút Previous, Next, Auto-play và Reset.
- Mỗi event ghi rõ role, stage, current operation và nội dung message.
- Sidebar để đổi giới hạn ký tự, số message lịch sử đang hiển thị, tốc độ Auto-play và xem hướng dẫn chạy full API pipeline.

Mục đích của UI này là mô phỏng quá trình EducationQ hoạt động, không phải render toàn bộ transcript như một static report.

Nếu chưa cài Streamlit:

```bash
pip install -r requirements.txt
```

Full API pipeline cần config API thật. Sample transcript demo và UI demo mặc định không cần API key.

## 3. Demo chạy thật mini bằng API

> Lưu ý: các lệnh pipeline chính nên chạy từ `src/run`, vì config dùng nhiều relative path.

Tạo môi trường:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Mở config demo:

```bash
code examples/demo_minimal.yaml
```

Thay các trường:

- `api_key`
- `base_url`
- `model`

Config hiện để mặc định OpenRouter-compatible:

```yaml
base_url: "https://openrouter.ai/api/v1"
model: "openai/gpt-4o-mini"
```

Chạy pre-test only:

```bash
cd src/run
python main.py --config ../../examples/demo_minimal.yaml --mode pretest
```

Chạy full mini pipeline:

```bash
python main.py --config ../../examples/demo_minimal.yaml --mode complete
```

Sau khi chạy, xem output:

```bash
find ../data/output/demo -type f | sort
```

Các file quan trọng:

- `pretest_results_*.json`
- `pretest_interaction_results_*.json`
- `pretest_interaction_posttest_results_*.json`
- `evaluation_results_*.json`

In transcript từ kết quả post-test/interaction:

```bash
cd ../..
python3 examples/demo_framework_transcript.py \
  --result src/data/output/demo/PATH_TO_RESULT_JSON \
  --max-chars 900
```

## 4. Talk track khi trình bày

### Bước 1: Entry point

Mở `src/run/main.py`, show `main()`:

```bash
rg -n "parser.add_argument|args.mode|complete|pretest|load_pretest|load_interaction|evaluation" src/run/main.py
```

Nói:

> `main()` parse CLI, tạo `EvalConfig`, tạo `EvalManager`, rồi chọn mode chạy. Framework không phải ba agent tự chat tự do; `EvalManager` điều phối toàn bộ thứ tự.

### Bước 2: Pre-test

Show method:

```bash
rg -n "def _run_pretest|def take_test|def extract_answer|calculate_accuracy" src/run/main.py
```

Nói:

> Student làm từng câu độc lập qua `StudentLLM.take_test()`. Prompt yêu cầu giải từng bước và kết thúc bằng `"the answer is (X)"`. Framework parse đáp án bằng regex; nếu không parse được thì `"R"` và tính sai.

### Bước 3: Interaction

Show method:

```bash
rg -n "def _run_interactions|def _process_question|def generate_question|def answer_question" src/run/main.py
```

Nói:

> Mỗi vòng gồm Teacher sinh câu hỏi/feedback, Student trả lời, rồi `{question, answer}` được append vào `interaction_history`. Vòng sau cả Teacher và Student đều nhận lại history này.

### Bước 4: Prompt của Teacher

Nói:

> Teacher nhận câu hỏi gốc, response/prediction pre-test của Student, và nhãn Correct/Incorrect. Code không truyền đáp án đúng trực tiếp cho Teacher. Teacher có thể chẩn đoán misconception từ lập luận của Student và lịch sử hội thoại.

### Bước 5: Prompt của Student

Nói:

> Student có thể được xem lại câu hỏi pre-test và câu trả lời cũ nếu `include_pretest_info=true`, nhưng trong interaction không được truyền nhãn đúng/sai. Đây là học trong context, không phải fine-tuning.

### Bước 6: Post-test

Show:

```bash
rg -n "def _run_posttest" src/run/main.py
```

Nói:

> Framework gọi lại `StudentLLM.take_test()` trên chính câu hỏi ban đầu, nhưng kèm toàn bộ interaction history. Nếu đáp án sau tốt hơn trước, Teacher tạo learning gain.

### Bước 7: Evaluation

Show:

```bash
rg -n "def _perform_evaluation|def _comprehensive_evaluation|teacher_questions_analysis|student_responses_analysis|over_interaction_analysis" src/run/main.py
```

Nói:

> `complete` dùng `_perform_evaluation()` để tính accuracy/progress bằng exact-match. Qualitative LLM judge là mode riêng `evaluation`, dùng CSV pairwise Teacher A/B và JSON Schema.

## 5. Những câu cần nhấn mạnh

- Teacher không được truyền đáp án đúng trực tiếp.
- Evaluator không điều khiển Teacher trong interaction.
- Learning gain không phải fine-tuning.
- `complete` chỉ tự chạy đánh giá định lượng exact-match.
- Qualitative pairwise evaluation phải chạy riêng bằng `--mode evaluation`.
- Output transcript nên đọc theo role: Dataset, Student, Teacher, Evaluator, Framework.
