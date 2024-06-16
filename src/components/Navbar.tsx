"use client"
import { useSession,signOut } from 'next-auth/react'
import Link from 'next/link'
import {User} from "next-auth"
import React from 'react'

const Navbar = () => {
    const  {data: session} = useSession()
    const user:User = session?.user
  return (
    <div>Navbar</div>
  )
}

export default Navbar