import { getArticles } from '@/lib/database'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function IndexPage() {
    const cookieStore = cookies()
    const tokenDict = cookieStore.get('token')
    if (tokenDict == undefined){
        redirect("/signin")
    }
    const token = tokenDict.value
    const userIdDict = cookieStore.get('id')
    const userId = parseInt(String(userIdDict?.value))
    const username = cookieStore.get('username')?.value as string;
    const articles = await getArticles(userId)
    console.log(articles)
    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                Dashboard
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
                hey {username}
            </p>
        </div>
    </section>
  )
}
