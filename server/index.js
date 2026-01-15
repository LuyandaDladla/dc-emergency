import express from "express";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: function(origin, cb) {
    // allow server-to-server / curl / same-origin
    if (!origin) return cb(null, true);

    // If no env set, allow all (dev-friendly)
    if (allowedOrigins.length === 0) return cb(null, true);

    // Exact match
    if (allowedOrigins.includes(origin)) return cb(null, true);

    return cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true
}));
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).send("DC Emergency Backend is LIVE");
});

app.get("/health", (req, res) => {
    res.status(200).json({ ok: true, status: "healthy" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Listening on", PORT));
