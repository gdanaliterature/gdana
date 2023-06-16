import { prisma } from "$lib/server/db";
import type { Actions, ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ()=>{
    let meetings = await prisma.meeting.findMany({})
    return {
        meetings
    }
}

export const actions: Actions = {
    begin: async({ request })=> {
    }
}
