# AGENTS.md

Instructions for ANY AI coding agent working in this repository (Codex, Cursor, Gemini CLI, Copilot, etc. — Claude Code loads the same content via `CLAUDE.md`).

**Before writing or editing any code, read these files in full. They are binding.**

1. **`THINKING.md`** — operating discipline: define done first, read files plus a caller before editing, verify by demonstrated output (never "it should work"), test failure paths as a non-admin user, lead summaries with the outcome and failures at the top, finish the work instead of promising it.
2. **`PLAYBOOK.md`** — this repo's specific patterns, traps, and non-obvious facts. If it does not exist yet, this repo's specifics are undocumented — read the code you touch extra carefully and copy existing patterns exactly.

On conflict: the owner's live instruction > `PLAYBOOK.md` > `THINKING.md` > general best practice.

Hard rules that apply even if you read nothing else: never commit or push unless explicitly asked; never `git add -A` or `git checkout .`; never print, copy, or commit secrets (`.env*`, tokens, cookies); never introduce a new architectural pattern as a side effect of a fix.

Enforcement: this repo carries **git-level guards** that fire for every tool and human — `.git/hooks/pre-commit` blocks commits that stage secret files, and `.git/hooks/pre-push` blocks all pushes unless the owner sets `ALLOW_PUSH=1`. Never set `ALLOW_PUSH` yourself and never bypass a guard (`--no-verify`, repointing `core.hooksPath`); a blocked command is policy, not an error — report it to the owner instead. (`GEMINI.md` is a symlink to this file for Gemini CLI; `.github/copilot-instructions.md` points Copilot here.)
