import React,{useContext, useEffect} from 'react'
import Styles from './receiptEvent.module.css';
import {ethers,utils} from 'ethers'
import { addressShortner } from '../../utils/helper';
import { formatDate } from '../../utils/formatDate';


const ReceiptEvent = ({contract, getSendEvents,getReceiveEvents,event}) => {

 console.log(event);
 useEffect(()=>{
    getSendEvents()
    getReceiveEvents()
 },[])

  return (
    <div className={Styles.wrapper}>
       <table className= {Styles.table}>
          <thead className = {Styles.table_header}>
              <tr className={Styles.table__head_row}>
                <th className={Styles.table_head_data}>S/N</th>
                <th className={Styles.table_head_data}>Amount</th>
                <th className={Styles.table_head_data}>Account</th>
                <th className={Styles.table_head_data}>Time</th>
              </tr>
          </thead>
          <tbody>
            {event.map((item, index) => {
              return <tr key={index} className={Styles.table__head_row}>
                <td className= {Styles.table_data}>
                  {index + 1}
                </td>
                <td className= {Styles.table_data}>
                  {Number(utils.formatUnits(item.amount, 18)).toFixed(4)}
                </td>
                <td className= {Styles.table_data}>
                  {addressShortner(item.from, false)}
                </td>
                <td className= {Styles.table_data}>
                  {formatDate(item.time)}
                </td>
              </tr>
            })}
          </tbody>
        </table>
    </div>
  )
}

export default ReceiptEvent