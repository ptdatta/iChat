import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();


  return (
    <div style={{ width: '70%', backgroundColor: '#f0f2f5', padding: '10px', paddingTop: '0px' }}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  )
}

export default ChatBox
