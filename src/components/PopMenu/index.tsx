import React, { useMemo } from 'react';
import { makeStyles, Menu, MenuItem, MenuProps, Typography } from '@material-ui/core';

export interface IMenuItem {
  id: string;
  label: string;
}

export interface IPropsPopMenu {
  anchorEl: MenuProps['anchorEl'];
  handleClose: () => void;
  menu: IMenuItem[];
  onSelectMenuItem?: <T extends IMenuItem>(x: T) => void;
}

const PopMenu: React.FC<IPropsPopMenu> = (props) => {
  const { menuStaticProps, styles } = useHooks();

  return (
    <Menu
      {...menuStaticProps}
      keepMounted
      anchorEl={props.anchorEl}
      className={styles.menu}
      open={Boolean(props.anchorEl)}
      onClose={props.handleClose}
    >
      {props.menu.map((item) => {
        return (
          <MenuItem
            key={item.id}
            onClick={() => {
              if (props.onSelectMenuItem) {
                props.onSelectMenuItem(item);
              }
              props.handleClose();
            }}
          >
            <Typography variant={'button'}>{item.label}</Typography>
          </MenuItem>
        );
      })}
    </Menu>
  );
};

const useHooks = () => {
  const styles = useStyles();

  const menuStaticProps = useMemo((): Partial<MenuProps> => {
    return {
      anchorOrigin: { horizontal: 'right', vertical: 'top' },
      transformOrigin: { horizontal: 'right', vertical: 'top' },
    };
  }, []);

  return {
    styles,
    menuStaticProps,
  };
};

const useStyles = makeStyles(() => ({
  menu: {
    width: 150,
  },
}));

export default PopMenu;
