import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/util/supabase/server'
import { redirect } from 'next/navigation'
import {cookies} from "next/headers";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'

    if (token_hash && type) {
        // TODO: object to change add cookies
        const supabase = createClient(cookies())

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            // redirect user to specified redirect URL or root of app
            redirect(next)
        }
    }

    // redirect the user to an error page with some instructions
    redirect('/error')
}