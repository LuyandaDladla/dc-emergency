import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function VerifiedStories(){
  const [stories,setStories]=useState([]);

  useEffect(()=>{
    (async ()=>{
      try{
        const r=await api.get("/hotspots/stories");
        setStories(r.data.stories||[]);
      }catch{
        setStories([]);
      }
    })();
  }, []);

  return (
    <div className="card">
      <div className="h2">Verified Alerts</div>
      <div className="small" style={{ marginTop: 6 }}>
        Quick safety updates (hotspots + verified alerts).
      </div>
      <div className="hr"></div>
      <div className="stories">
        {stories.length === 0 && (
          <div className="small">No verified alerts right now.</div>
        )}
        {stories.map(s=>(
          <div className="story" key={s.id}>
            <div className="storyRing"></div>
            <div className="storyLabel">{s.title}</div>
            <div className="storyLabel" style={{ color:"rgba(255,255,255,.42)" }}>
              {s.province} â€¢ {String(s.severity).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}