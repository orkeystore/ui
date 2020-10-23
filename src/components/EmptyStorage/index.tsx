import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';

const EmptyStorage = () => {
  const styles = useStyles();

  return (
    <Box>
      <Typography component="div" variant="h4">
        Keys storage is empty
      </Typography>
      <Box className={styles.text}>
        <p>
          After key entry created, the server will generate and rotate keys. Each generated key will
          be listed in storage.
        </p>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles(() => {
  return {
    text: {
      maxWidth: 600,
    },
  };
});

export default EmptyStorage;
