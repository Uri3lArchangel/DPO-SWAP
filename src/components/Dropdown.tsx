import Image from "next/image";
import React, { MouseEventHandler } from "react";
import ethLogo from "/public/assets/BUSD.png";

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
        <li id="eth" onClick={select}>
          <Image src={ethLogo} alt="b" /> <p>Busd</p>
        </li>
        <li id="dpo" onClick={select}>
          <Image src={ethLogo} alt="b2" /> <p>Busd2</p>
        </li>
      </ul>
    </div>
  );
}

export default Dropdown;
