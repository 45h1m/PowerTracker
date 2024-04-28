import React, { useState, useContext, useRef } from 'react'
import IconButton from './IconButton'
import { Switch } from 'antd';
import { WebSocketContext } from "../contexts/WebSocketContext";

const Switches = () => {
    
    let { log, sendMsg } = useContext(WebSocketContext);

    let [btn1, setBtn1] = useState(false);
    let [btn2, setBtn2] = useState(false);

    const handleClick = (btn) => {
        log('clicked ' + btn)
        // sendMsg("SWITCH");

        if(btn === 1) {

            

            if(btn1) sendMsg('10')
            else sendMsg('11')
            setBtn1(prev => !prev)
        }
        
        if(btn === 2) {
            
            
            if(btn2) sendMsg('20')
            else sendMsg('21')
            setBtn2(prev => !prev)
        }

    }


  return (
    <div className='sticky bottom-0 left-0 w-full flex justify-center items-center bg-slate-800 p-4 gap-2 mt-5'>
        <p className='opacity-70'>Switch 1</p>
        <Switch onClick={()=> handleClick(1) } checked={btn1}/>
        {/* <div className='h-5 w-[0.1rem] bg-slate-700 mx-5'></div>
        <p className='opacity-70' >Switch 2</p>
        <Switch onClick={ ()=>handleClick(2) } checked={btn2}/> */}
    </div>
  )
}

export default Switches