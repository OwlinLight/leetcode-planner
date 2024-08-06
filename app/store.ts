// store.js
import {proxy, useSnapshot} from "valtio";
import {gql} from "@apollo/client";
import client from "@/app/apollo";
import {fetchTodos} from "@/app/lib/action";
import {Database} from '@/app/lib/schema'
//TODO
const CHAT_URL = ``;

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

const SUBMISSION_DETAIL = gql`query submissionDetails($submissionId: Int!) {
  submissionDetails(submissionId: $submissionId) {
    runtime
    runtimeDisplay
    runtimePercentile
    runtimeDistribution
    memory
    memoryDisplay
    memoryPercentile
    memoryDistribution
    code
    timestamp
    statusCode
    user {
      username
      profile {
        realName
        userAvatar
      }
    }
    lang {
      name
      verboseName
    }
    question {
      questionId
      titleSlug
      hasFrontendPreview
    }
    notes
    flagType
    topicTags {
      tagId
      slug
      name
    }
    runtimeError
    compileError
    lastTestcase
    codeOutput
    expectedOutput
    totalCorrect
    totalTestcases
    fullCodeOutput
    testDescriptions
    testBodies
    testInfo
    stdOutput
  }
}
`

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
        chatPrompt: "",
        message: "",
        async fetchRecentACSubmissions(username: any, limit = 15) {
            this.isLoading = true
            const {data, errors, loading} = await client.query({
                query: RECENT_AC_SUBMISSIONS, variables: {
                    username: username,
                    limit: limit,
                }
            })
            this.isLoading = false;
            return data;
        },
        async fetchTodos() {
            const db_todos = await fetchTodos();
            this.todos = db_todos!;

            const {data: detail, errors: detailError, loading: isDetailLoading} = await client.query({
                query: RECENT_AC_SUBMISSIONS, variables: {
                    submissionId: 1330737677
                }
            })
            console.log(detail)
            console.log(detailError)
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
            if (this.searchKeyWords === "") {
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
        },
        async searchProblemsOnPrompt() {
            this.isLoading = true
            if (this.chatPrompt === "") {
                return this.fetchData()
            }
            try {
                const res = await fetch(CHAT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({prompt: this.chatPrompt}),
                });

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();
                console.log(data);
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        }
    },
)