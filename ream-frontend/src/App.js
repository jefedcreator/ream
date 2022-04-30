import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import {CA}  from '../src/utils/contract'
import {abi} from '../src/utils/abi'
import { reamAbi } from '../src/utils/reamabi'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Create from './pages/create/create';
import Investment from './pages/investment/investment';
import Receipt from './pages/receipt/receipt'
import Sendfund from './pages/sendFund/sendfund'
import LandingPage from './pages/landingPage/landingPage';

function App() {
  const [adminAddress,setAdminAddress] = useState("");
  const[contract, setContract] = useState("")
  const[displayContract, setDisplayContract] = useState(false);
  const[sendEvent,setSendEvent] = useState({});
  // const ContractContext= createContext("")

  const createReamTreasury = async() =>{
    try {
        if (window.ethereum) {
            const accounts =await window.ethereum.request({method:'eth_requestAccounts'});
            const account = accounts[0]; 
            setAdminAddress(account);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const reamFactory = new ethers.Contract(CA,abi,signer)
            const createReamTreasury = await reamFactory.createReamTreasury(account);
            const waitCreateReamTreasury = await createReamTreasury.wait();
           const newContract = await waitCreateReamTreasury.events[0].args[1];
           setContract(newContract)
           setDisplayContract(true)
        } else {
            console.log("connect metamask");
        }
    } catch (error) {
     console.log(error);    
    }
 }
  const allReamTreasury = async() =>{
    try {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const reamFactory = new ethers.Contract(CA,abi,signer)  

            const allReamTreasury = await reamFactory.allReamTreasury();
            console.log(allReamTreasury);
        } else {
          console.log("connect metamask");
        }
    } catch (error) {
     console.log(error);    
    }
 }

 const getEvents = async() =>{
  try {
      if (window.ethereum) {
        const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const signer = provider.getSigner();
        const ream = new ethers.Contract(contract,reamAbi,signer)
        const sendEvent = await ream.queryFilter("Send");
        console.log(sendEvent);
        setSendEvent({
          sendEvent
        })
      } else {
          
      }
  } catch (error) {
      console.log(error);
  }
}

  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/pricing' element={<LandingPage/>} />
        <Route path='/contact' element={<LandingPage/>} />
        <Route path='/create' element={<Create
            adminAddress={adminAddress}
            contract={contract}
            displayContract={displayContract}
            createReamTreasury={createReamTreasury}
        />} />
        <Route path='/receipt' element={<Receipt
            contract={contract}
        />} />
        <Route path='/investment' element={<Investment/>} />
        <Route path='/sendfund' element={<Sendfund
          adminAddress={adminAddress}
          contract={contract}
        />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App;
