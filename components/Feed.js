import { useEffect, useState } from "react";

export default function Feed() {
  const [feed, setFeed] = useState([])
  const [resource, setResource] = useState({
    type: "video",
    href: "",
    name: "",
  });

  useEffect(() => {
    loadFeed();
  }, [])

  async function loadFeed() {
    const res = await fetch("/api/resource/get-user-resources");
    const json = await res.json();

    if (json.success) {
      setFeed(json.resources);
    } else {
      console.log(json.message);
    }
  }

  async function handleAddResource(e) {
    e.preventDefault()

    const res = await fetch("/api/resource/add-new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resource),
    });

    const json = await res.json();

    if (json.success) {
      window.location.reload();
    } else {
      window.alert(json.message);
    }
  }

  return (
    <div className="flex flex-col items-start">
      <h2>
        Feed
      </h2>
      {feed.map(item => (
        <div key={item.id}>
          {JSON.stringify(item)}
        </div>
      ))}
      <form
        className="flex flex-col items-start"
        onSubmit={handleAddResource}
      >
        <select
          value={resource.type}
          onChange={e => setResource(p => ({ ...p, type: e.target.value }))}
        >
          <option value="video">Video</option>
          <option value="video-series">Video Series</option>
          <option value="textbook">Textbook</option>
          <option value="online-course">Online Course</option>
          <option value="manual">Manual</option>
          <option value="reference">Reference</option>
        </select>
        <input
          type="text"
          placeholder="href"
          value={resource.href}
          onChange={e => setResource(p => ({ ...p, href: e.target.value }))}
        />
        <input
          type="text"
          placeholder="name"
          value={resource.name}
          onChange={e => setResource(p => ({ ...p, name: e.target.value }))}
        />
        <button>
          add resource
        </button>
      </form>
    </div>
  );
};