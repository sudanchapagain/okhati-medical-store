'use client';

import Header from '../components/ui/header';
import Footer from '../components/ui/footer';

export default function Profile() {

    return (
        <>
            <Header />
            <div className="relative isolate my-24 px-6 pt-14 max-w-xl mx-auto bg-white">
                <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

                <label className="block mb-2 font-semibold">Full Name</label>
                <input
                    className="w-full mb-4 p-2 border rounded"
                    placeholder="Your name"
                />

                <label className="block mb-2 font-semibold">Email</label>
                <input
                    className="w-full mb-4 p-2 border rounded"
                    type="email"
                />

                <label className="block mb-2 font-semibold">New Password</label>
                <input
                    className="w-full mb-4 p-2 border rounded"
                    type="password"
                    placeholder="Leave empty if unchanged"
                />

                <button
                    className="relative isolate inline-flex cursor-default items-baseline justify-center gap-x-2 rounded-lg border border-transparent bg-(--btn-border) px-5 py-[calc(--spacing(2.5)-1px)] text-base/6 font-semibold text-white [--btn-bg:var(--color-green-600)] [--btn-border:var(--color-green-700)]/90 [--btn-hover-overlay:var(--color-white)]/10 [--btn-icon:var(--color-green-400)] before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-sm after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)] focus:outline-green-500 hover:after:bg-[--btn-hover-overlay]"
                >
                    Update Profile
                </button>
                <button
                    className="text-red-600 hover:underline text-sm ml-6 font-bold bg-red-100 px-9 py-3 rounded-lg"
                >
                    Log Out
                </button>

                <p className="text-sm text-gray-600 mt-4">{status}</p>
            </div>
            <Footer />
        </>
    );
}
