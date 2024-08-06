import client from "@/app/apollo";
import {RECENT_AC_SUBMISSIONS} from "@/app/queries";

export async function fetchRecentACSubmissions(username: any, limit = 15) {
    const {data, errors, loading} = await client.query({
        query: RECENT_AC_SUBMISSIONS, variables: {
            username: username,
            limit: limit,
        }
    })
    return data;
}