import Post from "../models/Post.js";

export async function listPosts(req, res) {
  const scope = req.query.scope || "national";
  const province = req.query.province || "";
  const q = {};
  if (scope) q.scope = scope;
  if (scope === "province" && province) q.province = province;

  const items = await Post.find(q).sort({ createdAt: -1 }).limit(200);
  res.json({ items });
}

export async function createPost(req, res) {
  const b = req.body || {};
  const doc = await Post.create({
    userId: req.user ? req.user._id : null,
    scope: b.scope || "national",
    province: b.province || "",
    title: b.title || "Update",
    body: b.body || "",
    isVerified: false
  });
  res.status(201).json({ doc });
}

// Admin: verify posts (optional)
export async function adminVerify(req, res) {
  const id = req.params.id;
  const doc = await Post.findById(id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  doc.isVerified = true;
  await doc.save();
  res.json({ doc });
}