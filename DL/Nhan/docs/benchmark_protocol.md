# EducationQ Dataset, Benchmark Protocol, and Config Notes

This workspace note condenses the parts requested from the paper:
Section 3 Dataset, Section 6 Experimental Setup, and Appendix B, C, D.

Primary sources:
- Local paper: `2504.14928v3.pdf`
- Official repository: https://github.com/SunriserFuture/EducationQ

## 1. Dataset

EducationQ builds a teaching-oriented benchmark from two established QA benchmarks:

| Source | Original size | Extracted subset | Local file |
| --- | ---: | --- | --- |
| GPQA | 448 | GPQA Diamond, 198 questions | `dataset/gpqa/dataset/gpqa_diamond.csv` |
| MMLU-Pro | 12,032 | MMLU-Pro Stratified, 1,300 questions | `dataset/mmlu-pro/mmlu_pro_stratified.json` |

Total evaluation set: 1,498 questions.

MMLU-Pro Stratified is sampled by subject and difficulty. The paper removes the unclear `other` category, stratifies remaining questions into 10 difficulty levels using top-model mean accuracy, then samples 10 questions from each subject-difficulty combination. The resulting subset covers 13 academic disciplines.

GPQA Diamond contributes PhD-level science questions with expert-validated difficulty. Appendix D (Table 8) splits the 198 questions by domain: Physics 86, Chemistry 93, Biology 19.

## 2. Standardized Data Schema

Appendix B.1 standardizes source datasets into this internal question object:

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

## 3. Benchmark Protocol

EducationQ uses a three-agent setup:

| Agent | Role |
| --- | --- |
| Student | Takes pre-test and post-test, responds during teaching dialogue |
| Teacher | Model under evaluation; gives guidance through questioning and feedback |
| Evaluator | Computes quantitative metrics and performs qualitative scoring |

The execution flow is:

1. Pre-test: Student answers benchmark questions using the official GPQA/MMLU-Pro evaluation style.
2. Interaction: Teacher and Student conduct 5 rounds of formative-assessment dialogue.
3. Post-test: Student retakes the question with pre-test reasoning and dialogue context included.
4. Evaluation: Compare pre-test and post-test performance, then optionally evaluate dialogue quality.

The teacher must not see answer options. The student keeps access to the full question and options, but not pre-test correctness labels. This boundary is important because the benchmark measures teaching guidance rather than answer leakage.

## 4. Metrics

The paper reports these quantitative metrics:

| Metric | Meaning |
| --- | --- |
| ALG | Absolute Learning Gain: post-test accuracy minus pre-test accuracy |
| PNIR | Positive-Negative Impact Ratio: lower is better |
| CSS | Cross-Subject Stability: lower means more stable gains across subjects |
| UIC | Unique Improvement Count: questions improved by only one teacher model |

Qualitative evaluation uses 17 educational dimensions grouped into interaction-level, teacher-question, and student-response analyses, each scored on a 1-10 scale.

## 5. Experimental Setup

Section 6 evaluates 14 open-source and commercial LLMs from Meta, Google, OpenAI, Alibaba, Mistral, Anthropic, Microsoft, DeepSeek, Cohere, and Nous through online APIs.

Paper-scale run:
- 1,498 questions.
- 14 teacher models.
- Llama 3.1 70B Instruct as the default student agent.
- 5 interaction rounds per task.
- 150 recommended tokens per teacher question and student answer.
- 19,474 valid dialogue sequences.
- 5,032 qualitative analyses over 296 dialogues and 17 educational dimensions.

Section 4.10 defines two automated retry mechanisms for data quality:
1. **Empty Response Detection**: triggers on zero token count (model output failure).
2. **Anomalous Output Detection**: triggers when token counts exceed 80% of the
   allotted budget — >80% of 1024 tokens for dialogue turns, or >80% of 2048 tokens
   for test answers. Both retry automatically with a 5-attempt limit per question.
   In the paper's final runs, average response lengths were 73.6 tokens for teacher
   dialogue, 260 tokens for student dialogue responses, and 425 tokens for test
   answers — well under the retry thresholds. All retry-triggering cases underwent
   manual review for root-cause validation.

Additional Appendix B quality controls:
- Evaluator output should follow a JSON schema.
- API backoff: 10 seconds initial delay, 320 seconds max delay, 5 max retries.
- Parallel processing default: 5 concurrent tasks.

### Why 5 rounds / 150 tokens (Section 4.9 ablation)

The paper justifies its interaction parameters with an ablation study: increasing the
per-turn token limit to 250 yielded no significant learning gains, while reducing it
to 70-100 tokens degraded teaching performance. Doubling the rounds to 10 (with halved
student token limits) increased computational cost without surpassing the
effectiveness of the 5-round, 150-token configuration — so 5 rounds/150 tokens is the
cost-effectiveness sweet spot, not an arbitrary choice.

## 6. Model Specification Summary

Appendix C (Table 7) lists the evaluated teacher models with context window and parameter count:

| Model | Org. | Provider | Type | Context | Params |
| --- | --- | --- | --- | --- | --- |
| Llama 3.1 70B Instruct | Meta | hyperbolic | bf16 | 32K | 70B |
| Gemini 1.5 Pro 002 | Google | Google Vertex | - | 4M | - |
| Llama 3.1 405B Instruct | Meta | hyperbolic | bf16 | 8K | 405B |
| OpenAI o1-mini | OpenAI | OpenAI | - | 128K | - |
| Qwen 2.5 72B Instruct | Alibaba | hyperbolic | bf16 | 32K | 72B |
| Llama 3.1 8B Instruct | Meta | hyperbolic | bf16 | 32K | 8B |
| Hermes 3 Llama 3.1 70B | Nous | hyperbolic | bf16 | 12K | 70B |
| Mistral Nemo | Mistral | DeepInfra | bf16 | 128K | 12B |
| Claude 3.5 Sonnet | Anthropic | Anthropic | - | 200K | - |
| WizardLM-2 8x22B | Microsoft | DeepInfra | bf16 | 66K | 176B |
| DeepSeek V2.5 | DeepSeek | deepseek | fp8 | 128K | - |
| Command R 08-2024 | Cohere | Cohere | - | 128K | - |
| GPT-4o-mini | OpenAI | OpenAI | - | 128K | - |
| Phi-3.5-mini Instruct | Microsoft | Azure | - | 128K | 3.8B |

"-" means unspecified in the paper. Context window sizes are in tokens.

## 6b. Dataset Distribution (Appendix D, Table 8)

| Source | Discipline | Count | Pct. (%) | Per-source % |
| --- | --- | ---: | ---: | ---: |
| MMLU-Pro Stratified | 13 disciplines (Business, Law, Psychology, Biology, Chemistry, History, Health, Economics, Math, Physics, Engineering, Philosophy, Computer Science) | 100 each | 6.68 each | 86.78 |
| GPQA Diamond | Physics | 86 | 5.74 | 13.22 |
| GPQA Diamond | Chemistry | 93 | 6.21 | |
| GPQA Diamond | Biology | 19 | 1.27 | |
| **Total** | | **1498** | **100.00** | **100.00** |

## 7. Config Files

This workspace includes:

- `data/input/config_template.yaml`: official template from the EducationQ repo.
- `data/input/config_teacher0shot_gpqa_diamond.yaml`: official GPQA Diamond paper-style config.
- `data/input/config_teacher0shot_mmlupro_stratified.yaml`: official MMLU-Pro Stratified paper-style config.
- `data/input/educationq_benchmark.yaml`: local, shorter sample config with workspace paths.

Use `DATASET_TYPE: "gpqa"` and `DATASET_NAME: "gpqa_diamond.csv"` for GPQA Diamond. Use `DATASET_TYPE: "mmlu-pro"` and `DATASET_NAME: "mmlu_pro_stratified.json"` for MMLU-Pro Stratified.
