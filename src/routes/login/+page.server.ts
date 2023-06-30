import {randomBytes, pbkdf2Sync, randomUUID} from 'crypto';
import { fail, type Actions, redirect } from "@sveltejs/kit";
import { prisma } from '$lib/server/db';

export const load = async ({cookies, params})=> {
    let sessionId = cookies.get('sessionId') || '';

    let admin = await prisma.admin.findFirst({
        where: {
            sessionId
        }
    });

    if(sessionId.length && admin && params){
        throw redirect(302, '/literature/inventory');
    }
}

export const actions: Actions = {
    register: async ({ request, cookies })=>{
        let data = await request.formData();

        let username = data.get('username')?.toString();
        let password = data.get('password')?.toString();

        if(!password?.length || !username?.length){
            return fail(400, { invalid: true});
        }

        let salt = randomBytes(16).toString('hex');
        let hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString();

        let admin = await prisma.admin.create({
            data: {
                username,
                hash,
                salt,
                sessionId: randomUUID()
            },
            select: {
                sessionId: true
            }
        });

        let sessionId = admin?.sessionId || '';

        cookies.set('sessionId', sessionId.toString(), {
            httpOnly: true,
            sameSite: true,
            secure: true,
            expires: new Date(Date.now()+ (1000*60*60*24))
        });

        throw redirect(302, '/');
    },

    login: async ({ request, cookies })=> {
        let data = await request.formData();

        let username = data.get('username')?.toString();
        let password = data.get('password')?.toString();

        if(!password?.length || !username?.length){
            return fail(400, { invalid: true });
        }

        let realAdmin = await prisma.admin.findFirst({
            where: {
                username,
            }
        });

        if(!realAdmin){
            return fail(400, { invalid: true }) ;
        }

        let hash = pbkdf2Sync(password, realAdmin.salt, 1000, 64, 'sha512').toString();
        
        if(realAdmin.hash.localeCompare(hash) !== 0){
            return fail(400, { invalid: true });
        }

        let admin = await prisma.admin.update({
            where: {
                username
            },
            data: {
                sessionId: randomUUID()
            },
            select: {
                sessionId: true
            }
        });

        let sessionId = admin.sessionId?.toString() || '';

        cookies.set('sessionId', sessionId, {
            httpOnly: true,
            sameSite: true,
            secure: true,
            expires: new Date(Date.now()+ (1000*60*60*24))
        });

        throw redirect(302, '/literature/inventory');
    }
}