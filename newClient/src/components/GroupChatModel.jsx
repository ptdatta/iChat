import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, List } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UserListItem from './UserListItem';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../Redux/Ducks/snackbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { ChatState } from '../Context/ChatProvider';
import Chip from '@mui/material/Chip';


const FormDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      dispatch(setSnackbar(true, "warning", "User Already Exists"));
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

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
      console.log(error);
    }
  }

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      dispatch(setSnackbar(true, "warning", "Please fill all the feilds"));
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      handleClose();
      dispatch(setSnackbar(true, "success", "New Group Chat Created!"));
    } catch (error) {
      dispatch(setSnackbar(true, "error", "Failed to Create the Chat!"));
    }
  };

  return (
    <div>
      <Dialog maxWidth="xs" open={open} onClose={handleClose}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }} >
          <Typography variant="h5" gutterBottom>
            Create a Group
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mb: '10px' }}
            fullWidth
            id="standard-basic"
            label="Chat Name"
            variant="standard"
            color="success"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <TextField
            fullWidth
            id="standard-basic"
            label="Add Users"
            variant="standard"
            color="success"
            value={search}
            onChange={handleChange}
          />
          {selectedUsers.map((u) => (
            <Chip sx={{ mt: '4px', mr: '2px' }} label={u.name} color="info" onDelete={() => handleDelete(u)} />
          ))}
          {loading && search !== "" ? (<CircularProgress sx={{ m: '20px 170px' }} color='success' />) :
            (
              searchResult?.slice(0, 3).map((user) => (
                <List>
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)} />
                </List>
              ))
            )}
        </DialogContent>
        <DialogActions>
          <Button color="success" onClick={handleSubmit}>
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </div>

  );
}

export default FormDialog