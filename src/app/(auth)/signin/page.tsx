"use client";
import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link";
import { useState } from "react";
import {useForm} from "react-hook-form";
import * as z from "zod"
 import {useDebounceValue} from 'usehooks-ts'


const page = () => {
  const [username,setUsername] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username,300)

  return (
    <div>

    </div>
  )
}

export default page

