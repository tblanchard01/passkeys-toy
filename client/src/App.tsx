import React from "react";
import { registerPasskey } from "./registerPasskey";

export default function App() {
  const [msg, setMsg] = React.useState("");

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <button
        onClick={async () => {
          setMsg("Launching...");
          try {
            await registerPasskey();
            setMsg("Done ✅");
          } catch (e: any) {
            setMsg(`Failed: ${e.message}`);
          }
        }}
      >
        Create passkey
      </button>

      {msg ? <p>{msg}</p> : null}
    </div>
  );
}
