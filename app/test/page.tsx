'use client'
import { cookies } from 'next/headers'
import {useEffect, useState} from "react";
import Timer from "@/app/test/Timer";

export default function Page() {
    const [startTimestamp, setStartTimestamp] = useState<number>(0);
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
    const [freeze, setFreeze] = useState<boolean>(false);

    const updateElapsedSeconds = () =>{
        // Calculate elapsed seconds from the start timestamp
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
        const elapsed = currentTimestamp - startTimestamp;
        setElapsedSeconds(elapsed);
    }

    useEffect(() => {
        // Simulate fetching startTimestamp from an external source
        const fetchStartTimestamp = async () => {
            // Simulate an API call
            const response = await new Promise<{ timestamp: number }>(resolve => {
                setTimeout(() => {
                    resolve({ timestamp: 1722800286 }); // Simulated timestamp from an external source
                }, 1000);
            });
            setStartTimestamp(response.timestamp);
        };
        fetchStartTimestamp();
        updateElapsedSeconds();
    }, [freeze, updateElapsedSeconds]);

    const handleSubmit = () => {
        setFreeze(true); // Freeze the timer after submitting
    };

    return (
        <div>
            <div>
                <label htmlFor="start-time">Start Time (Unix Timestamp): </label>
                <button className="btn btn-accent" onClick={handleSubmit}>Finish the problem</button>
            </div>
            <Timer elapsedSeconds={elapsedSeconds} freeze={freeze} />
        </div>
    );};