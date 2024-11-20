import React from 'react'

function PdfViewer({fileUrl}) {

  return (
    <div>
        <iframe src={fileUrl+"#toolbar=0"} height='90vh' width='100%' className='h-[90vh] [&::-webkit-scrollbar]:hidden' />
    </div>
  )
}

export default PdfViewer