"use client"

import {Calendar} from "@nextui-org/calendar";

import {store} from "@/app/store";
import {Flag, FlagOff} from 'lucide-react'
import {useSnapshot} from "valtio";
import {Link} from "@nextui-org/link";
import React, {useState} from "react";
import dayjs from "dayjs";
import {parseDate} from "@internationalized/date";
import {Chip} from "@nextui-org/chip";

function QuestionLi({question}) {
    return (
        <li key={question.frontendQuestionId}
            className="flex items-center space-x-2">
            <input type="checkbox" className="checkbox"/>
            <Link className="text-black hover:text-blue-500" isExternal
                  href={`https://leetcode.com/problems/${question.titleSlug}`}>
                <p>{question.frontendQuestionId}. {question.title}</p>
            </Link>

            {!question?.redo ?
                <button className="btn btn-ghost">Redo It<Flag/></button> :
                <button className="btn btn-ghost">Cancel Redo<FlagOff/>
                </button>}

        </li>
    )
}

export default function Home() {
    const storeSnap = useSnapshot(store)
    const today = dayjs().format("YYYY-MM-DD")
    const [calendarValue, setCalendarValue] = useState(parseDate(today))

    // group todos by date
    const groupedTodos = storeSnap.todos.reduce((acc, todo) => {
        const date = todo.todoDate;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(todo);
        return acc;
    }, {});

    function onCalendarChange(dateObj) {
        // console.log(dateObj)
        let date = `${dateObj.year}-${dateObj.month}-${dateObj.day}`
        date = dayjs(date).format('YYYY-MM-DD')
        setCalendarValue(parseDate(date))
        store.todosDateFilter = date
        console.log(date)
    }

    function onChipDateFilterClose() {
        store.todosDateFilter = ""
        setCalendarValue(today)
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
        <div className="flex flex-row justify-between my-2">
            {
                storeSnap.todosDateFilter !== ""
                    ? (<div>
                        <Chip onClose={onChipDateFilterClose} variant="bordered">
                            {storeSnap.todosDateFilter}
                        </Chip>
                        <div>
                            {storeSnap.todos
                                .filter(todo => {
                                    return todo.todoDate === storeSnap.todosDateFilter
                                })
                                .map((todo, index) => {
                                    return (
                                        <div key={todo.frontendQuestionId}>
                                            {index === 0 && <h2 className="text-2xl font-bold"> {todo.todoDate}</h2>}
                                            <QuestionLi question={todo}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>)
                    : (<div>
                        {Object.entries(groupedTodos)
                            .sort(([dateA], [dateB]) => dayjs(dateA).diff(dayjs(dateB)))
                            .map(([date, todos]) => (
                                <div key={date}>
                                    <h2 className="text-2xl font-bold">
                                        {dateToHeadingText(date)}
                                    </h2>
                                    <ul>
                                        {todos.map((todo) => (
                                            <QuestionLi question={todo} key={todo.frontendQuestionId}/>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                    </div>)
            }
            <div>
                <Calendar
                    onChange={onCalendarChange}
                    value={calendarValue}
                />
            </div>
        </div>
    )
}
