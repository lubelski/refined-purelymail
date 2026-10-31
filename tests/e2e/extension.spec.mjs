import { test as base, expect, chromium } from "@playwright/test";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
const html = await readFile("tests/fixtures/dashboard.html", "utf8");
const test = base.extend({
  // Playwright requires object destructuring even with no fixture dependencies.
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const profile = await mkdtemp(join(tmpdir(), "refined-purelymail-"));
    const extension = resolve("dist");
    const context = await chromium.launchPersistentContext(profile, {
      channel: "chromium",
      headless: true,
      args: [
        `--disable-extensions-except=${extension}`,
        `--load-extension=${extension}`,
      ],
    });
    // No credentials or real site traffic: fulfill navigation locally.
    await context.route("**/*", (route) =>
      route.request().isNavigationRequest()
        ? route.fulfill({ contentType: "text/html", body: html })
        : route.abort(),
    );
    try {
      await use(context);
    } finally {
      await context.close();
      await rm(profile, { recursive: true, force: true });
    }
  },
});
test("loads CSS through Chrome's manifest without external requests", async ({
  page,
}) => {
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("https://purelymail.com/account");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(247, 247, 251)",
  );
  await expect(page.locator("form")).toHaveCSS("border-radius", "14px");
  await expect(page.getByRole("button", { name: "Save" })).toHaveCSS(
    "background-color",
    "rgb(109, 63, 216)",
  );
  expect(requests).toEqual(["https://purelymail.com/account"]);
});
for (const url of [
  "https://example.org/",
  "https://webmail.purelymail.com/",
  "http://purelymail.com/",
]) {
  test(`does not inject on ${url}`, async ({ page }) => {
    await page.goto(url);
    await expect(page.locator("form")).toHaveCSS("border-radius", "0px");
  });
}
test("keyboard navigation and native form behavior survive styling", async ({
  page,
}) => {
  await page.goto("https://purelymail.com/account");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Account", exact: true }),
  ).toBeFocused();
  await expect(page.locator(":focus")).toHaveCSS("outline-style", "solid");
  await page.getByLabel("Email", { exact: true }).fill("new@example.test");
  await page.getByLabel("Plan").selectOption("Advanced");
  await page.getByLabel("Enabled").check();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page).toHaveURL(
    /\/saved\?email=new%40example.test&plan=Advanced&enabled=on$/,
  );
});
test("dark theme, reduced motion, and narrow layout", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("https://purelymail.com/account");
  await page.locator("html").evaluate((el) => (el.dataset.theme = "dark"));
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(18, 17, 23)",
  );
  await expect(page.locator("main")).toHaveCSS("padding", "16px");
  await expect(page.getByLabel("Email", { exact: true })).toHaveCSS(
    "transition-duration",
    "0s",
  );
  expect(
    await page
      .locator("html")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
});
