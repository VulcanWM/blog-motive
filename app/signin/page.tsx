import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import SigninForm from "@/components/signin-form"

export default function IndexPage() {
    const cookieStore = cookies()
    const token = cookieStore.has('token')
    if (token != false){
        redirect("/dashboard")
    }
    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <div className="flex max-w-[980px] flex-col items-start gap-2">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    Enter API Token
                </h1>
                <p className="max-w-[700px] text-lg text-muted-foreground">
                    The token will stay on your browser only.
                </p>
            </div>
            <SigninForm/>
        </section>
  )
}
