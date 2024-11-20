import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import EditiorExtension from './EditiorExtension'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Highlight from '@tiptap/extension-highlight'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'


function TextEditor({fileId}) {
    const editor = useEditor({
        extensions: [StarterKit,Text,Bold,Italic,Strike,Subscript,Superscript,Underline,Paragraph,Text,Heading,TextStyle, FontFamily,TextAlign.configure({types: ['heading', 'paragraph'],}),Highlight.configure({ multicolor: true }),
            Placeholder.configure({
                placeholder:'Start Taking yout notes here!',
            })
        ],
        editorProps:{
            attributes:{
                class:'focus:outline-none h-screen p-5'
            }
        }
      })

      const notes=useQuery(api.notes.GetNotes,{
        fileId:fileId
      })
      

      useEffect(()=>{
        editor&&editor.commands.setContent(notes)
      },[notes&&editor])
      
  return (
    <div>
        <EditiorExtension editor={editor} />
        <div className='overflow-scroll h-[88vh]'>
        <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default TextEditor