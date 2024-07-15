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
                    created_at: string
                    problem_id: number
                    isDone: boolean
                    plan_date: string
                }
                Insert: {
                    id?: number
                    created_at?: string
                    problem_id: number
                    isDone: boolean
                    plan_date: string
                }
                Update: {
                    id?: number
                    created_at?: string
                    problem_id?: number
                    isDone?: boolean
                    plan_date?: string
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
