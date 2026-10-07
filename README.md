# GTM Container Auditor

An independent working fork of the `gtm-audit-pro` package, prepared for adaptation to team and agency GTM audits and OpenAI, ChatGPT, and Codex workflows.

## Current baseline

This checkout preserves the upstream package, including its audit and autoresearch skills, Node.js runtime, tests, and Codex plugin manifest. It is a starting point for further adaptation; the agency workflow and ChatGPT integration are not yet implemented.

The current upstream runtime performs six static configuration checks: references, duplicates, naming, hygiene, legacy Universal Analytics tags, and folders. It can read a complete GTM export or a supported remote GTM target. It does not implement the earlier advertised 72-checkpoint scope. Configuration checks do not establish live firing, consent timing, conversion accuracy, or compliance. See [`UPSTREAM_README.md`](UPSTREAM_README.md) and the [audit skill](skills/gtm-audit-pro/SKILL.md) for current behavior and limits.

## Run the bundled runtime

Requires Node.js 22 or newer. No npm dependencies are required.

```sh
node skills/gtm-autoresearch-loop/scripts/runtime/cli.mjs --help
node --test skills/gtm-autoresearch-loop/scripts/runtime/test/*.test.mjs
```

Before auditing a container, read [`audit-integration.md`](skills/gtm-autoresearch-loop/references/audit-integration.md). Keep exports, credentials, configuration, and reports outside the plugin checkout. Never put access tokens in prompts, config files, or reports.

## Fork source

Source: [`Organized-AI/plugin-marketplace/gtm-audit-pro`](https://github.com/Organized-AI/plugin-marketplace/tree/main/gtm-audit-pro). The upstream skill package is distributed under the MIT License; see [`LICENSE`](LICENSE). The original package README is preserved at [`UPSTREAM_README.md`](UPSTREAM_README.md).

## Planned adaptation

- Define the agency audit workflow, client boundaries, and repeatable report format.
- Review the current audit dimensions and decide what additional checkpoints the team needs.
- Update the Codex integration and determine which ChatGPT workflows should be supported.
- Keep read-only auditing as the default and distinguish configuration evidence from live behavior.
