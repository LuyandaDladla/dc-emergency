import { useEffect, useState } from "react";
import { api, setToken } from "../services/api.js";
import Avatar from "../components/Avatar.jsx";

export default function Profile(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [msg,setMsg]=useState("");

  const [me,setMe]=useState(null);
  const [name,setName]=useState("");
  const [avatarUrl,setAvatarUrl]=useState("");
  const [province,setProvince]=useState(localStorage.getItem("province") || "Gauteng");

  const token = localStorage.getItem("token");

  const loadMe = async ()=>{
    try{
      const r = await api.get("/users/me");
      setMe(r.data.user);
      setName(r.data.user.name || "");
      setAvatarUrl(r.data.user.avatarUrl || "");
      setProvince(r.data.user.province || province);
    }catch{
      setMe(null);
    }
  };

  useEffect(()=>{
    if(token) loadMe();
  },[token]);

  const login = async ()=>{
    setMsg("Logging in...");
    try{
      const r = await api.post("/auth/login", { email, password });
      setToken(r.data.token);
      setMsg("Logged in.");
      window.location.reload();
    }catch(e){
      setMsg("Login failed: " + (e.response?.data?.message || e.message));
    }
  };

  const logout = ()=>{
    setToken(null);
    window.location.reload();
  };

  const saveProfile = async ()=>{
    setMsg("Saving...");
    try{
      await api.put("/users/me", { name, avatarUrl, province });
      localStorage.setItem("province", province);
      setMsg("Saved.");
      await loadMe();
    }catch(e){
      setMsg("Save failed: " + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="h1">Profile</div>
        <div className="small">Account + emergency settings.</div>
        <div className="hr"></div>

        {!token ? (
          <>
            <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <div style={{ height: 10 }}></div>
            <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <div style={{ height: 10 }}></div>
            <button className="btn btnPrimary" onClick={login}>Login</button>
            <div className="small" style={{ marginTop: 10 }}>{msg}</div>
          </>
        ) : (
          <>
            <div className="row" style={{ gap: 12 }}>
              <Avatar url={me?.avatarUrl} name={me?.name || me?.email || "User"} />
              <div className="stack" style={{ gap: 6, width:"100%" }}>
                <div className="badge">Logged in</div>
                <div className="small">{me?.email}</div>
              </div>
              <div className="space"></div>
              <button className="btn" onClick={logout}>Logout</button>
            </div>

            <div className="hr"></div>

            <div className="small">Display name</div>
            <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" />

            <div style={{ height: 10 }}></div>
            <div className="small">Profile picture URL (fastest for deployment)</div>
            <input className="input" value={avatarUrl} onChange={(e)=>setAvatarUrl(e.target.value)} placeholder="https://..." />

            <div style={{ height: 10 }}></div>
            <div className="small">Province</div>
            <select className="input" value={province} onChange={(e)=>setProvince(e.target.value)}>
              <option>Eastern Cape</option><option>Free State</option><option>Gauteng</option>
              <option>KwaZulu-Natal</option><option>Limpopo</option><option>Mpumalanga</option>
              <option>North West</option><option>Northern Cape</option><option>Western Cape</option>
            </select>

            <div style={{ height: 12 }}></div>
            <button className="btn btnPrimary" onClick={saveProfile}>Save</button>

            <div className="small" style={{ marginTop: 10 }}>{msg}</div>

            <div className="hr"></div>
            <div className="small">
              Next: I can add a full â€œEmergency Contactsâ€ manager here (add/edit/remove, WhatsApp/SMS).
            </div>
          </>
        )}
      </div>
    </div>
  );
}