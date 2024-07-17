// store.js
import {proxy, useSnapshot} from "valtio";
import {gql} from "@apollo/client";
import client from "@/app/apollo";
import {fetchTodos} from "@/app/lib/action";
import { Database } from '@/app/lib/schema'

const PROBLEMSET_QUESTION_LIST_QUERY = gql`
          query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
            problemsetQuestionList: questionList(
              categorySlug: $categorySlug
              limit: $limit
              skip: $skip
              filters: $filters
            ) {
              total: totalNum
              questions: data {
                acRate
                difficulty
                freqBar
                frontendQuestionId: questionFrontendId
                isFavor
                paidOnly: isPaidOnly
                status
                title
                titleSlug
                topicTags {
                  name
                  id
                  slug
                }
                hasSolution
                hasVideoSolution
              }
            }
          }
        `;

const RECENT_AC_SUBMISSIONS = gql`
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    } 
`;

interface Todo {
    id: number;
    question_id: number;
    is_done: boolean;
    title: string;
    title_slug: string;
    created_at: string;
    todo_date: string;
}


export const store = proxy({
    isLoading: true,
    todos: [] as Todo[],
    todosDateFilter: "",
    // total -> pagination
    total: 0,
    // this page number is just for UI
    pageNumber: 1,
    problemQuestionList: [],
    searchKeyWords: "",
    async fetchRecentACSubmissions(username: any, limit = 15) {
        this.isLoading = true
        const {data, errors, loading} = await client.query({
            query: RECENT_AC_SUBMISSIONS, variables: {
                username: username,
                limit: limit,
            }
        })
        this.isLoading = false;
        console.log(data);
    },
    async fetchTodos() {
        const db_todos = await fetchTodos();
        this.todos = db_todos!;
    },
    async fetchData(pageNumber = 1) {
        this.isLoading = true
        const {data, errors, loading} = await client.query({
            query: PROBLEMSET_QUESTION_LIST_QUERY, variables: {
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
        if(this.searchKeyWords === "") {
            return this.fetchData()
        }
        const {data, errors, loading} = await client.query({
            query: PROBLEMSET_QUESTION_LIST_QUERY, variables: {
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
    }
})