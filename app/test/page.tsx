'use client'
import { cookies } from 'next/headers'
import {useEffect, useState} from "react";

export default function Page() {
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prevSeconds => (prevSeconds + 1) % 60);
            setMinutes(prevMinutes => (prevMinutes + Math.floor((seconds + 1) / 60)) % 60);
            setHours(prevHours => (prevHours + Math.floor((minutes + Math.floor((seconds + 1) / 60)) / 60)) % 24);
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [seconds, minutes]);

    return (
        <div>
            <h1>Timer</h1>
            <span className="countdown font-mono text-2xl">
        <span style={{ "--value": hours }}></span>:
        <span style={{ "--value": minutes }}></span>:
        <span style={{ "--value": seconds }}></span>
      </span>
        </div>
    );
};