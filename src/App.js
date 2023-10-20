import "./App.css";
import Home from "./frontend/components/Home";

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;

//Account 10,11
//it causes error in local accounts so clear cache and then try Nonce too high. Expected nonce to be 0 but got 6. Note that transactions can't be queued when automining
//just run npx hardhat init in backend folder
//install all packages in main package.json
// npm i @nomiclabs/hardhat-waffle --legacy-peer-deps
// npm install --save-dev "@nomiclabs/hardhat-ethers@^2.0.0" "@types/sinon-chai@^3.2.3" "ethereum-waffle@*"
//run npx hardhat node in main folder
// npx hardhat run src/backend/scripts/deploy.js --network localhost 
//recommended to detect provider by metamask https://docs.metamask.io/wallet/tutorials/react-dapp-local-state/#use-metamaskdetect-provider
//can also detect provider by useing ethers library https://docs.ethers.org/v5/getting-started/#getting-started--connecting



//During contract deployment
// Contract deployment: FundContract
//   Contract address:    0xa196769ca67f4903eca574f5e76e003071a4d84a
//   Transaction:         0x1cdbda85a512a828c2154f586a841d11c9f1c7fb7dd14c5d8a84100f35d8b8aa
//   From:                0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097    //account used to use gas to deploy contract
//   Value:               0 ETH
//   Gas used:            1601717 of 1601717
//   Block #1:            0x9f75965c6eebceadf51664837ff3c05aae98b0a902000c72b8d42168de5d9bf6