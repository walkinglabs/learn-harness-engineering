[English Version →](../../../en/projects/project-05-grounded-qa-verification/)

> 관련 강의: [강의 09. 에이전트가 섣불리 완료를 선언하지 않도록 막기](./../../lectures/lecture-09-why-agents-declare-victory-too-early/index.md) · [강의 10. 완전한 파이프라인 실행만이 진정한 검증으로 인정됩니다](./../../lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
> 템플릿 파일: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# 프로젝트 05. 에이전트가 자신의 작업을 검증하도록 만들기

## 해야 할 일

역할 분리(role separation)를 구현합니다. 구현을 담당하는 생성자(generator), 검토를 담당하는 평가자(evaluator), 그리고 선택적으로 플래너(planner)를 만듭니다. 각 역할이 추가될 때마다 효과를 측정하기 위해 세 번 실행합니다.

에이전트가 구현과 검증을 동시에 담당하면 자신의 오류를 스스로 발견하기 어렵습니다. 독립된 평가자 역할을 분리하면 환각(hallucination)과 섣부른 완료 선언을 방지하고, 근거 기반(grounded) Q&A의 정확도를 높일 수 있습니다.

실질적인 기능 업그레이드(멀티턴 대화, 인용 패널 재설계, 또는 문서 필터링)를 선택하고 모든 실행에서 동일하게 유지합니다.

## 도구

- Claude Code 또는 Codex
- Git
- Node.js + Electron

## 하네스 메커니즘

자기 검증(self-verification) + 근거 기반 Q&A + 증거 기반 완료(evidence-based completion)
