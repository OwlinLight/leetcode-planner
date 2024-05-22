"use client"

import ProblemQuestionList from "@/components/ProblemQuestionList";
import {useEffect} from "react";
import {store} from "@/app/store";

export default function Home() {
    useEffect(() => {
        store.fetchData()
    }, [])
    return (
        <div>
            <ProblemQuestionList/>
        </div>
    );
}
