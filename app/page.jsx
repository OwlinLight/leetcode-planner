"use client"

import {ApolloProvider} from "@apollo/client";
import client from "@/app/apollo";
import {Calendar} from "@nextui-org/calendar";

import {store} from "@/app/store";
import {Flag, FlagOff} from 'lucide-react'
import {useSnapshot} from "valtio";
import {Link} from "@nextui-org/link";
import React, {useState} from "react";
import dayjs from "dayjs";
import {parseDate} from "@internationalized/date";
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";

export default function Home() {
    const storeSnap = useSnapshot(store)
    const [calendarValue, setCalendarValue] = useState(parseDate(dayjs().format("YYYY-MM-DD")))
    const [date, setDate] = useState("")

    const groupedTodos = storeSnap.todos.reduce((acc, todo) => {
        const date = todo.todoDate;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(todo);
        return acc;
    }, {});

    console.log(groupedTodos)
    function onCalendarChange() {
        return (dateObj) => {
            setCalendarValue(dateObj)
            // console.log(dateObj)
            const date = `${dateObj.year}-${dateObj.month}-${dateObj.day}`
            console.log(date)
            setDate(date)
        }
    }

    function dateToHeadingText(date) {
        const today = dayjs().format('YYYY-MM-DD')
        const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
        const yesterday = dayjs().add(-1, 'day').format('YYYY-MM-DD')
        if (date === today) {
            return "Today " + date + " " + dayjs(date).format('dddd')
        } else if (date === tomorrow) {
            return "Tomorrow " + date + " " + dayjs(date).format('dddd')
        } else if (date === yesterday) {
            return "Yesterday " + date + " " + dayjs(date).format('dddd')
        } else {
            return dayjs(date).format('dddd') + " " + date
        }
    }

    return (
        <ApolloProvider client={client}>
            <div className="flex flex-row justify-between my-2">
                <div>
                    <div>
                        {Object.entries(groupedTodos)
                            .sort(([dateA], [dateB]) => dayjs(dateA).diff(dayjs(dateB)))
                            .map(([date, todos]) => (
                            <div key={date}>
                                <h2 className="text-2xl font-bold">
                                    {dateToHeadingText(date)}
                                </h2>
                                <ul>
                                    {todos.map((question) => (
                                        <li key={question.frontendQuestionId} className="flex items-center space-x-2">
                                            <input type="checkbox" className="checkbox"/>
                                            <Link className="text-black hover:text-blue-500" isExternal
                                                  href={`https://leetcode.com/problems/${question.titleSlug}`}>
                                                <p>{question.frontendQuestionId}. {question.title}</p>
                                            </Link>

                                            {!question?.redo ?
                                                <button className="btn btn-ghost">Redo It<Flag/></button> :
                                                <button className="btn btn-ghost">Cancel Redo<FlagOff/></button>}

                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                </div>
                <div>
                    <Calendar onChange={onCalendarChange()}
                              value={calendarValue}/>
                </div>
            </div>

        </ApolloProvider>
    );
}
