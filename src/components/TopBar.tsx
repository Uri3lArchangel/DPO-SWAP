import Image from 'next/image'
import React from 'react'
import logo from '../../public/assets/directprivateoffers-logo-bd.png'

function TopBar({mode}:any) {
  return (
    <div className={mode.topBar}>
      <div className={mode.topContainer}>
        <h1 > </h1>
      </div>
      <div className={mode.lowerContainer}>
        <div className={mode.imageContainer}>
        </div>
        {/* DIRECT  <span style={{color:"black"}}> PRIVATE</span> OFFERS INCORPORATED */}
        <div style={{color:"green",fontSize:"2rem",fontWeight:"bolder",textAlign:"center"}}>DPO Global LLC</div>
        <p style={{textAlign:"center",fontSize:"1.6rem"}}></p>
      </div>
    </div>
  )
}

export default TopBar