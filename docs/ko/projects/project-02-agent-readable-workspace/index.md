[English Version →](../../../en/projects/project-02-agent-readable-workspace/)

> 관련 강의: [강의 03. 저장소를 단일 진실 원천으로 만들기](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [강의 04. 지침을 여러 파일로 분리하기](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> 템플릿 파일: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# 프로젝트 02. 프로젝트를 읽기 쉽게 만들고 중단된 곳에서 재개하기

## 해야 할 일

새로운 에이전트(agent)가 프로젝트 구조를 빠르게 파악하고, 현재 진행 상황을 이해하며, 작업을 이어받을 수 있도록 저장소에 "가독성(readability)"을 추가합니다. 구체적으로는 문서 임포트(import), 문서 상세 보기, 로컬 퍼시스턴스(persistence)를 구현하며, 두 세션에 걸쳐 완성합니다.

두 번 실행합니다. 첫 번째는 아무런 도움 없이, 두 번째는 `ARCHITECTURE.md`, `PRODUCT.md`, `session-handoff.md`를 저장소에 미리 배치한 상태로 진행합니다.

에이전트는 컨텍스트 윈도(context window)가 초기화되면 이전 작업 흐름을 기억하지 못합니다. 세션 핸드오프(session handoff) 파일을 통해 이전 세션의 상태(state)를 영속화하면, 새 세션의 에이전트도 동일한 진행 지점에서 출발할 수 있습니다.

## 도구

- Claude Code 또는 Codex
- Git
- Node.js + Electron

## 하네스 메커니즘

에이전트 가독성 있는 작업 공간 + 영속 상태 파일(persistent state files)
