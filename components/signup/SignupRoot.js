export default function SignupRoot() {
  return (
    <div>
      <div><h1>Signup</h1></div>
      <form>
        <div><input placeholder="email" /></div>
        <div><input placeholder="password" /></div>
        <div><button>sign up</button></div>
      </form>
      <div><a href="/login">log in instead</a></div>
    </div>
  );
};