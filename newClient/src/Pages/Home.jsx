import React from 'react'
import { useEffect } from 'react';
import { Paper } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { useNavigate } from 'react-router';


const Home = () => {
  const [alignment, setAlignment] = React.useState('login');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/");
    }
  }, [])

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '25px'
    }}>
      <Paper sx={{ bgcolor: 'rgba(255,255,255,1)', padding: '20px', maxWidth: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <ToggleButtonGroup
          color="success"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton sx={{ borderRadius: '10px', width: '200px', height: '50px' }} value="login">LogIn</ToggleButton>
          <ToggleButton sx={{ borderRadius: '10px', width: '200px', height: '50px' }} value="signup">SignUp</ToggleButton>
        </ToggleButtonGroup>
        {alignment === "login" ? <Login /> : <Signup />}
      </Paper>
    </div>
  )
}

export default Home
