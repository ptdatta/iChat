import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import MyChat from '../components/MyChat';
import ChatBox from '../components/ChatBox';
import { Divider } from '@mui/material';

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  
  return (
    <div
    style={{ display: 'flex', 
    justifyContent:'space-between',
    height: '100vh'
  }}
    >
      {user && <MyChat fetchAgain={fetchAgain}/>}
      <Divider sx={{ backgroundColor: '#f9fbff' }} orientation="vertical" flexItem />
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </div>
  )
}

export default Chat
