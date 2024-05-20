import React, {useEffect, useState} from 'react';


import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@nextui-org/table";
import {useSnapshot} from "valtio";
import {store} from "@/app/store";
import {Link} from "@nextui-org/link";
import {Chip} from "@nextui-org/chip";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/dropdown";
import {Button} from "@nextui-org/button";
import {Pagination} from "@nextui-org/pagination";

function ProblemQuestionList() {
    useEffect(() => {
        store.fetchData()
    }, [])

    const [currentPage, setCurrentPage] = useState(1)
    async function onPageNumberChange(pageNumber) {
        await store.fetchData(pageNumber)
        setCurrentPage(pageNumber)
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        console.log(pageNumber)
    }

    const storeSnap = useSnapshot(store)

    if (storeSnap.isLoading) {
        return (
            <div className="flex h-full justify-center items-center">
                <span className="loading loading-infinity loading-lg"></span>
            </div>
        )
    }
    const difficultyColors = {
        Easy: '#00AFA7',
        Medium: '#FFC900',
        Hard: '#FF2D6F'
    }
    return (
        <div className="my-2">
            <Table aria-label="leetcode table" className="mb-6">
                <TableHeader>
                    <TableColumn>Title</TableColumn>
                    <TableColumn>Difficulty</TableColumn>
                    <TableColumn>AC Rate</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Schedule</TableColumn>
                </TableHeader>
                <TableBody>
                    {store.problemQuestionList.map((question) => {
                        return (
                            <TableRow key={question.frontendQuestionId}>
                                <TableCell className="max-w-40">
                                    <Link className="text-black hover:text-blue-500" isExternal
                                          href={`https://leetcode.com/problems/${question.titleSlug}`}>
                                        <p>{question.frontendQuestionId}. {question.title}</p>
                                    </Link>
                                    <div className="flex flex-row flex-wrap">
                                        {question.topicTags.map(tag => {
                                            return (
                                                <Chip className="mr-2 mt-2" size="sm" key={tag.id}>{tag.name}</Chip>
                                            )
                                        })}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p style={{color: difficultyColors[question.difficulty]}}>{question.difficulty}</p>
                                </TableCell>
                                <TableCell>
                                    {question.acRate.toFixed(1)}%
                                </TableCell>
                                <TableCell>
                                    Todo/Redo/Done
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-row">
                                        Today
                                        TMRW
                                        ...
                                        Inbox
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <div className="flex justify-center mb-6">
                <Pagination  total={ Math.ceil(store.total / 50) } page={currentPage} showControls onChange={onPageNumberChange}/>
            </div>
        </div>
    );
}

export default ProblemQuestionList;