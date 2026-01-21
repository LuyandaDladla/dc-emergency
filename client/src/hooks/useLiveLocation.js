import { useEffect, useState } from "react";
import { detectProvince } from "../services/provinces";

export function useLiveLocation() {
  const [status, setStatus] = useState("idle"); // idle | ok | denied | error
  const [coords, setCoords] = useState(null); // {lat,lng,accuracy}
  const [province, setProvince] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    setStatus("idle");
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        setCoords({ lat, lng, accuracy });
        setProvince(detectProvince(lat, lng));
        setStatus("ok");
      },
      (err) => {
        if (err.code === 1) setStatus("denied");
        else setStatus("error");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { status, coords, province };
}
