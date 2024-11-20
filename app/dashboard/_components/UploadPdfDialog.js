'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { useAction, useMutation } from "convex/react"
import { Loader2Icon } from "lucide-react"
import React, { useState } from 'react'
import uuid4 from "uuid4"
import axios from 'axios';
import { toast } from "sonner"
  
function UploadPdfDialog({children}) {

    const generateUploadUrl=useMutation(api.fileStorage.generateUploadUrl)
    const addFileEntry=useMutation(api.fileStorage.AddFileEntryToDB)
    const getFileUrl = useMutation(api.fileStorage.getFileUrl)
    const embeddDocument=useAction(api.myAction.ingest)
    const {user}=useUser();
    const [file,setFile]=useState();
    const [loading,setLoading]=useState(false);
    const [fileName,setFileName]=useState();
    const [open,setOpen]=useState(false);
    const OnFileSelect = (event)=>{
        setFile(event.target.files[0]);
    }

    const OnUpload=async()=>{
        setLoading(true);

        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
        });
        const { storageId } = await result.json();
        const fileId= uuid4();
        const fileUrl=await getFileUrl({storageId:storageId})

        // Step 3: Save the newly allocated storage id to the database
        const resp=await addFileEntry({
            fileId:fileId,
            storageId:storageId,
            fileName:fileName??'Untitled File',
            fileUrl:fileUrl,
            createdBy:user?.primaryEmailAddress?.emailAddress
        })

        //API call to Fetch PDF Proccess Data
        const ApiResp=await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
        const fileIdObject = { fileId: fileId };
        await embeddDocument({
          splitText:ApiResp.data.result,
          fileId:fileIdObject
        })
        
        setLoading(false);
        setOpen(false);

        toast('File is ready..!')
    }

    return (
        <Dialog open={open}>
        <DialogTrigger asChild>
          <Button onClick={()=>setOpen(true)} className='w-full' >+ Upload PDF File</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload PDF File</DialogTitle>
            <DialogDescription asChild>
              <div children=''>
              <h2 className='mt-5'>Select a File to Upload</h2>
                    <div className="gap-2 p-3 rounded-md border">
                        <input type='file' accept="application/pdf"
                        onChange={(event)=>OnFileSelect(event)}
                        />
                    </div>
                    <div className="mt-2">
                        <label>File Name*</label>
                        <Input placeholder="File Name" onChange={(e)=>{setFileName(e.target.value)}} />
                    </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}>
            {loading?
                <Loader2Icon className="animate-spin"/>:'Upload'
            }
            </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>      
    )
  }
  
  export default UploadPdfDialog