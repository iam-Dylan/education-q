#!/usr/bin/env python3
"""Print an EducationQ teaching episode as a role/content transcript.

This helper is intentionally read-only. It lets you demo the framework from an
existing EducationQ result JSON without calling any LLM API.

Example:
    python examples/demo_framework_transcript.py \
      --result src/data/output/.../GPQA-diamond_Teacher-gpt-4o-mini_...json \
      --max-chars 900
"""

from __future__ import annotations

import argparse
import json
import textwrap
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple, Union


DEFAULT_SAMPLE_RESULT = (
    "src/data/output/EduQ-Bench_Student-llama31-70b-instruct/"
    "GPQA-diamond/interactions_results/"
    "GPQA-diamond_Teacher-gpt-4o-mini_Student-llama31-70b-instruct_results_"
    "1.0.0_145256.json"
)

DemoRecord = Dict[str, str]


def compact_text(value: Any, max_chars: int) -> str:
    """Return a readable, bounded string for terminal/demo output."""
    if value is None:
        return ""
    text = str(value).strip()
    text = "\n".join(line.rstrip() for line in text.splitlines())
    if max_chars > 0 and len(text) > max_chars:
        return text[: max_chars - 20].rstrip() + "\n... [truncated]"
    return text


def truncate_text(value: Any, max_chars: int) -> str:
    """Alias used by visual demos; keeps the CLI wording stable."""
    return compact_text(value, max_chars)


def print_block(role: str, content: Any, max_chars: int) -> None:
    """Print one role/content block in a consistent demo-friendly format."""
    print("\n" + "=" * 88)
    print(f"ROLE: {role}")
    print("-" * 88)
    print("CONTENT:")
    print(textwrap.indent(compact_text(content, max_chars), "  "))


def non_config_keys(mapping: Dict[str, Any]) -> Iterable[str]:
    return (key for key in mapping.keys() if key != "config")


def select_episode(
    data: Dict[str, Any],
    teacher: Optional[str],
    student: Optional[str],
    question_id: Optional[str],
) -> Tuple[str, str, str, Dict[str, Any]]:
    """Select one Teacher -> Student -> question episode from result data."""
    teacher_name = teacher or next(non_config_keys(data), None)
    if not teacher_name or teacher_name not in data:
        raise KeyError(f"Teacher not found: {teacher_name!r}")

    teacher_data = data[teacher_name]
    student_name = student or next(non_config_keys(teacher_data), None)
    if not student_name or student_name not in teacher_data:
        raise KeyError(f"Student not found under {teacher_name}: {student_name!r}")

    student_data = teacher_data[student_name]
    qid = question_id or next(non_config_keys(student_data), None)
    if not qid or qid not in student_data:
        raise KeyError(f"Question id not found under {teacher_name}/{student_name}: {qid!r}")

    episode = student_data[qid]
    return teacher_name, student_name, qid, episode


def first_response(phase: Dict[str, Any]) -> Dict[str, Any]:
    responses = phase.get("responses") or []
    if not responses:
        return {}
    return responses[0]


def format_question(response: Dict[str, Any]) -> str:
    options = response.get("options") or []
    option_lines = []
    for index, option in enumerate(options):
        label = chr(ord("A") + index)
        option_lines.append(f"{label}. {option}")

    return "\n".join(
        part
        for part in [
            f"question_id: {response.get('question_id', '')}",
            f"category: {response.get('category', '')}",
            response.get("question", ""),
            "\n".join(option_lines),
        ]
        if part
    )


def format_answer_summary(response: Dict[str, Any]) -> str:
    return "\n".join(
        [
            f"model_prediction: {response.get('model_prediction', '')}",
            f"correct_answer: {response.get('correct_answer', '')}",
            "",
            str(response.get("model_response", "")),
        ]
    )


def format_scores(scores: Dict[str, Any]) -> str:
    return json.dumps(scores or {}, ensure_ascii=False, indent=2)


def load_result_json(result_path: Union[str, Path]) -> Dict[str, Any]:
    """Load an EducationQ result JSON from a repo-relative or absolute path."""
    path = Path(result_path)
    if not path.exists():
        raise FileNotFoundError(f"Result JSON not found: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def load_demo_episode(
    result_path: Union[str, Path] = DEFAULT_SAMPLE_RESULT,
    teacher: Optional[str] = None,
    student: Optional[str] = None,
    question_id: Optional[str] = None,
) -> Tuple[str, str, str, Dict[str, Any]]:
    """Load and select one EducationQ teaching episode."""
    data = load_result_json(result_path)
    return select_episode(data, teacher, student, question_id)


def calculate_learning_gain(episode: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate lightweight per-episode learning-gain values for demo display."""
    pre_response = first_response(episode.get("pre_test", {}))
    post_response = first_response(episode.get("post_test", {}))
    pre_prediction = pre_response.get("model_prediction")
    post_prediction = post_response.get("model_prediction")
    correct_answer = post_response.get("correct_answer") or pre_response.get("correct_answer")

    pre_correct = pre_prediction == correct_answer if correct_answer is not None else None
    post_correct = post_prediction == correct_answer if correct_answer is not None else None
    progress = (
        int(post_correct) - int(pre_correct)
        if pre_correct is not None and post_correct is not None
        else None
    )

    return {
        "pre_test_prediction": pre_prediction,
        "post_test_prediction": post_prediction,
        "correct_answer": correct_answer,
        "pre_test_correct": pre_correct,
        "post_test_correct": post_correct,
        "progress_for_this_episode": progress,
        "pre_test_score": float(pre_correct) if pre_correct is not None else None,
        "post_test_score": float(post_correct) if post_correct is not None else None,
        "learning_gain": float(progress) if progress is not None else None,
    }


def format_learning_gain_summary(metrics: Dict[str, Any]) -> str:
    return "\n".join(
        [
            f"pre_test_prediction: {metrics.get('pre_test_prediction')}",
            f"post_test_prediction: {metrics.get('post_test_prediction')}",
            f"correct_answer: {metrics.get('correct_answer')}",
            f"pre_test_correct: {metrics.get('pre_test_correct')}",
            f"post_test_correct: {metrics.get('post_test_correct')}",
            f"progress_for_this_episode: {metrics.get('progress_for_this_episode')}",
        ]
    )


def build_demo_records(episode: Dict[str, Any]) -> List[DemoRecord]:
    """Build role/content records shared by the CLI and Streamlit demo."""
    pre_response = first_response(episode.get("pre_test", {}))
    post_response = first_response(episode.get("post_test", {}))
    records: List[DemoRecord] = [
        {
            "role": "FRAMEWORK / DATASET",
            "kind": "framework",
            "content": (
                "Framework loads one benchmark item and sends it to "
                "StudentLLM.take_test() for the pre-test. At this point there "
                "is no interaction history."
            ),
        },
        {
            "role": "DATASET / QUESTION",
            "kind": "dataset",
            "content": format_question(pre_response),
        },
        {
            "role": "STUDENT / PRE-TEST RESPONSE",
            "kind": "student",
            "content": format_answer_summary(pre_response),
        },
        {
            "role": "EVALUATOR / PRE-TEST EXACT-MATCH SCORE",
            "kind": "evaluator",
            "content": format_scores(episode.get("pre_test", {}).get("scores", {})),
        },
    ]

    for turn_index, turn in enumerate(episode.get("interaction", []), start=1):
        records.extend(
            [
                {
                    "role": f"TEACHER / INTERACTION TURN {turn_index}",
                    "kind": "teacher",
                    "content": str(turn.get("question", "")),
                },
                {
                    "role": f"STUDENT / INTERACTION TURN {turn_index}",
                    "kind": "student",
                    "content": str(turn.get("answer", "")),
                },
            ]
        )

    records.extend(
        [
            {
                "role": "FRAMEWORK / POST-TEST CONTEXT",
                "kind": "framework",
                "content": (
                    "Framework calls StudentLLM.take_test() again on the same "
                    "benchmark item, but now passes the accumulated "
                    "Teacher/Student interaction history as context."
                ),
            },
            {
                "role": "STUDENT / POST-TEST RESPONSE",
                "kind": "student",
                "content": format_answer_summary(post_response),
            },
            {
                "role": "EVALUATOR / POST-TEST EXACT-MATCH SCORE",
                "kind": "evaluator",
                "content": format_scores(episode.get("post_test", {}).get("scores", {})),
            },
            {
                "role": "FRAMEWORK / LEARNING-GAIN SUMMARY",
                "kind": "framework",
                "content": format_learning_gain_summary(calculate_learning_gain(episode)),
            },
        ]
    )
    return records


def render_episode(
    teacher_name: str,
    student_name: str,
    question_id: str,
    episode: Dict[str, Any],
    max_chars: int,
) -> None:
    print("\nEDUCATIONQ DEMO TRANSCRIPT")
    print(f"Teacher: {teacher_name}")
    print(f"Student: {student_name}")
    print(f"Question: {question_id}")
    print(f"Category: {episode.get('category', '')}")

    for record in build_demo_records(episode):
        print_block(record["role"], record["content"], max_chars)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Render an EducationQ result JSON as ROLE/CONTENT transcript."
    )
    parser.add_argument(
        "--result",
        default=DEFAULT_SAMPLE_RESULT,
        help="Path to EducationQ result JSON. Defaults to a bundled sample output.",
    )
    parser.add_argument("--teacher", help="Teacher key to render.")
    parser.add_argument("--student", help="Student key to render.")
    parser.add_argument("--question-id", help="Question id to render.")
    parser.add_argument(
        "--max-chars",
        type=int,
        default=1200,
        help="Maximum characters printed for each content block. Use 0 for no truncation.",
    )
    args = parser.parse_args()

    teacher_name, student_name, qid, episode = load_demo_episode(
        args.result, args.teacher, args.student, args.question_id
    )
    render_episode(teacher_name, student_name, qid, episode, args.max_chars)


if __name__ == "__main__":
    main()
