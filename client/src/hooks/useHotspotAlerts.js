import { useEffect, useRef, useState } from "react";
import { api } from "../services/api.js";
import { distanceMeters } from "../services/geo.js";
import { track } from "../services/analytics.js";

export function useHotspotAlerts(province){
  const [alert,setAlert]=useState(null);
  const seenRef=useRef(new Set());

  useEffect(()=>{
    let stop=false;
    let watchId=null;
    let hotspots=[];

    async function load(){
      try{
        const r=await api.get("/hotspots", { params: province ? { province } : {} });
        hotspots=r.data.items||[];
      }catch{ hotspots=[]; }
    }

    function startWatch(){
      if(!navigator.geolocation) return;
      watchId=navigator.geolocation.watchPosition((pos)=>{
        const lat=pos.coords.latitude;
        const lng=pos.coords.longitude;

        for(const h of hotspots){
          const d=distanceMeters(lat,lng,h.centerLat,h.centerLng);
          if(d <= h.radiusMeters){
            const key=String(h._id);
            if(!seenRef.current.has(key)){
              seenRef.current.add(key);
              setAlert({
                title: h.title,
                province: h.province,
                severity: h.severity,
                radiusMeters: h.radiusMeters
              });
              track("hotspot_enter", { hotspotId: key, province: h.province, severity: h.severity });
            }
          }
        }
      }, ()=>{}, { enableHighAccuracy:true, maximumAge: 5000, timeout: 8000 });
    }

    (async ()=>{
      await load();
      if(stop) return;
      startWatch();
    })();

    return ()=>{
      stop=true;
      if(watchId!==null) navigator.geolocation.clearWatch(watchId);
    };
  }, [province]);

  const clear=()=>setAlert(null);
  return { alert, clear };
}