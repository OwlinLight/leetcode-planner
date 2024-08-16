'use client'
import React, {useEffect, useState} from 'react';
import {Button} from "@nextui-org/button";
import {InfoIcon, PlusIcon} from "lucide-react";
import {createCollection, fetchCollectionProblems, fetchCollections} from "@/app/lib/action";
import {toast} from "sonner";
import {store} from "@/app/store";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import SelectCollection from "@/components/SelectCollection";
import {useSnapshot} from "valtio";

function CollectionPage() {
    // State to manage the currently expanded accordion panel
    const [expanded, setExpanded] = useState(false);
    const [problems, setProblems] = useState<any>([]);

    const {selectedCollectionId} = useSnapshot(store)

    const fetchProblems = async (collectionId: number) => {
        let data = await fetchCollectionProblems(collectionId);
        setProblems(data);
        console.log(data)
    }

    useEffect(() => {
        fetchProblems
    (store.selectedCollectionId);
    }, [selectedCollectionId]);

    function addCollection(){
        createCollection(null, null, null);
        toast.success("new collection created");
    }

    return (
        <div className="container mx-auto px-4">
            <Button className="btn-accent" onClick={addCollection}>
                <PlusIcon/>
            </Button>
            <SelectCollection/>
            {/*{store.selectedCollection ? (<p> current selected {store.selectedCollection}</p>) : ("no select")}*/}
            <h1 className="text-xl font-bold text-primary text-center my-4">LCP – Collection Page</h1>

            {problems ? problems.map((problem: any) => (
                <li key={problem.id}>
                    Problem ID: {problem.problem_id}, Index: {problem.idx !== null ? problem.idx : "N/A"}
                </li>
            )): (
                <p>No problems found for this collection.</p>
            )}

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
