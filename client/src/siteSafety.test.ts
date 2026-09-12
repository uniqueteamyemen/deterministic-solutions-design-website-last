import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("public-site safety and discoverability regressions", () => {
  it("keeps production error details out of the public error state", () => {
    const boundary = readProjectFile("client/src/components/ErrorBoundary.tsx");
    expect(boundary).toContain("import.meta.env.DEV && this.state.error?.stack");
  });

  it("defines canonical, social-sharing, icon, and no unresolved analytics markup", () => {
    const html = readProjectFile("client/index.html");
    expect(html).toContain('rel="canonical" href="https://deterministicsolutionsdesign.com/"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('name="twitter:card"');
    expect(html).toContain('rel="icon"');
    expect(html).not.toContain("%VITE_ANALYTICS_ENDPOINT%");
  });

  it("provides visible keyboard focus, skip navigation, and selected-state semantics", () => {
    const css = readProjectFile("client/src/index.css");
    const home = readProjectFile("client/src/pages/Home.tsx");
    const paylock = readProjectFile("client/src/pages/PayLock.tsx");
    expect(css).toContain(":focus-visible");
    expect(css).toContain(".button-outline");
    expect(home).toContain('className="skip-link"');
    expect(home).toContain('aria-selected={activeState === index}');
    expect(paylock).toContain('aria-selected={activeStage === index}');
  });

  it("keeps the new explanatory catalogs accessible and PayLock visibly bounded", () => {
    const catalog = readProjectFile("client/src/pages/Catalog.tsx");
    const paylockCatalog = readProjectFile("client/src/pages/PayLockCatalog.tsx");
    const paylockMark = readProjectFile("client/src/components/PayLockMark.tsx");
    expect(catalog).toContain('id="main-content"');
    expect(catalog).toContain('Read the problem');
    expect(paylockCatalog).toContain('does not move money');
    expect(paylockCatalog).toContain('Reference mark / SVG');
    expect(paylockMark).toContain("It intentionally avoids lock and payment imagery.");
  });

  it("preserves active-route orientation, anchored-section clearance, and reduced-motion support", () => {
    const layout = readProjectFile("client/src/components/SiteLayout.tsx");
    const css = readProjectFile("client/src/index.css");
    expect(layout).toContain('aria-current={isCurrent("/catalog") ? "page" : undefined}');
    expect(layout).toContain('isCurrent("/paylock") || isCurrent("/paylock/catalog")');
    expect(css).toContain('scroll-margin-top:96px');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
