// store.ts
import {proxy} from "valtio";
import {gql} from "@apollo/client";
import client from "@/app/apollo";

export const store = proxy({
    todos: [],
    problemQuestionList: [],
    // total -> pagination
    total: 0,
    isLoading: true,
    async fetchData(pageNumber = 1, searchKeywords) {
        this.isLoading = true

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

        if (searchKeywords) {
            const {data, errors, loading} = await client.query({
                query: PROBLEMSET_QUESTION_LIST_QUERY, variables: {
                    categorySlug: 'all-code-essentials',
                    skip: 50 * (pageNumber - 1),
                    limit: 50,
                    filters: {
                        searchKeywords: searchKeywords
                    },
                }
            })
            this.total = data.problemsetQuestionList.total
            this.problemQuestionList = data.problemsetQuestionList.questions
            // console.log(data.problemsetQuestionList)
        } else {
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
            // console.log(data.problemsetQuestionList)
        }

        this.isLoading = false;
    },
})