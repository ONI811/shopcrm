import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const { token } = useAuth();
  const { t } = useLanguage();

  function load() {
    api.getTickets(token).then(setTickets);
  }

  useEffect(load, [token]);

  function handleDraftChange(ticketId, value) {
    setReplyDrafts((prev) => ({ ...prev, [ticketId]: value }));
  }

  async function handleReply(ticketId) {
    const message = replyDrafts[ticketId];
    if (!message) return;
    await api.replyTicket(ticketId, message, token);
    setReplyDrafts((prev) => ({ ...prev, [ticketId]: "" }));
    load();
  }

  async function handleClose(ticketId) {
    await api.updateTicketStatus(ticketId, "closed", token);
    load();
  }

  return (
    <div>
      <div className="crm-topbar">
        <div>
          <div className="crm-eyebrow">{t("admin.supportTitle")}</div>
          <h2 style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 22 }}>{t("admin.customerTickets")}</h2>
        </div>
      </div>

      {tickets.length === 0 ? (
        <p style={{ color: "var(--crm-muted)" }}>{t("admin.noTickets")}</p>
      ) : (
        tickets.map((t2) => (
          <div className="crm-panel" key={t2.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{t2.subject}</strong>
                <div style={{ fontSize: 12, color: "var(--crm-muted)" }}>
                  {t2.customerName} - {new Date(t2.createdAt).toLocaleString()}
                </div>
              </div>
              <span className={`badge ${t2.status}`}>{t2.status}</span>
            </div>
            <p style={{ marginTop: 10 }}>{t2.message}</p>

            {t2.replies.map((r, i) => (
              <div key={i} style={{ marginTop: 8, paddingLeft: 12, borderLeft: "2px solid var(--crm-accent)" }}>
                <strong style={{ fontSize: 12 }}>{t("support.supportLabel")}:</strong> {r.message}
              </div>
            ))}

            {t2.status !== "closed" && (
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  placeholder={t("admin.writeReply")}
                  value={replyDrafts[t2.id] || ""}
                  onChange={(e) => handleDraftChange(t2.id, e.target.value)}
                />
                <button className="btn" onClick={() => handleReply(t2.id)}>
                  {t("admin.reply")}
                </button>
                <button className="btn secondary" onClick={() => handleClose(t2.id)}>
                  {t("admin.close")}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
