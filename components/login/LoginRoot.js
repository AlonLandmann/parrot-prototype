export default function LoginRoot() {
  return (
    <div>
      <div><h1>Login</h1></div>
      <form>
        <div><input placeholder="email" /></div>
        <div><input placeholder="password" /></div>
        <div><button>log in</button></div>
      </form>
      <div><a href="/signup">sign up instead</a></div>
      <div><a href="/reset">forgot password</a></div>
    </div>
  );
};