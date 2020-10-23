import React from 'react';
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import { Box, Theme, Typography } from '@material-ui/core';

export interface IPropsMessage {
  root?: PaperProps;
}

const Message: React.FC<IPropsMessage> = (props) => {
  const styles = useStyles();

  return (
    <Paper {...props.root} className={styles.root}>
      <Box className={styles.textWrap}>
        <ErrorOutlineRoundedIcon color="inherit" />
        <Typography className={styles.message} color="inherit">
          {props.children}
        </Typography>
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      padding: 10,
      flexGrow: 1,
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.contrastText,
    },
    message: {
      paddingLeft: '15px',
      paddingTop: '2px',
    },
    textWrap: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  };
});

export default Message;
