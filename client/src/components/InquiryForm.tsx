import { Check, Mail, MessageSquare, RefreshCw, Send, ShieldCheck, User } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  inquiryReferralSourceDescriptions,
  inquiryReferralSourceLabels,
  inquiryReferralSources,
  inquirySchema,
  inquiryTopicLabels,
  inquiryTopics,
  type InquiryInput,
} from "@shared/inquiry";

const initialForm: InquiryInput = {
  fullName: "",
  email: "",
  organization: "",
  topic: "architecture",
  referralSource: "direct",
  message: "",
  website: "",
};

interface InquiryRecord {
  id: string;
  fullName: string;
  email: string;
  organization?: string | null;
  topic: string;
  message: string;
  recipient?: string;
  status?: string;
  createdAt?: string;
}

export default function InquiryForm() {
  const [form, setForm] = useState<InquiryInput>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [activeTab, setActiveTab] = useState<"compose" | "feed">("compose");

  const update = (field: keyof InquiryInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const loadInquiries = async () => {
    setIsLoadingFeed(true);
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.warn("Failed to load internal inquiries:", err);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    const parsed = inquirySchema.safeParse(form);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Please review the form.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "The inquiry channel is unavailable.");
      setStatus("success");
      setMessage("Message recorded in Firestore and notification routed to baker@deterministicsolutionsdesign.com.");
      setForm(initialForm);
      loadInquiries();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The inquiry channel is unavailable.");
    }
  };

  return (
    <section className="inquiry-section" aria-labelledby="inquiry-title" id="discussion-space">
      <div className="container inquiry-grid">
        <div className="inquiry-intro">
          <div className="section-index">02 <span>/</span> Managed inquiry channel</div>
          <div className="section-kicker">Internal space &amp; notifications</div>
          <h2 id="inquiry-title">Start with a<br /><em>clear signal.</em></h2>
          <p>
            Submit the operating context, desired outcome, and constraint. All incoming messages and alerts
            are permanently retained in Firestore and routed directly to{" "}
            <strong>baker@deterministicsolutionsdesign.com</strong>.
          </p>

          <div style={{ marginTop: "24px", display: "flex", gap: "8px" }}>
            <button
              type="button"
              className={`button ${activeTab === "compose" ? "button-primary" : "button-outline"}`}
              style={{ fontSize: "13px", padding: "8px 16px" }}
              onClick={() => setActiveTab("compose")}
            >
              <Send size={14} /> New message
            </button>
            <button
              type="button"
              className={`button ${activeTab === "feed" ? "button-primary" : "button-outline"}`}
              style={{ fontSize: "13px", padding: "8px 16px" }}
              onClick={() => {
                setActiveTab("feed");
                loadInquiries();
              }}
            >
              <MessageSquare size={14} /> Discussion space ({inquiries.length})
            </button>
          </div>

          <div className="inquiry-boundary" style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--lime)", marginBottom: "6px" }}>
              <Mail size={15} /> <b>Official Notification Gateway</b>
            </div>
            <p style={{ margin: 0 }}>
              Direct contact &amp; inquiry routing:{" "}
              <a href="mailto:baker@deterministicsolutionsdesign.com">
                baker@deterministicsolutionsdesign.com
              </a>
            </p>
          </div>
        </div>

        {activeTab === "compose" ? (
          <form className="inquiry-form" onSubmit={submit} noValidate>
            <div className="form-grid">
              <label>
                <span>Name</span>
                <input value={form.fullName} onChange={(event) => update("fullName", event.target.value)} autoComplete="name" required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" required />
              </label>
            </div>
            <div className="form-grid">
              <label>
                <span>Organization <i>optional</i></span>
                <input value={form.organization} onChange={(event) => update("organization", event.target.value)} autoComplete="organization" />
              </label>
              <label>
                <span>Inquiry focus</span>
                <select value={form.topic} onChange={(event) => update("topic", event.target.value)}>
                  {inquiryTopics.map((topic) => <option key={topic} value={topic}>{inquiryTopicLabels[topic]}</option>)}
                </select>
              </label>
            </div>
            <label>
              <span>Context and intended outcome</span>
              <textarea value={form.message} onChange={(event) => update("message", event.target.value)} minLength={20} maxLength={4000} required />
            </label>
            <fieldset className="referral-fieldset">
              <legend>How did you find DS&amp;D?</legend>
              <p className="referral-help">This campaign signal is recorded alongside the inquiry for verification.</p>
              <div className="referral-options">
                {inquiryReferralSources.map((source) => {
                  const isSelected = form.referralSource === source;
                  return (
                    <label className={`referral-option${isSelected ? " is-selected" : ""}`} key={source}>
                      <input type="radio" name="referralSource" value={source} checked={isSelected} onChange={(event) => update("referralSource", event.target.value)} />
                      <span className="referral-option-copy"><b>{inquiryReferralSourceLabels[source]}</b><small>{inquiryReferralSourceDescriptions[source]}</small></span>
                      <span className="referral-signal" aria-hidden="true"><i /><i /><i /></span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <label className="inquiry-honeypot" aria-hidden="true">
              <span>Website</span>
              <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} />
            </label>
            <div className="inquiry-actions">
              <button className="button button-primary" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Recording inquiry…" : <>Submit inquiry <Send size={15} /></>}
              </button>
              {status !== "idle" && (
                <p className={`inquiry-status inquiry-${status}`} role="status">
                  {status === "success" && <Check size={15} />}
                  {message}
                </p>
              )}
            </div>
          </form>
        ) : (
          <div className="inquiry-form" style={{ background: "rgba(18,24,20,0.85)", border: "1px solid rgba(184,245,106,0.2)", borderRadius: "4px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px" }}>
              <div>
                <span style={{ color: "var(--lime)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>
                  INTERNAL DISCUSSION &amp; INQUIRY LOG
                </span>
                <div style={{ color: "#9ca59a", fontSize: "12px", marginTop: "2px" }}>
                  Active notifications sent to: <strong>baker@deterministicsolutionsdesign.com</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={loadInquiries}
                disabled={isLoadingFeed}
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#cfd6cd", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
              >
                <RefreshCw size={13} className={isLoadingFeed ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#8a9689" }}>
                <ShieldCheck size={28} style={{ margin: "0 auto 12px", opacity: 0.6 }} />
                <p style={{ margin: 0, fontSize: "13px" }}>No prior messages recorded yet. Submit the first inquiry above to populate this discussion stream.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "460px", overflowY: "auto", paddingRight: "6px" }}>
                {inquiries.map((inq) => (
                  <article
                    key={inq.id}
                    style={{
                      padding: "14px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <User size={14} style={{ color: "var(--lime)" }} />
                        <strong style={{ color: "#f0f4ef", fontSize: "13px" }}>{inq.fullName}</strong>
                        {inq.organization && <span style={{ color: "#889487", fontSize: "12px" }}>({inq.organization})</span>}
                      </div>
                      <span style={{ fontSize: "11px", color: "var(--lime)", fontFamily: "monospace", border: "1px solid rgba(184,245,106,0.3)", padding: "2px 6px", borderRadius: "2px" }}>
                        {inq.topic}
                      </span>
                    </div>
                    <p style={{ color: "#cfd6cd", fontSize: "13px", lineHeight: "1.5", margin: "6px 0 10px", whiteSpace: "pre-wrap" }}>
                      {inq.message}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#748173", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "8px" }}>
                      <span>From: {inq.email}</span>
                      <span>{inq.createdAt ? new Date(inq.createdAt).toLocaleString() : "Just now"}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
