import { createClient } from '@/util/supabase/client'
import { cookies } from 'next/headers'

export default async function Page() {
    const supabase = createClient()

    const { data: todos , error} = await supabase.from('todos').select('description')

    console.log(todos);
    console.log(error);

    return (
        <>
            /supa
        </>
    )
}
