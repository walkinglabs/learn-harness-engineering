# Initializer Agent Playbook

Use this playbook for the first serious session in a repository, before
incremental feature work begins.

## Goal

Create a stable operating surface so later sessions can implement behavior
without re-deriving startup commands, current status, or task boundaries.

## Required Outputs

The initializer should leave behind at least these artifacts:

- a root instruction file such as `AGENTS.md` or `CLAUDE.md`
- a machine-readable feature surface such as `feature_list.json`
- a durable progress artifact such as `claude-progress.md`
- a standard startup helper such as `init.sh`
- an initial safe commit that captures the baseline scaffold

## Checklist

1. Define the standard startup path.
2. Define the standard verification path.
3. Create the progress log and record the starting state.
4. Decompose the work into explicit features with statuses.
5. Create the first clean baseline commit.

## Success Test

A fresh session with no prior chat context should be able to answer:

- what this repository does
- how to start it
- how to verify it
- what is unfinished
- what the next best step is
