"use client"

import {ApolloProvider} from "@apollo/client";
import client from "@/app/apollo";
import ProblemQuestionList from "@/components/ProblemQuestionList";
import {useEffect} from "react";

import {store} from "@/app/store";

export default function Home() {
    useEffect(() => {
        store.fetchData()
    }, [])
    return (
        <ApolloProvider client={client}>
            <ProblemQuestionList/>
            </ApolloProvider>
    );
}
