'use client'
import { api } from '@/convex/_generated/api';
import { UserButton, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import React from 'react'

function Header() {
  const {user}=useUser(); 
  return (
    <div className='flex justify-end p-5 shadow-sm gap-5'>
      
          <h2 className='font-medium text-lg gap-5'>{user?.fullName}</h2>
          <UserButton />
    </div>
  )
}

export default Header