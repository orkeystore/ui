import React from 'react';
import { useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Button, Typography } from '@material-ui/core';

import * as sessionSelectors from 'src/containers/Session/selectors';

import { useContainerSession } from 'src/containers/Session/hooks';
import { makeStyles } from '@material-ui/styles';

const TopBar: React.FC = () => {
  const user = useSelector(sessionSelectors.account);
  const { logout } = useHooks();
  const styles = useStyles();
  const isLogoutAvail = user !== undefined;

  return (
    <AppBar position={'static'}>
      <Toolbar>
        <Typography variant={'h4'} color="inherit">
          Orkeystore
        </Typography>
        <div className={styles.grow} />
        {isLogoutAvail && (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

const useHooks = () => {
  const { logout } = useContainerSession();

  return {
    logout,
  };
};

const useStyles = makeStyles(() => {
  return {
    grow: {
      flexGrow: 1,
    },
  };
});

export default TopBar;
