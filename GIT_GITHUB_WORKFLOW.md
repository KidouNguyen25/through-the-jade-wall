# GIT & GITHUB WORKFLOW

## Branch model

Use a simple trunk-based model with short-lived branches.

Protected:

- `main`

Working branches:

- `feat/<scope>-<short-name>`
- `fix/<scope>-<short-name>`
- `refactor/<scope>-<short-name>`
- `chore/<scope>-<short-name>`
- `docs/<short-name>`

Examples:

- `feat/mahjong-sequence-gate`
- `fix/camera-wall-clipping`

## Main branch rule

`main` must remain deployable.

After bootstrap:

- no routine feature pushes directly to `main`;
- changes reach `main` through a reviewed/verified PR when platform capability allows;
- required checks must pass.

GitHub supports protected branches/rulesets and required status checks. Configure them when account/repository capabilities allow.

## Commit convention

Use Conventional Commits:

`<type>(<scope>): <imperative summary>`

Types:

- feat
- fix
- refactor
- perf
- test
- docs
- build
- ci
- chore

Examples:

- `feat(puzzle): resolve suited tile sequences`
- `perf(world): instance repeated lantern meshes`
- `fix(save): migrate discarded memory flags`
- `ci(pages): deploy verified production build`

## Commit rules

- coherent reason to change;
- do not mix unrelated refactors with feature behavior;
- tests and implementation can be in the same coherent commit;
- no generated build output unless deployment strategy explicitly requires it;
- no credentials;
- no vague messages such as `update`, `fix stuff`, `changes`.

## Pull request standard

PR body:

### Problem

What player/engineering problem is being solved?

### Solution

What changed?

### Acceptance criteria

- [ ] ...

### Verification

Commands executed and results.

### Visual evidence

Screenshot/video note when UI/3D appearance changes.

### Risk

Known limitations, migration concerns, performance risk.

## Required CI checks

Minimum:

- install from lockfile;
- formatting check;
- lint;
- typecheck;
- unit test;
- production build.

Add Playwright smoke test when the first runnable scene exists.

## Repository rules

Target rules for `main`:

- prevent force pushes;
- prevent deletion;
- require PR before merge where available;
- require CI status checks;
- require branch to be current if chosen policy needs it;
- use linear history if it does not obstruct the solo workflow.

For a solo autonomous repository, do not create bureaucratic review requirements that no actor can satisfy. CI is the primary gate.

## GitHub Actions security

- grant only required `permissions`;
- avoid broad write tokens;
- prefer immutable references for third-party Actions;
- do not expose secrets to untrusted PR code;
- deployment job gets Pages-specific permissions only.

## GitHub Pages

Deploy only a verified production artifact.
Recommended flow:

`push/PR -> CI`
`merge to main -> CI -> build -> Pages deploy`

GitHub Pages supports custom GitHub Actions deployment workflows.

## Release tags

For meaningful public milestones:

- `v0.1.0` vertical-slice internal
- `v0.2.0` vertical-slice public
- `v1.0.0` complete first game

Do not tag failing or unreproducible builds.
