"use client"

import {Calendar} from "@nextui-org/calendar";

import {store} from "@/app/store";
import {DeleteIcon, Flag, FlagOff, RecycleIcon, TrashIcon} from 'lucide-react'
import {useSnapshot} from "valtio";
import {Link} from "@nextui-org/link";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import {parseDate} from "@internationalized/date";
import {Chip} from "@nextui-org/chip";
import {deleteTodo, fetchTodos, finishTodo, startTodo, updateTodo} from "@/app/lib/action";
import {toast} from "sonner";
import timer from "@/components/Timer";
import Timer from "@/components/Timer";


function QuestionLi({question}) {

    async function handleStart(id){
        toast(`Timer Start at ${new Date().toTimeString()}`, {
            cancel: {
                label: 'Dismiss',
                onClick: () => console.log('Noted'),
            },
        });
        await startTodo(id);
        await store.fetchTodos();
    }

    async function handleFinish(id) {
        await finishTodo(id);
        await store.fetchTodos();
    }

    async function handleDelete(id) {
        toast.warning(`Todo ${id} has been deleted`)
        await deleteTodo(id);
        await store.fetchTodos();
    }

    return (
        <li key={question.id}
            className="flex items-center space-x-2">
            <div className="dropdown dropdown-left">
                <div tabIndex="0" role="button" className="btn-ghost btn m-1"><TrashIcon/></div>
                <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <button
                        className="btn btn-ghost"
                        onClick={() => handleDelete(question.id)}
                    >
                        Delete
                    </button>
                </ul>
            </div>
            <input type="checkbox" className="checkbox" checked={question.finished_at} disabled={true}/>
            <Link className="text-black hover:text-blue-500" isExternal
                  href={`https://leetcode.com/problems/${question.title_slug}`}>
                <p>{question.question_id}. {question.title}</p>
            </Link>
            {!question?.started_at ? (
                <Link className="text-black hover:text-blue-500" isExternal
                      href={`https://leetcode.com/problems/${question.title_slug}`}>
                    <button
                        className="btn btn-button"
                        onClick={() => handleStart(question.id)}
                    >
                        Start Timer
                        <Flag/>
                    </button>
                </Link>
            ) : (
                !question?.finished_at ? (
                    <>
                        <Timer elapsedSeconds={dayjs().diff(dayjs(question.started_at), 'seconds')} freeze={false}/>
                        <button
                            className="btn btn-outline btn-success"
                            onClick={() => handleFinish(question.id)}
                        >
                            Finished!
                            <Flag/>
                        </button>
                    </>
                ) : (
                    <Timer elapsedSeconds={dayjs(question.finished_at).diff(dayjs(question.started_at), 'seconds')} freeze={true}/>
                )
            )}
        </li>
    )
}

export default function Home() {
    const storeSnap = useSnapshot(store)
    const today = dayjs().format("YYYY-MM-DD")
    const [calendarValue, setCalendarValue] = useState(parseDate(today))

    useEffect(() => {
        async function helper() {
            await store.fetchTodos()
        }
        helper()
    }, []);
    // group todos by date
    const groupedTodos = storeSnap.todos.reduce((acc, todo) => {
        const date = todo.todo_date;
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
        setCalendarValue(parseDate(today))
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
                                    return todo.todo_date === storeSnap.todosDateFilter
                                })
                                .map((todo, index) => {
                                    return (
                                        <div key={todo.id}>
                                            {index === 0 && <h2 className="text-2xl font-bold"> {todo.todo_date}</h2>}
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
                                            <QuestionLi question={todo} key={todo.id}/>
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
