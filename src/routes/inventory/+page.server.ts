import { prisma } from "$lib/server/db";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ()=>{
    let orders = await prisma.order.findMany({
        where: {
            open: {
                equals: true
            }
        }
    });
    let literature = await prisma.literature.findMany({});
    return {
        orders,
        literature
    }
}
