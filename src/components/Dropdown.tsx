import Image from "next/image";
import React, { MouseEventHandler } from "react";
import ethLogo from "/public/assets/icons8-ethereum-480.png";

interface PROPS {
  hm: any;
  close: MouseEventHandler<HTMLParagraphElement>;
  select: MouseEventHandler<HTMLLIElement>
}

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
      <hr />
      <ul className={hm.dropDownTokenList}>
        <li id="from" onClick={select}>
          <Image src={ethLogo} alt="eth" /> <p>Ethereum</p>
        </li>
        <li id="to" onClick={select}>
          <Image src={ethLogo} alt="dpo" /> <p>DPO</p>
        </li>
      </ul>
    </div>
  );
}

export default Dropdown;
