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
import {toast} from 'sonner';
import dayjs from "dayjs";
import {Popover, PopoverContent, PopoverTrigger} from "@nextui-org/popover";
import {Calendar} from "@nextui-org/calendar";
import {parseDate} from "@internationalized/date";
import {useDebounce} from "use-debounce";

function ProblemQuestionList() {
    const [currentPage, setCurrentPage] = useState(1)
    // const storeSnap = useSnapshot(store)
    const storeSnap = useDebounce(useSnapshot(store), 1000)
    const [calendarValue, setCalendarValue] = useState(parseDate(dayjs().format("YYYY-MM-DD")))

    useEffect(() => {
        store.fetchData()
    }, [])

    if (storeSnap.isLoading) {
        return (
            <div className="flex h-full justify-center items-center">
                <span className="loading loading-infinity loading-lg"></span>
            </div>
        )
    }

    async function onPageNumberChange(pageNumber) {
        await store.fetchData(pageNumber)
        setCurrentPage(pageNumber)
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const difficultyColors = {
        Easy: '#00AFA7',
        Medium: '#FFC900',
        Hard: '#FF2D6F'
    }

    function addTodo(question) {
        const isExist = storeSnap.todos.some(todo => todo.frontendQuestionId === question.frontendQuestionId)
        if (isExist) {
            // FIXME: update if exist
            toast.error("It's already in your todo list")
        } else {
            store.todos.push(question)
            toast.success("Added to your today todo list")
        }
    }

    function addTodayTodo(question) {
        const today = dayjs();
        const formattedDateToday = today.format('YYYY-MM-DD');
        question.todoDate = formattedDateToday
        console.log(question)

        addTodo(question)
    }

    function addTomorrowTodo(question) {
        const tomorrow = dayjs().add(1, 'day');
        const formattedDateTomorrow = tomorrow.format('YYYY-MM-DD');
        question.todoDate = formattedDateTomorrow
        console.log(question)

        addTodo(question)
    }

    function onCalendarChange(question) {

        return (dateObj) => {
            setCalendarValue(dateObj)
            // console.log(dateObj)
            const date = `${dateObj.year}-${dateObj.month}-${dateObj.day}`
            console.log(date)
            question.todoDate = date
            addTodo(question)
        }
    }

    return (
        <div className="my-2">
            <Table aria-label="leetcode table" className="mb-6">
                <TableHeader>
                    <TableColumn>Title</TableColumn>
                    <TableColumn>Difficulty</TableColumn>
                    <TableColumn>AC Rate</TableColumn>
                    {/*<TableColumn>Status</TableColumn>*/}
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
                                                <div className="mr-2 mt-2 badge badge-ghost"
                                                     key={tag.id}>{tag.name}</div>
                                            )
                                        })}
                                    </div>
                                    {question.paidOnly && <div className="badge badge-warning mr-2 mt-2">
                                        Premium
                                    </div>}

                                </TableCell>
                                <TableCell>
                                    <p style={{color: difficultyColors[question.difficulty]}}>{question.difficulty}</p>
                                </TableCell>
                                <TableCell>
                                    {question.acRate.toFixed(1)}%
                                </TableCell>
                                {/*<TableCell>*/}
                                {/*    Todo/Redo/Done*/}
                                {/*</TableCell>*/}
                                <TableCell>
                                    <div className="flex flex-row">
                                        <button
                                            className="btn btn-ghost"
                                            onClick={() => addTodayTodo(question)}>
                                            Today
                                        </button>

                                        <button
                                            className="btn btn-ghost"
                                            onClick={() => addTomorrowTodo(question)}>
                                            Tomorrow
                                        </button>

                                        <Popover placement="bottom" showArrow={true}>
                                            <PopoverTrigger>
                                                <button className="btn btn-ghost">...</button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar onChange={onCalendarChange(question)}
                                                          value={calendarValue}/>
                                            </PopoverContent>
                                        </Popover>


                                        {/*<button className="btn btn-ghost">Inbox</button>*/}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <div className="flex justify-center mb-6">
                <Pagination total={Math.ceil(store.total / 50)} page={currentPage} showControls
                            onChange={onPageNumberChange}/>
            </div>
        </div>
    );
}

export default ProblemQuestionList;