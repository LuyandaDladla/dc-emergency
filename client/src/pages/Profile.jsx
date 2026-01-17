import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function loadContacts() {
  try {
    const raw = localStorage.getItem("dc_contacts");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function saveContacts(list) {
  localStorage.setItem("dc_contacts", JSON.stringify(list));
}

export default function Profile() {
  const { user, refreshMe } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [contacts, setContacts] = useState(loadContacts());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setAvatarUrl(user?.avatarUrl || "");
  }, [user?.avatarUrl]);

  const add = () => {
    if (!name.trim() || !phone.trim()) return;
    const next = [...contacts, { name: name.trim(), phone: phone.trim() }];
    setContacts(next);
    saveContacts(next);
    setName("");
    setPhone("");
  };

  const remove = (idx) => {
    const next = contacts.filter((_, i) => i !== idx);
    setContacts(next);
    saveContacts(next);
  };

  const saveAvatar = async () => {
    try {
      await api.post("/users/avatar", { avatarUrl });
      await refreshMe();
      alert("Saved profile picture.");
    } catch {
      alert("Could not save avatar (backend endpoint may not exist yet).");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold">DC</span>
          )}
        </div>
        <div>
          <div className="text-lg font-semibold">{user?.name || "Profile"}</div>
          <div className="text-sm text-white/60">{user?.email || ""}</div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
        <div className="font-semibold">Profile Picture</div>
        <div className="text-sm text-white/60">Paste an image URL (weâ€™ll add upload later).</div>
        <div className="flex gap-2">
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm"
          />
          <button onClick={saveAvatar} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15">
            Save
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
        <div className="font-semibold">Emergency Contacts</div>
        <div className="grid md:grid-cols-2 gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (+27...)"
            className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm"
          />
        </div>
        <button onClick={add} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15">
          Add Contact
        </button>

        <div className="mt-2 space-y-2">
          {contacts.length === 0 && <div className="text-sm text-white/50">No contacts yet.</div>}
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-white/60">{c.phone}</div>
              </div>
              <button onClick={() => remove(i)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}