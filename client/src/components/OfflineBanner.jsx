import { useEffect, useState } from "react";
import { checkHealth } from "../api";

// If the backend isn't running, buttons like Log in / Sign up would
// otherwise just appear to "do nothing". This checks /api/health on load
// (and every 15s while offline) and shows a clear, actionable banner
// instead of silence.
export default function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timer;

    async function ping() {
      try {
        await checkHealth();
        if (!cancelled) setOnline(true);
      } catch {
        if (!cancelled) setOnline(false);
      } finally {
        timer = setTimeout(ping, 15000);
      }
    }
    ping();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (online) return null;

  return (
    <div className="offline-banner">
      <strong>Backend not reachable.</strong> Start it with{" "}
      <code>cd server &amp;&amp; npm run dev</code> (default port 5000), then reload this page.
    </div>
  );
}
