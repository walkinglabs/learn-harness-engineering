[English Version →](../../../en/projects/project-06-runtime-observability-and-debugging/)

> 관련 강의: [강의 11. 에이전트의 런타임을 관찰 가능하게 만들기](./../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) · [강의 12. 모든 세션의 끝에서 깔끔하게 핸드오프하기](./../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
> 템플릿 파일: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# 프로젝트 06. 완전한 에이전트 하네스 구축하기 (캡스톤)

## 해야 할 일

이 프로젝트는 캡스톤(capstone) 프로젝트입니다. 앞선 다섯 개의 프로젝트에서 학습한 모든 것을 조립하고, 전체 벤치마크(benchmark)를 실행한 다음, 품질이 유지 가능한지 확인하기 위해 정리 과정(cleanup pass)을 수행합니다.

완전한 제품 슬라이스(product slice)를 포괄하는 고정된 멀티 기능 작업 세트를 사용합니다. 문서 임포트, 인덱싱, 인용 기반 Q&A, 런타임 관찰 가능성, 그리고 가독성 있고 재시작 가능한 저장소 상태가 포함됩니다. 먼저 약한 하네스 베이스라인으로 실행하고, 이어서 가장 강력한 하네스로 실행한 다음, 정리 후 재실행합니다. 마지막으로 하네스 절제 실험(harness ablation experiment)을 수행합니다. 구성 요소를 하나씩 제거하면서 실제로 어떤 요소가 중요한지 확인합니다.

앞선 프로젝트들에서 개별적으로 효과를 확인한 메커니즘들이 함께 작동할 때 어떤 시너지를 만들어 내는지, 그리고 어떤 구성 요소를 제거했을 때 품질이 가장 크게 저하되는지 파악하는 것이 이 캡스톤의 핵심입니다.

## 도구

- Claude Code 또는 Codex
- Git
- Node.js + Electron
- 품질 문서 템플릿(quality document template)
- 평가자 루브릭(evaluator rubric)
- 앞선 다섯 개의 프로젝트에서 축적된 모든 하네스 구성 요소

## 하네스 메커니즘

완전한 하네스: 모든 메커니즘 + 관찰 가능성 + 절제 연구(ablation study)
