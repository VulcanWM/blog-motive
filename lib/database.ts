import dbConnect from './mongodb';
import Article from '../models/Article';

export async function getArticles(userId: string) {
    await dbConnect();
    const articles = await Article.find({userId: userId})
    return articles
}

export async function getArticleFromId(articleId: string){
    await dbConnect();
    const article = await Article.find({articleId: articleId})
    if (article.length == 0){
        return false
    } else {
        return article[0]
    }
}

export async function createArticle(userId: string, draftId: string, deadline: Date){
    await dbConnect();
    if ((await getArticleFromId(draftId)) != false){
        return "You can only have one goal for a draft!"
    }
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