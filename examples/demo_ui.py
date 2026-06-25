#!/usr/bin/env python3
"""Seminar-ready Streamlit demo for the EducationQ teaching pipeline.

This UI replays one saved EducationQ episode as a live multi-agent simulation.
It intentionally avoids rendering the full transcript as a static report.
"""

from __future__ import annotations

import re
import time
from pathlib import Path
from typing import Any, Dict, List

import streamlit as st

from demo_framework_transcript import (
    DEFAULT_SAMPLE_RESULT,
    DemoRecord,
    build_demo_records,
    calculate_learning_gain,
    load_demo_episode,
    truncate_text,
)


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_RESULT_PATH = REPO_ROOT / DEFAULT_SAMPLE_RESULT

PIPELINE_STAGES = [
    "Dataset",
    "Pre-test",
    "Evaluate pre",
    "Interaction",
    "Post-test",
    "Learning gain",
]

ROLE_STYLES = {
    "framework": {
        "label": "EvalManager",
        "short": "Manager",
        "emoji": "🧭",
        "accent": "#4f46e5",
        "soft": "#eef2ff",
        "ink": "#312e81",
        "caption": "Điều phối dữ liệu, prompt context và thứ tự API call.",
    },
    "dataset": {
        "label": "Benchmark Dataset",
        "short": "Dataset",
        "emoji": "📚",
        "accent": "#0ea5e9",
        "soft": "#e0f2fe",
        "ink": "#075985",
        "caption": "Cung cấp câu hỏi trắc nghiệm chuẩn hóa.",
    },
    "teacher": {
        "label": "TeacherLLM",
        "short": "Teacher",
        "emoji": "🧑‍🏫",
        "accent": "#f97316",
        "soft": "#ffedd5",
        "ink": "#9a3412",
        "caption": "Sinh feedback/câu hỏi thích ứng từ pre-test và history.",
    },
    "student": {
        "label": "StudentLLM",
        "short": "Student",
        "emoji": "🧑‍🎓",
        "accent": "#10b981",
        "soft": "#d1fae5",
        "ink": "#065f46",
        "caption": "Làm pre-test, trả lời Teacher, rồi làm post-test.",
    },
    "evaluator": {
        "label": "EvaluatorLLM",
        "short": "Evaluator",
        "emoji": "🧮",
        "accent": "#a855f7",
        "soft": "#f3e8ff",
        "ink": "#6b21a8",
        "caption": "Tính exact-match score và learning gain.",
    },
}


def setup_page() -> None:
    st.set_page_config(
        page_title="EducationQ Agent Demo",
        page_icon="🎓",
        layout="wide",
        initial_sidebar_state="collapsed",
    )
    st.markdown(
        """
        <style>
        :root {
            --eduq-bg: #f6f4ef;
            --eduq-panel: rgba(255, 255, 255, .82);
            --eduq-ink: #171717;
            --eduq-muted: #6b7280;
            --eduq-line: rgba(23, 23, 23, .10);
        }
        .stApp {
            background:
                radial-gradient(circle at 15% 10%, rgba(79, 70, 229, .12), transparent 28rem),
                radial-gradient(circle at 90% 15%, rgba(249, 115, 22, .13), transparent 24rem),
                linear-gradient(180deg, #faf8f3 0%, #f4f1ea 100%);
            color: var(--eduq-ink);
        }
        .main .block-container {
            padding-top: 1.2rem;
            padding-bottom: 2.2rem;
            max-width: 1380px;
        }
        div[data-testid="stSidebar"] {
            background: #fffaf0;
            border-right: 1px solid rgba(23, 23, 23, .08);
        }
        .hero {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1.2rem;
            align-items: end;
            padding: 1.1rem 0 .65rem 0;
            border-bottom: 1px solid var(--eduq-line);
            margin-bottom: 1rem;
        }
        .eyebrow {
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: .12em;
            font-size: .72rem;
            font-weight: 850;
            margin-bottom: .35rem;
        }
        .title {
            color: #111827;
            font-size: clamp(2.1rem, 4vw, 4.2rem);
            line-height: .94;
            letter-spacing: -.07em;
            font-weight: 920;
            margin: 0;
        }
        .subtitle {
            color: #52525b;
            max-width: 760px;
            margin-top: .75rem;
            font-size: 1.02rem;
            line-height: 1.6;
        }
        .live-pill {
            display: inline-flex;
            align-items: center;
            gap: .45rem;
            border: 1px solid rgba(16, 185, 129, .28);
            background: rgba(236, 253, 245, .92);
            color: #047857;
            border-radius: 999px;
            padding: .45rem .72rem;
            font-size: .85rem;
            font-weight: 800;
            white-space: nowrap;
        }
        .pulse {
            width: .55rem;
            height: .55rem;
            border-radius: 999px;
            background: #10b981;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, .7);
            animation: pulse 1.8s infinite;
        }
        @keyframes pulse {
            70% { box-shadow: 0 0 0 9px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .meta-row {
            display: flex;
            flex-wrap: wrap;
            gap: .5rem;
            margin: .5rem 0 1rem 0;
        }
        .meta {
            border: 1px solid var(--eduq-line);
            background: rgba(255, 255, 255, .62);
            backdrop-filter: blur(10px);
            border-radius: 999px;
            color: #52525b;
            padding: .28rem .68rem;
            font-size: .82rem;
        }
        .panel {
            border: 1px solid var(--eduq-line);
            background: var(--eduq-panel);
            backdrop-filter: blur(18px);
            border-radius: 28px;
            box-shadow: 0 24px 80px rgba(24, 24, 27, .08);
        }
        .timeline {
            padding: 1rem;
            min-height: 560px;
        }
        .timeline-title,
        .panel-title {
            color: #18181b;
            font-weight: 890;
            letter-spacing: -.02em;
            margin-bottom: .75rem;
        }
        .step {
            position: relative;
            display: grid;
            grid-template-columns: 28px 1fr;
            gap: .55rem;
            align-items: start;
            padding: .2rem 0 .9rem 0;
        }
        .step:not(:last-child)::after {
            content: "";
            position: absolute;
            left: 13px;
            top: 30px;
            width: 2px;
            height: calc(100% - 24px);
            background: rgba(82, 82, 91, .16);
        }
        .step-dot {
            width: 28px;
            height: 28px;
            border-radius: 999px;
            display: grid;
            place-items: center;
            font-size: .76rem;
            font-weight: 900;
            border: 1px solid rgba(82, 82, 91, .16);
            background: #fff;
            color: #a1a1aa;
            z-index: 1;
        }
        .step.done .step-dot {
            background: #dcfce7;
            color: #166534;
            border-color: #bbf7d0;
        }
        .step.active .step-dot {
            background: #111827;
            color: #fff;
            border-color: #111827;
            box-shadow: 0 0 0 6px rgba(17, 24, 39, .08);
        }
        .step-label {
            color: #71717a;
            font-size: .86rem;
            font-weight: 780;
            line-height: 1.25;
            padding-top: .25rem;
        }
        .step.active .step-label {
            color: #18181b;
        }
        .main-card {
            overflow: hidden;
            min-height: 560px;
        }
        .main-head {
            min-height: 132px;
            padding: 1.25rem 1.35rem;
            background:
                radial-gradient(circle at 85% 0%, var(--soft), transparent 18rem),
                linear-gradient(135deg, #ffffff 0%, #fbfbfb 100%);
            border-bottom: 1px solid var(--eduq-line);
        }
        .role-line {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            align-items: center;
            margin-bottom: .6rem;
        }
        .role-name {
            display: flex;
            align-items: center;
            gap: .62rem;
            color: var(--ink);
            font-size: 1.24rem;
            font-weight: 920;
            letter-spacing: -.035em;
        }
        .role-chip {
            border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
            background: var(--soft);
            color: var(--ink);
            border-radius: 999px;
            padding: .22rem .62rem;
            font-size: .78rem;
            font-weight: 850;
            white-space: nowrap;
        }
        .operation {
            color: #52525b;
            font-size: 1.02rem;
            line-height: 1.55;
            max-width: 850px;
        }
        .message-wrap {
            padding: 1.1rem 1.25rem 1.3rem 1.25rem;
            background: #fff;
        }
        .bubble {
            position: relative;
            border: 1px solid color-mix(in srgb, var(--accent) 22%, rgba(23,23,23,.10));
            border-left: 8px solid var(--accent);
            background: linear-gradient(180deg, #ffffff 0%, color-mix(in srgb, var(--soft) 26%, #ffffff) 100%);
            border-radius: 22px;
            padding: 1.05rem 1.1rem;
        }
        .bubble-content {
            white-space: pre-wrap;
            color: #1f2937;
            font-size: 1rem;
            line-height: 1.66;
        }
        .mini-history {
            margin-top: .9rem;
            color: #71717a;
            font-size: .84rem;
        }
        .history-row {
            display: grid;
            grid-template-columns: 82px 1fr;
            gap: .7rem;
            border-top: 1px solid rgba(23, 23, 23, .07);
            padding-top: .58rem;
            margin-top: .58rem;
        }
        .history-role {
            color: #52525b;
            font-weight: 850;
        }
        .history-text {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .side {
            padding: 1rem;
            min-height: 560px;
        }
        .active-agent {
            border-radius: 24px;
            padding: 1rem;
            background: var(--soft);
            border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
            color: var(--ink);
            margin-bottom: .85rem;
        }
        .agent-avatar {
            width: 52px;
            height: 52px;
            border-radius: 18px;
            display: grid;
            place-items: center;
            background: #fff;
            font-size: 1.7rem;
            margin-bottom: .65rem;
            box-shadow: 0 12px 28px rgba(24, 24, 27, .08);
        }
        .agent-label {
            font-size: 1.1rem;
            font-weight: 920;
            letter-spacing: -.03em;
        }
        .agent-caption {
            color: color-mix(in srgb, var(--ink) 72%, #ffffff);
            font-size: .88rem;
            line-height: 1.45;
            margin-top: .3rem;
        }
        .metric-grid {
            display: grid;
            gap: .55rem;
            margin-top: .8rem;
        }
        .metric-card {
            border: 1px solid var(--eduq-line);
            border-radius: 18px;
            padding: .72rem .8rem;
            background: rgba(255,255,255,.66);
        }
        .metric-label {
            color: #71717a;
            font-size: .75rem;
            font-weight: 850;
            text-transform: uppercase;
            letter-spacing: .08em;
        }
        .metric-value {
            color: #18181b;
            font-size: 1.2rem;
            font-weight: 920;
            letter-spacing: -.03em;
            margin-top: .1rem;
        }
        div[data-testid="stHorizontalBlock"]:has(.stProgress) {
            border: 1px solid var(--eduq-line);
            background: rgba(255,255,255,.66);
            border-radius: 24px;
            padding: .72rem;
            margin: .65rem 0 1rem 0;
            box-shadow: 0 18px 48px rgba(24, 24, 27, .055);
        }
        .stButton > button {
            border-radius: 999px;
            border: 1px solid rgba(24, 24, 27, .12);
            background: rgba(255,255,255,.85);
            color: #18181b;
            font-weight: 850;
        }
        .stButton > button:hover {
            border-color: rgba(79, 70, 229, .35);
            color: #3730a3;
        }
        .thin-note {
            color: #71717a;
            font-size: .88rem;
            line-height: 1.45;
        }
        @media (max-width: 1100px) {
            .timeline {
                display: none;
            }
            .hero {
                grid-template-columns: 1fr;
            }
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def escape_html(text: Any) -> str:
    value = "" if text is None else str(text)
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def style_for(kind: str) -> Dict[str, str]:
    return ROLE_STYLES.get(kind, ROLE_STYLES["framework"])


def render_header() -> None:
    st.markdown(
        """
        <div class="hero">
          <div>
            <div class="eyebrow">EducationQ framework demo</div>
            <h1 class="title">Multi-agent teaching, replayed live.</h1>
            <div class="subtitle">
              Mỗi bước tương ứng với một đoạn code path trong EducationQ:
              EvalManager chọn dữ liệu, StudentLLM làm pre/post-test,
              TeacherLLM tương tác thích ứng, và EvaluatorLLM chấm exact-match.
            </div>
          </div>
          <div class="live-pill"><span class="pulse"></span> Live replay mode</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_sidebar() -> Dict[str, Any]:
    with st.sidebar:
        st.header("Demo controls")
        max_chars = st.slider(
            "Message length",
            min_value=220,
            max_value=2400,
            value=950,
            step=50,
        )
        history_window = st.slider(
            "History hints",
            min_value=0,
            max_value=4,
            value=2,
            step=1,
        )
        autoplay_delay = st.slider(
            "Auto-play speed",
            min_value=0.5,
            max_value=3.0,
            value=1.15,
            step=0.05,
        )
        run_mode = st.radio(
            "Mode",
            ["Live replay", "API command"],
        )
        st.divider()
        if st.button("Reset", use_container_width=True):
            reset_simulation()
            st.rerun()

    return {
        "max_chars": max_chars,
        "history_window": history_window,
        "autoplay_delay": autoplay_delay,
        "run_mode": run_mode,
    }


@st.cache_data(show_spinner=False)
def load_sample_demo(result_path: str) -> Dict[str, Any]:
    teacher, student, question_id, episode = load_demo_episode(result_path)
    records = build_demo_records(episode)
    return {
        "teacher": teacher,
        "student": student,
        "question_id": question_id,
        "category": episode.get("category", ""),
        "events": build_simulation_events(records),
        "metrics": calculate_learning_gain(episode),
    }


def infer_stage(record: DemoRecord) -> str:
    role = record.get("role", "")
    if "DATASET" in role or "QUESTION" in role:
        return "Dataset"
    if "PRE-TEST RESPONSE" in role:
        return "Pre-test"
    if "PRE-TEST EXACT-MATCH" in role:
        return "Evaluate pre"
    if "INTERACTION" in role:
        return "Interaction"
    if "POST-TEST RESPONSE" in role or "POST-TEST CONTEXT" in role:
        return "Post-test"
    return "Learning gain"


def infer_action(record: DemoRecord) -> str:
    role = record.get("role", "")
    if role == "FRAMEWORK / DATASET":
        return "EvalManager loads a benchmark item and starts the pre-test phase."
    if role == "DATASET / QUESTION":
        return "A normalized multiple-choice question enters the framework."
    if role == "STUDENT / PRE-TEST RESPONSE":
        return "StudentLLM.take_test() answers with no interaction history."
    if role == "EVALUATOR / PRE-TEST EXACT-MATCH SCORE":
        return "Evaluator compares the parsed answer against the gold option."
    if role.startswith("TEACHER / INTERACTION"):
        return f"TeacherLLM.generate_question() creates adaptive turn {extract_turn(role)}."
    if role.startswith("STUDENT / INTERACTION"):
        return f"StudentLLM.answer_question() responds in turn {extract_turn(role)}."
    if role == "FRAMEWORK / POST-TEST CONTEXT":
        return "EvalManager attaches the full interaction_history for post-test."
    if role == "STUDENT / POST-TEST RESPONSE":
        return "StudentLLM.take_test() retries the same item with conversation context."
    if role == "EVALUATOR / POST-TEST EXACT-MATCH SCORE":
        return "Evaluator computes post-test exact-match correctness."
    if role == "FRAMEWORK / LEARNING-GAIN SUMMARY":
        return "Framework reports behavioral gain: post-test minus pre-test."
    return "Framework advances to the next event."


def extract_turn(role: str) -> str:
    match = re.search(r"TURN\s+(\d+)", role)
    return match.group(1) if match else "?"


def build_simulation_events(records: List[DemoRecord]) -> List[DemoRecord]:
    events: List[DemoRecord] = []
    for index, record in enumerate(records):
        event = dict(record)
        event["event_index"] = str(index + 1)
        event["stage"] = infer_stage(record)
        event["action"] = infer_action(record)
        events.append(event)
    return events


def ensure_state(event_count: int) -> None:
    if "eduq_step" not in st.session_state:
        st.session_state.eduq_step = 0
    if "eduq_playing" not in st.session_state:
        st.session_state.eduq_playing = False
    st.session_state.eduq_step = min(max(st.session_state.eduq_step, 0), max(event_count - 1, 0))


def reset_simulation() -> None:
    st.session_state.eduq_step = 0
    st.session_state.eduq_playing = False


def advance_step(event_count: int) -> None:
    if st.session_state.eduq_step < event_count - 1:
        st.session_state.eduq_step += 1
    else:
        st.session_state.eduq_playing = False


def rewind_step() -> None:
    st.session_state.eduq_playing = False
    st.session_state.eduq_step = max(st.session_state.eduq_step - 1, 0)


def metric_value(value: Any) -> str:
    if value is None:
        return "—"
    if isinstance(value, float):
        return f"{value:.2f}"
    return str(value)


def render_meta(demo: Dict[str, Any]) -> None:
    st.markdown(
        f"""
        <div class="meta-row">
          <span class="meta">Teacher <b>{escape_html(demo["teacher"])}</b></span>
          <span class="meta">Student <b>{escape_html(demo["student"])}</b></span>
          <span class="meta">Question <b>{escape_html(demo["question_id"])}</b></span>
          <span class="meta">Category <b>{escape_html(demo["category"])}</b></span>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_timeline(current_stage: str) -> None:
    active_index = PIPELINE_STAGES.index(current_stage) if current_stage in PIPELINE_STAGES else 0
    html = ['<div class="panel timeline"><div class="timeline-title">Pipeline</div>']
    for index, stage in enumerate(PIPELINE_STAGES):
        state = "active" if index == active_index else "done" if index < active_index else ""
        marker = "✓" if index < active_index else str(index + 1)
        html.append(
            f'<div class="step {state}">'
            f'<div class="step-dot">{escape_html(marker)}</div>'
            f'<div class="step-label">{escape_html(stage)}</div>'
            "</div>"
        )
    html.append("</div>")
    st.markdown("".join(html), unsafe_allow_html=True)


def render_controls(event_count: int) -> None:
    col1, col2, col3, col4 = st.columns([1, 1, 1, 2.4])
    with col1:
        if st.button("← Back", use_container_width=True, disabled=st.session_state.eduq_step == 0):
            rewind_step()
            st.rerun()
    with col2:
        label = "Pause" if st.session_state.eduq_playing else "Play"
        if st.button(label, use_container_width=True):
            st.session_state.eduq_playing = not st.session_state.eduq_playing
            st.rerun()
    with col3:
        if st.button(
            "Next →",
            use_container_width=True,
            disabled=st.session_state.eduq_step >= event_count - 1,
        ):
            advance_step(event_count)
            st.rerun()
    with col4:
        progress = (st.session_state.eduq_step + 1) / max(event_count, 1)
        st.progress(progress)
        st.caption(f"Step {st.session_state.eduq_step + 1} of {event_count}")


def render_main_event(events: List[DemoRecord], max_chars: int, history_window: int) -> None:
    step = st.session_state.eduq_step
    current = events[step]
    style = style_for(current.get("kind", "framework"))
    content = escape_html(truncate_text(current.get("content", ""), max_chars))
    history_html = build_history_html(events, step, history_window)

    st.markdown(
        f"""
        <div class="panel main-card" style="--accent:{style["accent"]}; --soft:{style["soft"]}; --ink:{style["ink"]};">
          <div class="main-head">
            <div class="role-line">
              <div class="role-name">{style["emoji"]} {escape_html(style["label"])}</div>
              <div class="role-chip">{escape_html(current.get("stage", ""))}</div>
            </div>
            <div class="operation">{escape_html(current.get("action", ""))}</div>
          </div>
          <div class="message-wrap">
            <div class="bubble">
              <div class="bubble-content">{content}</div>
            </div>
            {history_html}
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def build_history_html(events: List[DemoRecord], step: int, history_window: int) -> str:
    if history_window <= 0 or step == 0:
        return ""
    start = max(0, step - history_window)
    rows = ['<div class="mini-history">Recent context routed by EvalManager']
    for event in events[start:step]:
        style = style_for(event.get("kind", "framework"))
        preview = escape_html(truncate_text(event.get("content", ""), 190)).replace("\n", " ")
        rows.append(
            '<div class="history-row">'
            f'<div class="history-role" style="color:{style["accent"]};">'
            f'{escape_html(style["short"])}</div>'
            f'<div class="history-text">{preview}</div>'
            "</div>"
        )
    rows.append("</div>")
    return "".join(rows)


def render_side_panel(current: DemoRecord, metrics: Dict[str, Any], events: List[DemoRecord]) -> None:
    style = style_for(current.get("kind", "framework"))
    step = st.session_state.eduq_step
    unlocked_post = any("POST-TEST" in event.get("role", "") for event in events[: step + 1])
    unlocked_gain = any(
        event.get("role") == "FRAMEWORK / LEARNING-GAIN SUMMARY" for event in events[: step + 1]
    )

    post_value = metric_value(metrics.get("post_test_prediction")) if unlocked_post else "Waiting"
    gain_value = metric_value(metrics.get("learning_gain")) if unlocked_gain else "Waiting"

    st.markdown(
        f"""
        <div class="panel side">
          <div class="panel-title">Runtime status</div>
          <div class="active-agent" style="--accent:{style["accent"]}; --soft:{style["soft"]}; --ink:{style["ink"]};">
            <div class="agent-avatar">{style["emoji"]}</div>
            <div class="agent-label">{escape_html(style["label"])}</div>
            <div class="agent-caption">{escape_html(style["caption"])}</div>
          </div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-label">Current event</div>
              <div class="metric-value">{escape_html(current.get("event_index", ""))}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Pre-test prediction</div>
              <div class="metric-value">{escape_html(metric_value(metrics.get("pre_test_prediction")))}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Post-test prediction</div>
              <div class="metric-value">{escape_html(post_value)}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Learning gain</div>
              <div class="metric-value">{escape_html(gain_value)}</div>
            </div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_simulation(demo: Dict[str, Any], controls: Dict[str, Any]) -> None:
    events = demo["events"]
    ensure_state(len(events))
    current = events[st.session_state.eduq_step]

    render_meta(demo)
    render_controls(len(events))

    left, center, right = st.columns([0.9, 2.7, 1.25], gap="large")
    with left:
        render_timeline(current.get("stage", "Dataset"))
    with center:
        render_main_event(events, controls["max_chars"], controls["history_window"])
    with right:
        render_side_panel(current, demo["metrics"], events)

    if st.session_state.eduq_playing:
        time.sleep(controls["autoplay_delay"])
        advance_step(len(events))
        st.rerun()


def render_sample_mode(controls: Dict[str, Any]) -> None:
    try:
        demo = load_sample_demo(str(DEFAULT_RESULT_PATH))
    except Exception as exc:  # pragma: no cover - UI safety branch
        st.error("Could not load the sample EducationQ result JSON.")
        st.caption(f"Details: {exc}")
        st.markdown("Try: `python3 examples/demo_framework_transcript.py --max-chars 900`")
        return
    render_simulation(demo, controls)


def render_api_instruction() -> None:
    st.info(
        "Live replay dùng sample output nên không cần API key. "
        "Muốn chạy pipeline thật thì cập nhật config/model rồi chạy command này."
    )
    st.code("code examples/demo_minimal.yaml", language="bash")
    st.code(
        """api_key: ...
base_url: ...
model: ...""",
        language="yaml",
    )
    st.code(
        """cd src/run
python main.py --config ../../examples/demo_minimal.yaml --mode complete""",
        language="bash",
    )
    st.markdown(
        '<div class="thin-note">'
        "Khi seminar, nên dùng replay để ổn định; pipeline thật dùng để chứng minh "
        "EducationQ có thể chạy end-to-end với API provider."
        "</div>",
        unsafe_allow_html=True,
    )


def main() -> None:
    setup_page()
    render_header()
    controls = render_sidebar()
    if controls["run_mode"] == "API command":
        render_api_instruction()
    else:
        render_sample_mode(controls)


if __name__ == "__main__":
    main()
