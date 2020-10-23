import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Container, Fade, TablePagination, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import * as storageSelectors from 'src/containers/Storage/selectors';
import StorageTable from 'src/components/StorageTable';
import { useContainerStorage } from 'src/containers/Storage/hooks';
import SearchInput from 'src/components/SearchInput';
import Portal from '../Portal';
import { makeStyles } from '@material-ui/styles';
import EmptyStorage from '../EmptyStorage';
import { Alert } from '@material-ui/lab';

const StorageList: React.FC = () => {
  const styles = useStyles();
  const { loading, data, error } = useSelector(storageSelectors.storageRequestSelector);
  const storageItems = data.items;
  const storageFilter = useSelector(storageSelectors.storageFilter);
  const pagerOptions = useSelector(storageSelectors.storagePagerOptions);
  const isEmpty = useSelector(storageSelectors.isEmptySelector);

  const {
    targetPage,
    storagePager,
    totalItems,
    handlePagerChange,
    handleChangePerPage,
    handleChangeFilterEntryName,
  } = useHooks();

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Grid container spacing={2}>
      {!isEmpty && (
        <Grid container item xs={12} spacing={2} alignItems="center">
          <Grid item>
            <SearchInput
              placeholder={'Search by entry name'}
              defaultValue={storageFilter.entryName}
              onThrottledChange={handleChangeFilterEntryName}
            />
          </Grid>
          <Grid item>
            <Fade in={loading}>
              <CircularProgress size={24} />
            </Fade>
          </Grid>
        </Grid>
      )}
      {isEmpty && (
        <Grid item xs={12}>
          <EmptyStorage />
        </Grid>
      )}
      {totalItems !== undefined && totalItems > 0 && (
        <Grid item xs={12}>
          <StorageTable items={storageItems} />
        </Grid>
      )}
      {!isEmpty && storageItems.length === 0 && (
        <Typography className={styles.notFound}>No items found</Typography>
      )}
      {targetPage !== undefined && totalItems !== undefined && totalItems > 0 && (
        <Portal id="layout_dashboard_footer">
          <Container className={styles.footerWrap}>
            <Grid item xs={12}>
              <TablePagination
                component="div"
                count={totalItems}
                page={targetPage - 1}
                rowsPerPageOptions={pagerOptions}
                onChangePage={handlePagerChange}
                rowsPerPage={storagePager.perPage}
                onChangeRowsPerPage={handleChangePerPage}
              />
            </Grid>
          </Container>
        </Portal>
      )}
    </Grid>
  );
};

const useStyles = makeStyles(() => {
  return {
    notFound: {
      marginTop: 20,
    },
    footerWrap: {
      paddingTop: 20,
      paddingBottom: 20,
    },
  };
});

const useHooks = () => {
  const { changePager, changeFilter } = useContainerStorage();
  const storagePager = useSelector(storageSelectors.storagePager);
  const { totalItems, perPage, page } = storagePager;

  const targetPage = useMemo(() => {
    if (totalItems === undefined) {
      return undefined;
    }
    const maxPage = Math.ceil(totalItems / perPage);
    return Math.min(maxPage, page);
  }, [totalItems, perPage, page]);

  const handleChangeFilterEntryName = useCallback(
    (val: string) => {
      return changeFilter({ entryName: val });
    },
    [changeFilter],
  );

  const handlePagerChange = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, value: number) => {
      return changePager({ page: value + 1 });
    },
    [changePager],
  );

  const handleChangePerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = parseInt(event.target.value, 10);
      return changePager({ perPage: val });
    },
    [changePager],
  );

  return {
    targetPage,
    storagePager,
    totalItems,
    handlePagerChange,
    handleChangeFilterEntryName,
    handleChangePerPage,
  };
};

export default StorageList;
