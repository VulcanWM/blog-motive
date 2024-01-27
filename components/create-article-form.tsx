'use client'
 
import { useFormState } from 'react-dom'
import { addArticleFunc, deleteArticleFunc } from '@/app/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Trash2 } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"


const initialState: {message: any} = {
  message: false,
};

 
export default function CreateArticleForm(props: {userId: string, drafts: {node: {title: string, id: string}}[], stats: {"_id": string, userId: string, articleId: string, deadline: Date, id: string, title: string}[]}) {
  const drafts = props.drafts
  const userId = props.userId
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const stats = props.stats;
  stats.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
  const [articles, setArticles] = useState(stats);

  const router = useRouter()
  const [state, formAction] = useFormState(
    addArticleFunc,
    initialState
  );
  const [date, setDate] = useState<Date>()

  useEffect(() => {
    if (typeof state.message == "object"){
      const obj = state.message;
      const deadline = String(new Date(obj.deadline));
      obj.deadline = deadline;
      setArticles(oldArray => [...oldArray, JSON.parse(JSON.stringify(obj))]);
      // const newArticles = articles;
      // newArticles.push(obj)
      // setArticles()
      // console.log(newArticles)
      // // setArticles(newArticles);
      // newArticles.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
      // console.log(newArticles)
      // setArticles(newArticles)
    }
  },[state])

  const draftNames: {value: string, label: string}[] = []

  drafts.map((draft) => (draftNames.push({label: draft.node.title, value: draft.node.id})))

  async function deleteArticleClient(articleId: string){
    await deleteArticleFunc(articleId, userId)
    const updatedArray = articles.filter(obj => obj.id !== articleId);
    setArticles(updatedArray);
  }
 
  return (
    <div>
          {articles.length == 0 ? 
            <div>
              <p>You have no draft goals!</p>
            </div>
          : <></>}
          {articles.map((article) => (
            <div id={article._id} key={article._id} className="flex">
                <p className="mr-2">{article.title}</p>
                <p className="mr-2">{String(article.deadline).split(" 00:00:00")[0]}</p>
                <Trash2 className="w-5 h-5" onClick={() => (deleteArticleClient(article.id))}></Trash2>
            </div>
          ))}
          <br/>
        <form action={formAction}>
          <h3 className="text-2xl font-bold">Create draft deadline</h3>
          <p className="text-red-500">{typeof state.message != "object" && state.message}</p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[300px] justify-between mb-3"
              >
                {value
                  ? draftNames.find((draftName) => draftName.value === value)?.label
                  : "Select draft..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search album..." />
                <CommandEmpty>No album found.</CommandEmpty>
                <CommandGroup>
                  {draftNames.map((draftName) => (
                    <CommandItem
                      key={draftName.value}
                      value={draftName.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false) 
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === draftName.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {draftName.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover><br/>
          <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick deadline</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                />
            </PopoverContent>
          </Popover><br/><br/>
          <Input className="hidden" value={value} name="draftId" id="draftId" readOnly={true}/>
          <Input className="hidden" value={String(date)} name="deadline" id="deadline" readOnly={true}/>
          <Button type="submit" className="w-[150px]">create track</Button>
      </form>
    </div>
  )
}