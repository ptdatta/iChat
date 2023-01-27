import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';
import { setSnackbar } from "../Redux/Ducks/snackbar";

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}


const CustomizedSnackbars = () => {
  const dispatch = useDispatch();
  const snackbarOpen = useSelector((state) => state.snackbar.snackbarOpen);
  const snackbarType = useSelector((state) => state.snackbar.snackbarType);
  const snackbarMessage = useSelector(
    (state) => state.snackbar.snackbarMessage
  );
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setSnackbar(false, snackbarType, snackbarMessage));
  };

  return (
    <div>
      <Snackbar
        TransitionComponent={TransitionUp}
        open={snackbarOpen}
        autoHideDuration={3800}
        onClose={handleClose}
      >
        <Alert elevation={6} onClose={handleClose} severity={snackbarType}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomizedSnackbars;
