'use client' // Error components must be Client Components
 
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { SignOutButton } from '@clerk/nextjs'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      {error.message}
      <Heading title='Wait!!' description={"To become a verfied user contact 0783205844"}/>
      <SignOutButton>sign out</SignOutButton>
    </div>
  )
}