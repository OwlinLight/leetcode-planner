'use client'
import { createClient } from "@/util/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import {LogInIcon} from "lucide-react";
import {useEffect, useState} from "react";


export default function AuthButton() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }

        fetchUser();
    }, []);

    const signOut = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevent form submission
        const supabase = createClient();
        await supabase.auth.signOut();
    };

    if (loading) {
        return <div>Loading...</div>; // Optional loading state
    }

    return user ? (
        <div className="flex items-center gap-4">
            Hey, {user.email}!
            <form onSubmit={signOut}>
                <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                    Logout
                </button>
            </form>
        </div>
    ) : (
        <Link
            href="/login"
            className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
            <LogInIcon />
            Login
        </Link>
    );
}

