"use client"

import {ApolloProvider} from "@apollo/client";
import client from "@/app/apollo";
import {Calendar} from "@nextui-org/calendar";

import {store} from "@/app/store";

export default function Home() {

    return (
        <ApolloProvider client={client}>
            <div className="flex flex-row justify-between my-2">
                <div>
                    <div>
                        Todo:
                    </div>
                    <div>
                        Redo:
                    </div>
                    <div>
                        Done:
                    </div>
                </div>
                <div>
                    <Calendar aria-label="Date (No Selection)"/>
                </div>
            </div>

        </ApolloProvider>
    );
}
