import User from "../models/User.js";

export async function getMe(req, res){
  const u = await User.findById(req.user._id).select("-password");
  res.json({ user: u });
}

export async function updateMe(req, res){
  const u = await User.findById(req.user._id);
  if(!u) return res.status(404).json({ message:"User not found" });

  const { name, avatarUrl, province } = req.body || {};
  if(name !== undefined) u.name = String(name);
  if(avatarUrl !== undefined) u.avatarUrl = String(avatarUrl);
  if(province !== undefined) u.province = String(province);

  await u.save();
  const safe = await User.findById(u._id).select("-password");
  res.json({ user: safe });
}