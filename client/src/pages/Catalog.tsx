import { ArrowRight, ArrowUpRight, Check, FileText, Layers3, Search } from "lucide-react";
import { Link } from "wouter";
import SiteLayout from "@/components/SiteLayout";

export const catalogFiles = [
  {
    code: "DSD / 01",
    status: "Office guide",
    title: "DS&D",
    summary: "A systems-design and research office that makes consequential details and shared rules readable.",
    href: "/about",
    action: "Read the office record",
    external: false,
  },
  {
    code: "PL / 02",
    status: "Product direction",
    title: "PayLock",
    summary: "A bounded reference path for named execution signals and readable delivery evidence—not payment processing.",
    href: "/paylock/catalog",
    action: "Read the PayLock catalog",
    external: false,
  },
  {
    code: "SSDD / 03",
    status: "Research & validation",
    title: "SSDD",
    summary: "Reference-model work on shared containment and event treatment with explicit evidence limits.",
    href: "/ssdd",
    action: "Read the research record",
    external: false,
  },
  {
    code: "HC / 04",
    status: "Research direction",
    title: "HC-CXL",
    summary: "A research direction examining difficult computing-system boundaries without hardware-readiness claims.",
    href: "/hc-cxl",
    action: "Read the research direction",
    external: false,
  },
];

export const deployedPlatforms = [
  {
    code: "YP / 05",
    status: "Production platform",
    title: "YPharma (منصة الدواء)",
    summary: "Official pharmaceutical governance platform for verifiable drug supply chain tracking, pharmacy network dispatching, and medicinal provenance.",
    href: "https://ypharma1.deterministicsolutionsdesign.com/",
    action: "Launch YPharma platform",
    external: true,
  },
  {
    code: "TR / 06",
    status: "Production platform",
    title: "Traveler (ترافلر)",
    summary: "Official dynamic travel operations engine delivering real-time route reservation, multi-modal itineraries, and ticketing coordination.",
    href: "https://traveler.deterministicsolutionsdesign.com/",
    action: "Launch Traveler platform",
    external: true,
  },
];

export const allCatalogFiles = [...catalogFiles, ...deployedPlatforms];

const readingRules = [
  { icon: <Search size={20} />, title: "Start with the burden", copy: "Name the friction people have learned to treat as fixed." },
  { icon: <Layers3 size={20} />, title: "Inspect the rule", copy: "Separate the consequential detail from the surrounding inherited process." },
  { icon: <Check size={20} />, title: "Keep the boundary", copy: "State what can be changed, what remains binding, and what can be tried safely." },
];

export default function Catalog() {
  return (
    <SiteLayout>
      <main className="catalog-page" id="main-content" tabIndex={-1}>
        <section className="catalog-hero">
          <div className="container catalog-hero-grid">
            <div>
              <div className="eyebrow reference-product-eyebrow">DS&amp;D / explanatory catalog</div>
              <p className="catalog-overline">System files for details that shape a shared outcome.</p>
              <h1>Read the problem<br /><em>before you inherit it.</em></h1>
              <p className="catalog-lead">This catalog explains how DS&amp;D reads work: not by assuming that every difficult condition can disappear, but by making the detail, the rule, and the next safe shared action inspectable.</p>
              <div className="catalog-actions">
                <a className="reference-button reference-button-primary" href="#files">Open system files <ArrowRight size={16} /></a>
                <Link className="reference-button reference-button-text" href="/contact">Start an inquiry <ArrowUpRight size={15} /></Link>
              </div>
            </div>
            <div className="catalog-reference-board" aria-label="DS&D catalog reading system">
              <span>OBSERVED DETAIL</span>
              <div className="catalog-board-routes"><i /><i /><i /></div>
              <div className="catalog-board-point"><b /></div>
              <strong>SHARED REFERENCE</strong>
              <small>BOUNDARY / ACTION / RECORD</small>
            </div>
          </div>
        </section>

        <section className="catalog-reading section">
          <div className="container">
            <div className="catalog-section-head">
              <div>
                <span className="section-index">01 / How to read this catalog</span>
                <h2>Clarity before<br /><em>complexity.</em></h2>
              </div>
              <p>DS&amp;D works in the space between a burden that looks compulsory and the smaller safe intervention that becomes visible once the actual constraint is named.</p>
            </div>
            <div className="catalog-reading-grid">
              {readingRules.map((rule, index) => (
                <article key={rule.title}>
                  <span>0{index + 1}</span>
                  {rule.icon}
                  <h3>{rule.title}</h3>
                  <p>{rule.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="catalog-files section" id="files">
          <div className="container">
            <div className="catalog-section-head">
              <div>
                <span className="section-index">02 / System files</span>
                <h2>Different work.<br /><em>Clearer claims.</em></h2>
              </div>
              <p>Every file identifies its present role. Product direction, reviewed behavior, validation, and research are never presented as interchangeable states.</p>
            </div>
            <div className="catalog-file-grid">
              {allCatalogFiles.map((file) => (
                <article key={file.code}>
                  <div className="catalog-file-top">
                    <span>{file.code}</span>
                    <b>{file.status}</b>
                  </div>
                  <h3>{file.title}</h3>
                  <p>{file.summary}</p>
                  {file.external ? (
                    <a href={file.href} target="_blank" rel="noreferrer">
                      {file.action} <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <Link href={file.href}>
                      {file.action} <ArrowRight size={14} />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="catalog-boundary section">
          <div className="container">
            <FileText size={24} />
            <div>
              <span className="section-kicker">Reading boundary</span>
              <h2>Evidence does not decorate a claim.<br /><em>It sets its edge.</em></h2>
            </div>
            <p>For the source records, technical library, and current readiness statements, inspect the evidence file directly. Where the record stops, DS&amp;D says so.</p>
            <Link href="/technical-library">Open the technical library <ArrowUpRight size={15} /></Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
