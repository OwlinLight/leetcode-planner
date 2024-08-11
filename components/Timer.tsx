import React, { useState, useEffect } from 'react';

interface TimerProps {
    elapsedSeconds: number; // Initial elapsed seconds
    freeze: boolean;        // Boolean to freeze or unfreeze the timer
}

function Timer({ elapsedSeconds, freeze }: TimerProps) {
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        const calculateTime = (totalSeconds: number) => {
            const hours = Math.floor(totalSeconds / 3600) % 24;
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setHours(hours);
            setMinutes(minutes);
            setSeconds(seconds);
        };

        let currentElapsedSeconds = elapsedSeconds;

        if (!freeze) {
            // Initial calculation
            calculateTime(currentElapsedSeconds);

            // Update every second
            const interval = setInterval(() => {
                currentElapsedSeconds += 1;
                calculateTime(currentElapsedSeconds);
            }, 1000);

            return () => clearInterval(interval); // Cleanup the interval on component unmount
        } else{
            calculateTime(currentElapsedSeconds);
        }
    }, [elapsedSeconds, freeze]);


    return (
        <div>
            <h1>Timer</h1>
            <span className="countdown font-mono text-2xl">
                <span style={{ "--value": hours } as React.CSSProperties}></span>:
                <span style={{ "--value": minutes } as React.CSSProperties }></span>:
                <span style={{ "--value": seconds } as React.CSSProperties}></span>
            </span>
        </div>
    );
}

export default Timer;
