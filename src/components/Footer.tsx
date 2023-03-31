import Link from 'next/link'
import React from 'react'


function Footer({mode}:any) {
  return (
    <div className={mode.footer}>
      <button><Link href={'#'} target='_blank'>Whitepaper</Link></button>
      <button><Link target='_blank' href={'https://docs.google.com/document/d/1oTQAJUfLiW8FNJJA5-hGq0iVeerUDhZCf2VUpOze5Is/edit?usp=sharing'}>F10 SEC</Link></button>
      <button><Link target='_blank' href={'https://docs.google.com/document/d/19A5MBtKif-8vA-kMYVyIM3VZjySxJYzisIxRSb8C3v8/edit?usp=sharing'}>EXECUTIVE SUMMARY</Link></button>
      <button><Link target='_blank' href={'https://docs.google.com/document/d/1Qr5AiPYpkQ3Hr6W7lGi4I95n0Q_PspDtglWXA0K3N1M/edit?usp=sharing'}>OFFERING DOCUMENTS</Link></button>
    </div>
  )
}

export default Footer