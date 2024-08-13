'use client';

import {useEffect, useState} from 'react';
import {generate} from './actions';
import ReactMarkdown from "react-markdown";
import {readStreamableValue} from 'ai/rsc';

// const {data, errors, loading} = await client.query({
//     query: RECENT_AC_SUBMISSIONS,
//     variables: {
//
//     }
// })


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Report(props: any) {
    const [generation, setGeneration] = useState<string>('');

    const promptTemplate = `
I have Finish the leetcode ${props.questionInfo} Problem, please give me the Reason why would we thinking about using certain Data Structure and Algorithm, Achieve Steps, Takeaways, 5 Similar Questions only with question title and Leetcode Links. Do not provide other information like Problem Statement or something else
`

    useEffect(() => {
        const init = async () => {
            const {output} = await generate(promptTemplate);

            for await (const delta of readStreamableValue(output)) {
                setGeneration(currentGeneration => `${currentGeneration}${delta}`);
            }
        }
        init()
    }, []);
    return (
        <div className="prose space-y-4">
            <ReactMarkdown>
                {generation}
            </ReactMarkdown>
        </div>
    );
}