
import { prisma } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

export const load = async ({cookies, params})=> {
    let sessionId = cookies.get('sessionId');

    if(sessionId?.length){
        let admin = await prisma.admin.findFirst({
            where: {
                sessionId
            },
            select: {
                id: true
            }
        });
    
        if(admin){
            await prisma.admin.update({
                where: {
                    id: admin.id
                },
                data: {
                    sessionId: null
                }
            });
        }
    }

    cookies.delete('sessionId');
    throw redirect(302, '/');
}