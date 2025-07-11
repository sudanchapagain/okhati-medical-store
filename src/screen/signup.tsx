import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/ui/loader";
import Error from "@/components/ui/error";
import Success from "@/components/ui/success";
import { registerNewUser } from "../redux/user.slice";
import type { RootState, AppDispatch } from "../redux/store";

export default function SignupPage() {
  const registerstate = useSelector(
    (state: RootState) => state.registerReducer,
  );
  const { loading, error, success } = registerstate;

  const [name, setname] = useState("");
  const [email, setemail] = useState("");

  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = {
      name: name,
      email: email,
      password: password,
      is_staff: false,
      is_active: true,
    };

    if (password === cpassword) {
      dispatch(registerNewUser(user));
    } else {
      alert("passwords not matched");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="mx-auto w-[500px] px-5">
        {loading && <Loader />}
        {error && <Error error={error} />}
        {success && <Success success="Your Registration is successful" />}

        <h1 className="mb-2 text-2xl font-bold">Sign up</h1>

        <p className="mb-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              inputMode="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="mt-1 mb-4 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />

            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              aria-describedby="email-note"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <p id="email-note" className="mt-1 text-xs text-gray-500">
              We will never share your email.
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              aria-describedby="password-note"
              minLength={8}
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <p id="password-note" className="mt-1 text-xs text-gray-500">
              Minimum 8 characters.
            </p>
            <label
              htmlFor="cpassword"
              className="mt-4 block text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              id="cpassword"
              type="password"
              required
              autoComplete="current-password"
              minLength={8}
              value={cpassword}
              onChange={(e) => setcpassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="relative isolate inline-flex w-full cursor-default items-baseline justify-center gap-x-2 rounded-lg border border-transparent bg-(--btn-border) px-10 py-[calc(--spacing(2.5)-1px)] text-base/6 font-semibold text-white [--btn-bg:var(--color-green-600)] [--btn-border:var(--color-green-700)]/90 [--btn-hover-overlay:var(--color-white)]/10 [--btn-icon:var(--color-green-400)] before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-sm after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)] hover:bg-green-700 focus:not-data-focus:outline-hidden data-active:[--btn-icon:var(--color-green-300)] data-active:after:bg-(--btn-hover-overlay) data-disabled:opacity-50"
          >
            Sign up
          </button>
        </form>
      </main>
    </div>
  );
}
