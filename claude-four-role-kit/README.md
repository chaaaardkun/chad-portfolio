# Four-role Claude Code frontend kit

Four concise role skills + four model-configured Claude Code subagents for Next.js App Router, React, TypeScript, and SCSS/component-library work.

## Installation

Copy the contents of `.claude/skills/` and `.claude/agents/` to your project's matching `.claude/` directories. If you already have subagents, keep them and add the corresponding name to each agent's `skills:` list rather than overwriting existing prompts.

Subagent skills are **preloaded**, so do not duplicate their instructions in the agent body. You can invoke a skill directly as `/lead-developer`, `/senior-developer`, `/junior-developer`, or `/qa-engineer`; a custom subagent is invoked by name through the Claude Code agent tool or through your orchestration workflow. They are not the same thing.

Do **not** add `disable-model-invocation: true` to a skill you want to preload with an agent's `skills:` field: Claude Code does not preload such skills.

## Recommended starting models

| Role | Model alias | Effort | Reason |
|---|---|---|---|
| Lead Developer | `sonnet` | `high` | Planning and triage |
| Senior Developer | `sonnet` | `medium` | Complex implementation |
| Junior Developer | `haiku` | `low` | Small, clear changes |
| QA Engineer | `sonnet` | `low` | Accurate review without excessive reasoning |

Promote Lead to `opus` / `high` for difficult architecture, and QA to `sonnet` / `medium` for visual comparisons, ambiguous failures, or accessibility issues. Promote Junior to `sonnet` / `medium` if Haiku repeatedly misses requirements; avoid multiple failed retries.

Models are set in `.claude/agents/*.md`, not in the SKILL.md files. These are provider-dependent aliases. Check `/model`, `/usage`, and `/context` in your environment. The `CLAUDE_CODE_EFFORT_LEVEL` environment variable overrides per-agent effort.

## Flow

`Lead plan -> assigned Senior or Junior -> QA -> targeted rework by same developer if needed -> QA retest -> Lead sign-off`

Lead plans and returns delegation contracts. This kit does **not** include an autonomous orchestration script, so your existing main session or workflow must invoke each agent. Avoid a full new lead or development pass on every QA finding.

Only delegate when separation actually helps. Tiny jobs may be cheaper with a single Sonnet pass than four agents repeatedly loading instructions and rereading the same files.

Use `HANDOFF_TEMPLATE.md` to keep context compact and reproduce failures. Optionally merge `PROJECT_RULES_SNIPPET.md` into an existing `CLAUDE.md` if it adds something missing; don't duplicate instructions already there.

## QA considerations

QA is configured without Write/Edit/NotebookEdit tools but may still use Bash or configured browser tooling to generate test artifacts. Do not treat this as a security boundary; for strict read-only behavior, enforce tool permissions and repository sandboxing separately.

If you use Playwright MCP, verify the QA agent can access it in your environment. Where tool access is limited, use Playwright CLI via Bash, or allow the specific MCP tools. Never claim a browser test ran unless it actually did.

## Next.js / component-library considerations

These skills do not hard-code framework APIs or test commands. They read actual versions, README docs, and scripts. Shared component changes should consider public exports, consuming apps, theme overrides, responsive behavior, accessibility, and versioning as applicable.

## Files

- `.claude/skills/{lead-developer,senior-developer,junior-developer,qa-engineer}/SKILL.md`
- `.claude/agents/{lead-developer,senior-developer,junior-developer,qa-engineer}.md`
- `HANDOFF_TEMPLATE.md`
- `PROJECT_RULES_SNIPPET.md`
