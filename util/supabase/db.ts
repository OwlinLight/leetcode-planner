import {cookies} from "next/headers";
import {createClient} from "@/util/supabase/server";

const cookieStore = cookies()
export const supabase = createClient(cookieStore)
