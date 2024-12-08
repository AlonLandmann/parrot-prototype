import Page from "@/components/Page";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    const res = await fetch("/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (json.success) {
      window.location = `/verify?email=${json.email}`;
    } else {
      window.alert(json.message);
    }
  }

  return (
    <Page title="Signup">
      <div className="flex flex-col items-start">
        <a href="/">
          home
        </a>
        <h1>
          Signup
        </h1>
        <form
          className="flex flex-col items-start"
          onSubmit={handleSignup}
        >
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button>
            sign up
          </button>
        </form>
        <a href="/login">
          log in instead
        </a>
      </div>
    </Page>
  );
};