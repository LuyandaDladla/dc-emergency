import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { track } from "../services/analytics.js";

function PostCard({ p }){
  return (
    <div className="card">
      <div className="row">
        <div className="badge">{(p.scope||"national").toUpperCase()}</div>
        <div className="badge">{p.province || "SA"}</div>
        <div className="space"></div>
        <div className="small">{new Date(p.createdAt).toLocaleString()}</div>
      </div>
      <div className="hr"></div>
      <div style={{ fontWeight: 900, fontSize: 16 }}>{p.title || "Update"}</div>
      <div className="small" style={{ marginTop: 8 }}>{p.body || ""}</div>

      <div className="hr"></div>
      <div className="row">
        <button className="btn" onClick={()=>track("post_like",{id:p._id})}>Like</button>
        <button className="btn" onClick={()=>track("post_share",{id:p._id})}>Share</button>
        <div className="space"></div>
        <button className="btn" onClick={()=>track("post_report",{id:p._id})}>Report</button>
      </div>
    </div>
  );
}

function SponsorCard({ ad }){
  if(!ad) return null;
  return (
    <div className="card" style={{ borderColor:"rgba(59,130,246,.25)" }}>
      <div className="row">
        <div className="badge">SPONSORED</div>
        <div className="space"></div>
        <div className="small">{ad.advertiser}</div>
      </div>
      <div className="hr"></div>
      <div style={{ fontWeight: 900 }}>{ad.title}</div>
      <div className="small" style={{ marginTop: 8 }}>{ad.body}</div>
    </div>
  );
}

export default function Community(){
  const [mode,setMode]=useState("national"); // national|province
  const [province,setProvince]=useState("Gauteng");
  const [posts,setPosts]=useState([]);
  const [ads,setAds]=useState([]);

  const query = useMemo(()=>{
    if(mode==="province") return { scope:"province", province };
    return { scope:"national" };
  },[mode,province]);

  const load = async ()=>{
    const r = await api.get("/posts", { params: query });
    setPosts(r.data.items || []);
    try{
      const a = await api.get("/ads"); // ads allowed here
      setAds(a.data.ads || []);
    }catch{ setAds([]); }
  };

  useEffect(()=>{ load(); },[mode,province]);

  // Inject one sponsor every 4 posts
  const mixed = useMemo(()=>{
    const out=[];
    let adIdx=0;
    for(let i=0;i<posts.length;i++){
      out.push({ type:"post", data: posts[i] });
      if((i+1)%4===0 && ads[adIdx]){
        out.push({ type:"ad", data: ads[adIdx] });
        adIdx++;
      }
    }
    return out;
  },[posts,ads]);

  return (
    <div className="stack">
      <div className="card">
        <div className="row">
          <button className={"btn" + (mode==="national" ? " btnPrimary":"")} onClick={()=>setMode("national")}>National</button>
          <button className={"btn" + (mode==="province" ? " btnPrimary":"")} onClick={()=>setMode("province")}>Province</button>
          <div className="space"></div>
          <div className="badge">Community</div>
        </div>

        {mode==="province" && (
          <div style={{ marginTop: 12 }}>
            <select className="input" value={province} onChange={(e)=>setProvince(e.target.value)}>
              <option>Eastern Cape</option><option>Free State</option><option>Gauteng</option>
              <option>KwaZulu-Natal</option><option>Limpopo</option><option>Mpumalanga</option>
              <option>North West</option><option>Northern Cape</option><option>Western Cape</option>
            </select>
            <div className="small" style={{ marginTop: 8 }}>
              Province feed is local updates + community safety posts.
            </div>
          </div>
        )}
      </div>

      {mixed.length===0 && (
        <div className="card">
          <div className="h2">No posts yet</div>
          <div className="small">Once you add posts, they will appear here.</div>
        </div>
      )}

      {mixed.map((x,idx)=>(
        x.type==="ad" ? <SponsorCard key={"ad"+idx} ad={x.data}/> : <PostCard key={x.data._id || idx} p={x.data}/>
      ))}
    </div>
  );
}