'use client'
import React, {useEffect, useState} from 'react';
import {Button} from "@nextui-org/button";
import {PlusIcon} from "lucide-react";
import {createCollection, fetchCollections} from "@/app/lib/action";
import {toast} from "sonner";
import {store} from "@/app/store";
import {Accordion, AccordionItem} from "@nextui-org/accordion";

function CollectionPage() {
    // State to manage the currently expanded accordion panel
    const [expanded, setExpanded] = useState(false);
    const [collections, setCollections] = useState([] as any);

    // Function to handle accordion changes
    const handleAccordionChange = (panel: any) => {
        setExpanded(expanded === panel ? null : panel);
    };

    function addCollection(){
        createCollection(null, null, null);
        toast.success("new collection created");
    }

    async function getCollections() {
        const data = await fetchCollections();
        setCollections(data);
    }

    useEffect(() => {
        getCollections();
        console.log(collections);
    }, [])

    // Sample data for sub-collections
    const subCollections = [
        {
            id: 'panel1',
            title: "Sub-collection 1",
            questions: ["Question 1", "Question 2"]
        },
        {
            id: 'panel2',
            title: "Sub-collection 2",
            questions: ["Question 3", "Question 4"]
        }
    ];

    const defaultContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    return (
        <div className="container mx-auto px-4">
            <Button className="btn-accent" onClick={addCollection}>
                <PlusIcon/>
            </Button>
            <div>
                <h2>Collections</h2>
                <ul>
                    {/*{console.log(collections)}*/}
                    {collections.map((collection: any) => (
                        <li key={collection.id}>
                            <h3>{collection.name}</h3>
                            <p>{collection.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <h1 className="text-xl font-bold text-primary text-center my-4">LCP – Collection Page</h1>

            <div className="flex justify-between items-center my-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Collection
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    Search Sub
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                </button>
            </div>

            <Accordion>
                <AccordionItem key="1" aria-label="Accordion 1" subtitle="Press to expand" title="Accordion 1">
                    Question
                </AccordionItem>

                <AccordionItem
                    key="2"
                    aria-label="Accordion 2"
                    subtitle={
                        <span>Press to expand <strong>key 2</strong></span>
                    }
                    title="Accordion 2"
                >
                    Question
                </AccordionItem>
                <AccordionItem key="3" aria-label="Accordion 3" subtitle="Press to expand" title="Accordion 3">
                        Question
                </AccordionItem>
            </Accordion>

        </div>
    );
}

export default CollectionPage;
