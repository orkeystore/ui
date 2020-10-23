import React from 'react';

import TopBar from 'src/components/TopBar';
import ExpiredSession from 'src/components/ExpiredSession';
import MainMenu from 'src/components/MainMenu';

import { makeStyles } from '@material-ui/core';

const DashboardLayout: React.FC = (props) => {
  const styles = useStyles();

  return (
    <div className={styles.wrap}>
      <ExpiredSession />
      <div>
        <TopBar />
      </div>
      <div className={styles.body}>
        <div className={styles.menu}>
          <MainMenu />
        </div>
        <div className={styles.main}>
          <div className={styles.mainContent}>{props.children}</div>
          <div className={styles.mainFooter}>
            <div id="layout_dashboard_footer" />
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    wrap: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 auto',
      minHeight: '100vh',
    },
    menu: {
      flex: '0 0 250px',
      backgroundColor: theme.palette.background.paper,
    },
    body: {
      flex: '1 1 auto',
      display: 'flex',
      minWidth: 0,
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.default,
      flex: '1 1 auto',
      minWidth: 0,
    },
    mainContent: {
      position: 'relative',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    mainFooter: {},
  };
}, { classNamePrefix: 'DashboardLayout-' });

export default DashboardLayout;
