# AUTONOMOUS EXECUTION PROTOCOL

## Purpose

Define how an AI agent works for long periods without accumulating uncontrolled technical debt.

## Work unit

One autonomous work unit should deliver one verifiable outcome.

Bad:
"Build the game."

Good:
"Implement deterministic Mahjong sequence resolver, unit tests, and one East Arcade gate using it."

## Task decomposition

For the active milestone:

1. identify dependencies;
2. split into thin vertical slices;
3. order by risk;
4. implement the smallest end-to-end path first;
5. expand only after the path is working.

## Risk-first rule

Prototype high-risk unknowns early:

- browser 3D performance;
- collision/camera;
- impossible-space transition;
- state persistence;
- deployment base path.

Do not spend days on lore UI before proving the game loop.

## Autonomous agent roles

A single model may perform all roles sequentially, but it must conceptually separate them:

### Planner

Defines outcome and acceptance criteria.

### Implementer

Writes minimal maintainable code.

### Reviewer

Reviews diff without assuming implementation is correct.

### Tester

Runs gates and reproduces player flow.

### Release engineer

Commits, pushes, PRs, deploys.

A role must not waive another role's gate merely because all roles are performed by one AI.

## Work log

Maintain `WORKLOG.md`.
Each run appends:

- date/time if known;
- starting commit;
- active task;
- decisions;
- tests;
- resulting commit(s);
- blocker, if any.

Keep it concise.

## External actions

When authenticated GitHub operations are available:

- execute them.
  When unavailable:
- do not pretend.
- leave repository locally ready.
- record exact command/action required.

## Handling dirty working trees

Before changes:

- inspect status;
- identify whether changes are user work or previous agent work;
- never reset/delete unknown changes casually;
- isolate new work or commit/stash only when ownership and intent are clear.

## Conflict policy

Resolve conflicts semantically.
After resolution:

- rerun affected tests;
- inspect both sides' behavior;
- never choose `ours`/`theirs` wholesale without understanding.

## Refactoring policy

Refactor when:

- needed for current feature;
- removing demonstrated duplication;
- fixing a performance/maintainability issue;
- enabling testability.

Do not perform repository-wide style churn during feature delivery.

## Asset generation policy

AI may create original procedural placeholders.
For external assets:

- use CC0/public domain or properly licensed material;
- record provenance;
- do not download commercial game/movie assets.

## Failure policy

If a test fails:

1. reproduce;
2. determine whether failure is caused by current change;
3. fix root cause;
4. rerun;
5. never simply disable the test unless the requirement itself is invalid and documented.

## Scope guard

When tempted to add a feature, ask:
"Does this directly improve the current milestone acceptance criteria?"
If no, put it in backlog.

## Completion report template

- Task:
- Branch:
- Commits:
- Acceptance criteria:
- Verification:
- Player-visible result:
- Technical debt introduced:
- Open risks:
- Remote status:
