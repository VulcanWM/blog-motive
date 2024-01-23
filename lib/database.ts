import dbConnect from './mongodb';
import Article from '../models/Article';

export async function getArticles(userId: string) {
    await dbConnect();
    const articles = await Article.find({userId: userId})
    return articles
}

export async function createArticle(userId: string, draftId: string, deadline: Date){
    if ((await getArticles(userId)).length >= 10){
        return "You can only have 10 draft deadlines!"
    }
    const article = await Article.create({
        userId: userId,
        articleId: draftId,
        deadline: deadline,
    })
    return JSON.parse(JSON.stringify(article))
}

export async function deleteArticle(articleId: string){
    await Article.deleteOne({articleId: articleId})
    return true
}