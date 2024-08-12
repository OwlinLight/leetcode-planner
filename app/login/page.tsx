"use client";

import {createClient} from "@/util/supabase/client";
import {Auth} from "@supabase/auth-ui-react";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {useEffect, useState} from "react";

const supabase = createClient();

export default function Login() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const handleStyleLoad = () => {
            setIsLoaded(true);
        };

        // Check if the document fonts are ready
        document.fonts.ready.then(handleStyleLoad);

        // Fallback: Check if document is already completely loaded
        if (document.readyState === "complete") {
            handleStyleLoad();
        }

        return () => {
            // Cleanup, if necessary
        };
    }, []);

    if (!isLoaded) {
        return (
            <div className="flex w-full justify-center">
                <span className="loading loading-infinity loading-lg"/>
            </div>
        ); // Show a loading indicator
    }

    return (
        <div className="min-w-full min-h-screen flex items-center justify-center">
            <div className="w-full h-full flex justify-center items-center p-4">
                <div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col text-base">
                <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                  Login
                </span>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: 'orange',
                                        brandAccent: 'brown',
                                    },
                                },
                            },
                        }}
                        providers={['github']}
                        redirectTo="http://localhost:3000"
                    />
                </div>
            </div>
        </div>
    );
}
