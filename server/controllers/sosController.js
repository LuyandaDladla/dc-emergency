export async function sendSOS(req, res) {
  try {
    const { lat, lng } = req.body || {};
    console.log("[SOS] received", { user: req.user?.id || null, lat, lng, at: new Date().toISOString() });

    // Return immediately (do not block on email/SMS yet)
    return res.status(200).json({ ok: true, message: "SOS received", location: { lat: lat ?? null, lng: lng ?? null } });
  } catch (e) {
    console.error("[SOS] error", e);
    return res.status(500).json({ ok: false, message: "SOS failed" });
  }
}