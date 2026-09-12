# Redesign checklist

- [ ] Resume the SSDD campaign autonomously: inventory the reproducible local SimCXL resources and then continue Cherry execution without redeploying or changing SSH configuration.
- [x] On the authenticated Cherry shell, record the pinned repository state and KVM admission result, then build the missing SimCXL `build/X86/gem5.opt` without changing SSH, BMC, or server configuration.
- [x] Use the owner-authorized open Cherry shell for the non-destructive KVM probe and approved SimCXL build; retain the command output as campaign evidence.
- [x] Search the pinned Cherry SimCXL checkout for all existing `gem5.*` executables, build directories, and build logs before rebuilding any binary.
- [x] Inspect the existing Cherry `simcxl-build` tmux session and `/tmp/simcxl-build.log` after the interactive continuation, and never start a duplicate build.
- [x] Retain the final `/tmp/simcxl-build.log` tail and executable SHA-256 showing that the SimCXL build completed; do not launch a duplicate build.
- [ ] Retain a compact inventory of all Cherry tmux sessions together with the completed build-log tail for later operational provenance.
- [x] Under the owner’s full authorization, reconnect to Cherry and capture the current tmux status, build log, repository HEADs, and existing artifacts before any replacement build.
- [x] Run the non-destructive KVM preflight, then use or complete only the pinned SimCXL build and checksum-verified missing resources.
- [x] Run the canonical non-destructive Cherry KVM preflight and retain its passing evidence in `.local-results/cherry-kvm-preflight-20260822T0708Z`.
- [x] Transfer the pinned local `vmlinux` and `parsec.img` to Cherry because neither resource is present under `/opt`; verify remote SHA-256 before using either resource.
- [ ] If a KVM or SimCXL prerequisite fails, capture the exact host-side cause and remediate the specific prerequisite under the owner’s full authorization before retrying the gate.
- [x] Prove the KVM-to-Timing CPU ROI transition in a smoke run before launching any performance matrix cell.
- [x] Retain a compact Cherry KVM smoke evidence bundle containing the accepted and proof-corruption results, KVM→Timing CPU markers from logs/stats/manifest, and SHA-256 fingerprints before closing the gate.
- [x] Expose the key raw KVM smoke lines: accepted success, proof-corruption rejection, KVM→Timing CPU transition markers, and retained SHA-256 hashes.
- [x] Verify and record the saved remote artifact and manifest paths for both smoke cases before closing the ROI gate.
- [x] Execute the approved SSDD matrix only after the KVM-to-Timing gate passes; retain raw logs, stats, manifests, and SHA-256 evidence. Full five-cell evidence: `ssdd-research/docs/validation/cherry-kvm-full-matrix-evidence-20260822.md`; raw local retention: `ssdd-research/.local-results/cherry-kvm-matrix1-20260822T073954Z/`.
- [ ] Launch the first checksum-protected KVM limited matrix on Cherry: accepted CXL-ASIC and proof-corruption CXL-ASIC, each with copied guest disk and retained manifests.
- [x] Monitor the active `ssdd-kvm-matrix1` session until it exits, then validate every cell’s exit status, ROI markers, stats, manifests, and SHA-256 evidence. All five rows and per-cell `sim_exit=0` were retained; the wrapper `exit-status` escaping defect is documented rather than overwritten.
- [x] Complete and audit the full KVM Type-3 matrix on Cherry: DRAM control, accepted CXL ASIC, rejected proof-corruption CXL ASIC, accepted CXL-FPGA model, and accepted interleave. Evidence record: `ssdd-research/docs/validation/cherry-kvm-full-matrix-evidence-20260822.md`.
- [x] Execute one independently named full KVM Type-3 replicate with the same pinned inputs and a corrected numeric `exit-status` capture; retain and compare it without reporting performance metrics. `exit-status=0`; raw retention: `ssdd-research/.local-results/cherry-kvm-matrix2-20260822T075517Z/`; audit: `cherry-kvm-full-matrix-evidence-20260822.md`.
- [x] Execute a third independently named full KVM Type-3 semantic behavioral replicate using the same inputs without interpreting its counters as performance. Semantic matrix and SHA-256 checks matched; one proof-corruption cell lacks `SSDD_TIMING_CPU_ROI_END`, documented in `cherry-kvm-full-matrix-evidence-20260822.md` and its raw audit file.
- [x] Run one additional independently named full KVM Type-3 replicate and require numeric `exit-status=0`, an identical semantic matrix, remote/local checksum passes, and KVM-to-Timing ROI markers in all five cells before closing the bounded repeatability set. Completed as `matrix4`; raw audit: `ssdd-research/.local-results/cherry-kvm-matrix4-20260822T082048Z/local-roi-closed-repeatability-audit.txt`.
- [x] Close only the final Cherry matrix verification required for the recorded result: confirm the pushed evidence record and clean research worktree, without rerunning a completed cell. Local and GitHub HEAD: `7bbbaf9a0f62d5f6eeff591f59aef37098d9ce24`; worktree clean.
- [x] Identify the next concrete runnable test in the approved nine-test campaign. Selected `run_gem5_controlled_matrix.sh`: latency sensitivity, five deterministic replays, and proof-corruption adversarial record variants 1/18/35 in syscall-emulation gem5. It is model-specific simulation only, not the blocked matched KVM baseline-versus-SSDD comparison.
- [x] Execute the selected controlled gem5 adversarial/replay matrix on Cherry with pinned SimCXL binary, numeric exit status, manifest, raw per-run artifacts, and SHA-256 inventory. Completed 21 runs with `exit-status=0`; raw retention: `ssdd-research/.local-results/cherry-controlled-matrix1-20260822T083500Z/`.
- [x] Audit and retain the Cherry controlled gem5 matrix: all 21 `gem5_exit=0` rows, deterministic control/replay outcomes, designed proof-corruption rejections at records 1/18/35, and remote/local SHA-256 checks passed. Evidence record: `ssdd-research/docs/validation/cherry-controlled-gem5-matrix-evidence-20260822.md`.
- [x] Execute and audit the native-reference `model3plus2` package on Cherry with actual exit `0`: ordering/exact-key collision, deterministic replay, packet-drop/node-delay/aggregator-failure/state-corruption no-commit dispositions and recovery, ledger tamper, Q32 checks, cross-language replay, and compiled proof controls are evidenced individually. It remains reference-only evidence.
- [x] Collect the original remote `model3plus2` subcase artifacts and map each executed adversarial condition to its retained outcome. JSON evidence is curated and indexed in `evidence/native-reference/cherry-model3plus2-20260822/inner/prehardware/`; `--mode scale-load` is correctly excluded because it was not part of this run.
- [x] Execute the separate native-reference `--mode scale-load` test on Cherry with its own manifest, generated input schedule, full logs, exit status, SHA-256 evidence, and terminal-derived captures. Completed as `cherry-scale-load1` with exit `0` and 11 accepted source points; evidence: `docs/validation/cherry-scale-load-native-reference-evidence-20260822.md`. It is not KVM, CXL, hardware, or baseline performance.
- [x] Retain the `model3plus1` setup failure without rerun or overwrite: runner exited `64` because `SSDD_RESULTS_DIR` lacked the required run-label subdirectory. Evidence: remote `/opt/ssdd-results/cherry-model3plus1/launcher.log` and local status record.
- [x] Execute the corrected independent `model3plus2` native-reference adversarial package with `SSDD_RESULTS_DIR` set to its complete run-label directory. Remote/local checksums and final provenance are retained under `ssdd-research/.local-results/cherry-model3plus2-20260822T085917Z/`.
- [x] Remedy the minimal Cherry prerequisite for the native-reference adversarial package: make the existing runner callable through `bash` and install `rustc` only if absent, then retain a passing non-destructive admission check. `rustc 1.75.0` is installed; passing probe: `/home/ubuntu/ssdd-model3plus1-postremedy-admission-20260822T0841Z.txt`; no source, SSH, kernel, or reboot change was made.
- [x] Align the Cherry SSDD checkout to the documented repository commit before launching the full KVM matrix, while retaining the already captured smoke evidence separately.
- [ ] Do not reconnect iKVM after its repeated WebSocket 1006 failure; resume remote inspection only through an explicitly authorized authenticated shell.
- [x] Reuse every verified complete Cherry artifact; remove only confirmed incomplete build output and replace only genuinely missing, checksum-verified resources.
- [x] Complete the current SimCXL inspection from the local shell only; defer all Cherry access attempts until a later explicit authorization and authenticated shell are available.
- [x] Compile and run the local SSDD reference workload in accepted and proof-corruption modes; retain outputs as functional evidence only, not as SimCXL or performance evidence.
- [ ] Choose and implement a cost-conscious disconnect alert that records loss of authorized Cherry shell reachability without stopping local SSDD work.
- [ ] Define the alert threshold, retention record, and owner-visible notification channel before enabling any recurring monitoring.
- [ ] Run one bounded local-only status watcher through the 85-hour campaign window; report any absence of newly authenticated Cherry-shell evidence, retain the local continuation state, and never initiate iKVM or SSH from the watcher.
- [x] Confirm that the platform will not create the recurring watcher while the DS&D website remains unpublished; do not publish or modify the website merely to enable this operational alert.

## Active Cherry SSDD execution

- [x] Catalog the approved nine-test Cherry campaign against the current pinned scripts and retained evidence. `ORD-01`, `ORD-02`, `RPL-01`, `FLT-01`, `LED-01`, `XLG-01`, `SCL-01`, `LOD-01`, and `Q32-01` are mapped in `ssdd-research/docs/validation/cherry-nine-test-campaign-evidence-index-20260822.md`.
- [x] Execute and audit the `model3plus2` native-reference family covering `ORD-01`, `ORD-02`, `RPL-01`, `FLT-01`, `LED-01`, `XLG-01`, and `Q32-01`: actual exit `0`, manifest, source/toolchain provenance, JSON artifacts, remote/local SHA-256 checks, and scope-bounded record are retained.
- [x] Execute and audit the `scale-load1` native-reference family covering `SCL-01` and `LOD-01`: actual exit `0`, manifest, generated schedule, source/interpreter provenance, JSON artifacts, remote/local SHA-256 checks, and scope-bounded record are retained.
- [x] Verify and publish the nine-test evidence index in GitHub with a commit that links every ID to its retained Cherry run and artifacts. Published at `396f51bc2ef890121383903a6d7dd491193b9dc7`.
- [ ] For any remaining test whose required control, instrumentation, or hardware is absent, record the exact gate and implement only the minimal scientifically valid remedy before execution.
- [x] For every Cherry run contributing to the nine-test campaign, retain complete provenance: exact command, host identity/IP, repository/binary/input paths, commits and SHA-256 values, environment facts, stdout/stderr, logs/config/stats/summary/manifest, actual exit status, and remote-plus-local SHA-256 verification. See the published campaign index and its linked native-reference and scale/load evidence bundles.
- [x] Capture and retain non-sensitive execution and completed-result screenshots for each Cherry run contributing to the nine-test campaign, then link them from its evidence record and Git commit. The native-reference and scale/load evidence bundles contain the review captures and visual-review notes.
- [x] Capture full provenance and two terminal-derived review screenshots for `model3plus2`: exact command, host/IP, paths, commits, binary/source hashes, toolchain, logs, config/artifacts, exit, remote/local SHA-256 verification, execution capture, and completed-result capture are retained in `evidence/native-reference/cherry-model3plus2-20260822/`.
- [x] Capture complete scale-load provenance and visual-review records: command, host/IP, source and interpreter hashes, stdout/stderr, JSON, exit, remote/local SHA-256 checks, and terminal-rendered launch/completion captures are curated under `evidence/native-reference/cherry-scale-load1-20260822/`.
- [x] Audit and report the retained SCL-01/LOD-01 scale-load source values, measurement definitions, and scope limitations from the published Cherry evidence bundle.
- [x] Recompute and compare the published SHA-256 inventories for the scale-load and nine-test evidence artifacts against the GitHub-tracked files; retain a discrepancy report if any hash differs.
- [x] Prepare and generate an evidence-bounded presentation covering all nine Cherry verification IDs, their mapped artifacts, integrity checks, and scientific boundaries.
- [ ] Determine whether paid Cherry credit or active time remains through a read-only account/server status check before proposing any separate PayLock or analysis-platform evidence run.
- [x] Define the deterministic PayLock evidence contract with success/failure/replay criteria, artifacts, and scope gates; the later PayLock run proceeded only after owner confirmation of the live test-only scope.
- [ ] Define a separate analysis-platform evidence contract with explicit ingest/validate/correlate/replay criteria, retained artifacts, and scope gates before any later analysis-platform run.
- [ ] Verify the remaining Cherry account time and active-server status read-only before using any paid capacity for a new product-evidence campaign.
- [x] Inventory accessible repositories and select one isolated, reproducible product-evidence package; do not alter production services, secrets, deployments, or payment settings.
- [x] Add and link a second redacted PayLock capture covering the main successful execution/completion sequence, then verify that the run record references both the success and modified-webhook captures.
- [x] Commit and push the new product-evidence package and write an evidence-bounded completion record linked to its GitHub commit.
- [x] Run the isolated Cherry PayLock commercial-success contract from the pinned public `paylock-core` revision: create H0, attach provider acknowledgement, submit user unlock, and require exactly one H1/proof outcome.
- [x] Publish a redacted cross-run comparison between the initial PayLock success run and fresh fixture E, normalizing generated identifiers/timestamps while comparing session/payment/provider_ack/unlock/resolve/replay/duplicate dispositions. The fixture-E run itself exited 0, returned the expected eight statuses, matched H1 within its lifecycle, and passed 1,020/1,020 remote and local SHA-256 checks.
- [x] Add an integrity-checked published summary showing that H0/H1 identifiers and timestamps were intentionally normalized or excluded from the cross-run equivalence conclusion.
- [x] Run bounded isolated PayLock negative controls for replay/idempotency and cancellation-before-unlock; retain the exact dispositions without making payment, fulfillment, identity, or production claims.
- [x] Run the confirmed live PayLock sequence only with isolated test fixtures against the current service: H0 → provider acknowledgement → user unlock → exactly one H1; do not create a payment, contact a provider, involve a real user, deploy, or alter configuration.
- [x] Preserve the live test-only request/response sequence, normalized identifiers, actual status codes, service evidence, integrity hashes, and explicit non-production boundary in a dedicated run record.
- [x] Simulate a test-only payment receipt on Cherry for the isolated live PayLock fixture, record the payment-attestation disposition, and complete the H0→provider acknowledgement→user unlock→one H1 path without funds movement.
- [x] Simulate a test-only payment-cancellation receipt on a separate fixture, record the closed-session disposition for later unlock/resolve, and preserve the results as payment-simulation—not payment-processor—evidence.
- [x] Submit the same test-only payment intent twice with the same receipt identifier and retain the actual duplicate-intent disposition, verifying that a second lifecycle execution is not created.
- [x] Submit and retain a distinct test-only tampered-webhook fixture and record the actual status as HTTP 200 accepted, distinguishing absent/unsupported signature validation from demonstrated rejection; the completed receipt-mismatch control does not substitute for this check.
- [x] Document a redacted reference to the retained raw response-body artifact for the tampered-webhook control, or publish a safe redacted transcript sufficient to audit the accepted disposition.
- [x] Correlate the successful test-only intent, receipt, webhook acknowledgement, PayLock verification, unlock, and exactly one H1 result in the published evidence record.
- [x] Amend the private PayLock evidence interpretation to state that the tested webhook is optional informational intake, not a payment-transfer, payment-authorization, or core-unlock gate; retain the HTTP 200 observation without treating it as a blocker for the core lifecycle.
- [x] Inventory the DS&D public pages, styles, and static-safe media required for a portable website copy; identify and exclude all auth, database, API, analytics, secret, runtime, and environment-variable dependencies.
- [x] Create a standalone `index.html` package with local CSS, local JavaScript, and local assets that preserves the public DS&D landing-page experience without any build step or network dependency.
- [x] Verify the standalone copy opens from `file://` and via a basic static server, contains no `process.env`, `import`, runtime API, analytics, remote URL, or secret reference, and package it as a ZIP with concise use instructions.
- [x] Establish the DS&D identity brief: institutional purpose, audiences, differentiated promise, strategic personality, non-claims, and architecture between DS&D, PayLock, SSDD, and HC-CXL.
- [x] Record the approved DS&D Brand Foundation v1: reduce avoidable difficulty, uncertainty, and doubt; reveal the problem and its pain before deciding whether intervention is warranted; use the simplest safe route; do not add fog; state what is known, unknown, and possible now.
- [x] Preserve the owner-supplied `DS&D Brand Voice & Identity Guide — The Rigorous Simplifier` as the governing tone for DS&D-facing materials: short direct language, named complexity or error, immediate acknowledgment of limits, and practical human protection without sales pressure.
- [x] Store the DS&D Brand Voice & Identity Guide as a durable project reference and require it for future DS&D website, standalone-site, PayLock, research-summary, and external-communication copy.
- [x] Preserve the owner-approved `DS&D Identity & Voice Operating System — The Rigorous Simplifier v1.0` as the controlling reference for all DS&D-facing copy and visual decisions, including its exact positioning, promise, prohibited claims, and PayLock/SSDD/HC-CXL roles.
- [x] Build the DS&D marketing truth map with three explicit layers: current work and evidence, the purpose it serves, and future ambition; prohibit campaign copy from presenting a later ambition as a current capability.
- [x] Adopt the owner’s approved DS&D metaphor for the positioning and visual brief: DS&D is a mirror that helps reveal truth hidden in operational details; it does not claim to own truth, and its work begins from the belief that workable solutions are often concealed in details.
- [x] Incorporate the owner’s clarified core into positioning: DS&D designs shared rules for handling consequential details, so differing internal processes do not corrupt the meaning of a common event; PayLock defines what shared signals count, while SSDD models a common boundary/reference treatment without claiming to eliminate jitter or accelerate latency.
- [x] Replace generic AI-tech visual cues only after the truth map and campaign focus are approved, so the revised logo, website, and campaign assets form one distinctive DS&D system.
- [x] Rebuild the managed DS&D homepage around the approved Reference Mark system: porcelain editorial field, graphite structure, oxide consequential detail, river evidence/reference, direct evidence-led copy, and no neon/circuit/default-AI visual language.
- [x] Add deterministic in-page DS&D and PayLock reference-mark studies or CSS-rendered equivalents to the redesign without storing new media inside the web project or creating a production claim.
- [x] Test responsive rendering and all existing navigation links after the redesign; preserve the unpublished state and save a reviewable checkpoint only after tests and visual verification pass.
- [x] Translate the approved DS&D concept into a visual brief before any redesign: detail made visible, shared reference or rule, calm evidence, and practical human protection; explicitly avoid dark-surface/neon-accent/abstract-circuit defaults as the primary identity language.
- [x] Embed the owner’s core maxim in the visual brief: `الشيطان يكمن في التفاصيل، وهناك أيضاً توجد الحلول`; use it to distinguish consequential details, hazards, and actionable resolution rather than as decorative copy.
- [x] Embed the owner’s core marketing conviction in positioning and design: DS&D does not claim superior intelligence; it refuses to accept normalized, avoidable difficulty as final reality and re-examines the details treated as fixed.
- [x] Present a small set of decision-ready visual directions with their intended meaning, palette, typography, composition, and logo relationship before editing the existing DS&D or PayLock marks.
- [x] Produce one approval-ready positioning statement, one-liner, and brand promise directly from Brand Foundation v1, then move once to voice and visual direction without reopening discovery questions.
- [x] Translate the owner’s supplied principles into approved brand language: a young office pursuing large change through small actions; reducing hidden difficulty, uncertainty, and doubt through the simplest safe path; and communicating direct evidence without artificial ambiguity.
- [x] Define the resulting brand personality and the distinction between DS&D’s ends (reducing avoidable difficulty and uncertainty) and its current means (including determinism and non-custodial operation where appropriate, but not as universal identity claims).
- [ ] Audit the current DS&D brand assets, website, standalone copy, research materials, and product marks for visual and verbal consistency.
- [ ] Define an approved identity system covering logo architecture, colour, typography, imagery, iconography, voice, messaging hierarchy, and evidence/readiness language.
- [ ] Create the first approved identity assets and a compact usage guide before applying them to the managed site, static copy, research artifacts, or product communications.

- [ ] Audit the latest private PayLock evidence commits, verify each published SHA-256 manifest, and reconcile the success, cancellation, duplicate, replay, malformed-receipt, mismatch, and unknown-reference dispositions.
- [ ] Define and execute the next bounded commercial-integration test: a local deterministic provider-adapter contract using a signed test event and a test-only one-time resource ticket, with no payment processor, customer, external provider, deployment, or production configuration change.
- [ ] Publish the redacted adapter-contract evidence, integrity manifest, and explicit boundary between adapter simulation and a live commercial payment-provider integration.

- [ ] Standing operating rule: after resolving a blocking fault in an active task, resume the original task immediately from its last valid step unless the owner explicitly requests a different path.
- [x] Inventory and document the locally prepared modified SimCXL repository, binary, kernel, disk image, Type-3 configuration, and campaign scripts that generated the retained SSDD evidence.
- [x] Publish the evidence-bounded SimCXL reproduction map and local reference-smoke record to `uniqueteamyemen/ssdd-research` at commit `265a0fcef4a3bb38b2992ba23748cf3e30c4eab5`.
- [ ] Log in through the Ubuntu tty1 screen only, record host identity and KVM prerequisites, and begin the approved SSDD campaign without further BMC or web-interface analysis.
- [ ] Reopen the existing Cherry HTML5 iKVM session exactly once after WebSocket code 1006 and record whether the same Ubuntu tty1 screen returns, without redeploying or modifying the server.
- [ ] Execute the approved SSDD campaign from the Cherry Ubuntu tty1 console: KVM admission first, then reproducibly pinned SimCXL/gem5 setup, smoke test, and only admitted measurement matrices.
- [ ] Perform one direct SSH connection only with the owner-verified `ssdd-cherry-2026` key to the correct Ubuntu account; if rejected, record the exact SSH reason and make no server or SSH configuration change.
- [ ] Correct the local SSH identity attachment—without touching Cherry—so the owner-verified key is explicitly offered during the required direct connection.

- [x] Reframe the hero around the four-part logic: Understand, Control, Verify, Prove.
- [x] Preserve the first version’s deep engineering tone, typography, graphite field, and signal-lime proof language.
- [x] Restructure the main flow as Continuum → Projects → Evidence → PayLock logic → Contact.
- [x] Add a clearer project-card layer for HC-CXL, SSDD, and PayLock without inventing product metrics.
- [x] Preserve the requested evidence numbers: 120+ experiments and prototypes, 30+ systems in progress, 15+ integrations and platforms, and 24/7 monitoring and validation.
- [x] Frame the numeric evidence band with clear evidence-language and optional links to runtime records, research publications, or source repositories.
- [x] Strengthen PayLock as the flagship commercial object with an explicit Intent → Execution → Proof sequence.
- [x] Validate desktop and mobile layout, interactions, and final checkpoint.

## PayLock detail page

- [x] Convert the supplied PayLock product document into an evidence-led page narrative.
- [x] Create the PayLock page with lifecycle, architecture, resilience, and market sections.
- [x] Link public technical evidence and update the approved contact email.
- [x] Connect the landing-page PayLock routes and validate desktop/mobile rendering.

## Institutional website expansion

- [x] Audit the current routes and define the full institutional information architecture.
- [x] Build a shared site shell with navigation, footer, metadata, and consistent cross-links.
- [x] Add HC-CXL, SSDD, Evidence, About, and Contact experiences using only currently supported content.
- [x] Connect project pages, evidence records, and contact actions across the site.
- [x] Validate desktop/mobile behavior and production build.

## Source-backed research and readiness expansion

- [x] Catalog the supplied SSDD, HC-CXL, and deterministic execution source materials.
- [x] Reframe SSDD and HC-CXL as research and validation-stage initiatives with clear readiness labels.
- [x] Reinforce PayLock as the sole commercial offering while showing its relationship to the research stack.
- [x] Create source-backed evidence records and technical-library links.
- [x] Validate the upgraded site and save an evidence-backed checkpoint.

## SSDD gem5 validation pathway

- [x] Define which SSDD properties can be modeled and measured in gem5 without representing unvalidated physical silicon behavior.
- [x] Create a reproducible gem5 experiment plan for deterministic ordering, replay, timing, and fault-injection scenarios.
- [x] Prepare a portable SSDD reference workload and validation-artifact structure for gem5 execution.
- [x] Publish only simulation-scoped findings and limitations in the website evidence library.

## Source-backed public evidence update

- [x] Replace placeholder SSDD and HC-CXL page narratives with source-backed research and validation framing.
- [x] Integrate the supplied HC-CXL deterministic execution-model infographic with descriptive context and accessibility text.
- [x] Publish the completed gem5 baseline replay result as a model-scoped evidence artifact.
- [x] Add coverage for research-page copy and verify the final source-backed update before checkpointing.

## Public technical-library completion

- [x] Add a source-backed technical library with direct record links for the SSDD gem5 baseline, validation plan, readiness boundaries, and HC-CXL reference model.
- [x] Link the evidence page and research pages to the technical library with simulation and validation labels intact.
- [x] Verify the technical-library flow on desktop and mobile before checkpointing.

## Controlled validation and managed inquiries

- [x] Define and execute a controlled gem5 latency matrix for the SSDD reference workload.
- [x] Define and execute deterministic fault-injection cases, preserving accepted and rejected replay evidence.
- [x] Publish simulation-scoped latency and fault-injection records with explicit model boundaries.
- [x] Add a managed public inquiry form backed by the project database and a secure submission procedure.
- [x] Validate inquiry submission states, the updated evidence pages, and save a checkpoint.

## Extended gem5 verification

- [x] Run an expanded fixed-latency replay set to confirm accepted-trace reproducibility across repeated model executions.
- [x] Run additional deterministic proof-corruption positions to confirm bounded rejection behavior in the current reference validator.
- [x] Document preliminary matrix results and the resulting public-claim boundary statement.

## Pre-hardware deterministic verification program

- [x] Catalog the newly supplied SSDD specifications, implementation sources, test plans, and artifact materials with their evidence boundaries.
- [x] Test SSC canonical ordering under randomized arrival permutations and designed collisions across the four-key tuple.
- [x] Run 100-epoch full replay with complete hash-chain comparison across an independent restart.
- [x] Expand fault safety testing to packet drop, node delay, aggregator failure, and corrupted state or ledger while asserting preservation of the last valid state.
- [x] Verify forensic detection of state hash, previous hash, aggregate, and epoch-ID tampering through ledger recomputation.
- [x] Compare a canonical Python ledger implementation against a Rust ledger implementation, or record the Rust implementation as unavailable if source is absent.
- [x] Measure a source-scoped scaling and load matrix, including latency components, epoch success, throughput, and network-model counters.
- [x] Validate Q32.32 saturation, multiplication, boundary values, and symmetric rounding behavior.
- [x] Publish only model-scoped results, explicit limitations, and reproducibility artifacts after all checks pass.

## Pre-hardware evidence audit

- [x] Verify and publish the manifest evidence for SSC permutations and four-key collision cases.
- [x] Verify and publish the independent 100-epoch full-chain replay comparison artifact.
- [x] Verify and publish last-valid-state results for all four fault classes.
- [x] Verify and publish the four ledger-tamper recomputation outcomes.
- [x] Verify and publish the Python-to-Rust reference-chain comparison result and implementation provenance.
- [x] Verify and publish the scaling and load metrics, including counters and latency-component boundaries.
- [x] Verify and publish the Q32.32 boundary, saturation, multiplication, and rounding outcomes.

## Separate research repositories

- [x] Inventory SSDD, PayLock, and HC-CXL source materials and classify every file by its appropriate repository.
- [x] Create and organize a clean SSDD repository with reproducible validation artifacts, clear licensing, and evidence-scoped documentation.
- [x] Audit the SSDD repository for duplicate content, secrets, unpublished material, and unsupported claims before publication.
- [x] Create the SSDD GitHub repository and publish the approved curated contents.
- [x] Prepare separate professional repository structures and publication inventories for PayLock and HC-CXL.

## Existing repository alignment

- [x] Identify the existing PayLock and HC-CXL repository paths under the owner account; do not create replacement repositories.
- [x] Create and publish only the new SSDD repository after final curation and audit.

## Repository allocation audit

- [x] Save and verify a publication-allocation inventory for SSDD source materials and the existing PayLock and HC-CXL repository scopes.

## SSDD public pre-hardware baseline

- [x] Review the SSDD repository for public-release boundaries and documentation links before changing visibility.
- [x] Create an immutable pre-hardware baseline commit and annotated tag containing the verification harness, manifests, retained evidence, reports, and test definitions.
- [x] Execute the defined 8-to-128-node scaling matrix and retain its raw result records.
- [x] Execute the scoped gem5 baseline and controlled workload simulations and retain their raw result records.
- [x] Publish the curated evidence, reports, and acceptance records to the SSDD repository with explicit model limitations.
- [x] Change the SSDD repository to public visibility and verify the published links and repository contents.

## SSDD publication follow-up

- [x] Create a new annotated baseline tag pointing to the fully runnable controlled gem5 harness and retained results.
- [x] Replace local-only paths in the gem5 baseline report with repository-relative public artifacts.
- [x] Recheck the public repository’s validation documents and tag-specific contents after the correction.

## Preview HMR repair

- [x] Diagnose the failed Vite HMR WebSocket connection through the managed preview proxy.
- [x] Apply a proxy-compatible HMR configuration and verify the preview reconnects without client console errors.
- [x] Diagnose the renewed public-preview HMR connection that closes before opening.
- [x] Reproduce or rule out the renewed HMR failure on a fresh public-preview session using the automatic Vite client.
- [x] Apply and verify a durable proxy-compatible HMR fallback without interrupting the ongoing SSDD simulation.

## SSDD CXL-aware simulation pathway

- [x] Keep PayLock and HC-CXL source repositories out of scope until the SSDD CXL-aware simulation pathway is complete.
- [x] Evaluate CXL-aware simulators against the SSDD reference workload and existing gem5 validation structure.
- [x] Record the selected CXL-aware simulation architecture, reproducibility prerequisites, and a simulation-only claim boundary.
- [x] Define a retained-evidence experiment matrix for CXL memory latency, bandwidth, contention, ordering, disruption, scaling, and non-CXL comparison.
- [x] Run a limited reproducible next-stage validation path and retain its generated artifacts without replacing the existing baseline.
- [x] Add the validation plan and RTL/FPGA transition decision record to the SSDD repository, then verify the documented path.

## SSDD parallel evidence programme

- [x] Retain the current SimCXL Type-3 run provenance, raw outputs, failure context, and Atomic-boot boundary without interrupting it.
- [x] Specify Snapshot/Epoch-aware CXL measurements and a small, evidence-led follow-up experiment set after the current result is known.
- [x] Select a bounded first RTL target and record its interface, reference vectors, acceptance criteria, and proof boundary.
- [x] Assess the non-hardware FPGA toolchain path and the separate real-CXL-hardware route without mislabelling simulation or synthesis as hardware validation.
- [x] Preserve failed and accepted records in domain-separated SSDD evidence, and update the website only with completed evidence-backed results.
- [x] Complete only the active SimCXL proof-corruption case; retain its raw logs, manifests, commands, configurations, workload identity, and artifact hashes without starting another SimCXL run.
- [x] Extend SSC RTL validation for rotated arrival order, canonical four-key ordering, three-key-prefix tie-breaking, exact collisions, reject-then-valid recovery, and repeated independent invocations, retaining two complete runs.
- [x] Compare retained Python reference vectors against RTL simulation output and preserve all source, testbench, vector, command, simulator, and result hashes.
- [x] Prepare an FPGA target, toolchain, clock, interface, resource, and synthesis-feasibility record while labelling any output as pre-hardware only.
- [x] Record the shortest credible real-CXL Type-3 hardware path, independent exerciser/analyzer options, measurement plan, and blockers without claiming hardware validation.
- [x] Define a realistic commercial baseline-versus-SSDD workload and its latency, jitter, throughput, overhead, deterministic-state, and recovery measurements before executing a large campaign.
- [x] Define the smallest adversarial matrix capable of falsifying Snapshot/Epoch, lateness, ordering, collision, proof, replay, and latency/jitter invariants.

## SSDD persistent-compute transition

- [x] Document the approved persistent-compute operating model for future long-running SSDD validation campaigns without moving or interrupting the active SimCXL evidence run.
- [x] Define reproducibility, evidence-retention, access-control, and cost-review gates before any future migration of simulation or FPGA workloads to persistent compute.
- [x] Record the deferred multi-option decision across the current environment, user-connected compute, independent persistent compute, external cloud, and future partner hardware access.

## Deferred repository readiness

- [x] Document a deferred-ready PayLock repository structure and publication inventory without modifying its existing repository.
- [x] Document a deferred-ready HC-CXL repository structure and publication inventory without modifying its existing repository.

## PayLock independent commercial audit

- [x] Superseded approval gate: the owner authorized autonomous DS&D public-site improvements and a final review before publishing; PayLock, Yaqeen, and HC-CXL source/repository files remain protected from modification unless separately approved.
- [x] Define PayLock as an independent commercial proof-and-governance layer, with paid AI/API services as a first application rather than its fixed identity, without positioning SSDD as a prerequisite in public product messaging.
- [x] Read and inventory the PayLock Core, Yaqeen, Dictionary, and Adapter repositories, plus any accessible local source materials, without modifying them.
- [x] Produce a source-grounded architecture and API-proof map that distinguishes implemented capabilities, evidence, assumptions, and commercial gaps.
- [x] Present a staged PayLock commercial readiness and launch roadmap for owner approval before changing repositories, product claims, or public site copy.
- [x] Enforce the owner-approved read scope: PayLock Core, Yaqeen, Dictionary, and Adapter only; exclude all other repositories and materials unless separately authorized.
- [x] Document and verify the two owner-approved deployment cases: a merchant-owned execution platform connected through an Adapter, or optional Yaqeen as a visible reference platform when the merchant lacks one.
- [x] Verify the two deployment cases against the designated PayLock Core, Yaqeen, Dictionary, and Adapter source materials, recording evidence for Core independence from Yaqeen and the exact Adapter and Dictionary roles.
- [x] Verify from source that Dictionary defines the shared semantic contract and Adapter applies that mapping before invoking Core, then correct the architecture report accordingly.
- [x] Complete a detailed read-only review of PayLock sources and deliver a source-grounded understanding summary for owner confirmation before any proposal or edit.
- [x] Prepare owner-reviewable landing-page segmentation that presents PayLock as the primary standalone product, treats Yaqeen, Adapter, and Dictionary as need-based components, and labels any multi-language translation engine as future work only.
- [x] Revise the owner-reviewable institutional positioning so DS&D is an international office portfolio, PayLock is its leading commercial product, the Yemen Medicine Platform remains excluded pending a separate decision, and any New Mexico entity is described only as in formation.
- [x] Correct the owner-reviewable positioning to state that the New Mexico virtual office, address, and correspondence are legally ready while the EIN alone remains pending, without publishing legal claims before explicit approval.
- [x] Remove any proposed public reference to EIN status and reserve tax, banking, and Stripe details for a later owner-approved update after the underlying details are ready.
- [x] Explicitly deprecate every superseded private positioning draft that still contains pending EIN or financial-status wording.
- [x] Audit all public-site and owner-reviewable DS&D/PayLock positioning materials for EIN, banking, Stripe, and pending-financial-status references, then record the clean result.
- [x] Incorporate the verified DS&D LLC name, New Mexico jurisdiction, software-development industry, and advanced-computing description into the private positioning proposal while withholding the registered address and responsible-party details from public copy unless separately approved.
- [x] Prepare a review-only visual landing-page improvement layout that preserves the current Signal / State identity and makes PayLock the clearest primary product.
- [x] Draft concise English homepage copy for owner review before modifying any public text.
- [x] Recommend whether the Yemen Medicine Platform should appear as a discreet portfolio product, with evidence-based inclusion criteria and no local-only framing.
- [x] Create a review-only four-tier portfolio layout that distinguishes ready products, products in preparation, engineering-validation programmes, and research programmes.
- [x] Draft precise English portfolio explanations and boundaries for PayLock, the Medicine Platform, SSDD, and HC-CXL before any public-page modification.
- [x] Define American English as the launch language and propose a staged localization path, with Arabic considered first only after explicit approval and no Hindi or Chinese launch version without market evidence.
- [x] Integrate the owner-approved DS&D and PayLock visual marks into the site’s existing Signal / State identity, using production-ready web assets and preserving accessibility.
- [x] Refine the homepage so PayLock is the first commercial message, then present DS&D’s portfolio by readiness without redesigning the established landing-page identity.
- [x] Strengthen global navigation, page transitions, service explanations, and related-work links so the experience operates as a complete institutional site rather than an isolated landing page.
- [x] Connect evidence-backed SSDD, HC-CXL, PayLock, and Technical Library routes through clear contextual links while preserving their distinct readiness and execution-domain boundaries.
- [x] Add or update focused automated tests for all material public-site changes, then verify responsive rendering, TypeScript, and the production build.
- [x] Prepare a final checkpoint and owner-review summary without publishing the website.
- [x] Review route-level code splitting and reduce the production bundle warning without weakening the existing page experience.
- [x] Prepare a private 72-hour PayLock and Yaqeen launch-readiness plan after the DS&D site verification is complete.
- [x] Complete a read-only readiness assessment of PayLock and Yaqeen for product, demonstration, documentation, and marketing needs.
- [x] Prepare launch materials and a final confirmation checklist without publishing, sending external messages, or enabling payments.
- [x] Create and maintain a private PayLock and Yaqeen launch-verification handoff file for continuity across future conversations.
- [x] Continue autonomous site implementation under the owner's standing authorization; preserve final owner review before publication and keep protected PayLock/Yaqeen/HC-CXL repositories read-only.
- [x] Verify the GitHub connector through a read-only retrieval, show a small fetched-data example, and summarize the available capabilities without modifying repositories.

داخلياً: التفويض الشامل للموقع مؤكد؛ لا يشمل نشر الموقع أو الأفعال الخارجية أو تعديل المستودعات المحمية.

الخطوة التالية: استئناف تنفيذ ملفات الواجهة واختباراتها من نقطة الاستقرار c908cb7a.

- [x] Audit the Envia and DoorDash Drive sandbox documentation, account access, credentials, webhook requirements, and permitted test scope before sending any sandbox request.
- [x] Record DoorDash Drive Sandbox as geographically blocked from the owner’s current browser location; preserve its documented test protocol for execution later from an account environment where the portal is permitted.
- [x] Prioritize reachable Envia Sandbox and Yaqeen non-production validation until the DoorDash external-access gate is resolved.
- [x] Research and compare geographically reachable provider sandboxes with officially documented lifecycle events, webhook delivery, authenticity controls, replay behavior, and non-production testing support; select only an evidence-bounded candidate for PayLock validation. Paddle Sandbox is the documented candidate; execution remains unperformed.
- [x] Research free or no-cost test-mode providers with explicit sandbox status, signed webhooks, lifecycle simulation, and no required shipment, payment, or production-account activation; compare them against the PayLock test matrix. Paddle Sandbox is the preferred path, followed by Stripe Test Mode and Lemon Squeezy Test Mode.
- [x] Inspect the owner’s accessible GitHub repositories in read-only mode to locate an existing sandbox-test application, webhook receiver, or documented configuration path before creating any new testing surface.
- [x] Design an evidence-bounded PayLock and Yaqeen sandbox test matrix covering authentic provider events, webhook-origin checks, rejection before proof, successful proof, cancellation, retries, duplicates, and retained redacted traces.
- [x] Superseded: the owner authorized Envia account closure and local-note cleanup; DoorDash Drive Sandbox remained geographically blocked. No further Envia or DoorDash test is active, while retained historical evidence remains preserved.
- [x] Verify that the DS&D and PayLock marks are visible, accessible, and correctly applied across the website’s primary and mobile routes; correct any confirmed presentation defect.
- [x] Update the private PayLock and Yaqeen readiness assessment, launch plan, and handoff with sandbox results and remaining launch gates.
- [x] Superseded by the owner’s explicit directive: use an isolated experiments-and-logs branch inside the existing PayLock repository instead of creating a separate private evidence repository.
- [x] Create an isolated experiments-and-logs branch inside the existing PayLock repository, with no changes to its default branch or product-source files.
- [x] Commit only redacted sandbox test definitions, logs, manifests, SHA-256 inventories, and review reports to the isolated PayLock evidence branch; never commit secrets, tokens, or private production data.
- [x] Audit the public DS&D site for any remaining identity placeholders and replace only confirmed defects with the owner-approved DS&D and PayLock visual marks; no confirmed placeholder remains after desktop and mobile verification.
- [x] Use the owner-supplied 18 August 2026 DS&D and PayLock brand board as the visual reference for any confirmed identity correction; retain accessible dark-theme variants and do not invent replacement marks.
- [x] Preserve all currently observed sandbox-readiness outcomes, including blocked and not-executed cases, in the isolated PayLock evidence branch with a reproducible manifest and no secrets.
- [x] Evaluate the GitHub signed-webhook route as a no-cost, external-event validation source for PayLock, limited to non-commercial repository events and a redacted evidence record.
- [x] Evaluate Network International Developer Hub Sandbox and exclude it from PayLock technical validation: its payment-oriented events are outside PayLock's fulfilment-only boundary.
- [x] Keep Sandbox Dubai in the commercial and regulatory exploration track only; do not present it as an API sandbox or use it as a launch prerequisite.
- [x] Verify Shopify Dev Store webhook capabilities and account prerequisites as a merchant-platform event source for a later PayLock Adapter test.
- [x] Verify Gemini service-event capabilities, callbacks, and authentication boundaries as a later asynchronous digital-service proof scenario for PayLock.
- [x] Prepare and unit-test a GitHub signed-webhook receiver that validates origin, event type, and delivery uniqueness without initiating or processing any payment.
- [x] Enforce the owner-corrected PayLock test boundary: accept only a provider-declared product-ready or fulfilment-complete signal; never collect, query, verify, infer, or govern payment status, payment data, or funds.
- [x] Align the bounded evidence route with the approved lifecycle: request freeze and H0; provider-declared delivery readiness; one-time atomic client unlock; H1 only when Provider ACK and User Unlock are both present, with no execution on interruption or partial completion.
- [x] Keep the Provider ACK and User Unlock gates as the currently documented minimum proof path, while making the Adapter/Dictionary policy extensible for additional owner-approved conditions rather than treating the two named gates as a closed list.
- [x] Close the previously proposed Shopify Dev Store fulfilment-webhook route as intentionally out of scope; do not provision a store or represent this unused path as a readiness deficit.
- [x] Prepare and unit-test an evidence-bounded Gemini digital-service completion receiver for official dynamic signed callbacks; retain only thin event metadata and never invoke PayLock Core.
- [x] Validate the owner-supplied Google-issued test key through the official models endpoint; never generate, mock, commit, or present a locally invented key as a provider credential.
- [x] Run the owner-approved GitHub release-webhook configuration and delivery exercise with short, recovery-safe browser interactions because the owner reports a weak connection rather than a disconnected browser; signed ping and exactly one redelivery each returned HTTP 202, while no release event was created.
- [x] Document the approved policy boundary: integrity, consent, one-time delivery control, and proof remain invariant; provider- and user-agreed security or operational options remain configurable through the integration contract and Adapter.
- [x] Classify the observed README wording against the approved adaptive-provider model as material before proposing any protected-source change; protected source remains unchanged.
- [x] Complete a source-backed 48-hour launch verification matrix mapping the owner-approved PayLock lifecycle to Core, Dictionary, Adapter, and Yaqeen; classify each row as implemented, configurable, integration-dependent, or absent before approving public launch wording.
- [x] Draft and source-check the public PayLock framing of three strict protocol invariants—H0-bound request, authenticated provider readiness, and controlled one-time user delivery/H1—versus configurable provider and user policies that belong to the integration contract and Adapter.
- [x] Execute a bounded Gemini non-production service-completion test with the owner-supplied Google-issued key held only in secure project settings, preserving a redacted result without customer data, financial data, or PayLock source changes; the request was accepted but callback completion is blocked or unconfirmed by the provider.
- [x] Report the Gemini outcome as executed, unsupported, or blocked based only on official API behavior; do not substitute a simulated callback or placeholder for a provider capability.
- [x] Revise the approved PayLock launch wording to express deterministic protocol invariants alongside adaptable integration tools in a confident, non-alarmist tone.
- [x] Extract approved DS&D and PayLock dark-theme logo assets from the owner-supplied brand board, publish the assets through managed storage, replace the remaining text-based mark treatment where appropriate, and verify desktop and mobile presentation.
- [x] Restart the GitHub Releases-only webhook configuration from a clean browser form after securely rotating its signing secret, then validate exactly one signed test delivery with redacted evidence.
- [x] Prepare an owner-facing, evidence-bounded PayLock test summary covering executed checks, exact outcomes, claim limits, open prerequisites, and the recommended next step.
- [x] Owner authorized cleanup of the Envia-only navigation note; deleted only that local note while retaining the already committed historical access observation in the isolated evidence branch.
- [x] Independently validate the attached UX, trust, production-safety, accessibility, metadata, and test-suite observations before modifying only substantiated issues.
- [x] Validate the owner-supplied PayLock readiness assessment against primary source-audit and test records, then state whether evidence requires a launch delay or a narrowed launch scope.
- [x] Audit all accessible GitHub repositories for retained Medusa, Vendure, or Stripe evidence of the complete provider event → Adapter → provider_ack → user_unlock → single H1 chain, and update the private launch matrix only where direct evidence supports it.
- [x] Visually review every retained Medusa, Vendure, and Stripe evidence image before drawing any further integration conclusion, recording the exact proof and limitation of each image.
- [x] Specify and implement, only after the visual review, an isolated Adapter experiment that authenticates a delivery-ready provider event and gates a concrete one-time digital resource before Core H1 issuance.
- [x] Package the evidence-review and integration-boundary method as a reusable skill after the image-first review is complete.
- [x] Fix substantiated site issues: correct internal evidence and project links, protect production error details, add accessible skip/focus and lifecycle semantics, define the outline button, and add launch metadata while removing the incomplete analytics placeholder.
- [x] Record the owner's decision to keep Shopify out of the current scope; do not provision or connect a store unless the owner reopens the decision explicitly.
- [x] Defer the transparent Shopify digital-delivery test; if reopened later, Shopify alone must handle any transaction or refund while PayLock receives only a signed delivery-ready event and H1 remains technical delivery evidence only.
- [x] Prepare a private owner-review package consolidating the visual evidence review, local Adapter experiment, reusable audit skill, website correction checkpoint, and deferred decisions.
- [x] Curate and add public-safe, evidence-bounded visual excerpts that help visitors understand the verified engineering record without exposing secrets or overstating readiness.
- [x] Verified that no active Shopify implementation exists; preserved the bounded test proposal as the only concrete retained record and kept the intentionally empty scope free of deficit framing.
- [x] Review the latest PayLock, Evidence, and Technical Library previews on desktop and mobile; record only substantiated usability, trust, and claim-boundary findings.
- [x] Produce an evidence-led DS&D and PayLock go-to-market plan that defines target wedges, offers, conversion paths, launch experiments, measurement, and Manus-supported hosting/analytics operations without overstating readiness.
- [x] Adopt the current PayLock commercial line consistently in launch-facing site copy without changing the evidence boundaries or payment exclusion.
- [x] Add validated referral-source attribution to public inquiries, persist it safely, and provide an accessible, visually responsive source-selection experience.
- [x] Review all nine accessible GitHub repositories read-only; summarize each repository's actual content, README quality, commercial role, relationship to the portfolio, and whether it merits bounded website inclusion.
- [x] Expand the 90-day go-to-market plan into a first-phase execution playbook with immediate actions, responsible roles, decision gates, messaging assets, and measurable learning loops.
- [x] Rewrite the Adapter repository README on an isolated review branch for credible public and investor-facing presentation, preserving explicit current-state limits and changing no implementation code.
- [x] Merge the owner-approved Adapter README documentation branch into the repository main branch without including implementation changes.
- [x] Build and test an isolated signed resource-ready Adapter connector that verifies a provider event, prevents duplicate delivery handling, keeps H0 server-side, and issues an opaque one-time access ticket without modifying PayLock Core.
- [x] Re-review the eight repositories other than Adapter and provide a concise evidence-bounded commercial summary for each, including whether it belongs on the DS&D website.

## Portfolio readiness assessment

- [x] Produce an evidence-bounded readiness classification for the website, PayLock, Yemen Medicine Intelligence, SSDD, Adapter + Dictionary, and Market Intelligence; distinguish launch, public-demo, research-submission, and development readiness without altering protected sources or publishing externally.

## PayLock payment-reference correction audit

- [x] Audit the protected PayLock source and public DS&D site separately for payment or funds references; reconcile prior removal statements with exact surviving paths and report any source change that needs explicit owner authorization.
- [x] Correct the PayLock audit to classify the optional provider-supplied commercial-gating signal around H0 as an adaptation policy, not as PayLock payment processing or a reason to alter protected Core source.
- [x] Conduct a source-only review for any active money/funds handling and for all H2 references; classify each finding as Core invariant, optional provider adaptation, legacy artifact, documentation, or test-only without modifying protected files.
- [x] Extend the source-only review to Yaqeen as the PayLock reference platform for small and medium providers; trace its integration assumptions, H2 references, optional provider policies, and commercial-launch relevance without modifying protected files.
- [x] Update Yaqeen README to describe its current PayLock reference-platform role accurately and remove any H2 reference.
- [x] Reject the default `test-key` in Yaqeen live production mode while preserving explicit local-development behavior.
- [x] Add and run a reproducible joint PayLock–Yaqeen release test covering the H0, provider acknowledgement, user unlock, H1, and replay-rejection path.
- [x] Extend the joint release suite with provider-response delay, failed/aborted provider acknowledgement, and client-side connection interruption cases; preserve one-H1 and no-release-on-failure invariants.
- [x] Push the expanded Yaqeen review branch and merge it into the repository main branch after all joint release checks pass.
- [x] Prepare a final non-public release package with versioned release notes and a source-backed test-coverage report for the PayLock–Yaqeen path.
- [x] Add the PayLock–Yaqeen joint release suite to Yaqeen CI, verify the remote workflow run, and preserve the existing production-key guard.
- [x] Present the unpublished Yaqeen release notes and PayLock–Yaqeen coverage report for owner review before any public release.
- [x] Audit the current Yaqeen source and deployment contract for the operator or provider credential that protects the reference platform; do not assume a key per end user, and treat an unimplemented multi-client key-management plane as optional policy rather than an invented launch requirement.
- [x] Present the two approved operating paths—PayLock with a provider-owned delivery platform, or PayLock with Yaqeen as the provider’s reference platform—and identify only the credential decision that applies to the selected path; implement and test nothing new without owner approval.
- [x] Update Yaqeen documentation and operational release notes to declare the permanent direct Yaqeen ↔ PayLock Core integration, reserve Adapter for external platforms only, and define the production API key as an instance-scoped server secret rather than an end-user credential.
- [x] Add focused regression coverage showing Yaqeen rejects a production request without a valid server API key while never exposing that key to browser-facing code, then run the joint release suite and CI.
- [x] Audit the available Yaqeen deployment configuration, CI permissions, secret-injection contract, exposed network surface, logging, dependency controls, and recovery assumptions; separate verified findings from settings that require hosting-console access.
- [x] Compare provider-operated isolated Yaqeen instances with DS&D-operated isolated instances, recommend the launch model, and define the minimum security controls and responsibility boundary before any production deployment change.
- [x] Superseded by the owner-approved trust model: do not split Yaqeen’s direct Core connection into an external API-key path; Yaqeen ↔ Core remains native and direct inside one trusted deployment boundary.
- [x] Restore the unhealthy Railway service from its deployment logs, configure a verified non-sensitive health check, provision the first provider-isolated DS&D-operated trusted stack, and complete a controlled launch verification after owner approval.
- [x] Superseded by the later owner-approved production contract: Yaqeen ↔ PayLock Core remains native/direct within the trusted deployment and its server credential is never exposed publicly; Adapter remains reserved for external-platform boundaries.
- [x] Verified the enforceable same-project private-network boundary before retaining the server-only production credential; no public unauthenticated Yaqeen API was created.
- [x] Update Yaqeen server configuration and tests to distinguish the native internal Core path from external-platform ingress without adding an Adapter or modifying PayLock Core.
- [x] Add a narrow non-sensitive readiness route, require durable Redis in production, and prevent broad diagnostic or evidence data from being exposed through the public service.
- [x] Pin reproducible CI inputs, run the joint release suite, push reviewed Yaqeen-only changes, and verify the remote workflow result.
- [x] Apply the corresponding Railway deployment configuration only after an enforceable private network or same-process boundary was verified; diagnose the existing crash and complete a controlled deployment check.
- [x] Produce an owner-reviewable architecture note showing the native Yaqeen ↔ PayLock Core trusted boundary and the distinct external-platform → Adapter → Core credentialed boundary.
- [x] Audit Yaqeen’s current prototype user experience, data durability, tenant isolation, provider operations, observability, recovery, and deployment model against the needs of a production reference platform for providers without an existing delivery platform.
- [x] Define and implement the first production-capable Yaqeen scope: provider workspace, resource issuance and one-time user access experience, durable operational records, per-provider isolation, and an operator-safe support surface, without representing H1 as financial evidence or modifying PayLock Core.
- [x] Add production-focused automated coverage and controlled-release documentation for Yaqeen, including failure preservation, privacy-aware logs, health/readiness, recovery, and provider-instance provisioning.
- [x] Design durable Yaqeen records for provider configuration, delivery resources, opaque one-time access tickets, lifecycle events, and preserved failed evidence without storing H0 in public-facing records.
- [x] Build a provider operations surface for creating delivery resources and issuing user access links, separated from the user-facing delivery and redemption experience.
- [x] Build a one-time user delivery flow using opaque tickets that records user access, preserves failures, and initiates the existing native PayLock lifecycle without exposing server credentials or H0.
- [x] Design and implement an optional, provider-configured Webhook layer with signed envelopes, replay protection, bounded retries, failure preservation, and explicit event semantics; keep it disabled by default and non-authoritative for H1.
- [x] Add provider-facing disclosure that optional Webhooks do not create a payment, refund, custody, or financial-verification responsibility for PayLock or Yaqeen.
- [x] Add clear provider and user notifications that a delivery session is constrained and produces an encrypted, timestamped technical event record; keep its meaning limited to technical delivery evidence and preserve failures without exposing H0.
- [x] Complete production Redis provisioning and inject the approved durable connection into the first DS&D-operated provider-isolated Yaqeen stack.
- [x] Apply the complete non-test Yaqeen production-secret contract and private Core-network configuration in the deployment environment.
- [x] Replace the crashed Railway deployment with the prepared release configuration, verify the non-sensitive health endpoint, and retain an operator recovery runbook without publishing the DS&D website.
- [x] Use the owner-authorized Railway and GitHub access to provision Redis, apply Yaqeen production configuration, and redeploy the prepared release without touching PayLock Core.
- [x] Execute and retain a pre-launch hardening suite covering configuration rejection, Redis durability, private-boundary enforcement, opaque-ticket concurrency, delivery-failure preservation, Webhook replay/retry behavior, and the direct PayLock lifecycle before any public launch claim.
- [x] Superseded by the owner-approved same-project private-network topology: GitHub-sourced Yaqeen and unmodified Core run together in the unified Yaqeen project; the separate PayLock project remains available for external-platform use.
- [x] Configure the Railway Yaqeen project as the unified Yaqeen + PayLock delivery service while preserving the separate PayLock project for external-platform use and its own GitHub-linked release path.
- [x] Treat GitHub as the sole release source for Yaqeen; verify the connected Railway and Docker Hub paths consume the approved GitHub revision, and document the Checkly management-session boundary rather than claiming an unverified monitor target.
- [x] Deploy an unmodified GitHub-sourced PayLock Core service inside the Yaqeen + PayLock Railway project because Railway private networking is project-scoped; retain the separate PAYLOCK project for external-platform operation.
- [x] Inventory `uniqueteamyemen` Docker Hub repositories and the owner-provided Checkly status page; align the verified Docker image with the approved GitHub release lineage and preserve the Checkly monitor as unchanged pending authenticated management access.
- [x] Store unified-stack credentials only as Railway secret variables, expose them solely to the Yaqeen and Core runtime processes, and remove temporary local generation material after secret storage is verified.
- [x] Complete one focused Railway launch-readiness attempt without repeated exploratory changes; either verify Core/Yaqeen/Redis health or record the exact platform block and stop.
- [x] Run the focused Yaqeen pre-launch hardening gate from GitHub Actions alongside the established joint release suite.
- [x] Correct the production Yaqeen Railway environment contract identified in deployment logs, then perform one documented health verification without altering PayLock Core.

- [x] Build and push a Docker image for the exact verified Yaqeen release commit to Docker Hub without changing source code or Railway configuration, then verify and record the exact image tag and commit SHA.

- [x] Superseded by the owner-approved production path: retain GitHub → Railway; Docker Hub remains an independent verified artifact and is not used as Railway's deployment source.
- [x] Verify the approved GitHub → Railway Yaqeen release is running, confirm health/Redis/private Core readiness, execute the existing live PayLock–Yaqeen release path and approved edge cases, and verify the existing Checkly status without changing code, Core, or secrets.
- [x] Create and run an external live-verification harness with isolated data inside the deployed Yaqeen environment for H0 → provider_ack → user_unlock → one H1 → verification → replay rejection, preserving the existing local release test and approved source unchanged.
- [x] Diagnose the live Yaqeen-to-Core HTTP 502 from Core logs and Railway private-link variables; repair only verified runtime configuration defects—Core Redis reference refresh and Yaqeen private-Core port correction—then rerun the same isolated harness successfully.
- [x] Extract, preserve, and provide the exact retained output of the successful isolated Railway live-verification harness; keep `/healthz` explicitly separate from delivery-chain proof.
- [x] Diagnose and correct the managed-preview Vite HMR WebSocket connection failure without changing public site behavior, then verify the preview console is clean.
- [x] Replace the ineffective HMR-disable fallback with an explicit managed-preview HTML transform that removes the unusable Vite HMR client; restart and verify a fresh cache-busted preview connection without a WebSocket error.
- [x] Re-verify the user-reported Vite WebSocket error against a new public preview document and latest browser log; distinguish a cached 17:03 session from any active post-fix injection, and correct only a confirmed active defect. Added no-store handling for HTML preview responses so an earlier document cannot be reused.
- [x] Isolate and replace the active `/@vite/client` delivery path evidenced by the 17:11 public-preview error with a CSS-compatible, WebSocket-free development module; verify the refresh endpoint and current browser logs show no new WebSocket failure.
- [x] Build a free local development automation agent that observes source changes, reports preview/test health, and sends a browser-safe refresh signal without WebSocket-based HMR. It uses bounded HTTPS polling, has no external dependencies, and is documented in `DEVELOPMENT.md`.
- [x] Create a new private GitHub repository for the DS&D website, push the current source and development-operation documentation, and verify the remote contents without publishing the site. Repository: `uniqueteamyemen/deterministic-solutions-design-website` at commit `10b6cc5`.
- [x] Set the DS&D website repository description and focused topics on GitHub.
- [x] Add a GitHub Actions workflow that installs dependencies, runs the website test suite, and builds the production bundle on pushes and pull requests.
- [x] Superseded by the owner’s decision not to upgrade GitHub: defer `main` branch protection, retain the repository as private, and keep the completed CI workflow active for every push and pull request.
- [x] Make the public GitHub Actions suite deterministic without committing production credentials, while retaining live credential validation for credentialed environments.
- [x] Confirm the current GitHub plan blocks branch protection for this private repository; retain private visibility and record the explicit platform requirement rather than weakening repository privacy.
- [x] Verify the actual destination and interaction behavior of the `Talk to PayLock` link on the PayLock page.
- [x] Verify that the DS&D site currently exposes neither search nor the medicine platform; reserve a separate, clearly bounded Work/portfolio entry with an explicit status label and destination for the medicine platform if the owner approves its inclusion.
- [x] Audit every public route at desktop and phone widths for text overflow, clipped controls, spacing failures, and weak visual hierarchy.
- [x] Refine shared site chrome, internal-page composition, typography, and responsive containment while preserving the graphite, bone, and signal-lime Signal/State identity.
- [x] Verify the visual refinements across all public routes, update applicable regression coverage, and confirm the production build without changing product, protocol, or service behavior.
- [x] Perform a read-only source-backed mapping of the owner-provided state, idempotency, webhook, controlled delivery, and audit-trail terms to PayLock/Yaqeen coverage and explicit boundaries.
- [x] Provide a read-only explanation of behavioral-panic UX patterns and PayLock/Yaqeen failure or link-tampering defenses without changing any product source or configuration.
- [x] Verify read-only whether a failed unlock attempt preserves the original delivery ticket for its first successful use, and explain the result against the owner's atomic-lock requirement.
- [x] Verify read-only whether product disclosure requires a live network request to Yaqeen/PayLock and whether any local unlock path exists.
- [x] Record the owner-mandated invariant that no lock opening or digital-asset disclosure is permitted without a live network connection to system servers; treat offline/local fallback as prohibited.
- [x] Verify directly from source whether a user can receive service delivery only through a live Yaqeen/Core network interaction, and state the exact boundary at the provider.
- [x] Add the full company name directly below the DS&D logo in the site header, preserving desktop and mobile responsiveness.
- [x] Verify the owner-provided Zenodo deposits and Smarty community record, including version lineage and supplement relation.
- [x] Replace any unsupported “published research” wording with accurate, source-backed language for documented Zenodo research records across public pages and the technical library.
- [x] Add the verified Zenodo records to the technical library where appropriate, with clear scope and repository links.
- [x] Verify the official Chiplet Summit 2027 call-for-presentations requirements, submission deadline, and scope without submitting a proposal.
- [x] Assess SSDD’s evidence-backed fit for a technical Chiplet Summit presentation and identify only supportable claims, limitations, and audience relevance.
- [x] Prepare an owner-reviewable SSDD presentation abstract and achievement-focused biography basis; do not submit or represent acceptance without explicit owner approval.
- [x] Defer all Chiplet Summit discussion and proposal work until the owner explicitly requests it; keep platform review as the active priority.
- [x] Audit and rebalance the full site typography so oversized display headlines and low-visibility utility text are corrected across desktop and mobile without changing the Signal/State identity or logo position.
- [x] Verify typography readability and layout containment on all public routes at desktop and mobile breakpoints, then run the full test suite and production build.
- [x] Repair the technical library public route discovered as a 404 during visual review, then verify its navigation targets and rendering.
- [x] Inspect and resolve the wide-screen hero-background tonal split if it is an unintended visual artifact rather than a deliberate, legible compositional layer.
- [x] Compare local DS&D website commits with the GitHub repository and push the approved outstanding website updates after verification.
- [x] Perform a final responsive audit of the hero, typography, navigation, cards, and overflow at 375×812, 768×1024, 1280×720, and 1876×870 across all public routes.
- [x] Correct any remaining device-specific readability, spacing, containment, or wide-screen hero-background issues found in the final audit, then rerun tests and the production build.
- [x] Apply a status discipline to audit notes and reports: label findings as open, in progress, resolved, or verified; do not restate resolved findings as current problems.
- [x] Push the latest completed responsive-review updates to the private GitHub repository and verify the remote head.
- [x] Produce an owner-reviewable SSDD test inventory that separates executed evidence from tests explicitly deferred for later.
- [x] Ensure the SSDD test report uses execution records only and never presents Zenodo documentation as test evidence.
- [x] Identify the exact recorded KVM-unavailability condition in the SimCXL evidence and its effect on measurement interpretation.
- [x] Define a measurement pathway for SSDD that keeps Atomic, KVM-enabled simulation, and physical CXL evidence scientifically separate.
- [x] Do not mark any SSDD latency, jitter, throughput, or baseline-comparison test complete from Atomic CPU execution without the required KVM-enabled measurement stage.
- [x] Start the remaining SSDD validation campaign with functional checks that are valid in the available environment.
- [ ] Execute the expanded SimCXL interleave and DRAM-control matrix locally, retaining behavioral outputs only and declaring the Atomic-CPU / no-KVM boundary.
- [ ] Select and admit an independent x86 KVM-capable execution environment before running any SSDD timing, commercial baseline-versus-SSDD, or adversarial response-time measurement; verify `/dev/kvm` and `vmx`/`svm` before using it.
- [ ] Run the commercial baseline-versus-SSDD and adversarial falsification matrices only after the KVM admission gate and explicit owner approval of the specific access arrangement succeed, retaining matched manifests and raw outputs.
- [ ] Evaluate persistent-compute migration only after the KVM measurement campaign, using a documented resource and cost review; do not create a persistent service or scheduled job before the owner explicitly authorizes it.
- [ ] Keep all remaining execution within the 85-hour ceiling and the US$800 maximum budget, using rental or research/partnership access only; do not purchase a lab, server, FPGA board, or CXL endpoint.
- [x] Produce a detailed SSDD Rental Plan with provider links, an 85-hour execution schedule, a US$300–800 budget allocation, and stop gates for KVM, FPGA, and real CXL access.
- [x] Compare current independent KVM-capable x86 hosting options, their admission guarantees, and estimated campaign cost before selecting a provider.
- [x] Verify whether any available Manus execution environment exposes actual KVM prerequisites (`/dev/kvm` and CPU virtualization flags) for gem5 measurement work.
- [x] Design one SSDD validation environment covering KVM-based workload measurement, FPGA implementation validation, and real CXL Type-3 verification without conflating their evidence.
- [x] Identify the required host, FPGA board/toolchain, CXL Type-3 endpoint, instrumentation, and access model for the unified validation environment.
- [x] Estimate phased acquisition or rental cost and identify which validation stages can begin before real CXL hardware is available.
- [x] Design one SSDD validation environment covering KVM-based workload measurement, FPGA implementation validation, and real CXL Type-3 verification without conflating their evidence.
- [x] Identify the required host, FPGA board/toolchain, CXL Type-3 endpoint, instrumentation, and access model for the unified validation environment.
- [x] Estimate phased acquisition or rental cost and identify which validation stages can begin before real CXL hardware is available.
- [x] Prepare one owner-facing SSDD plan that states the implementation sequence, costs, assumptions, and quote-dependent items for KVM, FPGA, and real CXL.
- [x] Search Saudi Arabia, Dubai, Africa, and South America for current free or research-access paths to KVM, FPGA, and physical CXL hardware, and classify each by verifiable availability. Refreshed 22 August 2026 in `/home/ubuntu/ssdd-regional-access-refresh-20260822.md`; the record distinguishes verified channels from unverified hardware availability.
- [x] Evaluate remote KVM, FPGA, and CXL access offers that may be available through a future research or commercial partnership, without making any commitment on the owner's behalf. No currently documented offer passes the KVM or physical-CXL gate; the assessment preserves owner-led outreach and non-binding posture.
- [x] Prepare one owner-facing SSDD plan that states the implementation sequence, costs, assumptions, and quote-dependent items for KVM, FPGA, and real CXL.

- [x] Verify official contact channels and current application requirements for the nine owner-approved SSDD access targets: SNIA, RDIA→KAUST, Chameleon/KVM@TACC, MemVerge, Khalifa University labs, H-BRS↔UNSL, LabsLand, and KACST via RDIA.
- [x] Identify up to two publicly listed, professionally relevant research, laboratory, or programme contacts for each approved target, using only official institutional information or public professional profiles.
- [x] Prepare tailored DS&D access or non-binding partnership outreach drafts for each approved target, without overstating current hardware availability or making commitments.
- [x] Prepare and retain an auditable outreach package and send register, including verified recipient channels, message purpose, sender-address verification, and the one-follow-up limit.
- [x] Superseded by owner-led sending: do not send SSDD outreach through the agent-connected Gmail channel; retain the company-sender verification finding and prepare the material for the owner to send from baker@deterministicsolutionsdesign.com.
- [x] Prepare a final owner-sendable SSDD outreach package containing verified official recipients, suitable public professional contacts, tailored messages, source links, and concise manual sending instructions.
- [x] Keep all external email unsent by the agent; the owner will send each approved message manually from baker@deterministicsolutionsdesign.com after review.
- [x] Deliver the complete single-file SSDD outreach package with all nine target messages and recipient details; no further research-only delay is acceptable once the source-backed record is sufficient.
- [x] Superseded after owner clarification: do not change the KACST outreach entry; explain factually why KACST was not apparent in the delivered package.

- [x] Assess the current SSDD evidence and independently executable tests to define a defensible research question, presentation format, claim boundaries, and submission readiness without conflating simulation, FPGA, or physical-CXL validation.

- [x] Evaluate the proposed Model 3+ SSDD framing against current evidence, KVM measurement gates, and the no-purchase constraint before approving any claims or execution sequence. Decision: approve the strategic direction only; use the evidence-bounded behavioral framing until a KVM-admitted, Timing-CPU paired measurement campaign is executed.

## SSDD Model 3+ local evidence packages

- [x] Execute package A: the predeclared local adversarial functional matrix, retaining positive controls, negative dispositions, raw logs, and independent replay where applicable. Accepted in `model3plus-local-20260822T020000Z` within the native-reference boundary.
- [x] Execute package B: the local ledger and proof-integrity matrix, retaining each defined tamper case, verifier output, and last-valid-state evidence. Accepted for the declared reference ledger and native compiled proof-control workload only.
- [x] Execute package C: an independent cross-implementation replay comparison with retained manifests, implementation hashes, and artifact hashes. Python and retained Rust reference chains matched across 100 epochs.
- [x] Execute package D: a cross-domain sanity table that distinguishes reference, gem5, SimCXL, RTL, FPGA, and physical-CXL claims without transferring evidence between domains. The table is retained in `docs/validation/model3plus-local-campaign-plan.md`.
- [x] Execute package E: an immutable artifact register for the Model 3+ local campaign, with input, tool, configuration, output, and SHA-256 provenance. The accepted rerun retained 26 raw artifacts and passed both artifact-hash and inventory self-hash checks.
- [x] Review the completed A–E results against the Model 3+ claim boundary, publish no unsupported performance conclusion, and retain a final owner-reviewable local-campaign report. Retained at `docs/validation/model3plus-local-campaign-results.md`; performance and hardware claims remain explicitly open.

## SSDD controlled validation campaign — owner specification 2026-08-22

- [ ] Create a distinct campaign directory, frozen configuration manifest, evidence registry, SHA-256 inventory, blocked/failure registry, and Git-tracked documentation without overwriting prior SSDD evidence.
- [ ] Verify the selected x86 environment for `/dev/kvm`, `vmx`/`svm`, usable KVM access, gem5 availability, and the KVM-to-Timing-CPU ROI hand-off; record an auditable smoke result.
- [ ] Execute the expanded SimCXL Type-3 behavioral follow-up matrix across supported DRAM, CXL-aware, interleave, controlled-memory, and interference configurations, retaining raw outputs and declaring any Atomic-CPU results non-performance evidence.
- [ ] Execute matched baseline-versus-SSDD quantitative measurements only after the KVM and Timing-CPU gate passes, with repeated distributions, raw `stats.txt`, guest logs, manifests, and matched input/workload configurations.
- [ ] Execute the established adversarial falsification matrix, preserving accepted, rejected-as-designed, failed, timed-out, blocked, and invalid/inconclusive results without overwriting negative evidence.
- [ ] Execute governance ablation and overhead-decomposition experiments only where the existing implementation permits reliable isolation; classify any non-isolable component as `NOT SEPARABLE`.
- [ ] Execute the persistent-compute long-run reproducibility campaign only after a specific persistent environment and automated-execution approach are approved, preserving each run independently.
- [ ] Produce the unified evidence/metrics matrix, cross-domain comparison, supported-versus-unsupported claim register, concise interpretation, and publish the reviewed campaign record to `uniqueteamyemen/ssdd-research`.

## SSDD KVM infrastructure acquisition and smoke execution

- [ ] Inventory all currently accessible infrastructure paths, connected services, connectors, and autonomous provisioning routes that could yield an x86_64 KVM-capable environment without purchasing physical hardware.
- [ ] Evaluate public and low-cost provider options for short-lived x86_64 KVM access, preferring already available resources first and retaining exact eligibility, cost, and capability evidence for each candidate.
- [ ] Secure the first viable KVM-capable environment autonomously where permissions allow, then document provider identity, host details, CPU model, storage, RAM, and every infrastructure change made.
- [ ] Run a KVM smoke path proving `/dev/kvm`, `vmx` or `svm`, guest boot, gem5 launch, Timing-CPU transition, and measurement-ROI reachability before any full SSDD performance run.
- [ ] Resume the SSDD performance path from the controlled campaign lineage only after the smoke gate passes, or preserve a precise blocked-state record if no accessible environment can satisfy the gate after exhausting available routes.

## SSDD cloud-rental KVM path

- [ ] Compare short-lived cloud or bare-metal rental candidates that can expose `/dev/kvm` and `vmx`/`svm`, separating advertised virtualization from verified nested-KVM capability and recording current cost terms.
- [ ] Prepare a provider-specific provisioning and teardown procedure that caps spend, records machine specifications, and runs the KVM-to-Timing-CPU smoke gate before any full campaign.
- [ ] Obtain explicit owner confirmation of the chosen provider, maximum spend, and resource creation before accepting terms, charging an account, or creating a paid cloud resource.

## SSDD bare-metal execution budget and gem5 configuration

- [x] Define a line-item hourly budget with provider cost, tax contingency, storage, transfer, setup time, test time, teardown time, and a stop-loss threshold for the SSDD bare-metal campaign. The US$0.40/hour planning arithmetic is US$34.00 for 85 hours, with an owner-approved US$80 maximum required before provisioning.
- [x] Produce an hour-by-hour SSDD execution schedule covering host admission, operating-system hardening, gem5 build validation, KVM boot, Timing-CPU ROI hand-off, matched measurements, adversarial tests, evidence packaging, and teardown. The schedule and stop-loss decisions are retained in `ssdd-bare-metal-execution-plan-20260822.md`.
- [x] Produce the provider-neutral Bare Metal gem5 runbook, including host prerequisites, dependency installation, reproducible build inputs, guest-image preparation, KVM admission tests, Timing-CPU checkpoint/restore procedure, and failure gates. The guide distinguishes the mandatory SimCXL Type-3 smoke from the separate MESI build required by the optional gem5 stdlib KVM diagnostic.

## SSDD scaling characterization amendment

- [x] Add a standalone Scaling Characterization experiment to the 85-hour Bare Metal campaign: matched baseline and SSDD levels of 8, 16, 32, 64, and 128 (or a documented workload-equivalent ladder), three independent repeats per level, and retained latency, p95/p99, jitter, throughput, CPU and memory overhead, queue/backpressure, and state/integrity outcome fields. The H45–H53 time box, manifest/pilot contract, per-counter limits, KVM-plus-Timing-CPU gate, no-extrapolation rule, and unchanged US$80 ceiling are now recorded in the owner plan and SSDD repository record.

## Cherry Servers owner-assisted provisioning

- [x] Review the Cherry Servers bare-metal creation form and present only the required account, host-selection, SSH-key, billing, and approval inputs to the owner; stop before resource creation or payment. The portal requested service purpose, reason for choosing the provider, referral source, contact phone, and LinkedIn URL; the deployment page then returned a provider-side network error/blank state before host selection. No personal data was entered, no host was selected, no resource was created, and no payment screen was reached.
- [x] Inspect the Cherry Servers portal’s visible billing cadence and deployment categories to determine whether the owner is viewing monthly dedicated-server offers or an hourly Bare Metal route; report the result before selecting a host or entering payment. The portal’s `Dedicated Servers → 8–16 Cores` page visibly states `Billing: Monthly`; the selected Chicago AMD Ryzen 7700X offer is €159/month base and €265/month with the shown 2×2 TB NVMe configuration. It is not an hourly route and exceeds the US$80 approved-planning ceiling, so it was not selected or submitted.
- [x] Configure the owner-visible Cherry Servers draft to the minimal SSDD Bare Metal specification—Chicago AMD Ryzen 7700X, 8 cores / 16 threads, 64 GB RAM, 2×1 TB NVMe, Ubuntu 24.04, no control panel, no additional IPs, included 100 GB backup—then stop before Pay & Deploy and verify any billing-frequency control shown by the portal. The exact 64 GB ready-built row had zero stock, so the owner-visible draft uses the next ready-built row: 96 GB RAM and 2×1 TB NVMe, with no custom setup fee; all other requested defaults remain selected.
- [x] Select the available pre-built Cherry Servers hardware configuration only, retain Ubuntu 24.04 and all included defaults, and stop at the price/frequency summary without changing the custom configuration, creating an instance, or entering payment. The live summary shows AMD Ryzen 7700X, Chicago, 96 GB DDR5, 2×1 TB NVMe with RAID 1, Ubuntu 24.04, no control panel, no additional IPv4/IPv6, 100 TB egress, private VLAN, 100 GB backup, disabled monitoring, 15–30 minute deployment estimate, and EUR 179/month. No SSH key was chosen, no payment was entered, and Pay & Deploy was not pressed.

## SSDD remote-host access

- [x] Generate a dedicated ED25519 SSH key pair for the SSDD temporary bare-metal host, disclose only its public key for the owner to add in Cherry Servers, and retain no root password. Public-key fingerprint: `SHA256:9ckWXkjoPPHGi84h4BzspMlyMKqeg+swDJbTTUKwU6I`.
- [ ] Confirm the paid Cherry Servers instance is active, obtain its public address through the portal, and prove that the dedicated SSDD SSH key—not the owner’s browser or root password—can reach it before the owner disconnects.
- [ ] Create the owner-approved Cherry Servers Bare Metal instance at the live hourly configuration: Chicago AMD Ryzen 7700X, 96 GB DDR5, 2×1 TB NVMe RAID 1, Ubuntu 24.04, key `SSDD`, and EUR 0.306/hour; then monitor deployment without changing the selected configuration.
- [ ] Repair the campaign SSH-key attachment through the Cherry Servers console if `/root/.ssh/authorized_keys` does not contain the approved SSDD public key, then re-run the non-destructive remote KVM preflight without using a root password.
- [ ] Match the owner-selected public key `ssdd-cherry-2026` to an existing local private key and retry access with that matching key only; do not add, replace, or remove any server SSH key.
- [ ] Diagnose the local `ssdd-cherry-2026` private-key transfer only: inspect its redacted boundary lines, file type, and specified `ssh-keygen` parse commands; make no key-file edits, no server changes, and no Cherry SSH attempt unless parsing succeeds.
- [x] Transfer the owner-verified Windows private-key file through a single-line Base64 PowerShell bridge into a secure field, restore it only in a temporary local file, and validate its fingerprint before any future Cherry SSH attempt.
- [ ] Run one non-destructive `id` command against Cherry with the verified `ssdd-cherry-2026` credential; do not modify the server, add keys, or deploy anything during this access proof.
- [ ] Use the owner-provided temporary Cherry console credential to inspect the system account, `/root/.ssh/authorized_keys`, and file permissions in read-only mode; do not alter a server file, key, account, or deployment setting.
- [ ] Open the authenticated BMC HTML5 iKVM screen and stop immediately once the Ubuntu display is visible; do not send keystrokes, inspect files, or alter server state.
- [x] Replace the older dark/neon shared-shell and institutional-route treatment with the approved Reference Mark materials and typography, while retaining every existing route, link, form, and evidence boundary.
- [x] Refine the Reference Mark composition using the supplied visual comparison: make the multi-process-to-one-reference diagram more legible and introduce a more deliberate method-grid rhythm, without copying the source layout or weakening DS&D’s evidence boundaries.
- [x] Correct the DS&D public message so avoidable difficulty is framed as apparently compulsory—not a consciously chosen option—until visible consequential details and a shared rule reveal a safer alternative.
- [x] Add a campaign-ready workplace examples section that contrasts an apparently compulsory burden with the consequential detail to inspect and a safe shared alternative; label illustrative thought experiments as such and avoid presenting popular myths as verified facts.
- [x] Produce an evidence-aware DS&D social-media campaign plan with short platform copy, clearly labelled illustrative scenarios, and a practical response strategy for customer resistance to revisiting apparently compulsory difficulty.
- [x] Add approval-ready 15-second Instagram video briefs and asset-governance rules: private GitHub for copy, scripts, approvals, and manifests; managed asset storage for final media; no social publication without explicit owner confirmation.
- [x] Defer production and review of the three original 15-second DS&D videos at the owner’s direction; retain only the pencil, T-shirt, and oversized generic-bottle scripts for later generation, with no third-party logos, unverified historical claim, real-person imitation, or publication.
- [x] Run a professional-quality DS&D website sprint: audit public routes and page consistency, strengthen accessibility and resilient UI states, add targeted quality coverage, validate across target breakpoints, and record reviewable improvements without publishing or changing product/research services.
- [x] Finalize a production-ready PayLock Reference Mark asset and concise use rules that represent a named event, shared reference, and readable proof path—not a lock, payment rail, or custody service.
- [x] Build public DS&D and PayLock explanatory catalog pages with evidence-aware language, clear navigation, responsive visual systems, and no claims beyond current product/research readiness.
- [x] Add and verify one repeatable quality command that runs the website tests, TypeScript check, and production build in the same sequence used by continuous integration.
- [x] Align the homepage navigation with the public catalog system by adding direct DS&D Catalog and PayLock routes across desktop and mobile while preserving the existing section anchors.
- [x] Align the page title and search/social metadata with DS&D’s approved promise: make consequential details clear and the next shared action reliable, without unsupported performance claims or obsolete dark-signal imagery.
