"use client"

import React from "react";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { createClient } from "@/util/supabase/client";
import { useForm } from "react-hook-form";

export default function Settings() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (form) => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('settings')
                .insert([
                    {
                        leetcode_username: form.username,
                        cookies: form.cookies
                    },
                ])
                .select();

            if (error) throw error;
            console.log("Settings saved successfully:", data);
            // Add user feedback here (e.g., toast notification)
        } catch (error) {
            console.error("Error saving settings:", error.message);
            // Add error feedback for the user here
        }
    };

    return (
        <div className="space-y-10">
            <h1 className="text-2xl font-bold">Settings</h1>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type="text"
                    className="max-w-lg"
                    label="Leetcode Username"
                    labelPlacement="outside"
                    isRequired
                    {...register("username", { required: "Username is required" })}
                    errorMessage={errors.username?.message}
                />
                <Textarea
                    label="Cookies"
                    labelPlacement="outside"
                    className="max-w-lg"
                    {...register("cookies", { required: "Cookies are required" })}
                    errorMessage={errors.cookies?.message}
                    isRequired
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
            </form>
        </div>
    );
}