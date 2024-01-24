"use server"

import { cookies } from 'next/headers'
import { createArticle, deleteArticle } from '@/lib/database';
import { getArticleStats } from '@/lib/graphql';

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

export async function getDrafts(){
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value as string;
    const username = cookieStore.get('username')?.value as string;
    try {

        const endpoint = "https://gql.hashnode.com";
        const headers = {
            "content-type": "application/json",
            "Authorization": token
        };
        const graphqlQuery = {
            "operationName": "Publication",
            "query": `
            query Publication {
                publication(host: "${username}.hashnode.dev") {
                  isTeam
                  title
                   drafts(first: 50) {
                    edges {
                      node {
                        title
                        id
                      }
                    }
                  }
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
            return []
        }
        return data.data.publication.drafts.edges
        
    } catch (error) {
        return []
    }
}

export async function addArticleFunc(prevState: { message: string } | { message: boolean }, formData: FormData){
    const draftId = formData.get("draftId") as string;
    const deadline = formData.get("deadline") as string;
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value as string;
    const userId = cookieStore.get('id')?.value as string;
    try {

        const endpoint = "https://gql.hashnode.com";
        const headers = {
            "content-type": "application/json",
            "Authorization": token
        };
        const graphqlQuery = {
            "operationName": "Draft",
            "query": `
              query Draft($id: ObjectId!) {
                draft(id: $id) {
                  id
                  title
                  author {
                    id
                  }
                }
              }
            `,
            "variables": {"id": draftId}
        };

        const options = {
            "method": "POST",
            "headers": headers,
            "body": JSON.stringify(graphqlQuery)
        };

        const response = await fetch(endpoint, options);
        const data = await response.json();
        if (data.data == null){
            return {message: "That is not your draft!"}
        }
        if (data.data.draft.author.id == userId){
            const id = data.data.draft.id;
            const title = data.data.draft.title;
            const dateDeadline = new Date(deadline)
            const func = await createArticle(userId, draftId, dateDeadline)
            if (typeof func == "object"){
                func.id = id;
                func.title = title;
            }
            return {message: func}
        } else {
            return {message: "That is not your draft!"}
        }
        
    } catch (error) {
        return {message: "error " + error}
    }
}

export async function deleteArticleFunc(articleId: string, userId: string){
    const stats = await getArticleStats(articleId)
    if (stats != null){
        if (stats.author.id){
            await deleteArticle(articleId)
        }
    }
    return true
}