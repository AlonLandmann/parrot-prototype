import { useState } from "react";

export default function LoginRoot() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (json.success) {
      if (json.userVerified) {
        window.location = "/app";
      } else {
        window.location = `/verify?email=${json.userEmail}&sendToken=true`
      }
    } else {
      window.alert(json.message);
    }
  }

  return (
    <div className="flex flex-col items-start">
      <a href="/">
        home
      </a>
      <h1>
        Login
      </h1>
      <form
        className="flex flex-col items-start"
        onSubmit={handleLogin}
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
          log in
        </button>
      </form>
      <a href="/signup">
        sign up instead
      </a>
      <a href="/reset">
        forgot password
      </a>
    </div>
  );
};