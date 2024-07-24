'use server'

import {supabase} from "@/util/supabase/db";

export async function createTodo(todo: { question_id: any; is_done: any; title: any; title_slug: any; todo_date: any; }) {
    const { data, error } = await supabase
        .from('todos')
        .insert([
            {
                question_id: todo.question_id,
                is_done: todo.is_done,
                title: todo.title,
                title_slug: todo.title_slug,
                todo_date: todo.todo_date
            }
        ])
        .select();

    if (error) {
        console.error("Error creating todo:", error);
        return;
    }

    console.log("Todo created successfully:", data);
}

export async function fetchTodos() {
    let { data: todos, error } = await supabase
        .from('todos')
        .select('*')
    return todos;
}

export async function updateTodo(questionId: any, isDone: any) {
    const { data, error } = await supabase
        .from('todos')
        .update({ 'is_done': isDone})
        .eq('question_id', questionId)
        .select()
}

export async function deleteTodo(questionId: any) {
    const {error} = await supabase
        .from('todos')
        .delete()
        .eq('question_id', questionId)

}
