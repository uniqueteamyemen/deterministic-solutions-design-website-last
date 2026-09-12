# Source Evidence Notes — August 2026

This note captures the public-facing evidence boundaries extracted from the user-supplied technical package. The source files are user-provided working materials; their technical assertions must be presented as documented design targets or validation scope unless independently tested and released.

## Product readiness positioning

| Initiative | Public status to use | Evidence basis | Claims to avoid |
|---|---|---|---|
| PayLock | Commercial offering | Existing PayLock product document and established product page | Do not claim third-party certification or live customer deployment without a source record |
| SSDD | Research and validation-stage deterministic systems architecture | `SSDDImplementationandTestSuite.1.docx`, `prototype-SSDD.docx`, `SSDD-Specification-V1.2.pdf` | Do not describe the prototype plan or test suite as completed validation |
| HC-CXL v2.1R | Research rebuild / validation-stage physical governance reference | `HC-CXL_v2.1R_FULL_Amended_Final_Precise.pdf` | Do not state silicon qualification, production readiness, or independently verified physical performance |

## SSDD findings

The implementation manual describes an SSDD/SAGP architecture with compute nodes, a Sovereign Sidecar, aggregation furnaces, a fusion furnace, and a cryptographic ledger. It defines fixed-point Q32.32 arithmetic, deterministic ordering, simulator and compliance-test guidance, and a 1,000-node simulation target.

The prototype roadmap frames key demonstrations as future validation objectives: deterministic replay, deterministic convergence, bounded decision windows, and cross-language hash matching. It proposes an initial cluster topology and a staged test plan. Website language must frame these as **prototype objectives**, **test scenarios**, and **validation work**, not delivered production results.

## HC-CXL findings

The v2.1 failure analysis explicitly declares HC-CXL v2.1 invalid because of governance, lineage, reproducibility, and publication-pipeline failures, and directs a rebuild from a frozen v2.0 baseline. The public site must preserve this lineage transparency.

The v2.1R physical justification document describes a reference layer for amplitude, timing, stability, and throughput governance, including a 73 ps decision bound, 0.05 amplitude envelope, 50 ns metastability gap, and a five-stage / seven-engine operational matrix. Its numerical constants and validation language are documented as reference assumptions and recomputation rules pending empirical validation under the defined operating domain.

## Architectural relationship

The API Replacement / DERG source material positions SSDD as deterministic middleware, HC-CXL as a physical enforcement concept, SARP as deterministic routing, and H0/H1 receipts as an entitlement bridge. For the public website, explain this as a **research-stack relationship** that informs PayLock’s proof-first commercial narrative; do not claim that PayLock depends on unvalidated research components unless the supplied product documentation explicitly confirms it.

## gem5 validation scope

The supplied SSDD implementation document identifies concrete software-facing invariants suitable for simulation-driven testing: fixed-point Q32.32 arithmetic, cycle-based logical time, deterministic seed derivation, deterministic sidecar ordering by `(structural_dim, enterprise_type, seq)`, canonical serialization, hash-chain replay, and bounded-window processing. These can be measured with a portable synthetic workload, repeated runs, configurable memory timing, and controlled fault-injection.

gem5 itself is a computer-system architecture research simulator. Its Ruby memory system supports detailed, configurable cache-coherence, memory-controller, interconnect, and state-machine modeling, which makes it suitable for measuring the system-level effects of deterministic ordering, replay, and memory-timing scenarios. [gem5 Ruby documentation](https://www.gem5.org/documentation/general_docs/ruby/)

The initial gem5 plan must not claim physical HC-CXL validation. The first experiments model the SSDD reference workload under controlled simulator parameters, then report only workload-level deterministic correctness, replay-hash agreement, operation counts, simulated cycle cost, and injected-fault outcomes. CXL-specific extensions are a secondary research path: the gem5-CXL repository is a research fork, while CXL-DMSim describes a fuller CXL Type-3 model and reports separate calibration against hardware prototypes. [gem5-CXL](https://github.com/SlugLab/gem5-CXL) [CXL-DMSim](https://arxiv.org/html/2411.02282v2)

On 17 August 2026, the completed baseline ran a five-stage, seven-engine, 35-operation portable reference workload twice in gem5 25.1.0.1 with the same X86 syscall-emulation configuration. Both runs returned the same replay digest (`ff05ec2371488ba1`) and `validation=accepted`, each at simulated tick `308777000`. This is a model-scoped repeatability artifact only; the reproducibility record is stored in `research/gem5-ssdd-reference-results.md`.

Public language: **simulation plan**, **reproducible experiment**, **research validation**, and **model-scoped results**. Avoid “silicon-qualified”, “hardware-certified”, “production-ready”, and any physical-performance claim that has not been empirically demonstrated.

## Controlled matrix update — model-scoped gem5 only

On 17 August 2026, the reference workload was run with fixed `SimpleMemory` latency values of 10 ns, 50 ns, and 100 ns. The six fixed-latency runs returned `validation=accepted` with the canonical replay digest `ff05ec2371488ba1`. Five repeated 50 ns executions likewise matched the same digest. A single-bit corruption of the generated proof at records 1, 18, and 35 was rejected in two repeated runs for each position.

The recorded simulated-tick values were 1,346,204,000 at 10 ns, 1,636,604,000 at 50 ns, and 1,999,604,000 at 100 ns. These figures describe the selected gem5 model and workload only. They do **not** measure physical memory behavior, CXL traffic, operational fault rates, cryptographic strength, comprehensive fault coverage, or production resilience. The reproducibility record is stored in `research/gem5-ssdd-controlled-matrix-results.md`.
