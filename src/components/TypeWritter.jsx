import React from 'react';
import Typewriter from 'typewriter-effect';


function TypeWritter({text}) {
  return (
    <h1>
    <Typewriter
      options={{
        strings: [`${text}`],
        autoStart: true,
        loop: false,
        delay: 120,
        deleteSpeed: 50,
        cursor:'_',
        pauseFor: 7200000000,
        wrapperClassName: 'typewriter-wrapper',
      }}
      />
  </h1>
  )
}

export default TypeWritter