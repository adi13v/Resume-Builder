import React from 'react'

function PdfBox({pdfUrl , defaultPdfUrl}:{pdfUrl:string | null , defaultPdfUrl:string}) {
  return (
    <div>
    {pdfUrl && (
      <div className="pdf-viewer-container md:fixed md:top-19 md:right-0 md:w-1/2 sm:w-full">
        <iframe
          src={pdfUrl + '#zoom=88%'}
          className="w-full h-screen rounded-xl border border-white/10"
        />
      </div>
     )}
     {!pdfUrl && (
      <div className="pdf-viewer-container md:fixed md:top-19 md:right-0 md:w-1/2 sm:w-full">
        <iframe
          src={defaultPdfUrl + '#zoom=88%'}
          className="w-full h-screen rounded-xl border border-white/10"
        />
      </div>
     )}
    </div>
  )
}

export default PdfBox
