import dbConnect from './mongodb';
import Article from '../models/Article';

export async function getArticles(userId: number) {
    await dbConnect();
    const articles = await Article.find({userId: userId})
    return articles
}