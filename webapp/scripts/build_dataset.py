import csv
import json
import random
from pathlib import Path

csv.field_size_limit(10**7)

SCRIPT_DIR = Path(__file__).resolve().parent
WEBAPP_DIR = SCRIPT_DIR.parent
REPO_ROOT = WEBAPP_DIR.parent

DATASET_ROOT = REPO_ROOT / "src" / "data" / "dataset"
OUT = WEBAPP_DIR / "public" / "data" / "questions.json"

LETTERS = "ABCDEFGHIJ"


def clean(s):
    return (s or "").strip()


def build_mmlu():
    path = DATASET_ROOT / "mmlu-pro" / "mmlu_pro_stratified.json"
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    out = []
    for d in data:
        options = [clean(o) for o in d["options"]]
        out.append({
            "id": f"mmlu-{d['question_id']}",
            "source": "mmlu-pro",
            "category": d["category"],
            "question": clean(d["question"]),
            "options": options,
            "answer_index": d["answer_index"],
            "answer_letter": LETTERS[d["answer_index"]],
            "cot_content": clean(d.get("cot_content", "")),
            "explanation": "",
        })
    return out


def build_gpqa():
    rng = random.Random(42)
    path = DATASET_ROOT / "gpqa" / "dataset" / "gpqa_diamond.csv"
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    out = []
    for row in rows:
        correct = clean(row["Correct Answer"])
        incorrect = [
            clean(row["Incorrect Answer 1"]),
            clean(row["Incorrect Answer 2"]),
            clean(row["Incorrect Answer 3"]),
        ]
        options = [correct] + incorrect
        order = list(range(4))
        rng.shuffle(order)
        shuffled = [options[i] for i in order]
        answer_index = order.index(0)
        domain = clean(row.get("High-level domain", "")) or "Science"
        out.append({
            "id": f"gpqa-{clean(row['Record ID'])}",
            "source": "gpqa-diamond",
            "category": domain.lower(),
            "question": clean(row["Question"]),
            "options": shuffled,
            "answer_index": answer_index,
            "answer_letter": LETTERS[answer_index],
            "cot_content": "",
            "explanation": clean(row.get("Explanation", "")),
        })
    return out


def main():
    mmlu = build_mmlu()
    gpqa = build_gpqa()
    all_q = mmlu + gpqa
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(all_q, f, ensure_ascii=False)
    print("mmlu:", len(mmlu), "gpqa:", len(gpqa), "total:", len(all_q))

    cats = {}
    for q in all_q:
        cats.setdefault(q["source"], set()).add(q["category"])
    for k, v in cats.items():
        print(k, sorted(v))


if __name__ == "__main__":
    main()
