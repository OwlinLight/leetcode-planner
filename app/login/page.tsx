"use client";

import { createClient } from "@/util/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const supabase = createClient();

export default async function Test() {
    const signInWithGoogle = async () => {
        supabase.auth.signInWithOAuth({
            provider: "google",
        });
    };

    const signInWithGithub = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "github",
        });
    };

    return (
        <>
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={["github"]}
            />
        </>
    );
}
