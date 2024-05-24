"use client";

import {store} from "@/app/store";
import {parseDate} from "@internationalized/date";
import {Calendar} from "@nextui-org/calendar";
import {Chip} from "@nextui-org/chip";
import {Link} from "@nextui-org/link";
import dayjs from "dayjs";
import {Flag, FlagOff} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useSnapshot} from "valtio";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

function calendarObjToDateString(calendar) {
	// YYYY-M-D -> YYYY-MM-DD
	return dayjs(`${calendar.year}-${calendar.month}-${calendar.day}`).format(
		"YYYY-MM-DD",
	);
}

function QuestionLi({ question }) {
	return (
		<li
			key={question.frontendQuestionId}
			className="flex items-center space-x-2"
		>
			<input type="checkbox" className="checkbox" />
			<Link
				className="text-black hover:text-blue-500"
				isExternal
				href={`https://leetcode.com/problems/${question.titleSlug}`}
			>
				<p>
					{question.frontendQuestionId}. {question.title}
				</p>
			</Link>

			{!question?.redo ? (
				<button type="button" className="btn btn-ghost">
					Redo It
					<Flag />
				</button>
			) : (
				<button type="button" className="btn btn-ghost">
					Cancel Redo
					<FlagOff />
				</button>
			)}
		</li>
	);
}

export default function Home() {
	const storeSnap = useSnapshot(store);
	const today = dayjs().format("YYYY-MM-DD");
	const [calendarValue, setCalendarValue] = useState(parseDate(today));

	// query string prep
	// readonly
	const searchParams = useSearchParams();
	const pathname = usePathname();
	// set by replacing with pathname?newSearchParams
	const { replace } = useRouter();

	useEffect(() => {
		const date = dayjs(searchParams.get("date")).format('YYYY-MM-DD') ;
		if (date) {
			setCalendarValue(parseDate(date))
			store.todosDateFilter = date;
		}
	}, []);

	// group todos by date
	const groupedTodos = storeSnap.todos.reduce((acc, todo) => {
		const date = todo.todoDate;
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(todo);
		return acc;
	}, {});

	function onCalendarChange(calendarObj) {
		setCalendarValue(calendarObj);

		const date = calendarObjToDateString(calendarObj);
		store.todosDateFilter = date;

		// string process
		const params = new URLSearchParams(searchParams);
		params.set("date", date);
		// actually replace the url
		replace(`${pathname}?${params.toString()}`);
	}

	function onChipDateFilterClose() {
		store.todosDateFilter = "";
		setCalendarValue(parseDate(today));

		// string process
		const params = new URLSearchParams(searchParams);
		params.delete("date");
		// actually replace the url
		replace(`${pathname}?${params.toString()}`);
	}

	function dateToHeadingText(date) {
		const today = dayjs().format("YYYY-MM-DD");
		const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
		const yesterday = dayjs().add(-1, "day").format("YYYY-MM-DD");
		if (date === today) {
			return `Today ${date} ${dayjs(date).format("dddd")}`;
		}
		if (date === tomorrow) {
			return `Tomorrow ${date} ${dayjs(date).format("dddd")}`;
		}
		if (date === yesterday) {
			return `Yesterday ${date} ${dayjs(date).format("dddd")}`;
		}
		return `${dayjs(date).format("dddd")} ${date}`;
	}

	return (
		<div className="flex flex-row justify-between my-2">
			{storeSnap.todosDateFilter !== "" ? (
				<div>
					<Chip onClose={onChipDateFilterClose} variant="bordered">
						{storeSnap.todosDateFilter}
					</Chip>
					<div>
						{storeSnap.todos
							.filter((todo) => {
								return todo.todoDate === storeSnap.todosDateFilter;
							})
							.map((todo, index) => {
								return (
									<div key={todo.frontendQuestionId}>
										{index === 0 && (
											<h2 className="text-2xl font-bold"> {todo.todoDate}</h2>
										)}
										<QuestionLi question={todo} />
									</div>
								);
							})}
					</div>
				</div>
			) : (
				<div>
					{Object.entries(groupedTodos)
						.sort(([dateA], [dateB]) => dayjs(dateA).diff(dayjs(dateB)))
						.map(([date, todos]) => (
							<div key={date}>
								<h2 className="text-2xl font-bold">
									{dateToHeadingText(date)}
								</h2>
								<ul>
									{todos.map((todo) => (
										<QuestionLi question={todo} key={todo.frontendQuestionId} />
									))}
								</ul>
							</div>
						))}
				</div>
			)}
			<div>
				<Calendar onChange={onCalendarChange} value={calendarValue} />
			</div>
		</div>
	);
}
