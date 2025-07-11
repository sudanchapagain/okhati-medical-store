import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/user.slice";
import Error from "@/components/ui/error";
import Loader from "@/components/ui/loader";
import type { RootState, AppDispatch } from "../redux/store";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loginReducer = useSelector((state: RootState) => state.loginReducer);
  const { loading, error, currentUser } = loginReducer;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="mx-auto -mt-2.5 w-[500px] px-5">
        {error && <Error error="Invalid Credentials" />}
        {loading && <Loader />}

        <h1 className="mb-2 text-2xl leading-snug font-bold">Log in</h1>

        <p className="mb-8 text-sm leading-snug text-neutral-500">
          New to Okhati?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

        <form onSubmit={login}>
          <label htmlFor="email" className="mt-4 block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-black-500 mt-1 block w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-600 focus:ring-1 focus:ring-green-600 sm:text-sm"
          />

          <label htmlFor="password" className="mt-4 block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            inputMode="text"
            autoComplete="current-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-black-500 mt-1 block w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-600 focus:ring-1 focus:ring-green-600 sm:text-sm"
          />

          <button
            type="submit"
            className="relative isolate mt-7 inline-flex w-full cursor-default items-baseline justify-center gap-x-2 rounded-lg border border-transparent bg-(--btn-border) px-10 py-[calc(--spacing(2.5)-1px)] text-base/6 font-semibold text-white [--btn-bg:var(--color-green-600)] [--btn-border:var(--color-green-700)]/90 [--btn-hover-overlay:var(--color-white)]/10 [--btn-icon:var(--color-green-400)] before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-sm after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)] focus:not-data-focus:outline-hidden data-active:[--btn-icon:var(--color-green-300)] data-active:after:bg-(--btn-hover-overlay) data-disabled:opacity-50 data-disabled:before:shadow-none data-disabled:after:shadow-none data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-green-500 data-hover:[--btn-icon:var(--color-green-300)] data-hover:after:bg-(--btn-hover-overlay) *:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]"
          >
            Log in
          </button>
        </form>
      </main>
    </div>
  );
}
