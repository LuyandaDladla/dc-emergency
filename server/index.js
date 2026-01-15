import express from "express";

const app = express();

import cors from "cors";


// Parse JSON
app.use(express.json());

// CORS (bulletproof)
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.length === 0) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("CORS blocked: " + origin));
    },
    credentials: true
}));

// IMPORTANT: handle preflight requests
app.options("*", cors());



app.use(cors({
  origin: function(origin, cb) {

    if (!origin) return cb(null, true);

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
