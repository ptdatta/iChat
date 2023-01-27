import React from 'react'
import { useState } from 'react'
import { TextField, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import LoadingButton from '@mui/lab/LoadingButton';
import axios from "axios";
import { setSnackbar } from '../Redux/Ducks/snackbar';
import { useDispatch } from 'react-redux';



const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClick = async () => {
    setLoading(true);
    if (!email || !password) {

      dispatch(setSnackbar(true, "warning", "Please fill all the fields"));
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        config
      );

      //   console.log(data);

      localStorage.setItem("userInfo", JSON.stringify(data));
      dispatch(setSnackbar(true, "success", "Login Successfull"));
      setLoading(false);
      setTimeout(() => {
        navigate('/chat');
      }, 500);
    } catch (error) {

      dispatch(setSnackbar(true, "error", error.response.data.message));
      setLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setPropToast({ ...propToast, open: false })
  };

  return (
    <form style={{
      marginTop: '20px'
    }}>
      <TextField sx={{ m: 1, width: '400px' }} id="outlined-basic" placeholder='Enter your Email Address' label="Email Address" variant="outlined" color='success'
        onChange={(e) => setEmail(e.target.value)} value={email} />
      <FormControl sx={{ m: 1, width: '400px' }} variant="outlined">
        <InputLabel color='success' htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          placeholder='Enter Password'
          color='success'
          value={password}
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
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
      <LoadingButton loading={loading} sx={{ m: 1, width: '400px', height: '50px' }} color="success" variant="contained" disableElevation onClick={handleClick}>LogIn</LoadingButton>
      <LoadingButton loading={loading} sx={{ m: 1, width: '400px', height: '50px' }} color="error" variant="contained" disableElevation onClick={() => {
        setEmail("guest@example.com");
        setPassword("123456");
      }}>Get Guest User Credentials</LoadingButton>
    </form>
  )
}

export default Login
