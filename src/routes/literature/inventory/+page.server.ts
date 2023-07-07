import { prisma } from "$lib/server/db";
import { error, type Actions, type ServerLoad } from "@sveltejs/kit";

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
    cancel: async ({request})=> {
        let data = await request.formData();

        let canceledOrder = Number(data.get('canceledOrder')?.toString());

        if(!(canceledOrder>=0)){
            throw error(400, {message: 'cancelled order id not set'});
        }

        await prisma.order_item.deleteMany({
            where: {
                orderId: canceledOrder
            }
        })

        await prisma.order.delete({
            where: {
                id: canceledOrder
            }
        })
    },
    complete: async ({request})=> {
        let data = await request.formData();

        let completedOrder = Number(data.get('completedOrder')?.toString());

        if(!(completedOrder>=0)){
            throw error(400, {message: 'completed order id not set'});
        }

        let order = await prisma.order.update({
            where: {
                id: completedOrder
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
                orderId: completedOrder
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