import { useEffect, useState } from "react";

export default function VerifyRoot() {
  const [email, setEmail] = useState("");
  const [emailToken, setEmailToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("email")) {
      setEmail(params.get("email"));
    }

    if (params.has("email") && params.has("sendToken")) {
      sendEmailToken(params.get("email"));
    }
  }, []);

  async function sendEmailToken(email) {
    const res = await fetch("/api/user/generate-email-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();

    if (json.success) {
      console.log(json.message);
    } else {
      console.log(json.message);
    }
  }

  async function handleCheck(e) {
    e.preventDefault();

    const res = await fetch("/api/user/check-email-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, emailToken }),
    });

    const json = await res.json();

    if (json.success) {
      window.location = "/app";
    } else {
      window.alert(json.message);
    }
  }

  return (
    <div className="flex flex-col items-start">
      <h1>Verify</h1>
      <form
        className="flex flex-col items-start"
        onSubmit={handleCheck}
      >
        <input
          type="text"
          placeholder="6-digit token"
          value={emailToken}
          onChange={e => setEmailToken(e.target.value)}
        />
        <button>
          confirm
        </button>
      </form>
      <button onClick={() => sendEmailToken(email)}>
        send new token
      </button>
      <a href="/app">
        skip for now
      </a>
    </div>
  );
};