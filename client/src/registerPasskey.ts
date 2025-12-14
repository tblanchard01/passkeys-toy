import { b64urlToBuf, bufToB64url } from "./webauthnEncoding";

export async function registerPasskey() {
  const optsRes = await fetch("http://localhost:4000/passkeys/register/options", {
    method: "POST"
  });
  const options = await optsRes.json();
  if (!optsRes.ok) throw new Error("options failed");

  const publicKey: PublicKeyCredentialCreationOptions = {
    ...options,
    challenge: b64urlToBuf(options.challenge),
    user: {
      ...options.user,
      id: b64urlToBuf(options.user.id)
    }
  };

  const cred = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;
  if (!cred) throw new Error("no credential");

  const att = cred as PublicKeyCredential & { response: AuthenticatorAttestationResponse };

  const payload = {
    id: att.id,
    rawId: bufToB64url(att.rawId),
    type: att.type,
    response: {
      clientDataJSON: bufToB64url(att.response.clientDataJSON),
      attestationObject: bufToB64url(att.response.attestationObject)
    }
  };

  const verifyRes = await fetch("http://localhost:4000/passkeys/register/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await verifyRes.json();
  if (!verifyRes.ok || !result.ok) throw new Error("verify failed");
}
