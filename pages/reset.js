import Page from "@/components/Page";

export default function ResetPage() {
  return (
    <Page title="Reset">
      <div>
        <div><h1>Reset</h1></div>
        <form>
          <div><input placeholder="email" /></div>
          <button>continue</button>
        </form>
        <div><a href="/login">back to login</a></div>
      </div>
    </Page>
  );
};