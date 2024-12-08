import Page from "@/components/Page";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [emailToken, setEmailToken] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("email")) {
      setEmail(params.get("email"));
      sendEmailToken(params.get("email"));
    }

    if (params.has("resetPassword")) {
      setResetPassword(true);
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

    const res = await fetch(`/api/user/check-email-token?resetPassword=${resetPassword}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, emailToken }),
    });

    const json = await res.json();

    if (json.success) {
      if (resetPassword) {
        window.location = `/reset?email=${email}`;
      } else {
        setSuccess(true);
      }
    } else {
      window.alert(json.message);
    }
  }

  return (
    <Page title="Verify">
      <div className="flex flex-col items-start">
        <h1>
          Verify
        </h1>
        {!success &&
          <>
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
          </>
        }
        {success &&
          <>
            <p>
              Your email has been verified successfully.
            </p>
            <a href="/app">
              App
            </a>
          </>
        }
      </div>
    </Page>
  );
};