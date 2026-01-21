// server/routes/community.js
import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";
import PostReport from "../models/PostReport.js";
import { resolveProvince } from "../utils/provinceFromLatLng.js";

const router = express.Router();

function safeText(s = "") {
  return String(s).trim();
}

function requireText(text) {
  const t = safeText(text);
  if (!t) return null;
  if (t.length > 1000) return t.slice(0, 1000);
  return t;
}

/**
 * GET /api/community/feed?scope=forYou|province&province=Gauteng
 */
router.get("/feed", auth, async (req, res) => {
  try {
    const scope = (req.query.scope || "forYou").toString();
    const province = (req.query.province || "").toString();

    const q = { isDeleted: false, replyToPostId: null };
    if (scope === "province" && province) q.province = province;

    const items = await Post.find(q).sort({ createdAt: -1 }).limit(50);
    return res.json({ ok: true, items });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

/**
 * GET /api/community/posts/:id  (thread view)
 */
router.get("/posts/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const root = await Post.findOne({ _id: id, isDeleted: false });
    if (!root) return res.status(404).json({ ok: false, error: "Not found" });

    const thread = await Post.find({
      isDeleted: false,
      $or: [{ _id: root._id }, { rootPostId: root.rootPostId || root._id }],
    }).sort({ createdAt: 1 });

    return res.json({ ok: true, root, thread });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

/**
 * POST /api/community/posts
 * body: { text, lat, lng, displayName? }
 */
router.post("/posts", auth, async (req, res) => {
  try {
    const t = requireText(req.body?.text);
    if (!t) return res.status(400).json({ ok: false, error: "text required" });

    const lat = req.body?.lat;
    const lng = req.body?.lng;
    const prov = resolveProvince(lat, lng);

    const post = await Post.create({
      userId: req.user.id,
      displayName: safeText(req.body?.displayName) || "Anonymous",
      text: t,
      province: prov.province,
      lat: Number(lat),
      lng: Number(lng),
      replyToPostId: null,
      rootPostId: null,
    });

    return res.json({ ok: true, post });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

/**
 * POST /api/community/posts/:id/reply
 * body: { text }
 */
router.post("/posts/:id/reply", auth, async (req, res) => {
  try {
    const parentId = req.params.id;
    const parent = await Post.findById(parentId);
    if (!parent || parent.isDeleted) return res.status(404).json({ ok: false, error: "Not found" });

    const t = requireText(req.body?.text);
    if (!t) return res.status(400).json({ ok: false, error: "text required" });

    const rootId = parent.rootPostId || parent._id;

    const reply = await Post.create({
      userId: req.user.id,
      displayName: "Anonymous",
      text: t,
      province: parent.province,
      lat: parent.lat,
      lng: parent.lng,
      replyToPostId: parent._id,
      rootPostId: rootId,
    });

    await Post.findByIdAndUpdate(parent._id, { $inc: { repliesCount: 1 } });
    await Post.findByIdAndUpdate(rootId, { $inc: { repliesCount: 1 } });

    return res.json({ ok: true, reply });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

/**
 * POST /api/community/posts/:id/like
 */
router.post("/posts/:id/like", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post || post.isDeleted) return res.status(404).json({ ok: false, error: "Not found" });

    const userId = req.user.id;
    const already = post.likedBy?.some((x) => x.toString() === userId);

    if (already) {
      post.likedBy = post.likedBy.filter((x) => x.toString() !== userId);
      post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
    } else {
      post.likedBy = [...(post.likedBy || []), userId];
      post.likesCount = (post.likesCount || 0) + 1;
    }

    await post.save();
    return res.json({ ok: true, likesCount: post.likesCount, liked: !already });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

/**
 * POST /api/community/posts/:id/repost
 */
router.post("/posts/:id/repost", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post || post.isDeleted) return res.status(404).json({ ok: false, error: "Not found" });

    const userId = req.user.id;
    const already = post.repostedBy?.some((x) => x.toString() === userId);

    if (already) {
      post.repostedBy = post.repostedBy.filter((x) => x.toString() !== userId);
      post.repostCount = Math.max(0, (post.repostCount || 0) - 1);
    } else {
      post.repostedBy = [...(post.repostedBy || []), userId];
      post.repostCount = (post.repostCount || 0) + 1;
    }

    await post.save();
    return res.json({ ok: true, repostCount: post.repostCount, reposted: !already });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

/**
 * POST /api/community/posts/:id/report
 * body: { reason, note }
 */
router.post("/posts/:id/report", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post || post.isDeleted) return res.status(404).json({ ok: false, error: "Not found" });

    const reason = safeText(req.body?.reason) || "unspecified";
    const note = safeText(req.body?.note) || "";

    await PostReport.create({
      postId,
      reporterUserId: req.user.id,
      reason,
      note,
      status: "open",
    });

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

/**
 * DELETE /api/community/posts/:id  (own post)
 */
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post || post.isDeleted) return res.status(404).json({ ok: false, error: "Not found" });
    if (post.userId && post.userId.toString() !== req.user.id) {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }

    post.isDeleted = true;
    await post.save();

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

export default router;
