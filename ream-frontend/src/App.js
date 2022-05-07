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
  const[event,setEvent] = useState([]);
  
  // const ContractContext= createContext("")

  const handleChainId = async() =>{
    const chainId = await window.ethereum.request({method: "eth_chainId"})
    if (Number(chainId) != 80001) {
        alert("Please switch account to Matic mumbai testnet")
    }
  }

  const createReamTreasury = async() =>{
    try {
        if (window.ethereum) {
            const accounts =await window.ethereum.request({method:'eth_requestAccounts'});
            const account = accounts[0]; 
            setAdminAddress(account);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const reamFactory = new ethers.Contract(CA,abi,signer);
            const check = await reamFactory.userCreated(account);
            if (!check) {
              const createReamTreasury = await reamFactory.createReamTreasury();
              const waitCreateReamTreasury = await createReamTreasury.wait();
              const getContract =  waitCreateReamTreasury.events[0].args[1];
              setContract(getContract)
              setDisplayContract(true)
            } 
            else{
              const getContract = await reamFactory.userToReamAddr(account);
              setContract(getContract)
              setDisplayContract(true)
            }  
    
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

 const getSendEvents = async() =>{
  try {
      if (window.ethereum) {
        const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const ream = new ethers.Contract(CA,abi,provider)
        const sendEvent = await ream.queryFilter("Send");
        // console.log("sendEvent", sendEvent);

        const Event = []

        sendEvent.forEach(data=>{
          Event.unshift({ 
            amount: data.args[0],
            to: data.args[1],
            desc: data.args[2],
            time: data.args[3]
          })
        })

        // setEvent(Event)
        ream.on("Send", (amount,to,desc,_time) => {
          const newEvent = {
            to:to,
            amount: amount,
            time: _time.toString(),
            desc:desc
          }
    
          //setEvent(prev => [newEvent, ...prev]);
        })
        // console.log(event);
      } else {
          
      }
  } catch (error) {
      console.log(error);
  }
}

 const getReceiveEvents = async() =>{
  try {
      if (window.ethereum) {
        const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const ream = new ethers.Contract(CA,abi,provider)
        const receiveEvent = await ream.queryFilter("Receive");
        const Event = []

        receiveEvent.forEach(data =>{
          Event.unshift(
            {
              amount:data.args[0],
              from:data.args[1],
              time:data.args[2]
            }
          )
        })
        
        setEvent(Event)

        ream.on("Receive", (amount,from, _time) => {
          const newEvent = {
            from:from,
            amount: amount,
            time: _time.toString(),
          }
    
          setEvent(prev => [newEvent, ...prev]);
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
            handleChainId={handleChainId}
        />} />
        <Route path='/receipt' element={<Receipt
            contract={contract}
            getSendEvents={getSendEvents}
            getReceiveEvents={getReceiveEvents}
            event={event}
        />} />
        <Route path='/investment' element={<Investment/>} />
        <Route path='/sendfund' element={<Sendfund
          adminAddress={adminAddress}
          contract={contract}
          handleChainId={handleChainId}
        />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App;
