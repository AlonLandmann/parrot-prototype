import { useEffect, useState } from "react";

export default function AppRoot() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const res = await fetch("/api/user/get-metadata");
    const json = await res.json();

    if (json.success) {
      setUser(json.user);
      setLoading(false);
    } else {
      console.log(json.message);
      setLoading(false);
    }
  }

  async function handleLogout() {
    const res = await fetch("/api/user/logout", { method: "POST" });
    const json = await res.json();

    if (json.success) {
      window.location.reload();
    } else {
      window.alert(json.message);
    }
  }

  return (
    <div>
      <a href="/">
        home
      </a>
      <h1>App</h1>
      {!loading && !user &&
        <div className="flex flex-col items-start">
          <a href="/login">Login</a>
          <a href="/signup">Signup</a>
        </div>
      }
      {!loading && user &&
        <div className="flex flex-col items-start">
          <p>
            Hello {user.email}!
          </p>
          <button onClick={handleLogout}>
            log out
          </button>
          {!user.isVerified &&
            <a href={`/verify?email=${user.email}`}>
              verify email address
            </a>
          }
          <a href="/reset">
            reset password
          </a>
        </div>
      }
    </div>
  );
};