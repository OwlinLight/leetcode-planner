// store.js
import {proxy, useSnapshot} from "valtio";
import {gql} from "@apollo/client";
import client from "@/app/apollo";
import {fetchTodos} from "@/app/lib/action";
import {Database} from '@/app/lib/schema'
import {PROBLEM_QUESTION_LIST_QUERY, RECENT_AC_SUBMISSIONS} from "@/app/queries";


// interface Todo {
//     id: number;
//     question_id: number;
//     is_done: boolean;
//     title: string;
//     title_slug: string;
//     created_at: string;
//     todo_date: string;
// }

export const store = proxy({
        isLoading: true,
        todos: [] as any[],
        todosDateFilter: "",
        // total -> pagination
        total: 0,
        // this page number is just for UI
        pageNumber: 1,
        problemQuestionList: [],
        searchKeyWords: "",
        chatPrompt: "",
        message: "",
        async fetchTodos() {
            const db_todos = await fetchTodos();
            this.todos = db_todos!
        },
        async fetchData(pageNumber = 1) {
            this.isLoading = true
            const {data, errors, loading} = await client.query({
                query: PROBLEM_QUESTION_LIST_QUERY, variables: {
                    categorySlug: '',
                    skip: 50 * (pageNumber - 1),
                    limit: 50,
                    filters: {},
                }
            })
            this.total = data.problemsetQuestionList.total
            this.problemQuestionList = data.problemsetQuestionList.questions
            this.pageNumber = pageNumber
            this.isLoading = false;
        },
        async searchProblems(pageNumber = 1) {
            this.isLoading = true
            if (this.searchKeyWords === "") {
                return this.fetchData()
            }
            const {data, errors, loading} = await client.query({
                query: PROBLEM_QUESTION_LIST_QUERY, variables: {
                    categorySlug: 'all-code-essentials',
                    skip: 50 * (pageNumber - 1),
                    limit: 50,
                    filters: {
                        searchKeywords: this.searchKeyWords
                    },
                }
            })
            this.total = data.problemsetQuestionList.total
            this.problemQuestionList = data.problemsetQuestionList.questions
            this.pageNumber = pageNumber
            this.isLoading = false
        },
    },
)