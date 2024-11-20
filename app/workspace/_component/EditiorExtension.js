import { chatSession } from '@/configs/AIModel';
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs';
import { useAction, useMutation } from 'convex/react'
import { Bold, Heading1, Heading2, Highlighter, Italic, List, Sparkle, Strikethrough, Subscript, Superscript, Underline } from 'lucide-react'
import { useParams } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';


function EditorExtension({editor}) {
  const {fileId}=useParams();
  const SearchAI=useAction(api.myAction.search)
  const saveNotes=useMutation(api.notes.AddNotes)
  const {user}=useUser();
  
  const onAiClick=async()=>{
    toast("AI Generating Answer..!")
     const selectedText=editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
     )
     const result=await SearchAI({
      query:selectedText,
      fileId:fileId
     })
     

     const UnformattedAns=JSON.parse(result);
     let AllUnformattedAns=''; //drop this
     UnformattedAns&&UnformattedAns.forEach(item=>{
      AllUnformattedAns=AllUnformattedAns+item.pageContent
     });

     const PROMPT="Give an answer in short for question :"+selectedText+"Please give appropriate answer in HTML format"; //IMP

     const AiModelResult= await chatSession.sendMessage(PROMPT);
     const FinalAns = AiModelResult.response.text().replace('```','').replace('```','').replace('html','');
     
     const AllText=editor.getHTML();
     editor.commands.setContent(AllText+'<p> <strong>Answer: </strong>'+FinalAns+'</p>');

     saveNotes({
      notes:editor.getHTML(),
      fileId:fileId,
      createdBy:user?.primaryEmailAddress?.emailAddress
     })






  }

  return editor&&(
    <div className='p-5'>
        <div className="control-group">
        <div className="button-group flex gap-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'text-red-300' : ''}
          >
            <Bold/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'text-red-300' : ''}
          >
            <Italic/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'text-red-300' : ''}
          >
            <Highlighter/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'text-red-300' : ''}
          >
            <Strikethrough/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={editor.isActive('superscript') ? 'text-red-300' : ''}
          >
            <Superscript/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={editor.isActive('subscript') ? 'text-red-300' : ''}
          >
            <Subscript/>
            </button>
            <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'text-red-300' : ''}
          >
            <Underline/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'text-red-300' : ''}
          >
            Justify
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive({ level: 1 }) ? 'text-red-300' : ''}
          >
            <Heading1/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive({ level: 2 }) ? 'text-red-300' : ''}
          >
            <Heading2/>
          </button>
          <button
            onClick={() => editor.chain().focus().setFontFamily('Comic Sans MS, Comic Sans').run()}
            className={editor.isActive('textStyle', { fontFamily: 'Comic Sans MS, Comic Sans' }) ? 'text-red-300' : ''}
            data-test-id="comic-sans"
          >
            Comic Sans
          </button>
          <button
            onClick={() => editor.chain().focus().setFontFamily('serif').run()}
            className={editor.isActive('textStyle', { fontFamily: 'serif' }) ? 'text-red-300' : ''}
            data-test-id="serif"
          >
            Serif
          </button>
          <button
            onClick={() => editor.chain().focus().setFontFamily('times square roman').run()}
            className={editor.isActive('textStyle', { fontFamily: 'times square roman' }) ? 'text-red-300' : ''}
            data-test-id="times square roman"
          >
            Times Square
          </button>
          <button
            onClick={() => onAiClick()}
            className={'hover:text-red-500'}
          >
            <Sparkle/>
          </button>
          </div>
          </div>
    </div>
  )
}

export default EditorExtension