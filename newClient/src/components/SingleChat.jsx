import React from 'react'
import { useState, useEffect } from 'react';
import { ChatState } from '../Context/ChatProvider'
import { Typography, ListItem, ListItemAvatar, ListItemText, Avatar, Dialog, DialogTitle, DialogContent, LinearProgress, Paper, InputBase, IconButton, Box } from '@mui/material';
import { getSender, getSenderFull } from '../config/ChatLogics';
import GroupsIcon from '@mui/icons-material/Groups';
import UpdateGroupChatModel from './UpdateGroupChatModel';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { setSnackbar } from '../Redux/Ducks/snackbar';
import { useDispatch } from 'react-redux';
import axios from "axios";
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import InfiniteScroll from 'react-infinite-scroller';
import animationData from '../assets/Typing.json';
import ScrollableFeed from 'react-scrollable-feed';


const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
  const [openDia, setOpenDia] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => { setIsTyping(true) });
    socket.on('stop typing', () => { setIsTyping(false) });
  }, [])

  const handleClickOpen = () => {
    setOpenDia(true);
  };

  const handleClickClose = () => {
    setOpenDia(false);
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength)
  }

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat])

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
  })
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      dispatch(setSnackbar(true, "error", "Failed to load the messages"));
    }
  };

  const sendMessage = async (event) => {
    //  if(event.key==="Enter" && newMessage){
    socket.emit('stop typing', selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "http://localhost:5000/api/message",
        {
          content: newMessage,
          chatId: selectedChat,
        },
        config
      );
      socket.emit("new message", data);
      // console.log(data);
      setMessages([...messages, data]);
    } catch (error) {
      console.log(error);
      dispatch(setSnackbar(true, "error", "Failed to send the message"));
    }
    //  }
  }


  return (
    <Box>
      {selectedChat ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '10vh' }}>
            <ListItem>
              <ListItemAvatar sx={{ '&:hover': { cursor: 'pointer' } }} onClick={handleClickOpen}>
                <Avatar src={selectedChat.isGroupChat ? <GroupsIcon /> : getSenderFull(user, selectedChat.users).pic} />
              </ListItemAvatar>
              <ListItemText primary={selectedChat.isGroupChat ? selectedChat.chatName : getSender(user, selectedChat.users)} />
            </ListItem>
            <Dialog scroll='body' open={openDia} onClose={handleClickClose}>
              {!selectedChat.isGroupChat ?
                <div style={{ padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <DialogTitle variant='h4'>
                    {getSender(user, selectedChat.users)}
                  </DialogTitle>
                  <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Avatar sx={{ m: '18px 5px', height: '110px', width: '110px' }} src={selectedChat.isGroupChat ? <GroupsIcon /> : getSenderFull(user, selectedChat.users).pic} />
                    <Typography variant="h6">
                      Email: {getSenderFull(user, selectedChat.users).email}
                    </Typography>
                  </DialogContent>
                </div>
                : <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />}
            </Dialog>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', backgroundColor: 'white', height: '88vh', borderRadius: '10px' }}>
            {loading ? (<LinearProgress sx={{ height: '10px', borderRadius: '5px', m: '0px 10px' }} color='success' />) :
              <div style={{ marginBottom: '5px' }}>
                <Box sx={{ height: '555px' }}>
                  <ScrollableChat messages={messages} />
                </Box>
                {isTyping ?
                  <div style={{ display: 'flex' }}>
                    <Lottie
                      style={{ marginLeft: '8px' }}
                      options={defaultOptions}
                      width={50}
                      height={25}
                    />
                  </div> : <></>}
              </div>}
            {/* <div>Typing</div> */}
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', m: '0px 10px', mb: '10px' }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Type a Message..."
                onChange={typingHandler}
                value={newMessage}
              // onKeyPress={sendMessage}
              />
              <IconButton color="success" onClick={sendMessage}>
                <SendRoundedIcon />
              </IconButton>
            </Paper>
          </div>
        </div>) :
        (
          <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography color="green" variant="h5" gutterBottom>
              Click on a user to Start Chatting
            </Typography>
          </div>
        )}
    </Box>
  )
}

export default SingleChat
