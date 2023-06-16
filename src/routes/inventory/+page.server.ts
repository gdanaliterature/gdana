import { prisma } from "$lib/server/db";
import type { Actions, ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ()=>{
    let orders = await prisma.order.findMany({
        where: {
            open: {
                equals: true
            }
        }
    });

    let orderIds: number[] = [];

    orders.forEach(order=>{
        orderIds.push(order.id);
    })
    
    let order_items = await prisma.order_item.findMany({
        where: {
            orderId: {
                in: orderIds
            }
        }
    })

    let literature = await prisma.literature.findMany({});
    let meetings = await prisma.meeting.findMany({});
    return {
        orders,
        order_items,
        literature,
        meetings
    }
}

export const actions: Actions = {
    update: async ({ request })=> {
        let data = await request.formData();

        for(let i=1; data.get('quantity'+i); i++){
            await prisma.literature.update({
                where: {
                    id: i
                },
                data: {
                    quantity: Number(data.get('quantity'+i)?.toString() || '0')
                }
            })
        }
    },
    complete: async ({request})=> {
        let data = await request.formData();

        await prisma.order.update({
            where: {
                id: Number(data.get('order')?.toString() || '0')
            },
            data: {
                open: false
            }
        });
    }
}