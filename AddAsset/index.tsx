import React, { useEffect, useState } from "react";
import "./AddAsset.css";
import btcLogo from "../../../assets/coins/bitcoin_black_and_white.svg";
import rayLogo from "../../../assets/coins/ray_black_and_white.svg";
import solanaLogo from "../../../assets/coins/solana_black_and_white.svg";
import usdcLogo from "../../../assets/coins/usdc_black_and_white.svg";
import AssetPercent from "../../../pages/AssetPercent";
import { SERVER_URLAnaytics } from "../../../pages/utils";

import axios from "axios";
import { clusterApiUrl } from "../../../config/configCluster";
import store from "../../../redux/store";
export default function AddAsset(props: any) {
  const [activeTab, setActiveTab] = useState(0);
  const [program, setProgram] = useState("");
  const [selectedAsset, setSelectedAsset] = useState({ name: "" });
  let net = store.getState().network.name;
  const network = clusterApiUrl(net);
  // const [assets, setAssets] = useState(getAllSolanaPortfolioAssets(network));
  const [assets, setAssets] = useState([]);
  const [listAssets, setListAssets] = useState(props.assets);
  const [verfyAsset, setVerfyAsset] = useState(false);

  useEffect(() => {
    if (listAssets && listAssets[listAssets.length - 1] != undefined) {
      let asset = listAssets[listAssets.length - 1];
      setSelectedAsset(asset);
      setVerfyAsset(true);
    }
    getListAssets();
  }, []);
  function exitAssetsP(nameAsset: any) {
    var portfolio: any = localStorage.getItem("portfolio");

    var assetP: any[] =
      portfolio && JSON.parse(portfolio).assets
        ? JSON.parse(portfolio).assets
        : [];

    for (let i = 0; i < assetP.length; i++) {
      if (assetP[i].name === nameAsset) {
        return true;
      }
    }
    if (
      nameAsset === "USD Coin" ||
      nameAsset === "Raydium" ||
      nameAsset === "Wrapped Bitcoin" ||
      nameAsset === "Wrapped Solana"
    ) {
      return false;
    } else {
      return true;
    }

    /*return true;*/
  }

  function getListAssets() {
    let network = store.getState().network.name;
    axios
      .get(
        SERVER_URLAnaytics + "/getPortfolioAssetsByNetwork?network=" + network
      )
      .then((response: any) => {
        if (response.data != undefined) {
          setAssets(response.data);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  const [searchField, setSearchField] = useState("");

  const filteredAssets = assets.filter((item: any) => {
    return (
      item.name.toLowerCase().includes(searchField.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchField.toLowerCase())
    );
  });

  const handleChange = (e: any) => {
    setSearchField(e.target.value);
  };

  const LogoAsset = (tickerLogo: any) => {
    //alert(nameLogo)
    if (tickerLogo === "WSOL") {
      return <img className="assetLogo" src={solanaLogo} />;
    } else if (tickerLogo === "WBTC") {
      return <img className="assetLogo" src={btcLogo} />;
    } else if (tickerLogo === "RAY") {
      return <img className="assetLogo" src={rayLogo} />;
    } else if (tickerLogo === "USDC") {
      return <img className="assetLogo" src={usdcLogo} />;
    }
  };

  function selectAsset(asset: any) {
    asset.exit = true;
    setSelectedAsset(asset);
    localStorage.setItem("selectedAsset", JSON.stringify(asset));
  }

  function next() {
    props.assetChanged(true);
    var portfolio: any = localStorage.getItem("portfolio");

    var assets: any[] =
      portfolio && JSON.parse(portfolio).assets
        ? JSON.parse(portfolio).assets
        : [];
    // alert(selectedAsset + "**");
    if (verfyAsset) {
      var newAsset = assets.filter((item: any) => {
        return item != listAssets[listAssets.length - 1];
      });
      newAsset.push(selectedAsset);
      portfolio = portfolio ? JSON.parse(portfolio) : {};
      portfolio.assets = newAsset;
      localStorage.setItem("portfolio", JSON.stringify(portfolio));
    } else {
      assets.push(selectedAsset);
      portfolio = portfolio ? JSON.parse(portfolio) : {};
      portfolio.assets = assets;
      localStorage.setItem("portfolio", JSON.stringify(portfolio));
    }
    props.changeTab(1);
  }
  const renderTableContent = () => {
    assets.forEach((asset: any) => {
      // asset.forEach((element: { ticker: any }) => {
      //   if (asset.ticker === element.ticker) {
      //     console.log("karima exit ", asset.ticker);
      return asset;
      // }
      // });
    });
    return filteredAssets.map((asset: any, index: any) => (
      <tr key={index}>
        <td>
          <div className="assetInfo">
            {LogoAsset(asset.ticker)}

            <span className="assetName">{asset.name}</span>
          </div>
        </td>
        <td>
          <span
            className="assetTag"
            style={{ backgroundColor: asset.colorTag }}
          >
            {asset.tag}
          </span>
        </td>
        <td>
          <button
            onClick={() => {
              selectAsset(asset);
            }}
            className={`btn selectAsset ${
              selectedAsset.name == asset.name ? "selected" : ""
            }`}
            disabled={exitAssetsP(asset.name) ? true : false}
          >
            Select
          </button>
        </td>
      </tr>
    ));
  };
  return (
    <div className="AddAssetComponent">
      {/* <select name="sort" id="sort" className="rt-select sort">
        <option selected disabled hidden>
          Sort by
        </option>
        <option value="">option 1</option>
        <option value="">option 2</option>
      </select>
      <input
        type="text"
        name="search"
        className="sr-input search"
        placeholder="Search"
        onChange={handleChange}
      /> */}
      <div className="tableContainer">
        <table className="assetsTable">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Tag</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
      </div>
      <button
        disabled={!selectedAsset.name}
        onClick={() => next()}
        className="actionButton nextButton"
      >
        Continue to programing
      </button>
    </div>
  );
}
