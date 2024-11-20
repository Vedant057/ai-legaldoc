import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'


function WorkspaceHeader({fileInfo}) {
  
  return (
    <div className='p-4 flex justify-between shadow-md'>
        <Image src={'/logo.svg'} alt='logo' width={140}  height={100}/>
        <h2 className='font-serif font-bold'>{fileInfo?.fileName}</h2>
        <div className='flex gap-2 items-center'>
        <Button>Delete File</Button>
        <Button>Save File</Button>
            <UserButton />
        </div>
        
    </div>
  )
}

export default WorkspaceHeader