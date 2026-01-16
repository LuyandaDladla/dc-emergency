import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, error: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ ok: false, error: "User not found" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  return res.status(403).json({ ok: false, error: "Admin only" });
};

export const optionalProtect = async (req, res, next) => {
  try {
    let token = null;

    // Support: Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    req.user = user || null;
    return next();
  } catch (err) {
    // If token is invalid/expired, still allow SOS to proceed as anonymous
    req.user = null;
    return next();
  }
};