import Image from "next/image";
import React, { MouseEventHandler } from "react";
import metamask_logo from "../../public/assets/icons8-metamask-logo-96.png";
import walletConnect_logo from "../../public/assets/WalletConnect-Logo.png";

interface PROPS {
  mode: any;
  window: MouseEventHandler<HTMLElement>;
  connect:MouseEventHandler
}

function WalletConnect({ mode, window,connect }: PROPS) {
  return (
    <div className={mode.walletConnectContainer}>
      <p className={mode.cancel} onClick={window}>
        x
      </p>
      <ul>
        <li
          id="metamask"
          onClick={(e) => {
            window(e)
            connect(e)
          }}
        >
          <Image alt="metamask" src={metamask_logo} />
          <p>Metamask</p>
        </li>
        {/* <li id="walletConnect">
          <Image
            alt="walletConnect"
            style={{
              width: "100%",
              height: "70px",
            }}
            src={walletConnect_logo}
          />
          <p>Wallet Connect</p>
        </li> */}
      </ul>
    </div>
  );
}

export default WalletConnect;
