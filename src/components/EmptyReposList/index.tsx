import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

export interface IPropsEmptyReposList {
  onAddNewOne: () => void;
}

const EmptyReposList: React.FC<IPropsEmptyReposList> = (props) => {
  const styles = useStyles();

  return (
    <Box>
      <Typography component="div" variant="h4">
        There are no repositories
      </Typography>
      <Box className={styles.text}>
        <p>
          Repository is useful when you need to get several keys in one request. For example, you
          can get all keys while an auth server initialization.
        </p>
      </Box>
      <Box className={styles.buttonBox}>
        <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={props.onAddNewOne}>
          Add repo
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

export default EmptyReposList;
