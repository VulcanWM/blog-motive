"use server"

import { cookies } from 'next/headers'

export async function addToken(prevState: { message: string } | { message: boolean }, formData: FormData){
    const token = formData.get("token") as string;
    try {

        const endpoint = "https://gql.hashnode.com";
        const headers = {
            "content-type": "application/json",
            "Authorization": token
        };
        const graphqlQuery = {
            "operationName": "Me",
            "query": `
            query Me {
                me {
                    id
                    username
                    name
                }
            }
            `,
            "variables": {}
        };

        const options = {
            "method": "POST",
            "headers": headers,
            "body": JSON.stringify(graphqlQuery)
        };

        const response = await fetch(endpoint, options);
        const data = await response.json();
        if (data.data == null){
            return {message: data.errors[0].message}
        }
        cookies().set('token', token, { secure: true })
        cookies().set('id', data.data.me.id, { secure: true })
        cookies().set('username', data.data.me.username, { secure: true })
        return {message: true}
        
    } catch (error) {
        return {message: "error " + error}
    }
}