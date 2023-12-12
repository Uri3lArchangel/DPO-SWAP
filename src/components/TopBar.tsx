import Image from 'next/image'
import React from 'react'
import logo from '../../public/assets/directprivateoffers-logo-bd.png'

function TopBar({mode}:any) {
  return (
    <div className={mode.topBar}>
      <div className={mode.topContainer}>
        <h1 >DPO Global LLC </h1>
      </div>
      <div className={mode.lowerContainer}>
        <div className={mode.imageContainer}>
        </div>
        <div style={{color:"green",fontSize:"2rem",fontWeight:"bolder",textAlign:"center"}}> DIRECT  <span style={{color:"black"}}> PRIVATE</span> OFFERS INCORPORATED</div>
        <p style={{textAlign:"center",fontSize:"1.6rem"}}>FINTRAC # M23796196</p>
      </div>
    </div>
  )
}

export default TopBar