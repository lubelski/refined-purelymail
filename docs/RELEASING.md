# Release checklist

Publishing is manual. CI produces candidate artifacts; it does not publish them.

## Before the first release

- [ ] Select a license and verify rights to the original ZIP and all assets.
- [ ] Configure the GitHub remote, enable Actions, and require the CI job in branch protection.
- [ ] Validate actual authenticated pages using [TESTING.md](TESTING.md).
- [ ] Confirm styling stays within `/manage` and its child paths; public/login
      pages and subdomains must remain unchanged.
- [ ] Resolve accessibility findings, including contrast and forced-color behavior.
- [ ] Create original extension icons (16/32/48/128px), add manifest entries, extend
      the build allowlist and package tests, and verify the installed appearance.
      Icons are intentionally not invented or borrowed from Purelymail here.
- [ ] Prepare accurate store copy, sanitized screenshots, promotional graphics,
      support URL/contact, and an explicit unofficial/non-affiliation statement.
- [ ] Review and publish [PRIVACY.md](../PRIVACY.md) at a stable public HTTPS URL.
- [ ] Register/configure the Chrome Web Store developer account and complete its
      current privacy, single-purpose, host-access, and distribution declarations.
      The extension applies local styles only; do not claim to fix unimplemented workflows.
- [ ] Review the full development dependency audit. Current moderate findings concern
      minimatch through ESLint (GHSA-g3hv-75wg-m249); no dependencies ship in the ZIP.
      Do not blindly run `npm audit fix --force` (it proposes obsolete ESLint).
- [ ] Recheck current store requirements; this checklist is not approval from Google.

## Each release

1. Update the version in both `extension/manifest.json` and `package.json`, refresh
   the lockfile with `npm install --package-lock-only`, and update CHANGELOG.md.
2. From a clean checkout: `npm ci`, install Chromium, then `npm run package`.
3. Verify CI and the manual Chrome checks. Inspect the ZIP contents; manifest must
   be at root and only runtime assets present.
4. Upload the verified ZIP from `artifacts/` manually to the developer dashboard.
   Review listing/disclosures and submit only after owner approval.
5. Record the submitted version and commit; tag the approved release. Retain the artifact.
6. If a release breaks pages, advise disabling the extension. Ship a fixed or
   reverted stylesheet with a **higher** version; do not reuse an uploaded version.

## Official references

- [Prepare your extension](https://developer.chrome.com/docs/webstore/prepare)
- [Publish](https://developer.chrome.com/docs/webstore/publish)
- [Listing guidance](https://developer.chrome.com/docs/webstore/best_listing)
- [Privacy policies](https://developer.chrome.com/docs/webstore/program-policies/privacy)
