'use server'

import {Database} from "@/app/lib/schema";
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

// export async function createTodo(formData: FormData) {
export async function createTodo(problemId:number, planDate:Date) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // const problemId =  formData.get('problemId');
    // const planDate = formData.get('planDate');

    const { data, error } = await supabase
        .from('todos')
        .insert([
            { problem_id: problemId, is_done: false, plan_date: planDate },
        ])
        .select()
}

export async function fetchTodos() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    let { data: todos, error } = await supabase
        .from('todos')
        .select('problem_id, is_done, plan_date')
    return todos;
}
