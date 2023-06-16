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
            console.log('books', book?.quantity, 'of ', book?.title, ' minus ', items[i].quantity);
            
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