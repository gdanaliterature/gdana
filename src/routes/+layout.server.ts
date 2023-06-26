import { prisma } from "$lib/server/db";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({cookies})=> {
    let sessionId = cookies.get('sessionId');

    if(sessionId?.length){

        let admin = await prisma.admin.findFirst({
            where: {
                sessionId
            },
            select: {
                username: true,
                sessionId: true
            }
        });
        
        if(admin?.sessionId?.localeCompare(sessionId) == 0){
            return { admin: true };
        } else {
            return { admin: false };
        }
        
    } else {
        return{
            admin: false
        };
    }
}