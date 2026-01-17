import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
    const xToken = req.headers["x-auth-token"] || req.headers["X-Auth-Token"];
    const token = bearer || xToken || (header && !header.startsWith("Bearer ") ? header : "");

    if (!token) {
      return res.status(401).json({ ok: false, error: "No token provided" });
    }

    const secret =
      process.env.JWT_SECRET ||
      process.env.JWT_KEY ||
      process.env.SECRET ||
      process.env.APP_SECRET ||
      "dev_jwt_secret_change_me";

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid token", detail: err.message });
  }
}