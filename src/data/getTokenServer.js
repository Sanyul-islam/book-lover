"use server"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function getTokenServer(){
    const {token} = await auth.api.getToken({
        headers: await headers(),
    });

    return token || null;
}