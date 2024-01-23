import { getArticles } from '@/lib/database'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getDrafts } from '../actions'
import CreateArticleForm from '@/components/create-article-form'
import { getArticleStats } from '@/lib/graphql'

export default async function IndexPage() {
    const cookieStore = cookies()
    const tokenDict = cookieStore.get('token')
    if (tokenDict == undefined){
        redirect("/signin")
    }
    const token = tokenDict.value
    const userId = cookieStore.get('id')?.value as string;
    const username = cookieStore.get('username')?.value as string;
    const articles = await getArticles(userId)
    const stats: {"_id": string, userId: string, articleId: string, deadline: Date, id: string, title: string}[] = []
    for (const article of articles) {
        const statsForArticle = await getArticleStats(article.articleId);
        if (statsForArticle !== null) {
            const statsObject = {
                "_id": String(article._id),
                userId: article.userId,
                articleId: article.articleId,
                deadline: article.deadline,
                id: statsForArticle.id,
                title: statsForArticle.title
            };
    
            stats.push(statsObject);
        }
    }
    const draftsArray = await getDrafts()
    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                Dashboard
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
                hey {username}
            </p>
            <CreateArticleForm drafts={JSON.parse(JSON.stringify(draftsArray))} stats={stats}></CreateArticleForm>
        </div>
    </section>
  )
}
