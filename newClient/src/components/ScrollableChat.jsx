import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../Context/ChatProvider'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { Tooltip, Avatar } from '@mui/material';
import './style.css'

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed className='scrollbar'>
      {messages && messages.map((m, i) => (
        <div style={{ display: 'flex' }} key={m._id}>
          {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
            <Tooltip title={m.sender.name} arrow>
              <Avatar sx={{ m: '6px' }} src={m.sender.pic} />
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
              marginLeft: isSameSenderMargin(messages, m, i, user._id),
              marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              marginRight: isSameSender(messages, m, i, user._id) ? 0 : 8,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
            }}
          >
            {m.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat
