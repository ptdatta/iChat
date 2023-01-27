import React from 'react'
import { useState } from 'react'
import { TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FileBase from 'react-file-base64'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setSnackbar } from '../Redux/Ducks/snackbar';
import { useDispatch } from 'react-redux';


const Signup = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const navigate = useNavigate();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConPassword, setShowConPassword] = React.useState(false);
    const [picLoading, setPicLoading] = useState(false);

    const handleClick = async () => {
        setPicLoading(true);
        if (!name || !email || !password || !confirmpassword) {

            dispatch(setSnackbar(true, "warning", "Please Fill all The Fields"));
            setPicLoading(false)
            return;
        }
        if (password !== confirmpassword) {

            dispatch(setSnackbar(true, "warning", "Passwords Do Not Match"));
            setPicLoading(false)
            return;
        }
        
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "http://localhost:5000/api/user",
                {
                    name,
                    email,
                    password,
                    pic,
                },
                config
            );

            dispatch(setSnackbar(true, "success", "Registration Successfull"));
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            setTimeout(() => {
                navigate('/chat');
            }, 500);
        } catch (error) {

            dispatch(setSnackbar(true, "error", error.response.data.message));
            setPicLoading(false);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setPropToast({ ...propToast, open: false })
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConPassword = () => setShowConPassword((show) => !show);

    const postDetails = (base64) => {
        setPicLoading(true);
        const type = base64.substring(base64.indexOf(':') + 1, base64.indexOf(';'));
        if (type === "image/jpeg" || type === "image/png") {
            setPic(base64);
        } else {
            setPropToast({ title: "Please select an image", open: true, status: "warning" })
        }
        setPicLoading(false);
        return;
    }

    return (
        <form style={{
            marginTop: '20px'
        }}>
            <TextField sx={{ m: 1, width: '400px' }} placeholder="Enter your name" id="outlined-basic" label="Name" variant="outlined" color='success' onChange={(e) => setName(e.target.value)} />
            <TextField sx={{ m: 1, width: '400px' }} placeholder="Enter Your Email Address" id="outlined-basic" label="Email Address" variant="outlined" color='success' onChange={(e) => setEmail(e.target.value)} />
            <FormControl sx={{ m: 1, width: '400px' }} variant="outlined">
                <InputLabel color='success' htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                    placeholder='Enter Password'
                    color='success'
                    onChange={(e) => setPassword(e.target.value)}
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                />
            </FormControl>
            <FormControl sx={{ m: 1, width: '400px' }} variant="outlined">
                <InputLabel color='success' htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                <OutlinedInput
                    placeholder='Confirm Password'
                    onChange={(e) => setConfirmpassword(e.target.value)}
                    color='success'
                    id="outlined-adornment-password"
                    type={showConPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowConPassword}
                                edge="end"
                            >
                                {showConPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Confirm Password"
                />
            </FormControl>
            <Typography sx={{ ml: '8px', p: '5px' }} varient="h6">Upload your Picture</Typography>
            <div style={{
                marginLeft: '12px'
            }}>
                <FileBase
                    type="file"
                    multiple={false}
                    // onDone={({base64})=>console.log(base64.substring(base64.indexOf(':')+1,base64.indexOf(';')))}
                    onDone={({ base64 }) => postDetails(base64)}
                />
            </div>
            <LoadingButton loading={picLoading} sx={{ m: 1, width: '400px', height: '50px' }} color="success" variant="contained" disableElevation onClick={handleClick}>Sign Up</LoadingButton>
        </form>
    )
}

export default Signup
