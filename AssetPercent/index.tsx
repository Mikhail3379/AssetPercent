import React, { useEffect, useMemo, useRef, useState } from "react";
import ProgramStep from "../../components/CreationAssetSteps/ProgramStep";
import "./AssetPercent.css";
import YieldStep from "../yieldStep";
import { WalletsTypes } from "../WalletUtils";
import store from "../../../src/redux/store";
import { useHistory } from "react-router-dom";
import Wallet from "@project-serum/sol-wallet-adapter";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { SlopeWalletAdapter } from "@solana/wallet-adapter-slope";
import { SolongWalletAdapter } from "@solana/wallet-adapter-solong";
import { CloverWalletAdapter } from "@solana/wallet-adapter-clover";
import { Coin98WalletAdapter } from "@solana/wallet-adapter-coin98";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { MathWalletWalletAdapter } from "@solana/wallet-adapter-mathwallet";
import { clusterApiUrl } from "../../config/configCluster";
import AddAsset from "../../components/AssetPercent/AddAsset";
import SidebarMenu from "../../components/sidebarMenu";
import Sidebar from "../../shared/Sidebar";
import { adminTestControl } from "../../NToken-solana-module/portfolio/adminAccess";
import solanaLogo from "../../assets/coins/solana_black_and_white.svg";
import btcLogo from "../../assets/coins/bitcoin_black_and_white.svg";
import { Connection } from "@solana/web3.js";
export default function AssetPercent() {
  const [activeTab, setActiveTab] = useState(0);
  const changeTab = (tabIndex: any) => {
    if (activeTab !== tabIndex) setActiveTab(tabIndex);
  };
  const getClassName = (index: number) => {
    return activeTab === index ? "active" : "";
  };
  // const [network, setNetwork] = useState("");
  const [percent, setPercent] = useState(0);
  const history = useHistory();
  let net = store.getState().network.name;
  const network = clusterApiUrl(net);
  const [selectedWallet, setSelectedWallet]: any = useState(undefined);
  const [solanaAccount] = useState(store.getState().account);
  const [walletType] = useState(store.getState().walletType.name);
  const [assets, setAssets] = useState([]);
  const [assetsChanged, setAssetsChanged] = useState(false);
  const programRef = useRef();
  const [isMinified, setIsMinified] = useState(false);
  const [assetsColor, setAssetsColor] = useState<any>({
    btc: "gray",
    sol: "green",
  });
  const [selectedAsset, setSelectedAsset] = useState("btc");
  // const connection = useMemo(() => new Connection(networkUrl), [networkUrl]);
  const injectedWallet = useMemo(() => {
    try {
      if (walletType === WalletsTypes.SOLANA) {
        //@ts-ignore
        return new Wallet(window.sollet, network);
      } else if (walletType === WalletsTypes.PHANTOM) {
        //@ts-ignore
        return new PhantomWalletAdapter(window.solana, network);
      } else if (walletType === WalletsTypes.SOLFRARE) {
        //@ts-ignore
        return new SolflareWalletAdapter(window.solfrare, network);
      } else if (walletType === WalletsTypes.SLOPE) {
        //@ts-ignore
        return new SlopeWalletAdapter(window.slope, network);
      } else if (walletType === WalletsTypes.SOLONG) {
        //@ts-ignore
        return new SolongWalletAdapter(window.solong, network);
      } else if (walletType === WalletsTypes.CLOVER) {
        //@ts-ignore
        return new CloverWalletAdapter(window.clover_solana, network);
      } else if (walletType === WalletsTypes.COIN98) {
        //@ts-ignore
        return new Coin98WalletAdapter(window.clover_solana, network);
      } else if (walletType === WalletsTypes.MATHWALLET) {
        //@ts-ignore
        return new MathWalletWalletAdapter(window.clover_solana, network);
      }
    } catch (e) {
      console.log(`Could not create injected wallet: ${e}`);
      return null;
    }
  }, [network]);

  useEffect(() => {
    stopBrowserNavigation();
    window.addEventListener("popstate", stopBrowserNavigation);
    return () => {
      window.removeEventListener("popstate", stopBrowserNavigation);
    };
  }, []);

  const stopBrowserNavigation = () => {
    window.history.pushState(null, document.title, window.location.href);
  };
  useEffect(() => {
    if (
      walletType === WalletsTypes.SOLANA ||
      walletType === WalletsTypes.PHANTOM ||
      walletType === WalletsTypes.SOLFRARE ||
      walletType === WalletsTypes.SLOPE ||
      walletType === WalletsTypes.SOLONG ||
      walletType === WalletsTypes.BITKEEP ||
      walletType === WalletsTypes.CLOVER ||
      walletType === WalletsTypes.MATHWALLET
    ) {
      walletConnect();
    } else {
      history.push("/ConnectAccount");
    }
    if (
      (walletType === WalletsTypes.SOLANA ||
        walletType === WalletsTypes.PHANTOM ||
        walletType === WalletsTypes.SOLFRARE ||
        walletType === WalletsTypes.SLOPE ||
        walletType === WalletsTypes.SOLONG ||
        walletType === WalletsTypes.BITKEEP ||
        walletType === WalletsTypes.CLOVER ||
        walletType === WalletsTypes.MATHWALLET) &&
      selectedWallet
    ) {
      listnerConnect();
    }
  }, []);

  function listnerConnect() {
    //@ts-ignore
    selectedWallet.on("connect", () => {});
    //@ts-ignore
    selectedWallet.on("disconnect", () => {});
    //@ts-ignore
    selectedWallet.connect();
    return () => {
      //@ts-ignore
      selectedWallet.disconnect();
    };
  }

  function walletConnect() {
    if (!solanaAccount) {
      history.push("/ConnectAccount");
      return;
    }
    //@ts-ignore
    setSelectedWallet(injectedWallet);
  }

  const toggleSideBar = () => {
    setIsMinified(!isMinified);
  };

  function accessControl() {
    // adminTestControl(connection, store.getState().account.adress, (error, result: any) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    // let pathname = props.location.pathname
    // let isAdmin = result === 'true';
    // if (!isAdmin && pathname.includes("/nova/administration/")) {
    //   history.push({
    //     pathname: "/nova/PageErrorAdminAccess",
    //   });
  }

  const getPageNavigationContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <AddAsset
            changeTab={changeTab}
            assets={assets}
            assetChanged={(value: any) => {
              console.log("your value -->", value);
              setAssetsChanged(value);
            }}
          />
        );
      case 1:
        return <ProgramStep changeTab={changeTab} ref={programRef} />;

      case 2:
        return <YieldStep selectedWallet={selectedWallet} />;

      default:
        return;
    }
  };
  function updateDonut(percent: any, mainAsset: string) {
    const donutElement = document.getElementById("section1");
    if (!donutElement) return;

    let mainColor, secondaryColor;

    switch (mainAsset) {
      case "btc":
        mainColor = assetsColor.btc;
        secondaryColor = assetsColor.sol;
        break;
      case "sol":
        mainColor = assetsColor.sol;
        secondaryColor = assetsColor.btc;
        break;
      default:
        break;
    }
    donutElement.style.backgroundImage = `linear-gradient(#202024, #202024),linear-gradient(to right, ${mainColor} ${percent}%, ${secondaryColor} 0%)`;
  }

  const increasePercent = (e: any) => {
    e.preventDefault();
    // @ts-ignore
    if (percent < 100) {
      setPercent(percent + 10);
      updateDonut(percent + 10, selectedAsset);
    }
  };
  const reducePercent = (e: any) => {
    e.preventDefault();
    if (percent > 0) {
      setPercent(percent - 10);
      updateDonut(percent - 10, selectedAsset);
    }
  };
  const handleSelectedAssetChange = (asset: string) => {
    setSelectedAsset(asset);
    setPercent(100 - percent);
    updateDonut(100 - percent, asset);
  };
  return (
    <div className="assetContainer">
      {/* <aside className={`sidebar ${isMinified ? "minified" : ""}`}>
        <Sidebar
          // pathname={props.location.pathname}
          toggleSideBar={toggleSideBar}
          network={network}
        />
      </aside> */}
      <div className="assetHeader">
        <button className="btnWalletConnected"></button>
        <h1>Create Portfolio</h1>
        <h3>Select one asset at a time</h3>
      </div>
      <div className="assetWrapper">
        <div className="assetList">
          <div id="section1" className="circle" data-percent={percent}>
            <button onClick={reducePercent} className="btnMinus">
              -
            </button>
            <button onClick={increasePercent} className="btnPlus">
              +
            </button>
            <div className="percent">{percent}%</div>
          </div>
          <h2>Assets</h2>
          <button
            onClick={() => handleSelectedAssetChange("btc")}
            className="btnBTC"
          >
            <img className="assetLogo" src={btcLogo} />
            BTC
          </button>
          <button
            onClick={() => handleSelectedAssetChange("sol")}
            className="btnSolana"
          >
            <img className="assetLogo" src={solanaLogo} />
            Solana
          </button>
          <div className="takeProfit">
            <p>Take Profit</p>
            <br></br>
            <ul>
              <li>Selling 9% into BTC every 15 days</li>
              <li>BTC placed into yield strategy</li>
            </ul>
          </div>
          <button className="btnFinish">Finish</button>
        </div>
        <main>
          <ol className="stepsMenu">
            <li className={`navigation ${getClassName(0)}`}>Add</li>
            <li className={`navigation ${getClassName(1)}`}>Program</li>
            <li className={`navigation ${getClassName(2)}`}>Yield</li>
          </ol>
          <div className="pageNavigationContent">
            {getPageNavigationContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
