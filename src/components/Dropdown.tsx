import Image from "next/image";
import React, { MouseEventHandler } from "react";
import { tokensData, tokensDataArry } from "../core/tokenData";
import dpologo from '../../public/assets/dpo coin-01.png'

interface PROPS {
  hm: any;
  close: MouseEventHandler<HTMLParagraphElement>;
  select: MouseEventHandler<HTMLLIElement>
}

let a ='abc'

function Dropdown({ hm, close,select }: PROPS) {
  return (
    <div className={hm.dropDown}>
      <p className={hm.cancel} onClick={close}>
        X
      </p>
      <input
        type="text"
        id="TokenAddress"
        placeholder="Input Token Address or Search Existing Tokens"
      />
      <ul className={hm.dropDownTokenList}>
        {tokensDataArry.map((item,index)=>(<li key={index} id={item.symbol} onClick={select}>
          <Image src={item.logo} width="120" height="120" alt={item.symbol}  /> <p>{item.name}</p>
        </li>))}
      </ul>
    </div>
  );
}

export default Dropdown;
