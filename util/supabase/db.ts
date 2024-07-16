import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

const cookieStore = cookies()
export const supabase = createClient(cookieStore)
