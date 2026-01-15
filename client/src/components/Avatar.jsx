export default function Avatar({ url, name="User" }){
  const initials = (name || "U").split(" ").filter(Boolean).slice(0,2).map(s=>s[0].toUpperCase()).join("");
  return (
    <div className="avatar" title={name}>
      {url ? <img src={url} alt={name} /> : <div className="avatarText">{initials || "U"}</div>}
    </div>
  );
}