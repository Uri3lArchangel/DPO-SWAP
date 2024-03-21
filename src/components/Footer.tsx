import Link from 'next/link'
import React from 'react'


function Footer({mode}:any) {
  return (
    <div className={mode.footer}>
      <button><Link href={'https://docs.google.com/document/d/1LRSTsiGrnMGwsQmrVjtZXzvRl1ydtGpK3KZE6JsQHQs/edit?pli=1'} target='_blank'>DPO.3.17</Link></button>
      <button><Link target='_blank' href={'https://docs.google.com/document/d/1oTQAJUfLiW8FNJJA5-hGq0iVeerUDhZCf2VUpOze5Is/edit?usp=sharing'}>F10 SEC</Link></button>
      <button><Link target='_blank' href={'https://pitch.liveplan.com/kFcoa/bfiiA'}>THE PITCH</Link></button>
      <button><Link target='_blank' href={'https://acrobat.adobe.com/link/review?uri=urn:aaid:scds:US:4a3b5a88-568b-472f-b225-d88a374b80fc'}>OFFERING DOCUMENTS</Link></button>
    </div>
  )
}

export default Footer