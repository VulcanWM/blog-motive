'use client'
 
import { useFormState } from 'react-dom'
import { addToken } from '@/app/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from '@/components/ui/button'
import { useEffect } from 'react'


const initialState: {message: any} = {
  message: false,
};

 
export default function Signup() {
  const router = useRouter()
  const [state, formAction] = useFormState(
    addToken,
    initialState
  );

  useEffect(() => {
    if (state.message == true){
      router.push("/dashboard")
    }
  },[state])

 
  return (
    <div>
        <form className='flex' action={formAction}>
          <p className="text-red-500">{state.message}</p>
          <Input name="token" id="token" placeholder="Hashnode Token" className="w-[200px] mr-5"/>
          <Button type="submit">add token</Button>
        </form>
    </div>
  )
}