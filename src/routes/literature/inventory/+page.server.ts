import { prisma } from "$lib/server/db";
import type { Actions, ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ()=>{
    let orders = await prisma.order.findMany({
        where: {
            open: {
                equals: true
            }
        },
        orderBy: {
            id: 'asc'
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

    let literature = await prisma.literature.findMany({
        orderBy: {
            id: 'asc'
        }
    });
    let meetings = await prisma.meeting.findMany({
        orderBy: {
            day: 'asc'
        }
    });
    return {
        orders,
        order_items,
        literature,
        meetings
    }
}

export const actions: Actions = {
    update: async ({ request })=> {
        let form = await request.formData();

        for(let i=0; form.get('item'+i); i++){
            let itemId = form.get('item'+i);
            await prisma.literature.update({
                where: {
                    id: Number(itemId)
                },
                data: {
                    quantity: Number(form.get('quantity'+i)?.toString() || '0')
                }
            })
        }
    },
    complete: async ({request})=> {
        let data = await request.formData();

        const orderNum = Number(data.get('order')?.toString()??'0');

        let order = await prisma.order.update({
            where: {
                id: orderNum
            },
            data: {
                open: false
            }, 
            select:{
                id: true
            }
        });

        let items = await prisma.order_item.findMany({
            where: {
                orderId: orderNum
            }
        });

        for( let i=0; i<items.length; i++){
            let book = await prisma.literature.findFirst({
                where: {
                    id: items[i].itemId
                }
            });
            
            await prisma.literature.update({
                where: {
                    id: items[i].itemId
                },
                data: {
                    quantity: book!.quantity - items[i].quantity
                }
            });
        }
    }
}