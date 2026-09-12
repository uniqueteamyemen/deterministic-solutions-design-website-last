// Development refresh agent using HTTP long polling / refresh endpoint
if (typeof window !== "undefined" && import.meta.env.DEV) {
  let isRefreshing = false;
  const pollDevRefresh = async () => {
    try {
      const response = await fetch("/__manus__/dev-refresh", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        if (data && data.reload && !isRefreshing) {
          isRefreshing = true;
          window.location.reload();
        }
      }
    } catch {
      // suppress network polling retry errors
    } finally {
      setTimeout(pollDevRefresh, 2000);
    }
  };
  pollDevRefresh();
}
