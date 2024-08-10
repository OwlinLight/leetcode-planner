'use client'
import { createClient } from "@/util/supabase/client";
import Link from "next/link";
import {redirect, useRouter} from "next/navigation";
import {LogInIcon, LogOutIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import {store} from "@/app/store";


export default function AuthButton() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        const supabase = createClient();
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            store.user = user;
            setLoading(false);
        }
        fetchUser();
    }, [user]);

    const signOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        store.user = null;
        //TODO: improve performance
        store.fetchTodos();
    };

    if (loading) {
        return <div>Loading...</div>; // Optional loading state
    }

    return user ? (
        <div className="flex items-center gap-4">
            Hey, {user.email}!
            <Button className="btn-accent" onClick={()=>signOut()}>
                <LogOutIcon />
                Logout
            </Button>
        </div>
    ) : (
        <Link
            href="/login"
            className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
            <Button className="btn-accent">
                <LogInIcon />
                Login
            </Button>
        </Link>
    );
}

