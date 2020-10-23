import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { isAlreadyFetched } from 'src/containers/Session/selectors';
import { useContainerSession } from 'src/containers/Session/hooks';

const StartScreen: React.FC = (props) => {
  const isComplete = useSelector(isAlreadyFetched);
  useHooks();
  const styles = useStyles();

  if (isComplete) {
    return <>{props.children}</>;
  }

  return <div className={styles.wrap}>{/* <CircularProgress size={60} /> */}</div>;
};

const useHooks = () => {
  const { fetchMe } = useContainerSession();

  useEffect(() => {
    const req = fetchMe();
    return () => {
      req.abort();
    };
  }, [fetchMe]);
};

const useStyles = makeStyles(() => {
  return {
    wrap: {
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
    },
  };
});

export default StartScreen;
