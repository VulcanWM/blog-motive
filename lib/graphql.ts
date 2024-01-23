"use server"

import { cookies } from 'next/headers'

export async function getArticleStats(articleId: string){
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value as string;
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
            "variables": {"id": articleId}
        };

        const options = {
            "method": "POST",
            "headers": headers,
            "body": JSON.stringify(graphqlQuery)
        };

        const response = await fetch(endpoint, options);
        const data = await response.json();
        if (data.data == null){
            return true
            // check if it is published 
            // if it is not, then show error
            // if not, it is published
        } else {
            return data.data.draft
        }
        
        
    } catch (error) {
        return null
    }
}