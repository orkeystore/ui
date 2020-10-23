import { Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React from 'react';

export interface IPropsEmptyKeysList {
  onAddNewOne: () => void;
}

const EmptyKeysList: React.FC<IPropsEmptyKeysList> = (props) => {
  const styles = useStyles();

  return (
    <Box>
      <Typography component="div" variant="h4">
        There are no available key entries
      </Typography>
      <Box className={styles.text}>
        <p>
          Key entry simplifies work with rotatable keys. When you create a key entry, the server
          generates keys with a defined lifetime. After the key expires, the server will replace it
          with the new one and you can get a renewed key with the same request.
        </p>
      </Box>
      <Box className={styles.buttonBox}>
        <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={props.onAddNewOne}>
          Add key entry
        </Button>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles(() => {
  return {
    text: {
      maxWidth: 600,
    },
    buttonBox: {
      marginTop: 30,
    },
  };
});

export default EmptyKeysList;
