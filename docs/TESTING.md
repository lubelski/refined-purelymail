# Testing strategy

## Automated

Run `npm ci && npx playwright install chromium && npm run check`.
On Linux, use `npx playwright install --with-deps chromium`.

Browser tests intercept all navigation with synthetic HTML and abort other
requests. This makes CI independent of accounts, credentials, network conditions,
and live service availability. It also means passing tests **do not establish
compatibility with current Purelymail HTML**.

Add regression fixtures and assertions whenever a selector or interaction changes.
Include form-table layouts, long domains, validation errors, disabled controls,
and dense lists as real-page coverage is developed. Do not silently update
expectations just to make failing tests pass.

For failures: `npx playwright show-report`; traces are retained on failures
(`npx playwright show-trace <trace.zip>`). Never upload real account traces.

## Before release

Use a dedicated test account and unpacked extension in Chrome:

- Compare enabled/disabled on sign-in, account settings, users, domains, routing,
  billing, and public pages. Check that destructive controls and warnings remain clear.
- Verify tab order, visible focus, keyboard-only selection and submission, native
  validation, reset, checkboxes, disabled/read-only fields, and error messages.
- Check 320px/mobile and desktop widths, 200% zoom, long addresses and domains,
  table overflow, light/dark page themes, reduced motion, and forced colors.
- Check text and control contrast (including dark-theme purple buttons), accessible
  names, and screen-reader announcements. Current tests are not an accessibility audit.
- Confirm webmail/subdomains and unrelated sites remain unchanged.
- Inspect browser console and network with the extension enabled/disabled.
- Reload, update, disable, and remove the extension; ensure native behavior returns.

Record Chrome version, pages checked, findings, and sanitized screenshots with the
release. Never commit credentials, cookies, account exports, or real customer data.

Next testing milestone: obtain sanitized real dashboard markup with permission,
add representative fixtures and reviewed visual baselines in a pinned Linux browser
environment. Synthetic screenshot baselines alone would provide false confidence.
