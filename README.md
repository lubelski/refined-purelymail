# Refined Purelymail

An independent, unofficial Chrome extension that refines the appearance of
[Purelymail](https://purelymail.com/). Not affiliated with or endorsed by Purelymail.

**Status: development foundation, not yet Web Store ready.** The original prototype
is preserved in `reference/refined-purelymail.zip`.

## Scope

A Manifest V3, CSS-only extension for `https://purelymail.com/manage` and its child paths (including query strings). It improves
spacing, forms, tables, and keyboard focus without replacing native controls.
It does not change account logic or fix workflow behavior. Subdomains (including
webmail) and HTTP are intentionally excluded. There is no background worker,
runtime JavaScript, telemetry, storage, or remote font/resource loading.

The prototype's selectors have not yet been validated against an authenticated
dashboard. The dark palette activates only when the page sets `data-theme="dark"`;
this extension does not implement a theme switch.

## Develop

Use Node 24 LTS (see `.nvmrc`) and npm.

```sh
npm ci
npx playwright install chromium
npm run build
```

Open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**,
and select this checkout's **dist/** directory. After editing `extension/`, rebuild,
reload the extension, and refresh the page.

## Checks and packaging

```sh
npm run check       # lint, formatting, unit and real-extension browser tests
npm run format      # apply formatting
npm run package     # all checks, then a clean ZIP build
```

Output: `artifacts/refined-purelymail-0.1.0.zip`. The manifest is at the archive
root. Only explicitly allowlisted runtime assets are packaged; dependencies and
reference files never ship. `npm run build` is the faster, unchecked local build.

- Unit tests enforce MV3, version consistency, host scope, no remote CSS resources,
  and byte-identical packaging across repeated builds.
- Playwright launches a persistent Chromium profile with the **built extension**,
  not a manually injected stylesheet. Offline synthetic fixtures cover injection,
  nonmatching hosts, native form submission, keyboard focus, dark styling,
  reduced motion, and mobile overflow.
- Fixtures are **not real dashboard captures**, and these checks are not a complete
  accessibility or visual regression audit. No authenticated site is contacted.
- GitHub Actions runs the same checks and uploads ZIP/report artifacts. A workflow
  is included, but no remote is configured yet.

See [testing guidance](docs/TESTING.md), [release checklist](docs/RELEASING.md),
[privacy policy draft](PRIVACY.md), and [contributing](CONTRIBUTING.md).

## Layout

- `extension/`: shipping source; manifest version is kept in sync with package.json.
- `scripts/`: minimal deterministic Node packaging; no bundler needed.
- `tests/`: package policy tests and offline browser fixtures.
- `reference/`: original ZIP, provenance only; do not edit or ship.
- `dist/`, `artifacts/`: generated and ignored.

No open-source license has been selected yet. Choose one before public distribution.
