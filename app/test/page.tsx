'use client'
import { cookies } from 'next/headers'
import {useEffect, useState} from "react";
import Timer from "@/components/Timer";
import {fetchRecentACSubmissions} from "@/app/gqlAction";

export default function Page() {
    const [startTimestamp, setStartTimestamp] = useState<number>(0);
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
    const [freeze, setFreeze] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateElapsedSeconds = () =>{
        // Calculate elapsed seconds from the start timestamp
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
        const elapsed = currentTimestamp - startTimestamp;
        setElapsedSeconds(elapsed);
    }

    const fetchStartTimestamp = async (userName: String, titleSlug: String) => {
        // Simulate an API call
        // const response = await new Promise<{ timestamp: number }>(resolve => {
        //     setTimeout(() => {
        //         resolve({ timestamp: 1722800286 }); // Simulated timestamp from an external source
        //     }, 1000);
        // });
        const data = await fetchRecentACSubmissions(userName);
        const recentAcSubmissionList = data.recentAcSubmissionList;
        console.log(recentAcSubmissionList);
        // Check if the response has the expected data
        if (recentAcSubmissionList) {
            // Find the submission with the matching titleSlug
            const submission = recentAcSubmissionList.find(
                (submission: { titleSlug: String; }) => submission.titleSlug === titleSlug
            );
            console.log(submission);
            // Set the timestamp if the submission is found
            if (submission) {
                setStartTimestamp(submission.timestamp);
            } else {
                setError(`No submission found with titleSlug: ${titleSlug}`);
            }
        }
    };

    useEffect(() => {
        // Simulate fetching startTimestamp from an external source
        fetchStartTimestamp('pedia', 'max-value-of-equation');
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