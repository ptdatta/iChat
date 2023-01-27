import React from 'react'
import { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { DialogTitle, DialogActions, DialogContent, Chip, TextField, Button, CircularProgress, List } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from "axios";
import { setSnackbar } from '../Redux/Ducks/snackbar';
import { useDispatch } from 'react-redux';
import UserListItem from './UserListItem';


const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
    const dispatch = useDispatch();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const { selectedChat, setSelectedChat, chats, user } = ChatState();


    const handleRename = async () => {
        if (!groupChatName) {
            dispatch(setSnackbar(true, "error", "Please enter the new GroupChat Name"));
            return;
        }

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:5000/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            setRenameLoading(false);
            setSelectedChat(data);
            console.log(chats);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            dispatch(setSnackbar(true, "error", "Failed to Update"));
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleSearch = async (e) => {
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
            console.log(error);
        }
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
          dispatch(setSnackbar(true, "error", "User Already in group!"));
          return;
        }
    
        if (selectedChat.groupAdmin._id !== user._id) {
          dispatch(setSnackbar(true, "error", "Only admins can add someone!"));
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `http://localhost:5000/api/chat/groupadd`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
        } catch (error) {
          dispatch(setSnackbar(true, "error", error.response.data.message));
          setLoading(false);
        }
        setGroupChatName("");
      };

      const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
          dispatch(setSnackbar(true, "error", "Only admins can remove someone!"));
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `http://localhost:5000/api/chat/groupremove`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          fetchMessages();
          setLoading(false);
        } catch (error) {
          dispatch(setSnackbar(true, "error", error.response.data.message));
          setLoading(false);
        }
        setGroupChatName("");
      };

    return (
        <div style={{ width: '400px', padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <DialogTitle variant='h4'>
                {selectedChat.chatName}
            </DialogTitle>
            <DialogContent >
                <div style={{ display: 'flex', flexDirection: 'row',flexWrap: 'wrap' }}>
                    {selectedChat.users.map((u) => (
                        <Chip sx={{ mr: '2px',mt:'2px' }} label={u.name} color="success" onDelete={() => handleRemove(u)} />
                    ))}
                </div>
                <div style={{ padding: '10px 0px', display: 'flex', flexDirection: 'row' }}>
                    <TextField sx={{ mr: '3px' }} fullWidth color="success" id="outlined-basic" label="Chat Name" variant="outlined" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                    <LoadingButton loading={renameloading} color='info' variant="contained" onClick={handleRename}>
                        Update
                    </LoadingButton>
                </div>
                <div style={{ width: '100%' }}>
                    <TextField fullWidth color="success" id="outlined-basic" label="Add User To Group" variant="outlined" value={search} onChange={handleSearch} />
                    {loading && search !== "" ? (<CircularProgress sx={{ m: '20px 170px' }} color='success' />) :
                        (
                            searchResult?.slice(0, 3).map((user) => (
                                <List>
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)} />
                                </List>
                            ))
                        )}
                </div>
            </DialogContent>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '90%' }}>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={() => handleRemove(user)}>
                        Leave Group
                    </Button>
                </DialogActions>
            </div>
        </div>
    )
}

export default UpdateGroupChatModel
