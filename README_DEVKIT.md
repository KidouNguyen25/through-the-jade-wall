# AI Development Kit contents

This archive is intentionally documentation-first. Copy its contents into the project root before starting the autonomous agent.

Most important files:

- `MASTER_PROMPT.md` — operational instruction for the autonomous AI;
- `current_project_task.md` — single active work order;
- `PROJECT_MANIFEST.yaml` — machine-readable project constraints;
- `GAME_BIBLE.md` / `NARRATIVE_BIBLE.md` — creative source of truth;
- `TECHNICAL_ARCHITECTURE.md` — code boundaries;
- `ENGINEERING_STANDARDS.md` — coding rules;
- `GIT_GITHUB_WORKFLOW.md` — branch/commit/PR/deploy discipline;
- `QUALITY_GATES.md` — completion requirements;
- `AUTONOMOUS_EXECUTION_PROTOCOL.md` — long-run behavior;
- `ROADMAP.md` — milestone order.

Recommended autonomous invocation pattern:

1. Put these files in the empty project directory.
2. Give the coding AI the instruction:
   `Read START_HERE.md and execute current_project_task.md autonomously. Follow MASTER_PROMPT.md exactly.`
3. The AI should then bootstrap the repository rather than being fed a giant one-off implementation prompt.

The kit deliberately prevents the agent from trying to build the entire game in one run.
