'use client';

import {useChat} from 'ai/react';
import ReactMarkdown from "react-markdown";


export default function Chat() {
    const {messages, input, handleInputChange, handleSubmit} = useChat();
    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            {messages.map(m => (
                <div key={m.id} className="prose whitespace-pre-wrap">
                    {m.role === 'user' ? 'User: ' : 'AI: '}
                    <ReactMarkdown>
                        {m.content}
                    </ReactMarkdown>
                </div>
            ))}

            <form onSubmit={handleSubmit}>
                <input
                    className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
                    value={input}
                    placeholder="Say something..."
                    onChange={handleInputChange}
                />
            </form>
        </div>
    );
}