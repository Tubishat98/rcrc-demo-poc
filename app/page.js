'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    // This code only runs on the client side
    const storedUser = localStorage.getItem('selectedUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to PIF Portal</h1>
        {user ? (
          <p className="text-lg mb-4">Welcome back, {user.name}</p>
        ) : (
          <p className="text-lg mb-4">Please select a section from the navigation menu to get started.</p>
        )}
      </div>
    </main>
  )
}
