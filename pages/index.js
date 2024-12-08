import Page from "@/components/Page";

export default function HomePage() {
  return (
    <Page title="Home">
      <div className="flex flex-col items-start">
        <a href="/">
          home
        </a>
        <h1>
          Home
        </h1>
        <a href="/app">
          app
        </a>
      </div>
    </Page>
  );
}