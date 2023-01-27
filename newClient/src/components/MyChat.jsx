import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { ChatState } from '../Context/ChatProvider';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import { setSnackbar } from '../Redux/Ducks/snackbar';
import { useDispatch } from 'react-redux';
import Chatloading from './Chatloading';
import UserListItem from './UserListItem';
import CircularProgress from '@mui/material/CircularProgress';
import { getSender, getSenderFull } from '../config/ChatLogics';
import { ListItemButton, ButtonGroup } from '@mui/material';
import FormDialog from './GroupChatModel';


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));


const RecipeReviewCard = ({ fetchAgain }) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { selectedChat, setSelectedChat, user, chats, setChats, notification, setNotification } = ChatState();
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [loggedUser, setLoggedUser] = useState();
  const [openDia, setOpenDia] = useState(false);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const [state, setState] = React.useState({
    left: false,
  });

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
    console.log(Notification);
  }, [fetchAgain]);

  const handleClickOpen = () => {
    setOpenDia(true);
  };

  const handleClickClose = () => {
    setOpenDia(false);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate('/');
  };

  const clear = () => {
    setSearch("");
    setSearchResult();
    fetchChats();
  };

  const handleChange = async (e) => {
    setSearch(e.currentTarget.value);
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:5000/api/user?search=${e.currentTarget.value}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      dispatch(setSnackbar(true, "error", "Failed to Load the Search Results"));
    }
  }

  const accessChat = async (userId) => {

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:5000/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      dispatch(setSnackbar(true, "error", "Error fetching the chat"));
      console.log(error)
    }
  };

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:5000/api/chat", config);
      setChats(data);
      console.log(chats);
    } catch (error) {
      dispatch(setSnackbar(true, "error", "Failed to load that chats"));
    }
  };


  return (
    <div style={{ width: '30%', backgroundColor: 'white' }}>
      <Card sx={{ maxWidth: 1000 }} elevation={0}>
        <CardHeader
          sx={{ color: '#51f542', backgroundColor: '#f0f2f5' }}
          avatar={
            <Avatar onClick={toggleDrawer('left', true)} sx={{ '&:hover': { cursor: 'pointer' } }} src={user.pic} />
          }
          action={
            <ButtonGroup>
              <IconButton aria-label="settings">
                <Badge badgeContent={notification.length} color="primary">
                  <NotificationsActiveIcon onClick={handleClick2} sx={{ color: '#b9f6ca' }} />
                </Badge>
              </IconButton>
              <IconButton aria-label="settings">
                <MoreVertIcon onClick={handleClick} sx={{ color: '#b9f6ca' }} />
              </IconButton>
            </ButtonGroup>
          }
          title={user.name}
          subheader={user.email}
        />
        <Menu
          id="fade-menu"
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleClickOpen}>
            <ListItemIcon>
              <AddCircleOutlineOutlinedIcon sx={{ color: '#b9f6ca' }} />
            </ListItemIcon>
            Create Group
          </MenuItem>
          <MenuItem onClick={logoutHandler}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: '#b9f6ca' }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
        <Menu
          id="fade-menu"
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl2}
          open={open2}
          onClose={handleClose2}
          TransitionComponent={Fade}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {!notification.length && <MenuItem>No new messages</MenuItem>}
          {notification.map((notif) => (
            <MenuItem key={notif._id} onClick={() => {
              setSelectedChat(notif.chat)
              setNotification(notification.filter((n) => n !== notif));
            }}>
              {notif.chat.isGroupChat ?
                `New message in ${notif.chat.chatName}` :
                `New message from ${getSender(user, notif.chat.users)}`}
            </MenuItem>
          ))}
        </Menu>
        <FormDialog open={openDia} handleClose={handleClickClose} />
        <Drawer
          anchor="left"
          open={state['left']}
          onClose={toggleDrawer('left', false)}
        >
          <div
            style={{ width: '380px' }}
          >
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#ccd2d8',
              height: '150px',
              alignItems: 'center',
            }}>
              <StyledBadge
                sx={{ p: 'relative', top: '70px' }}
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent="   "
              >
                <Avatar sx={{ height: '120px', width: '120px' }} src={user.pic} />
              </StyledBadge>
            </div>
            <List
              sx={{
                mt: '70px',
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
              }}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Username" primaryTypographyProps={{ color: '#51f542' }} secondary={user.name} />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Email" primaryTypographyProps={{ color: '#51f542' }} secondary={user.email} />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          </div>
        </Drawer>
        <Paper
          component="form"
          sx={{ m: '5px 10px', p: '2px 0px', display: 'flex', alignItems: 'center', width: '94%' }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, backgroundColor: '#f1f1f1', pl: '8px', borderRadius: '8px' }}
            placeholder="Search...."
            value={search}
            onChange={handleChange}
          // onChange={(e)=>console.log(e.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            {search === "" ?
              <SearchIcon sx={{ color: '#b9f6ca' }} /> :
              <CloseIcon onClick={clear} />}
          </IconButton>
        </Paper>
      </Card>
      <Divider sx={{ mt: '5px' }} />
      {loading && search !== "" ? (<Chatloading />) :
        (
          searchResult?.map((user) => (
            <List>
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)} />
            </List>
          ))
        )}
      {chats.length !== 0 ?
        (<List>
          {chats.map((chat) => (
            chat.isGroupChat ? (
              <div>
                <ListItemButton onClick={() => setSelectedChat(chat)}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <AccountCircleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={chat.chatName} />
                  </ListItem>
                </ListItemButton>
                <Divider variant="middle" />
              </div>
            ) : (
              <div>
                <ListItemButton onClick={() => setSelectedChat(chat)}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={getSenderFull(loggedUser, chat.users).pic} />
                    </ListItemAvatar>
                    <ListItemText primary={getSender(loggedUser, chat.users)} />
                  </ListItem>
                </ListItemButton>
                <Divider variant="middle" />
              </div>
            )
          ))}
        </List>)
        : (<CircularProgress sx={{ m: '20px 170px' }} color='success' />)}
    </div>
  );
}

export default RecipeReviewCard