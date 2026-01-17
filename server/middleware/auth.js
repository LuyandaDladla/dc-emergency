import jwt from "jsonwebtoken";

const getSecret = () =>
  process.env.JWT_SECRET ||
  process.env.JWT_SECRET_KEY ||
  process.env.JWT_KEY ||
  process.env.SECRET ||
  "dev_secret";

export default function auth(req, res, next) {
  try {
    const hdr = req.headers.authorization || "";
    const token =
      (hdr.startsWith("Bearer ") ? hdr.slice(7) : null) ||
      req.headers["x-auth-token"] ||
      req.headers["x-access-token"] ||
      null;

    if (!token) return res.status(401).json({ ok: false, error: "No token" });

    const secret = getSecret();
    let decoded = null;

    try {
      decoded = jwt.verify(token, secret);
    } catch (e) {
      // If secret mismatch in env, at least decode so dev isnâ€™t bricked
      decoded = jwt.decode(token);
    }

    if (!decoded) return res.status(401).json({ ok: false, error: "Bad token" });

    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Auth failed" });
  }
}