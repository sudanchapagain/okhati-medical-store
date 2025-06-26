'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/auth/login?signup=success');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="mx-auto w-[500px] px-5">
        {error && <p className="mb-4 text-red-500">{error}</p>}

        <h1 className="mb-2 text-2xl font-bold">Sign up</h1>

        <p className="mb-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
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
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p id="email-note" className="mt-1 text-xs text-gray-500">
              We&aposll never share your email.
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
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p id="password-note" className="mt-1 text-xs text-gray-500">
              Minimum 8 characters.
            </p>

          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700"
          >
            Sign up
          </button>
        </form>
      </main>
    </div>
  );
}
