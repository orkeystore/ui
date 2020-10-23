import { CircularProgress, Container, makeStyles } from '@material-ui/core';
import React from 'react';

export interface IPropsPage {
  isLoading?: boolean;
}

const Page: React.FC<IPropsPage> = (props) => {
  const { isLoading } = props;
  const styles = useStyles();

  if (isLoading) {
    return (
      <div className={styles.loaderWrap}>
        <CircularProgress size={64} />
      </div>
    );
  }

  return (
    <Container className={styles.container}>
      <>{props.children}</>
    </Container>
  );
};

const useStyles = makeStyles(() => ({
  loaderWrap: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120,
  },
  container: {
    minWidth: 0,
    flexGrow: 1,
    paddingTop: 24,
  },
}));

export default Page;
