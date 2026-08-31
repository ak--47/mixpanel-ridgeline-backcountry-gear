---
name: GitHub push authentication
description: How to push git to GitHub from this workspace using the Replit GitHub connection
---

Standard `git push` to GitHub fails auth here. Working pattern: use the Replit GitHub connection (add it via integrations if `not_added`), then use an ephemeral git credential helper script in /tmp that fetches the OAuth token at push time from `https://$REPLIT_CONNECTORS_HOSTNAME/api/v2/connection?include_secrets=true&connector_names=github` with header `X_REPLIT_TOKEN: repl $REPL_IDENTITY`, emitting `username=x-access-token` / `password=<token>`. Invoke with `git -c credential.helper='/tmp/gitcred/helper.sh' push ...`.

**Why:** No credentials are persisted in tracked files or .git/config; token is fetched fresh each push.

**How to apply:** Any time git needs to fetch/push against the GitHub `origin` remote (https://github.com/ak--47/mixpanel-ridgeline-backcountry-gear.git).

Note: task merges can wipe `.git/config` remotes — if `origin` is missing, re-add it with the URL above before fetching. If local main has only a patch-equivalent extra commit (check `git cherry origin/main main` for `-`), rebasing onto origin/main drops it safely and is equivalent to a fast-forward.
