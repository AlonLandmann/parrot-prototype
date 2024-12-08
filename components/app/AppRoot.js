import { useEffect, useState } from "react";

export default function AppRoot() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/user/get-metadata");
      const json = await res.json();

      if (json.success) {
        setUser(json.data);
        setLoading(false);
      } else {
        console.log(json.message);
        setLoading(false);
      }
    })();
  }, []);

  async function handleLogout() {
    const res = await fetch("/api/user/logout", { method: "POST" });
    const json = await res.json();

    if (json.success) {
      window.location.reload();
    } else {
      console.log(json.message);
    }
  }

  return (
    <div>
      <h1>App</h1>
      {!loading && !user &&
        <div className="flex flex-col items-start">
          <a href="/login">Login</a>
          <a href="/signup">Signup</a>
        </div>
      }
      {!loading && user &&
        <div className="flex flex-col items-start">
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