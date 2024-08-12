"use client"

import React, { useState, useEffect } from "react";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { createClient } from "@/util/supabase/client";
import { proxy, useSnapshot } from "valtio";

// Create a proxy state
const state = proxy({
    username: "",
    cookies: "",
    isSubmitting: false,
    isLoading: true,
    error: null,
    existingRecord: null
});

export default function Settings() {
    const snap = useSnapshot(state);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        state.isLoading = true;
        state.error = null;
        try {
            const supabase = createClient();

            // First, get the current user's ID
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            if (!user) {
                throw new Error("No authenticated user found");
            }

            // Now fetch settings for this user
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
                throw error;
            }

            if (data) {
                state.existingRecord = data;
                state.username = data.leetcode_username || "";
                state.cookies = data.cookies || "";
            } else {
                state.existingRecord = null;
            }
        } catch (error) {
            console.error("Error fetching settings:", error.message);
            state.error = "Failed to load settings. Please try again.";
        } finally {
            state.isLoading = false;
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!state.username.trim()) newErrors.username = "Username is required";
        if (!state.cookies.trim()) newErrors.cookies = "Cookies are required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        state[e.target.name] = e.target.value;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        state.isSubmitting = true;
        state.error = null;

        try {
            const supabase = createClient();

            // Get the current user's ID
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            if (!user) {
                throw new Error("No authenticated user found");
            }

            let result;
            if (state.existingRecord) {
                // Update existing record
                result = await supabase
                    .from('settings')
                    .update({
                        leetcode_username: state.username,
                        cookies: state.cookies
                    })
                    .eq('user_id', user.id);
            } else {
                // Insert new record
                result = await supabase
                    .from('settings')
                    .insert({
                        user_id: user.id,
                        leetcode_username: state.username,
                        cookies: state.cookies
                    });
            }

            if (result.error) throw result.error;

            console.log("Settings saved successfully");
            // Add user feedback here (e.g., toast notification)

            // Refresh the existingRecord state
            await fetchSettings();
        } catch (error) {
            console.error("Error saving settings:", error.message);
            state.error = "Failed to save settings. Please try again.";
        } finally {
            state.isSubmitting = false;
        }
    };

    if (snap.isLoading) {
        return <div>Loading settings...</div>;
    }

    return (
        <div className="space-y-10">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="space-y-4">
                <Input
                    type="text"
                    className="max-w-lg"
                    label="Leetcode Username"
                    labelPlacement="outside"
                    name="username"
                    value={snap.username}
                    onChange={handleInputChange}
                    isRequired
                    errorMessage={errors.username}
                />
                <Textarea
                    label="Cookies"
                    labelPlacement="outside"
                    className="max-w-lg"
                    name="cookies"
                    value={snap.cookies}
                    onChange={handleInputChange}
                    isRequired
                    errorMessage={errors.cookies}
                />
                <Button onClick={handleSubmit} disabled={snap.isSubmitting}>
                    {snap.isSubmitting ? "Saving..." : "Save"}
                </Button>
                {snap.error && <p className="text-red-500">{snap.error}</p>}
            </div>
        </div>
    );
}