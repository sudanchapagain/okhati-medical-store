import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import Error from "@/components/ui/error";
import Loader from "@/components/ui/loader";
import Success from "@/components/ui/success";
import { updateUser, logoutUser } from "../redux/user.slice";
import type { RootState, AppDispatch } from "../redux/store";

interface User {
  id: string;
  name: string;
  email: string;
  is_staff?: boolean;
  is_active?: boolean;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const updateState = useSelector(
    (state: RootState) => state.updateUserReducer,
  );
  const currentUser: User = JSON.parse(
    localStorage.getItem("currentUser") || "{}",
  );
  const { loading, success, error } = updateState;
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>(currentUser.name || "");
  const [email, setEmail] = useState<string>(currentUser.email || "");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (password === confirmPassword) {
      const updatedUser = {
        name,
        email,
        password,
        is_staff: currentUser.is_staff ?? false,
        is_active: currentUser.is_active ?? true,
      };
      dispatch(updateUser({ userid: currentUser.id, updateUser: updatedUser }));
    } else {
      alert("Passwords do not match");
    }
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(logoutUser());
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    console.log("ini current user", currentUser);
  }, [currentUser]);

  return (
    <div className="relative isolate mx-auto my-24 max-w-xl bg-white px-6 pt-14">
      {loading && <Loader />}
      {error && <Error error="Something went wrong" />}
      {success && (
        <Success success="Your details have been updated successfully. Please re-login." />
      )}

      <h2 className="mb-4 text-2xl font-bold">Your Profile</h2>
      <form onSubmit={handleUpdate}>
        <label htmlFor="name" className="mb-2 block font-semibold">
          Full Name
        </label>
        <input
          name="fullName"
          id="name"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
          className="mb-4 w-full rounded border p-2"
        />

        <label htmlFor="email" className="mb-2 block font-semibold">
          Email
        </label>
        <input
          name="email"
          id="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          className="mb-4 w-full rounded border p-2"
        />

        <label htmlFor="password" className="mb-2 block font-semibold">
          Password
        </label>
        <input
          name="password"
          type="password"
          id="password"
          className="mb-4 w-full rounded border p-2"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword" className="mb-2 block font-semibold">
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          id="confirmPassword"
          className="mb-4 w-full rounded border p-2"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border border-transparent bg-(--btn-border) px-5 py-[calc(--spacing(2.5)-1px)] text-base/6 font-semibold text-white [--btn-bg:var(--color-green-600)] [--btn-border:var(--color-green-700)]/90 [--btn-hover-overlay:var(--color-white)]/10 [--btn-icon:var(--color-green-400)] before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-sm after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)] hover:after:bg-[--btn-hover-overlay] focus:outline-green-500"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
