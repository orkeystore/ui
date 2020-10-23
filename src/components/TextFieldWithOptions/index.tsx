import React from 'react';
import {
  Button,
  InputAdornment,
  InputProps,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import PopMenu from '../PopMenu';

export interface IMenuItem {
  id: string;
  label: string;
}

export interface IPropsTextFieldWithOptions {
  menu?: IMenuItem[];
  currentMenuLabel?: React.ReactNode;
  fieldProps?: TextFieldProps;
  inputProps?: InputProps;
  onSelectMenuItem?: <T extends IMenuItem>(i: T) => void;
  disabled?: boolean;
  beforeOptions?: React.ReactNode;
  afterOptions?: React.ReactNode;
}

const TextFieldWithOptions: React.FC<IPropsTextFieldWithOptions> = (props) => {
  const { menu, currentMenuLabel, fieldProps, inputProps, disabled } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenUnitMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUnitMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <TextField
        fullWidth
        {...fieldProps}
        variant="outlined"
        disabled={disabled}
        InputProps={{
          endAdornment: currentMenuLabel ? (
            <InputAdornment position="end">
              {props.beforeOptions}
              <Button size={'small'} disabled={disabled} onClick={handleOpenUnitMenu}>
                {currentMenuLabel}
              </Button>
              {props.afterOptions}
            </InputAdornment>
          ) : null,
          ...inputProps,
        }}
      />
      {menu && (
        <PopMenu
          anchorEl={anchorEl}
          menu={menu}
          onSelectMenuItem={props.onSelectMenuItem}
          handleClose={handleCloseUnitMenu}
        />
      )}
    </>
  );
};

export default TextFieldWithOptions;
