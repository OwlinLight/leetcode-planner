import {store} from "@/app/store";
import {parseDate} from "@internationalized/date";
import {Calendar} from "@nextui-org/calendar";
import {Link} from "@nextui-org/link";
import {Pagination} from "@nextui-org/pagination";
import {Popover, PopoverContent, PopoverTrigger} from "@nextui-org/popover";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow,} from "@nextui-org/table";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {toast} from "sonner";
import {useSnapshot} from "valtio";

function ProblemQuestionList() {
	const storeSnap = useSnapshot(store);
	const today = dayjs().format("YYYY-MM-DD");
	const [calendarValue, setCalendarValue] = useState(parseDate(today));

	useEffect(() => {
		store.fetchData();
	}, []);

	if (storeSnap.isLoading) {
		return (
			<div className="flex h-full justify-center items-center">
				<span className="loading loading-infinity loading-lg" />
			</div>
		);
	}

	async function onPageNumberChange(pageNumber) {
		if (storeSnap.searchKeyWords === "") {
			await store.fetchData(pageNumber);
		} else {
			await store.searchProblems(pageNumber);
		}
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	const difficultyColors = {
		Easy: "#00AFA7",
		Medium: "#FFC900",
		Hard: "#FF2D6F",
	};

	function addTodo(question) {
		const isExist = storeSnap.todos.some(
			(todo) => todo.frontendQuestionId === question.frontendQuestionId,
		);

		if (isExist) {
			// update todoDate
			store.todos = storeSnap.todos.map((todo) => {
				if (todo.frontendQuestionId === question.frontendQuestionId) {
					return {...todo, todoDate: question.todoDate};
				}
				return todo;
			});
			toast.success("Updated Date");
		} else {
			store.todos.push(question);
			toast.success("Added to your today todo list");
		}
	}

	function addTodayTodo(question) {
		const questionWithTodoDate = { ...question, todoDate: today };
		addTodo(questionWithTodoDate);
	}

	function addTomorrowTodo(question) {
		const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
		const questionWithTodoDate = { ...question, todoDate: tomorrow };
		addTodo(questionWithTodoDate);
	}

	function onCalendarChange(question) {
		return (dateObj) => {
			setCalendarValue(dateObj);
			// console.log(dateObj)
			let date = `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
			date = dayjs(date).format("YYYY-MM-DD");
			const questionWithTodoDate = { ...question, todoDate: date };
			addTodo(questionWithTodoDate);
		};
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
					{storeSnap.problemQuestionList.map((question) => {
						return (
							<TableRow key={question.frontendQuestionId}>
								<TableCell className="max-w-40">
									<Link
										className="text-black hover:text-blue-500"
										isExternal
										href={`https://leetcode.com/problems/${question.titleSlug}`}
									>
										<p>
											{question.frontendQuestionId}. {question.title}
										</p>
									</Link>
									<div className="flex flex-row flex-wrap">
										{question.topicTags.map((tag) => {
											return (
												<div
													className="mr-2 mt-2 badge badge-ghost"
													key={tag.id}
												>
													{tag.name}
												</div>
											);
										})}
									</div>
									{question.paidOnly && (
										<div className="badge badge-warning mr-2 mt-2">Premium</div>
									)}
								</TableCell>
								<TableCell>
									<p style={{ color: difficultyColors[question.difficulty] }}>
										{question.difficulty}
									</p>
								</TableCell>
								<TableCell>{question.acRate.toFixed(1)}%</TableCell>
								{/*<TableCell>*/}
								{/*    Todo/Redo/Done*/}
								{/*</TableCell>*/}
								<TableCell>
									<div className="flex flex-row">
										<button
											type="button"
											className="btn btn-ghost"
											onClick={() => addTodayTodo(question)}
										>
											Today
										</button>

										<button
											type="button"
											className="btn btn-ghost"
											onClick={() => addTomorrowTodo(question)}
										>
											Tomorrow
										</button>

										<Popover
											placement="bottom"
											onClose={() => setCalendarValue(parseDate(today))}
										>
											<PopoverTrigger>
												<button type="button" className="btn btn-ghost">
													...
												</button>
											</PopoverTrigger>
											<PopoverContent>
												<Calendar
													onChange={onCalendarChange(question)}
													value={calendarValue}
												/>
											</PopoverContent>
										</Popover>

										{/*<button className="btn btn-ghost">Inbox</button>*/}
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			<div className="flex justify-center mb-6">
				<Pagination
					showControls
					page={storeSnap.pageNumber}
					total={Math.ceil(store.total / 50)}
					onChange={onPageNumberChange}
				/>
			</div>
		</div>
	);
}

export default ProblemQuestionList;