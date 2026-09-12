import { ArrowLeft, ArrowUpRight, BookOpen, Check, ShieldCheck } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

type LibraryRecord = {
  id: string;
  index: string;
  className: string;
  status: string;
  title: string;
  copy: string;
  facts: { value: string; label: string }[];
  boundary: string;
  route: { href: string; label: string };
  excerpt?: {
    label: string;
    checks: { result: string; label: string }[];
    scope: string;
  };
};

export const libraryRecords: LibraryRecord[] = [
  {
    id: "ssdd-gem5-baseline",
    index: "01",
    className: "SIMULATION ARTIFACT",
    status: "COMPLETED / MODEL-SCOPED",
    title: "SSDD gem5 reference replay baseline",
    copy: "A portable five-stage, seven-engine logical workload was run twice in gem5 25.1.0.1 under the same X86 syscall-emulation configuration. The runs produced the same canonical replay output and an accepted reference-workload validation result.",
    facts: [
      { value: "2 / 2", label: "matching simulator runs" },
      { value: "35", label: "operations per run" },
      { value: "ff05ec2371488ba1", label: "matching replay digest" },
      { value: "308,777,000", label: "simulated ticks per run" },
    ],
    boundary: "This record demonstrates repeatability for the selected workload, compiler, gem5 revision, configuration, and inputs. It is not hardware validation, CXL traffic validation, security certification, or a production-readiness result.",
    route: { href: "/ssdd", label: "Read SSDD validation framing" },
  },
  {
    id: "ssdd-controlled-matrix",
    index: "02",
    className: "SIMULATION ARTIFACT",
    status: "COMPLETED / MODEL-SCOPED",
    title: "SSDD controlled latency and fault matrix",
    copy: "The same five-stage, seven-engine reference workload was executed under 10 ns, 50 ns, and 100 ns fixed-memory-latency settings. Five 50 ns replays were accepted with the same canonical digest. A one-bit proof mutation at trace records 1, 18, and 35 was rejected in each of two repeated runs per position.",
    facts: [
      { value: "5 / 5", label: "matching 50 ns replays" },
      { value: "3", label: "fixed latency cases" },
      { value: "6 / 6", label: "proof mutations rejected" },
      { value: "ff05ec2371488ba1", label: "accepted replay digest" },
    ],
    boundary: "The matrix measures simulated ticks and validator outcomes for this fixed workload and configuration. It does not measure physical memory latency, actual CXL traffic, an operational fault rate, cryptographic strength, or end-to-end production resilience.",
    route: { href: "/ssdd", label: "Inspect the controlled SSDD matrix" },
  },
  {
    id: "ssdd-prehardware",
    index: "03",
    className: "REFERENCE VALIDATION",
    status: "COMPLETED / MODEL-SCOPED",
    title: "SSDD pre-hardware deterministic verification",
    copy: "A retained reference suite translated the supplied SSDD specification, implementation manual, and prototype roadmap into an ordering, 100-epoch replay, fault-containment, ledger-forensics, Q32.32, cross-language, scaling, and load record. It retains 8→128 logical-node and 1k→100k events/s-equivalent matrices with component timings; these are native-reference wall-clock and modeled-byte records, not network or hardware measurements. The native-reference suite and the earlier gem5 fixture remain separate, explicitly scoped evidence domains.",
    facts: [
      { value: "128 / 128", label: "random arrivals, one ordered batch" },
      { value: "100 / 100", label: "independent replay chain entries" },
      { value: "4 / 4", label: "ledger modifications detected" },
      { value: "4 / 4", label: "fault cases preserve last valid state" },
      { value: "100 / 100", label: "Python / Rust reference chain hashes" },
      { value: "9 / 9", label: "Q32.32 boundary outcomes" },
    ],
    boundary: "The suite exercises retained software references and modeled controls. It is not a hardware, firmware, CXL, NIC-bandwidth, cluster-resilience, security, or production-readiness result. The Rust comparison is a retained reference because no supplied Rust implementation was available; its agreement does not validate a production Rust runtime.",
    route: { href: "/ssdd", label: "Read SSDD pre-hardware framing" },
  },
  {
    id: "ssdd-simcxl-limited",
    index: "04",
    className: "CXL-AWARE SIMULATION",
    status: "COMPLETED / SIMULATION-ONLY",
    title: "SSDD SimCXL Type-3 limited integrity matrix",
    copy: "A retained two-case full-system SimCXL Type-3 matrix observed the named reference workload in a guest exposing separate local-DRAM and CXL-memory NUMA nodes. The normal case accepted its reference digest; the controlled proof mutation at record 18 produced the planned bounded rejection. The guest booted with an Atomic CPU because KVM was unavailable.",
    facts: [
      { value: "1 / 1", label: "accepted normal case" },
      { value: "1 / 1", label: "proof mutation rejected" },
      { value: "2,935 + 8,063 MB", label: "guest NUMA node capacities" },
      { value: "ATOMIC", label: "boot CPU model" },
    ],
    boundary: "This is CXL-aware simulation evidence only. Atomic boot makes the record unsuitable for a timing or throughput comparison; it does not establish physical CXL behavior, FPGA operation, silicon timing, certification, or production readiness.",
    route: { href: "/ssdd", label: "Read SimCXL evidence boundaries" },
  },
  {
    id: "ssdd-rtl-ssc",
    index: "05",
    className: "RTL SIMULATION",
    status: "COMPLETED / BOUNDED CONTRACT",
    title: "Bounded SSC RTL behavioral verification",
    copy: "The retained Snapshot/Epoch SSC test bench ran 128 affine arrival trials across 32 complete unique permutations, repeated four times. Two independent simulator invocations were byte-identical, and an independent Python reference comparison accepted all 128 canonical batches. Exact four-key collisions were rejected and valid post-rejection recovery was retained.",
    facts: [
      { value: "128", label: "affine arrival trials" },
      { value: "32 × 4", label: "unique permutations × repeats" },
      { value: "2", label: "byte-identical replays" },
      { value: "128 / 128", label: "reference-vector batches accepted" },
    ],
    boundary: "This record demonstrates behavioral RTL simulation of one bounded ordering controller. It is not timing closure, a target-device resource result, FPGA hardware, CXL operation, an SSDD runtime, or production-readiness evidence.",
    route: { href: "/ssdd", label: "Read RTL validation boundaries" },
  },
  {
    id: "ssdd-validation-plan",
    index: "06",
    className: "VALIDATION PLAN",
    status: "RESEARCH WORK / IN PROGRESS",
    title: "SSDD deterministic validation pathway",
    copy: "The research plan identifies software-facing invariants that can be modeled without representing unvalidated physical silicon behavior: fixed-point arithmetic, logical time, deterministic ordering, canonical serialization, hash-chain replay, bounded windows, and controlled fault injection.",
    facts: [
      { value: "Q32.32", label: "documented arithmetic model" },
      { value: "1,000", label: "node-scale simulation target" },
      { value: "4", label: "planned validation families" },
      { value: "REPLAY", label: "baseline experiment focus" },
    ],
    boundary: "The initial matrix has varied memory timing and injected controlled proof corruption; later experiments may extend scenario coverage, but each result remains tied to its stated simulator model and configuration. No simulator result becomes a physical HC-CXL claim by implication.",
    route: { href: "/ssdd", label: "Inspect the SSDD research file" },
  },
  {
    id: "hc-cxl-reference",
    index: "07",
    className: "RESEARCH REBUILD",
    status: "REFERENCE ASSUMPTIONS / VALIDATION PENDING",
    title: "HC-CXL v2.1R physical-governance reference",
    copy: "HC-CXL v2.1R begins from a frozen v2.0 baseline after the v2.1 failure analysis identified governance, lineage, reproducibility, and publication-pipeline failures. The current work is an explicit rebuild with testable reference assumptions, not an announcement of compliant hardware.",
    facts: [
      { value: "0.05", label: "amplitude reference envelope" },
      { value: "73 ps", label: "documented decision bound" },
      { value: "50 ns", label: "documented metastability gap" },
      { value: "5 × 7", label: "stages × engines reference matrix" },
    ],
    boundary: "The listed values are documented reference assumptions and recomputation rules awaiting empirical validation in the defined operating domain. They are not measured hardware behavior, silicon qualification, or a CXL compliance result.",
    route: { href: "/hc-cxl", label: "Read the HC-CXL research rebuild" },
  },
  {
    id: "paylock-adapter-local-experiment",
    index: "08",
    className: "LOCAL INTEGRATION EXPERIMENT",
    status: "COMPLETED / LOCAL-ONLY",
    title: "PayLock delivery-Adapter acceptance exercise",
    copy: "An isolated prototype exercised the narrow provider-event-to-resource path with six named acceptance checks. The local run covered signed release handling, event rejection, duplicate suppression, opaque-ticket handling, single-use access under a race, and failure without release.",
    facts: [
      { value: "6 / 6", label: "local acceptance checks passed" },
      { value: "1", label: "provider acknowledgement per tested delivery" },
      { value: "1", label: "resource release per tested ticket" },
      { value: "0", label: "H0 values in asserted external responses" },
    ],
    excerpt: {
      label: "Result excerpt / isolated local test run",
      checks: [
        { result: "PASS", label: "Signed release accepted once; H0 withheld from the tested response surface" },
        { result: "PASS", label: "Invalid signatures and non-release events rejected before the Core signal path" },
        { result: "PASS", label: "Duplicate delivery, ticket replay, and concurrent access produced one eligible path" },
        { result: "PASS", label: "A simulated Core unlock failure prevented resource release" },
      ],
      scope: "The six checks are a local prototype result. They do not establish a deployed Adapter, a live provider-ready event, end-user consumption, or a production integration. Any H1 reference here is technical delivery evidence only—not payment, refund, or financial evidence.",
    },
    boundary: "This record is a local test result for an isolated prototype, retained outside the protected product source. It is not evidence of a live provider integration, external provider attestation, production one-time access control, or general launch readiness.",
    route: { href: "/paylock#review", label: "Read the PayLock reviewed status" },
  },
  {
    id: "paylock-github-signed-connectivity",
    index: "09",
    className: "SIGNED CONNECTIVITY CHECK",
    status: "COMPLETED / CONNECTIVITY-SCOPED",
    title: "GitHub signed receiver verification",
    copy: "The configured DS&D test receiver accepted one signed GitHub `ping` request and one owner-authorized redelivery. GitHub recorded HTTP `202` for both deliveries; the retained record excludes payloads, delivery identifiers, raw headers, and the configured secret.",
    facts: [
      { value: "202", label: "signed ping response" },
      { value: "2 / 2", label: "ping and authorized redelivery accepted" },
      { value: "0.09 s", label: "recorded initial completion time" },
      { value: "RELEASE", label: "configured event subscription scope" },
    ],
    excerpt: {
      label: "Result excerpt / redacted receiver record",
      checks: [
        { result: "202", label: "GitHub signed `ping` accepted by the configured test receiver" },
        { result: "202", label: "One owner-authorized redelivery accepted by the same receiver" },
        { result: "LIMIT", label: "No `release.published` event was created or inferred from the check" },
      ],
      scope: "This is a signed endpoint-reachability and signing-path check only. It does not demonstrate a release lifecycle, an Adapter mapping, provider readiness, a PayLock Core transition, H0/H1 issuance, or user access control.",
    },
    boundary: "The result confirms only the narrow receiver’s signed GitHub connectivity. It must not be represented as provider-delivery evidence or a completed PayLock integration.",
    route: { href: "/paylock#review", label: "Read the integration boundary" },
  },
  {
    id: "evidence-boundaries",
    index: "10",
    className: "READINESS REGISTER",
    status: "PUBLIC POSITIONING / CURRENT",
    title: "Readiness and evidence boundaries",
    copy: "The DS&D continuum has intentionally different readiness states. PayLock is the commercial offering. SSDD is prototype- and validation-stage systems research. HC-CXL v2.1R is a research rebuild and physical-governance reference. The boundary travels with each record.",
    facts: [
      { value: "PAYLOCK", label: "commercial offering" },
      { value: "SSDD", label: "prototype / validation stage" },
      { value: "HC-CXL", label: "research rebuild" },
      { value: "gem5", label: "simulation evidence only" },
    ],
    boundary: "This library provides public summaries of source-backed research records. Where a Zenodo deposit is linked, it is a documented repository record; it is not represented here as peer-reviewed publication, independent verification, or validation beyond its stated scope.",
    route: { href: "/evidence", label: "Return to the evidence register" },
  },
  {
    id: "hc-cxl-zenodo-lineage",
    index: "11",
    className: "ZENODO TECHNICAL RECORD",
    status: "DOCUMENTED / OPEN RECORD",
    title: "HC-CXL documented Zenodo lineage",
    copy: "Zenodo retains a documented HC-CXL lineage: three technical notes for versions 1.0, 1.1, and 1.2; the v2.1R software repository; and a Smarty-community report explicitly recorded as a supplement to the v2.1R software DOI.",
    facts: [
      { value: "5", label: "linked documented records" },
      { value: "v2.1R", label: "current repository edition" },
      { value: "OPEN", label: "Zenodo record access" },
    ],
    boundary: "A DOI and an open repository record make the named artifacts citable and retrievable. They do not by themselves establish peer review, independent replication, hardware validation, CXL conformance, certification, or product readiness.",
    route: { href: "https://doi.org/10.5281/zenodo.17969945", label: "Open the HC-CXL v2.1R Zenodo record" },
  },
  {
    id: "ssdd-zenodo-record",
    index: "12",
    className: "ZENODO RESEARCH RECORD",
    status: "DOCUMENTED / OPEN RECORD",
    title: "SSDD documented Zenodo record",
    copy: "Zenodo record v1 for SSDD documents a foundational theoretical framework and stated simulation results. It provides a documented public research record alongside—rather than in place of—the bounded simulation and validation evidence recorded elsewhere in this library.",
    facts: [
      { value: "v1", label: "documented edition" },
      { value: "18 MAR 2026", label: "Zenodo publication date" },
      { value: "OPEN", label: "Zenodo record access" },
    ],
    boundary: "This is an open documented research record. Its availability does not transform the stated simulation results into independently verified, hardware, security, certification, or production-readiness evidence.",
    route: { href: "https://doi.org/10.5281/zenodo.19098717", label: "Open the SSDD Zenodo record" },
  },
  {
    id: "ypharma-production-platform",
    index: "13",
    className: "PRODUCTION DEPLOYMENT",
    status: "LIVE / OPERATIONAL",
    title: "YPharma Pharmaceutical Governance Platform",
    copy: "YPharma is DS&D's deployed pharmaceutical supply-chain platform providing medicine batch traceability, dispensary validation, and anti-counterfeit drug governance at scale.",
    facts: [
      { value: "PROD", label: "deployment environment" },
      { value: "LIVE", label: "operational status" },
      { value: "BATCH", label: "traceability granularity" },
      { value: "END-TO-END", label: "supply chain visibility" },
    ],
    boundary: "Production platform deployed on official domain: ypharma1.deterministicsolutionsdesign.com.",
    route: { href: "https://ypharma1.deterministicsolutionsdesign.com/", label: "Launch YPharma Platform" },
  },
  {
    id: "traveler-production-platform",
    index: "14",
    className: "PRODUCTION DEPLOYMENT",
    status: "LIVE / OPERATIONAL",
    title: "Traveler Dynamic Logistics & Booking Engine",
    copy: "Traveler provides multi-modal route scheduling, dynamic inventory reservation, passenger ticketing, and automated operations telemetry for travel and transit providers.",
    facts: [
      { value: "PROD", label: "deployment environment" },
      { value: "LIVE", label: "operational status" },
      { value: "REAL-TIME", label: "route availability" },
      { value: "DYNAMIC", label: "booking engine" },
    ],
    boundary: "Production platform deployed on official domain: traveler.deterministicsolutionsdesign.com.",
    route: { href: "https://traveler.deterministicsolutionsdesign.com/", label: "Launch Traveler Platform" },
  },
];

export default function TechnicalLibrary() {
  return (
    <SiteLayout>
      <main className="library-page">
        <section className="library-hero">
          <div className="institutional-grid" aria-hidden="true" />
          <div className="container library-hero-inner">
            <div className="institutional-meta"><span className="status-dot" /> Evidence / Technical library / Readable records</div>
            <a className="back-link" href="/evidence"><ArrowLeft size={14} /> DS&D / Evidence</a>
            <div className="library-hero-grid">
              <div>
                <h1>Claims need a<br /><em>record.</em></h1>
                <p>The technical library turns the current research evidence into linkable public records. Each entry states what was observed, where its boundary ends, and which institutional file provides the surrounding context.</p>
              </div>
              <div className="library-signal">
                <BookOpen size={20} />
                <span>PUBLIC RECORD INDEX</span>
                <b>{libraryRecords.length}</b>
                <small>source-backed entries</small>
              </div>
            </div>
          </div>
        </section>

        <section className="library-register section" aria-label="Technical library records">
          <div className="container">
            <div className="section-index">01 <span>/</span> Record index</div>
            <div className="library-register-intro"><div><div className="section-kicker">Evidence without category confusion</div><h2>Open the record.<br /><em>Keep the boundary.</em></h2></div><p>Every entry is intentionally labeled as a simulation artifact, validation plan, research rebuild, or readiness register. The library does not convert an internal source assumption into a public performance claim.</p></div>
            <div className="library-records">
              {libraryRecords.map((record) => (
                <article className="library-record" id={record.id} key={record.id}>
                  <div className="library-record-head">
                    <div><span>{record.index} / {record.className}</span><h3>{record.title}</h3></div>
                    <div className="library-record-status"><Check size={14} /> {record.status}</div>
                  </div>
                  <div className="library-record-body"><p>{record.copy}</p><div className="library-facts">{record.facts.map((fact) => <div key={fact.label}><b>{fact.value}</b><span>{fact.label}</span></div>)}</div></div>
                  {record.excerpt && <aside className="library-excerpt" aria-label={record.excerpt.label}><div className="library-excerpt-head"><span>{record.excerpt.label}</span><b>PUBLIC-SAFE SUMMARY</b></div><div className="library-excerpt-checks">{record.excerpt.checks.map((check) => <div key={check.label}><strong>{check.result}</strong><span>{check.label}</span></div>)}</div><p>{record.excerpt.scope}</p></aside>}
                  <div className="library-boundary"><ShieldCheck size={18} /><p>{record.boundary}</p></div>
                  <a className="library-route" href={record.route.href} target={record.route.href.startsWith("http") ? "_blank" : undefined} rel={record.route.href.startsWith("http") ? "noreferrer" : undefined}>{record.route.label} <ArrowUpRight size={16} /></a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
