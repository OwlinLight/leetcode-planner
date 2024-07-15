import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: todos , error} = await supabase.from('todos').select('description')

    console.log(todos);
    console.log(error);

    return (
        <>
            /supa
        </>
    )
}
