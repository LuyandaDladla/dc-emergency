import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.status(200).send("DC Emergency Backend is LIVE");
});

app.get("/health", (req, res) => {
    res.status(200).json({ ok: true, status: "healthy" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Listening on", PORT));
