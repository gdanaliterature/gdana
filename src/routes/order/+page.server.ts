import { prisma } from "$lib/server/db";
import type { order, order_item } from "@prisma/client";
import type { Actions, ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ()=>{
    let meetings = await prisma.meeting.findMany({});
    let books = await prisma.literature.findMany({});

    return {
        meetings, books
    }
}

export const actions: Actions = {
    begin: async({ request })=> {
        let data = await request.formData();

        const order: Partial<order> = {
            name: data.get('name')?.toString(),
            phone: data.get('phone')?.toString(),
            meetingId: Number(data.get('meeting')?.toString())
        }

        return {
            order
        }
    },

    submit: async({ request }) => {
        let data = await request.formData();

        let order: order = JSON.parse(data?.get('order')?.toString()|| '');     
        
        order = {
            ...order,
            order_date: new Date(Date.now()),
            open: true
        };

        order = await prisma.order.create({
            data: order
        });

        let items: order_item[] = [];

        for(let itemIter=0; data.get('item'+itemIter); itemIter++){
            items.push(
                await prisma.order_item.create({
                    data: {
                        orderId: order.id,
                        itemId: Number(data.get('item'+itemIter)!.toString()),
                        quantity: Number(data.get('quantity'+itemIter)!.toString())
                    }            
                })
            );
        }

        return {
            order, items
        }
    }
}
