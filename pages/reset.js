import Page from "@/components/Page";
import { useEffect, useState } from "react";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("email")) {
      setEmail(params.get("email"));
      setSessionActive(true);
    }

    setLoading(false);
  }, []);

  async function handleSubmitEmail(e) {
    e.preventDefault();
    window.location = `/verify?email=${email}&resetPassword=true`;
  }

  async function handleSubmitNewPassword(e) {
    e.preventDefault();

    if (newPassword !== newPasswordConfirmation) {
      return window.alert("Passwords don't match.");
    }

    const res = await fetch("/api/user/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const json = await res.json();

    if (json.success) {
      setSuccess(true);
    } else {
      window.alert(json.message);
    }
  }

  return (
    <Page title="Reset">
      <div className="flex flex-col items-start">
        <a href="/">
          home
        </a>
        <h1>
          Reset
        </h1>
        {!success && !loading && !sessionActive &&
          <form
            className="flex flex-col items-start"
            onSubmit={handleSubmitEmail}
          >
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button>
              continue
            </button>
          </form>
        }
        {!success && !loading && sessionActive &&
          <form
            className="flex flex-col items-start"
            onSubmit={handleSubmitNewPassword}
          >
            <input
              type="password"
              placeholder="Set new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={newPasswordConfirmation}
              onChange={e => setNewPasswordConfirmation(e.target.value)}
            />
            <button>
              confirm
            </button>
          </form>
        }
        {success &&
          <p>
            Your password has been reset successfully.
          </p>
        }
        <a href="/login">
          back to login
        </a>
      </div>
    </Page>
  );
};