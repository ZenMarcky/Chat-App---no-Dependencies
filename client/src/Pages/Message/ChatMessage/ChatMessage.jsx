import React from 'react'
import './ChatMessage.css'
import {format} from 'timeago.js'


function ChatMessage(props) {



  return (
    <div className='chatMessage'>
<h5>{props.own ? <p className='myName'>You</p> : <p>Other</p> }</h5>
<div className={props.own ? "messageBox" : "otherMessageBox"}>
<p >
  {props.message.text}
</p>


</div>
<p className={props.own ? "sendTime" : "otherSendTime"}>{format(props.message.createdAt)}</p>

    </div>
  )
}

export default ChatMessage
