import Page from "@/components/Page";
import { useState } from "react";

export default function ResetPage() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    window.location = `/verify?email=${email}&resetPassword=true`;
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
        <form
          className="flex flex-col items-start"
          onSubmit={handleSubmit}
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
        <a href="/login">
          back to login
        </a>
      </div>
    </Page>
  );
};