import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import VerifiedStories from "../components/VerifiedStories.jsx";
import HotspotModal from "../components/HotspotModal.jsx";
import { useHotspotAlerts } from "../hooks/useHotspotAlerts.js";
import Avatar from "../components/Avatar.jsx";

export default function Feed() {
  const navigate = useNavigate();
  const [province, setProvince] = useState(localStorage.getItem("province") || "Gauteng");
  const [status, setStatus] = useState("");
  const [me, setMe] = useState(null);

  const { alert, clear } = useHotspotAlerts(province);

  useEffect(() => {
    localStorage.setItem("province", province);
  }, [province]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/users/me");
        setMe(r.data.user);
      } catch {
        setMe(null);
      }
    })();
  }, []);

  const triggerSOS = async () => {
    setStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      setStatus("Sending...");
      await api.post("/sos", {
        province,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        message: "Emergency SOS"
      });
      setStatus("Sent");
      clear();
      alert("SOS sent.");
    }, async () => {
      setStatus("Location blocked. Sending without GPS...");
      await api.post("/sos", { province, message: "Emergency SOS (no GPS)" });
      setStatus("Sent");
      alert("SOS sent.");
    });
  };

  return (
    <div className="stack">
      <HotspotModal alert={alert} onClose={clear} />

      <div className="card">
        <div className="topBar">
          <div className="brandLeft">
            <div className="brandTitle">Safety Hub</div>
            <div className="brandTag">SOS is the main feature. Everything else supports it.</div>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <div className="badge">SA</div>
            <div onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
              <Avatar url={me?.avatarUrl} name={me?.name || me?.email || "User"} />
            </div>
          </div>
        </div>

        <div className="provinceRow">
          <div className="small">Province</div>
          <select
            className="input provinceSmall"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          >
            <option>Eastern Cape</option>
            <option>Free State</option>
            <option>Gauteng</option>
            <option>KwaZulu-Natal</option>
            <option>Limpopo</option>
            <option>Mpumalanga</option>
            <option>North West</option>
            <option>Northern Cape</option>
            <option>Western Cape</option>
          </select>
        </div>

        <div className="sosHero">
          <div className="sosHeroTitle">Emergency SOS</div>
          <div className="sosHeroSub">
            One tap sends your location to DC Academy and your emergency contacts.
          </div>

          <div className="sosHeroCircle">
            <button className="sosHeroBtn" onClick={triggerSOS}>SOS</button>
          </div>

          <div className="small" style={{ marginTop: 12 }}>Status: {status || "Ready"}</div>
        </div>

        <div className="quickGrid">
          <div className="quickCard" onClick={() => navigate("/risk")}>
            <div className="quickTitle">Risk Assessment</div>
            <div className="quickSub">Guided questions, clear outcome + next steps.</div>
          </div>
          <div className="quickCard" onClick={() => navigate("/therapist")}>
            <div className="quickTitle">AI Therapist</div>
            <div className="quickSub">Support chat with safety escalation rules.</div>
          </div>
          <div className="quickCard" onClick={() => navigate("/community")}>
            <div className="quickTitle">Community</div>
            <div className="quickSub">National + province updates and posts.</div>
          </div>
          <div className="quickCard" onClick={() => navigate("/profile")}>
            <div className="quickTitle">Profile</div>
            <div className="quickSub">Emergency contacts + your account.</div>
          </div>
        </div>
      </div>

      <VerifiedStories />
    </div>
  );
}