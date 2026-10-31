# Contributing

Keep the extension CSS-only unless a documented feature genuinely needs JavaScript.
Do not add host permissions, remote fonts, analytics, or resource requests without
an explicit privacy and scope review. Avoid a framework/bundler until needed.

Use a task branch/worktree, keep the primary checkout on main, and submit changes
for review. Run `npm run check` before submitting. New behavior needs regression
coverage and real-page verification when selectors depend on Purelymail markup.
Never include account data or browser profiles in commits.

Source is in `extension/`; do not edit generated output or the reference ZIP.
Use `npm run format` for formatting. For releases, follow docs/RELEASING.md.

Report vulnerabilities privately to the maintainer using a verified contact
channel; do not post credentials or exploit details publicly. A public security
contact must be configured before launch.
