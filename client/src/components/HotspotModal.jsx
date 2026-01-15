export default function HotspotModal({ alert, onClose }){
  if(!alert) return null;
  const sev = String(alert.severity||"").toLowerCase();
  const title = sev === "high" ? "High Risk Area" : (sev === "medium" ? "Caution Area" : "Awareness Area");
  return (
    <div style={{
      position:"fixed", left:0, right:0, top:0, bottom:0,
      background:"rgba(0,0,0,.65)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex: 80, padding: 14
    }}>
      <div className="card" style={{ maxWidth: 520, width:"100%" }}>
        <div className="h1">{title}</div>
        <div className="small" style={{ marginTop: 6 }}>
          You entered a hotspot: <b>{alert.title}</b> ({alert.province}). Stay aware and consider safer routes.
        </div>
        <div className="hr"></div>
        <div className="row">
          <button className="btn btnPrimary" onClick={()=>{ window.location.href="/sos"; }}>Open SOS</button>
          <div className="space"></div>
          <button className="btn" onClick={onClose}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}