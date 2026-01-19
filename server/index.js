import cors from "cors";
import express from "express";

import usersRoutes from "./routes/users.js";


import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import communityRoutes from "./routes/community.js";

import riskRoutes from "./routes/risk.js";

import therapistRoutes from "./routes/therapist.js";

import analyticsRoutes from "./routes/analytics.js";

import hotspotsRoutes from "./routes/hotspots.js";

import sosRoutes from "./routes/sos.js";
dotenv.config();


const app = express();
  
// CORS__SINGLE_SOURCE_OF_TRUTH
const corsOptions = {
  origin: (origin, cb) => {
    // allow server-to-server, curl, postman
    if (!origin) return cb(null, true);

    // allow localhost dev
    if (origin === "http://localhost:5173") return cb(null, true);
    if (origin === "http://127.0.0.1:5173") return cb(null, true);

    // allow ALL vercel previews + prod
    if (origin.endsWith(".vercel.app")) return cb(null, true);

    return cb(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
const allowlist = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://dc-emergency.vercel.app", 
];

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://dc-emergency.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Auth-Token"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


import cors from "cors";

const allowlist = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    //Vercel domain here
     "https://dc-emergency.vercel.app/",
];

const corsOptions = {
    origin: function (origin, cb) {
        // allow curl/postman/no-origin
        if (!origin) return cb(null, true);

        // allow any vercel preview automatically
        if (origin.endsWith(".vercel.app")) return cb(null, true);

        if (allowlist.includes(origin)) return cb(null, true);

        return cb(new Error("CORS blocked: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
};
//handles preflight
app.use(express.json());


app.use(express.json());






app.use("/api/users", usersRoutes);
const allowed = [

  "http://localhost:5173",

  "https://dc-emergency.vercel.app"

];


app.use(cors({

  origin: (origin, cb) => {

    if (!origin) return cb(null, true);

    if (allowed.includes(origin)) return cb(null, true);

    if (origin.endsWith(".vercel.app")) return cb(null, true);

    return cb(null, false);

  },

  credentials: true,

  methods: ["GET","POST","PUT","DELETE","OPTIONS"],

  allowedHeaders: ["Content-Type","Authorization"]

}));
// Always available

app.get("/", (req,res)=>res.json({ ok:true, service:"dc-emergency-backend" }));

app.get("/health", (req,res)=>res.json({ ok:true, status:"healthy" }));

app.get("/debug/boot", (req,res)=>res.json({ ok:true, at:new Date().toISOString() }));


// DB (does not crash in stub mode)

connectDB();


// Routes

app.use("/api/auth", authRoutes);


app.use("/api/sos", sosRoutes);





app.use("/api/community", communityRoutes);



app.use("/api/risk", riskRoutes);



app.use("/api/therapist", therapistRoutes);



app.use("/api/analytics", analyticsRoutes);



app.use("/api/hotspots", hotspotsRoutes);





const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log("Server running on port", PORT));


