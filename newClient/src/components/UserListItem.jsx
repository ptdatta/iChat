import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { ListItemButton } from '@mui/material';


const UserListItem = ({ user, handleFunction }) => {
    
    return (
        <div style={{ height: '65px'}}>
            <ListItemButton onClick={handleFunction}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={user.pic} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email} />
                </ListItem>
            <Divider variant="middle" component="li" />
            </ListItemButton>
        </div>
    )
}

export default UserListItem
