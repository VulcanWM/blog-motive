import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Want to write blogs consistently?<br className="hidden sm:inline" />
          Get and stay motivated with Blog Motive 
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Set targets for your blogging journey and track them.<br/>
          Integrated with your Hashnode account for the best experience.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Try it out
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div>
    </section>
  )
}
