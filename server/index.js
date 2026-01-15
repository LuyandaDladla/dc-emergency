import express from "express";

const app = express();


const normalizeOrigin = (u) => {
  if (!u || typeof u !== "string") return "";
  return u.trim().replace(/\/+$/, "");
};

const allowed = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Non-browser requests (curl, server-to-server)
    if (!origin) return cb(null, true);

    const o = normalizeOrigin(origin);

    // If env not set, allow all (safe for now)
    if (allowed.length === 0) return cb(null, true);

    // Exact match
    if (allowed.includes(o)) return cb(null, true);

    // Allow any Vercel preview domains for this app
    if (o.endsWith(".vercel.app")) return cb(null, true);

    // IMPORTANT: never throw hard errors that cause 500 + missing headers
    return cb(null, false);
  },
  credentials: true
}));

app.options("*", cors());
import cors from "cors";


// Parse JSON
app.use(express.json());

// CORS (bulletproof)
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);


    },
    credentials: true
}));

// IMPORTANT: handle preflight requests
app.options("*", cors());




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
