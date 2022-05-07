import React from 'react'
import Sidebar from './../../components/sidebar/sidebar'
import Header from './../../components/header/header'
import Styles from './sendfund.module.css'
import SendFundHandler from '../../components/sendFundHandler/sendfundHandler'

const Sendfund = ({adminAddress,contract,handleChainId}) => {
  return (
    <div>
        <Header/>
        <div className={Styles.wrapper}>
            <Sidebar/>
            <SendFundHandler
            adminAddress={adminAddress}
            contract={contract}
            handleChainId={handleChainId}
            />
        </div>
    </div>
  )
}

export default Sendfund