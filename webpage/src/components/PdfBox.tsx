import React from 'react'

function PdfBox({pdfUrl , defaultPdfUrl}:{pdfUrl:string | null , defaultPdfUrl:string}) {
  return (
    <div>
    {pdfUrl && (
      <div className="pdf-viewer-z-0 container lg:fixed lg:top-19 lg:right-0 lg:w-1/2 sm:w-full">
        <iframe
          src={pdfUrl + '#zoom=90%'}
          className="w-full h-screen rounded-xl border border-white/10"
        />
      </div>
     )}
     {!pdfUrl && (
      <div className="pdf-viewer-container lg:fixed lg:top-19 lg:right-0 lg:w-1/2 sm:w-full">
        <iframe
          src={defaultPdfUrl + '#zoom=90%'}
          className="w-full h-screen rounded-xl border border-white/10"
        />
      </div>
     )}
    </div>
  )
}

export default PdfBox
