import React, { useEffect, useState, ChangeEvent, useCallback } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  makeStyles,
  Box,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IApiKeyEntry } from 'libs/api/types';
import { useContainerKeys } from 'src/containers/Keys/hooks';
import { IApiParamsKeysList, IApiResultKeysList } from 'libs/api/keys/list';
import { useAsyncEffect } from 'libs/utils/useAPIEffect';
import SearchInput from '../SearchInput';

export interface IPropsEntriesPicker {
  pickedSet?: string[];
  noItemsMessage?: string;
  onUpdate?: (selected: IApiKeyEntry[]) => void;
}

const EntriesPicker: React.FC<IPropsEntriesPicker> = (props) => {
  const { noItemsMessage } = props;
  const { picked, options, handleChangeItem, handleSearchChange } = useHooks(props);
  const styles = useStyles();

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} className={styles.topDivider}>
        <Divider />
      </Grid>
      {options.length === 0 && noItemsMessage && (
        <Typography className={styles.noItemsMessage} variant="caption">
          {noItemsMessage}
        </Typography>
      )}
      {options.length > 0 && (
        <Grid item xs={12}>
          <SearchInput
            placeholder={'Select required keys...'}
            onThrottledChange={handleSearchChange}
            fullWidth
          />
          <Box className={styles.scrollBar}>
            <PerfectScrollbar>
              <List>
                {options.map((item) => {
                  return (
                    <div key={item.id}>
                      <ListItem key={item.id}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            size="small"
                            disableRipple
                            checked={picked.includes(item.code)}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleChangeItem(item.code, e.target.checked)
                            }
                          />
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                      </ListItem>
                    </div>
                  );
                })}
              </List>
            </PerfectScrollbar>
            {options.length === 0 && <Typography>No items available</Typography>}
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

const useHooks = (props: IPropsEntriesPicker) => {
  const { pickedSet, onUpdate } = props;
  const [picked, pickItems] = useState<string[]>([]);
  const [options, setOptions] = useState<IApiKeyEntry[]>([]);
  const [pickedDetails, changePickedDetails] = useState<{ [id: number]: IApiKeyEntry }>({});
  const [searchParams, setParams] = useState<{
    page?: number;
    perPage?: number;
    search?: string;
  }>({});

  useUpdatePickedSetFromProps(pickedSet, pickItems);
  useGetPickedDetails(picked, pickedDetails, changePickedDetails);
  useFetchOptions(searchParams, setOptions);

  const handleChangeItem = useCallback(
    (code: string, checked: boolean) => {
      const newItems = checked ? picked.concat([code]) : picked.filter((item) => item !== code);

      if (onUpdate) {
        onUpdate(options.filter((item) => newItems.includes(item.code)));
      }

      pickItems(newItems);
    },
    [onUpdate, pickItems, options, picked],
  );

  const handleSearchChange = useCallback(
    (val: string) => {
      setParams((s) => ({ ...s, search: val }));
    },
    [setParams],
  );

  return {
    options,
    picked,
    handleChangeItem,
    handleSearchChange,
  };
};

const useStyles = makeStyles(() => ({
  scrollBar: {
    height: 220,
  },
  topDivider: {
    marginBottom: 5,
  },
  noItemsMessage: {
    padding: '10px 15px',
  },
}));

const useUpdatePickedSetFromProps = (
  pickedSet: string[] | undefined,
  pickItems: (p: string[]) => void,
) => {
  useEffect(() => {
    if (pickedSet) {
      pickItems(pickedSet);
    }
  }, [pickedSet, pickItems]);
};

const useGetPickedDetails = (
  picked: string[],
  pickedDetails: Record<string, IApiKeyEntry>,
  changePickedDetails: (p: Record<number, IApiKeyEntry>) => void,
) => {
  const { requestKeysByIds } = useContainerKeys();
  useEffect(() => {
    const newDetails = pickedDetails;
    const requestTargets: string[] = [];

    picked.forEach((id) => {
      if (!newDetails[id]) {
        requestTargets.push(id);
      }
    });
    /*
    if (requestTargets.length > 0) {
      requestKeysByIds({ ids: requestTargets })
        .then(({ items }) => {
          items.forEach((item) => {
            newDetails[item.id] = item;
          });
        })
        .catch((err) => {
          throw err;
        });
      changePickedDetails(newDetails);
    }
    */
  }, [picked, pickedDetails, changePickedDetails, requestKeysByIds]);
};

const useFetchOptions = (
  params: IApiParamsKeysList,
  setOptions: (opts: IApiKeyEntry[]) => void,
) => {
  const { requestKeysList } = useContainerKeys();

  const fetchList = useCallback(() => {
    return requestKeysList(params);
  }, [params, requestKeysList]);

  const onComplete = useCallback(
    (res: IApiResultKeysList) => {
      setOptions(res.items);
    },
    [setOptions],
  );

  useAsyncEffect(fetchList, onComplete);
};

export default EntriesPicker;
