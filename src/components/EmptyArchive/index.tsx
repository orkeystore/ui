import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';

const EmptyArchive = () => {
  const styles = useStyles();

  return (
    <Box>
      <Typography component="div" variant="h4">
        There are no archived entries
      </Typography>
      <Box className={styles.text}>
        <p>
          You can mark key entry as archived. In that case, it will be no longer available, but
          server will keep all associated keys in storage. Also, you could restore archived key
          entry at any moment.
        </p>
        <p>All archived entries will be listed here.</p>
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

export default EmptyArchive;
