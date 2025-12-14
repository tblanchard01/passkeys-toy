import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const rpId = "localhost";
let lastChallenge = null;

app.post("/passkeys/register/options", (_req, res) => {
  const userId = "1234";
  const username = "bakery-user";

  lastChallenge = crypto.randomBytes(32).toString("base64url");

  res.json({
    rp: { id: rpId, name: "Bakery Toy" },
    user: {
      id: Buffer.from(userId, "utf8").toString("base64url"),
      name: username,
      displayName: username
    },
    challenge: lastChallenge,
    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
    timeout: 60000,
    attestation: "none"
  });
});

app.post("/passkeys/register/verify", (_req, res) => {
  if (!lastChallenge) return res.status(400).json({ ok: false });
  lastChallenge = null;
  res.json({ ok: true });
});

app.listen(4000, () => console.log("API http://localhost:4000"));
