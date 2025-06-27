'use client';

import { useEffect, useState } from 'react';
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) {
                console.error('Error fetching user:', userError);
                setStatus('Error loading user data.');
                return;
            }
            setUser(userData.user);

            if (userData.user) {
                let { data: profileData, error: profileError } = await supabase
                    .from('profile')
                    .select('full_name, email, phone_number, role')
                    .eq('id', userData.user.id)
                    .single();

                if (profileError && profileError.code === 'PGRST116') {
                    const { data: newProfileData, error: insertError } = await supabase
                        .from('profile')
                        .insert({
                            id: userData.user.id,
                            email: userData.user.email,
                            full_name: '',
                            phone_number: '',
                            role: 'user',
                        })
                        .select('full_name, email, phone_number, role')
                        .single();

                    if (insertError) {
                        console.error('Error creating profile:', insertError);
                        setStatus('Error creating profile data.');
                        return;
                    } else {
                        profileData = newProfileData;
                    }
                } else if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    setStatus('Error loading profile data.');
                    return;
                }

                if (profileData) {
                    setFullName(profileData.full_name || '');
                    setEmail(profileData.email || '');
                    setPhoneNumber(profileData.phone_number || '');
                }
            }
        };

        fetchUserAndProfile();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user) {
                setFullName('');
                setEmail('');
                setPhoneNumber('');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUpdateProfile = async () => {
        if (!user) {
            setStatus('No user logged in.');
            return;
        }

        setStatus('Updating profile...');
        const { error } = await supabase
            .from('profile')
            .update({
                full_name: fullName,
                email: email,
                phone_number: phoneNumber,
            })
            .eq('id', user.id);

        if (error) {
            console.error('Error updating profile:', error);
            setStatus(`Error updating profile: ${error.message}`);
        } else {
            setStatus('Profile updated successfully!');
        }
    };

    const handleLogout = async () => {
        setStatus('Logging out...');
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
            setStatus(`Error logging out: ${error.message}`);
        } else {
            setStatus('Logged out successfully.');
        }
    };

    if (!user) {
        return (
            <>
                <Header />
                <div className="relative isolate my-24 px-6 pt-14 max-w-xl mx-auto bg-white">
                    <h2 className="text-2xl font-bold mb-4">Profile</h2>
                    <p>Please log in to view your profile.</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="relative isolate my-24 px-6 pt-14 max-w-xl mx-auto bg-white">
                <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

                <label className="block mb-2 font-semibold">Full Name</label>
                <input
                    className="w-full mb-4 p-2 border rounded"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <label className="block mb-2 font-semibold">Email</label>
                <input
                    className="w-full mb-4 p-2 border rounded"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                />

                <label className="block mb-2 font-semibold">Phone Number</label>
                <input
                    className="w-full mb-4 p-2 border rounded"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <button
                    onClick={handleUpdateProfile}
                    className="relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border border-transparent bg-(--btn-border) px-5 py-[calc(--spacing(2.5)-1px)] text-base/6 font-semibold text-white [--btn-bg:var(--color-green-600)] [--btn-border:var(--color-green-700)]/90 [--btn-hover-overlay:var(--color-white)]/10 [--btn-icon:var(--color-green-400)] before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-sm after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)] focus:outline-green-500 hover:after:bg-[--btn-hover-overlay]"
                >
                    Update Profile
                </button>
                <button
                    onClick={handleLogout}
                    className="text-red-600 hover:underline text-sm ml-6 font-bold bg-red-100 px-9 py-3 rounded-lg"
                >
                    Log Out
                </button>

                {status && <p className="text-sm text-gray-600 mt-4">{status}</p>}
            </div>
            <Footer />
        </>
    );
}
