export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[]

export interface Database {
    public: {
        Tables: {
            todos: {
                Row: {
                    id: number
                    question_id: number
                    is_done: boolean
                    title: string
                    title_slug: string
                    created_at: string
                    todo_date: string
                }
                Insert: {
                    id?: number
                    question_id: number
                    is_done: boolean
                    title: string
                    title_slug: string
                    created_at?: string
                    todo_date: string
                }
                Update: {
                    id?: number
                    question_id?: number
                    is_done?: boolean
                    title?: string
                    title_slug?: string
                    created_at?: string
                    todo_date?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
