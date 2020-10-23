import React from 'react';
import { useSelector } from 'react-redux';
import { List, ListItem, ListItemText, ListItemIcon, makeStyles } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { mainMenuLinks } from 'src/containers/Session/selectors';
import { useRouter } from 'next/router';

const MainMenu: React.FC = () => {
  const mainMenu = useSelector(mainMenuLinks);
  const styles = useStyles();
  const router = useRouter();

  return (
    <List component="nav">
      {mainMenu.map((item) => {
        const isActive = item.path === router.pathname;
        const color = isActive ? 'primary' : 'action';
        return (
          <ListItem
            key={item.id}
            button
            onClick={isActive ? undefined : () => router.push(item.path)}
          >
            <ListItemIcon className={styles.iconWrap}>
              <Icon color={color}>{item.icon}</Icon>
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                color: isActive ? 'primary' : 'initial',
              }}
            >
              {item.title}
            </ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
};

const useStyles = makeStyles(() => ({
  iconWrap: {
    maxWidth: 40,
    minWidth: 40,
  },
}));

export default MainMenu;
