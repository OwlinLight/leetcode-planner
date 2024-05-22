// store.ts
import {proxy} from "valtio";
import {gql} from "@apollo/client";
import client from "@/app/apollo";
import {useDebounce} from "use-debounce";
import dayjs from "dayjs";

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

export const store = proxy({
    isLoading: true,
    todos: [],
    todosDateFilter: "",
    // total -> pagination
    total: 0,
    // this page number is just for UI
    pageNumber: 1,
    problemQuestionList: [],
    searchKeyWords: "",
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