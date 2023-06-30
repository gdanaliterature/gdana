import { prisma } from "$lib/server/db"
import type { literature, meeting } from "@prisma/client";
import { error, fail, redirect } from "@sveltejs/kit";

export const load = async ({parent})=> {
    const data = await parent();

    if(!data.admin){
        throw redirect(302, '/literature/order');
    }

    const meetings = await prisma.meeting.findMany({});
    const literature = await prisma.literature.findMany({});

    return {
        meetings,
        literature
    }
}

export const actions = {
    updateMeetings: async({request})=> {
        let form = await request.formData();

        let meetings: Partial<meeting>[] = [];
        for(let meetingIter = 0; form.get('meeting'+meetingIter+"name"); meetingIter++){
            let meetingId = form.get('meeting'+meetingIter)?.toString();
            let meetingName = form.get('meeting'+meetingIter+'name')?.toString();
            let meetingDay = form.get('meeting'+meetingIter+'day')?.toString();
            let meetingHour = form.get('meeting'+meetingIter+'hour')?.toString();
            let meetingMinute = form.get('meeting'+meetingIter+'minute')?.toString();
            let meetingMeridian = form.get('meeting'+meetingIter+'meridian')?.toString();

            if(!meetingName?.length){
                return fail(400, {
                    error: 'Meeting #'+meetingIter+': Name Required'
                })
            }

            if(!meetingId?.length){
                meetings.push(
                    await prisma.meeting.create({
                        data: {
                            name: meetingName,
                            day: Number(meetingDay),
                            time: meetingHour+':'+meetingMinute+meetingMeridian
                        }
                    })
                );
            } else {
                meetings.push(
                    await prisma.meeting.update({
                        where: {
                            id: Number(meetingId)
                        },
                        data: {
                            name: meetingName,
                            day: Number(meetingDay),
                            time: meetingHour+':'+meetingMinute+meetingMeridian
                        }
                    })
                )
            }
        }
        return {
            meetings
        }
    },
    deleteMeeting: async({request})=> {
        let form = await request.formData();

        let deleteId = form.get('deleteMeeting');
        if(!deleteId){
            throw error(400, {message: 'Meeting id required'});
        }
        await prisma.meeting.delete({
            where: {
                id: Number(deleteId)
            }
        });
        return;
    },
    updateLiterature: async({request})=> {
        let form = await request.formData();

        let literature: Partial<literature>[] = [];
        for(let litIter = 0; form.get('literature'+litIter+"title"); litIter++){
            let litId = form.get('literature'+litIter)?.toString();
            let litTitle = form.get('literature'+litIter+'title')?.toString();
            let litPrice = form.get('literature'+litIter+'price')?.toString();
            let litCategory = form.get('literature'+litIter+'category')?.toString();
            let litQuantity = form.get('literature'+litIter+'quantity')?.toString();

            if(!litTitle?.length){
                return fail(400, {
                    error: 'Item #'+litIter+': Title Required'
                })
            } else if(!litCategory?.length){
                return fail(400, {
                    error: 'Item #'+litIter+': Category Required'
                })
            } else if(!litQuantity?.length){
                return fail(400, {
                    error: 'Item #'+litIter+': Quantity Required'
                })
            }

            let data: any = {
                title: litTitle,
                price: Number(litPrice),
                category: litCategory,
                quantity: Number(litQuantity)
            };

            if(!litId?.length){
                literature.push(
                    await prisma.literature.create({data})
                );
            } else {
                literature.push(
                    await prisma.literature.update({
                        where: {
                            id: Number(litId)
                        },
                        data
                    })
                )
            }
        }
    },
    deleteLiterature: async({request})=> {
        let form = await request.formData();

        let deleteId = form.get('deleteLiterature');
        if(!deleteId){
            throw error(400, {message: 'Literature id required'});
        }
        await prisma.literature.delete({
            where: {
                id: Number(deleteId)
            }
        });
        return;
    }
}