'use server'

import {supabase} from "@/util/supabase/db";

export async function createTodo(todo: any) {
    const { data, error } = await supabase
        .from('todos')
        .insert([
            {
                question_id: todo.question_id,
                is_done: todo.is_done,
                title: todo.title,
                title_slug: todo.title_slug,
                todo_date: todo.todo_date,
                user_id: todo.user_id
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
        .order('id', { ascending: true }); // Order by 'id' in ascending order
    return todos;
}

export async function updateTodo(id: any, isDone: any) {
    const { data, error } = await supabase
        .from('todos')
        .update({ 'is_done': isDone})
        .eq('id', id)
        .select()
}

export async function deleteTodo(id: any) {
    const {error} = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
}

export async function startTodo(id: any) {
    const { data, error } = await supabase
        .from('todos')
        // .update({ 'started_at': supabase.rpc('now')})
        .update({ 'started_at': new Date().toISOString()})
        .eq('id', id)
        .select()
}

export async function finishTodo(id: any) {
    const { data, error } = await supabase
        .from('todos')
        // .update({ 'started_at': supabase.rpc('now')})
        .update({ 'finished_at': new Date().toISOString()})
        .eq('id', id)
        .select()
}

export async function createCollection(name: any, description: any, parent_id: any) {
    // name not added
    const { data, error } = await supabase
        .from('collections')
        .insert([
            { description: description, parent_id: parent_id},
        ])
        .select()
    console.log(error);
}

export async function fetchCollections(){
    let { data: collections, error } = await supabase
        .from('collections')
        .select('*')
    return collections;
}

