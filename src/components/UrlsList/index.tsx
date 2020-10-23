import React, { useCallback, useMemo } from 'react';
import {
  List,
  ListItem,
  TextField,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CopyBtn from 'src/components/CopyBtn';

export interface ILinkItem {
  code: string;
  url: string;
  label: string;
  isPrivate?: boolean;
}

export interface IPropsUrlsList {
  items: ILinkItem[];
}


const UrlsList: React.FC<IPropsUrlsList> = (props) => {
  const styles = useStyles();
  const { inputRefs, handleFocus } = useHooks(props);

  return (
    <List className={styles.list}>
      {props.items.map((item, i) => {
        return (
          <ListItem className={styles.item} key={item.code}>
            <TextField
              value={item.url}
              label={item.label}
              fullWidth
              variant="outlined"
              onFocus={handleFocus}
              InputProps={{
                inputRef: inputRefs[i],
                endAdornment: (
                  <InputAdornment position="end">
                    <CopyBtn inputRef={inputRefs[i]} message={`URL has been copied!`}/>
                    {!item.isPrivate && (
                      <IconButton
                        onClick={() => {
                          window.open(item.url, '_blank');
                        }}
                      >
                        <OpenInNewIcon fontSize={'small'} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

const useHooks = (props: IPropsUrlsList) => {
  const handleFocus: React.FocusEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      event.target.select();
    },
    [],
  );

  const inputRefs = useMemo(() => props.items.map(() => React.createRef<HTMLInputElement>()), [props.items]);

  return {
    inputRefs,
    handleFocus,
  }
}

const useStyles = makeStyles(() => ({
  list: {
    padding: 0,
    paddingBottom: 10,
    width: '100%',
  },
  item: {
    padding: 0,
    paddingBottom: 10,
    paddingTop: 10,
  },
}));


export default UrlsList;
