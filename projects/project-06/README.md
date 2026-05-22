# Project 06: Complete Interview Debrief Harness Capstone

Build the complete Interview Debrief Coach product and the complete harness around it, then benchmark weak and strong harness runs.

## Directory Guide

| Directory | Meaning |
|------|------|
| `starter/` | Product is mostly usable, but the harness is intentionally weak and missing key restart / benchmark artifacts. |
| `solution/` | Reference implementation with full product, full harness, benchmark, cleanup scanner, evaluator rubric, and quality document. |

## How to Use

```sh
cd starter
npm install
# Run the weak-harness benchmark and record defects.

cd ../solution
npm install
./init.sh
npm run check
npm run test
npm run build
./scripts/benchmark.sh
./scripts/cleanup-scanner.sh
./scripts/check-architecture.sh
```

## Features Covered

- Import timestamped transcripts
- Optional audio-upload entry with mock transcription only
- Create and manage interview sessions
- Transcript timeline and speaker correction
- Follow-up chain analysis
- Technical depth gaps and project evidence gaps
- Speech issues, risk report, and training plan
- Timestamped evidence jumps and feedback
- Local storage, structured logs, benchmark, cleanup scanner

## Related Lectures

- [Lecture 11: Why Observability Belongs Inside the Harness](../../docs/en/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md)
- [Lecture 12: Why Every Session Must Leave a Clean State](../../docs/en/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
