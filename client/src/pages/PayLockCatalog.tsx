import { ArrowRight, ArrowUpRight, Check, FileCheck2, Fingerprint, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import PayLockMark from "@/components/PayLockMark";
import SiteLayout from "@/components/SiteLayout";

export const paylockCatalogSections = [
  { no: "01", label: "Named event", title: "Bind the request", copy: "The current reviewed Core path forms H0 from the scoped request and a system-issued serial." },
  { no: "02", label: "Shared meaning", title: "Read the signals", copy: "An integration defines what provider readiness and user unlock mean for its own service context." },
  { no: "03", label: "Guarded proof", title: "Issue the record", copy: "The current named signals guard technical H1 issuance. H1 is delivery evidence only." },
];

const boundaries = [
  { icon: <Check size={19} />, title: "What PayLock is", copy: "A product direction for named execution signals and a readable proof path." },
  { icon: <ShieldCheck size={19} />, title: "What PayLock is not", copy: "A payment system, funds custodian, delivery provider, or substitute for a provider’s policy." },
  { icon: <Fingerprint size={19} />, title: "What remains integration-specific", copy: "Event authentication, delivery-ready semantics, access controls, and the provider’s operating decisions." },
];

export default function PayLockCatalog() {
  return (
    <SiteLayout>
      <main className="catalog-page paylock-catalog-page" id="main-content" tabIndex={-1}>
        <section className="catalog-hero paylock-catalog-hero">
          <div className="container catalog-hero-grid">
            <div>
              <div className="eyebrow reference-product-eyebrow">PayLock / explanatory catalog</div>
              <p className="catalog-overline">Named execution signals. Readable proof path.</p>
              <h1>One event.<br /><em>One readable reference.</em></h1>
              <p className="catalog-lead">PayLock gives an agreed execution path a more legible record. It does not move money or replace provider, delivery, or access policy; it makes the named evidence boundary inspectable.</p>
              <div className="catalog-actions"><Link className="reference-button reference-button-primary" href="/paylock">Open the product file <ArrowRight size={16} /></Link><a className="reference-button reference-button-text" href="#path">Read the proof path <ArrowDown size={15} /></a></div>
            </div>
            <div className="paylock-catalog-mark-panel"><PayLockMark label="PayLock event reference mark" /><span>EVENT</span><i /><span>REFERENCE</span><i /><span>PROOF</span><small>AGREED SIGNAL / READABLE STATE</small><a className="paylock-mark-download" href="/paylock-reference-mark.svg" target="_blank" rel="noreferrer">Reference mark / SVG <ArrowUpRight size={13} /></a></div>
          </div>
        </section>

        <section className="catalog-reading section" id="path"><div className="container"><div className="catalog-section-head"><div><span className="section-index">01 / The current proof path</span><h2>Bind. Declare.<br /><em>Prove.</em></h2></div><p>The catalog records the current reviewed Core behavior and distinguishes it from the integration work that remains necessary for provider-specific use.</p></div><div className="paylock-catalog-path">{paylockCatalogSections.map((section) => <article key={section.no}><span>{section.no}</span><small>{section.label}</small><h3>{section.title}</h3><p>{section.copy}</p></article>)}</div></div></section>

        <section className="paylock-catalog-boundaries section"><div className="container"><div className="catalog-section-head"><div><span className="section-index">02 / Scope discipline</span><h2>Keep the claim<br /><em>inside the boundary.</em></h2></div><p>PayLock becomes trustworthy by making responsibilities explicit, rather than implying a broader commercial or delivery outcome than the evidence supports.</p></div><div className="paylock-boundary-grid">{boundaries.map((boundary) => <article key={boundary.title}>{boundary.icon}<h3>{boundary.title}</h3><p>{boundary.copy}</p></article>)}</div></div></section>

        <section className="catalog-boundary paylock-catalog-next section"><div className="container"><FileCheck2 size={24} /><div><span className="section-kicker">Where to inspect next</span><h2>Read the source.<br /><em>Keep open work visible.</em></h2></div><p>The product file holds the reviewed Core path, current evidence boundary, lifecycle, and linked source records. A required provider-to-access contract remains distinct from that reviewed behavior.</p><Link href="/paylock">Open PayLock product file <ArrowUpRight size={15} /></Link></div></section>
      </main>
    </SiteLayout>
  );
}

function ArrowDown({ size }: { size: number }) { return <span aria-hidden="true" style={{ fontSize: size, lineHeight: 1 }}>↓</span>; }
