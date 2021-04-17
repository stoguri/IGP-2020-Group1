import React, { useState } from 'react';
import { Typography, AppBar, makeStyles, Box } from '@material-ui/core';

function LoginView() {

  const useStyles = makeStyles({
    top: {
        backgroundColor: "darkslategrey"
    }
});

  return (
    <Box >
      <p id="splash-text">Please login to gain access to the features of this website</p>
    </Box>
  );
}

export default LoginView;



