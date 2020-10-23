import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Button,
  makeStyles,
  Box,
  Container,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Alert from '@material-ui/lab/Alert';
import { Pagination } from '@material-ui/lab';

import {
  isKeyListEmpty,
  keysPagerOptionsSelector,
  keysRequestSelector,
  keysSearchSelector,
} from 'src/containers/Keys/selectors';
import { useContainerKeys } from 'src/containers/Keys/hooks';
import * as keysSelectors from 'src/containers/Keys/selectors';
import KeyItem from 'src/components/KeyItem';
import PerPageSelect from 'src/components/PerPageSelect';
import SearchInput from 'src/components/SearchInput';
import Portal from '../Portal';
import EmptyKeysList from '../EmptyKeysList';
import EmptyArchive from '../EmptyArchive';

export interface IPropsKeysList {
  archive?: boolean;
}

const KeysList: React.FC<IPropsKeysList> = (props) => {
  const styles = useStyles();
  const { loading, data, error, pager } = useSelector(keysRequestSelector);
  const pagerOptions = useSelector(keysPagerOptionsSelector);
  const search = useSelector(keysSearchSelector);
  const isEmpty = useSelector(isKeyListEmpty);

  const {
    handleModalToggle,
    handlePagerChange,
    handleChangePerPage,
    handleChangeSearch,
  } = useHooks();

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box className={styles.wrap}>
      <Grid container spacing={2}>
        <Grid item container spacing={2} xs={12} alignItems={'center'}>
          {!isEmpty && !props.archive && (
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleModalToggle}
              >
                Add key entry
              </Button>
            </Grid>
          )}
          {!isEmpty && (
            <Grid item>
              <SearchInput
                defaultValue={search}
                onThrottledChange={handleChangeSearch}
                placeholder={'Search by name...'}
              />
            </Grid>
          )}
          {loading && (
            <Grid item>
              <CircularProgress size={24} />
            </Grid>
          )}
        </Grid>
        {isEmpty && !props.archive && (
          <Grid item xs={12}>
            <EmptyKeysList onAddNewOne={handleModalToggle} />
          </Grid>
        )}
        {isEmpty && props.archive && (
          <Grid item xs={12}>
            <EmptyArchive />
          </Grid>
        )}
        {!isEmpty && (
          <Grid item xs={12}>
            {data.items.length > 0 && (
              <Grid container spacing={2}>
                {data.items.map((item) => {
                  return (
                    <Grid item key={item.id} xs={6}>
                      <KeyItem data={item} />
                    </Grid>
                  );
                })}
              </Grid>
            )}
            {data.items.length === 0 && (
              <Typography className={styles.notFound}>No items found</Typography>
            )}
          </Grid>
        )}
        {Boolean(pager.totalPages) && (
          <Portal id="layout_dashboard_footer">
            <Container className={styles.footerWrap}>
              <Grid container item xs={12} alignItems="center">
                <Grid item>
                  <PerPageSelect
                    current={pager.perPage}
                    options={pagerOptions}
                    onSelect={handleChangePerPage}
                  />
                </Grid>
                <Grid item className={styles.pagerHolder}>
                  {pager.totalPages !== undefined && pager.totalPages > 1 && (
                    <Pagination
                      onChange={handlePagerChange}
                      count={pager.totalPages}
                      page={pager.page}
                    />
                  )}
                </Grid>
              </Grid>
            </Container>
          </Portal>
        )}
      </Grid>
    </Box>
  );
};

const useHooks = () => {
  const isFormOpened = useSelector(keysSelectors.isEditModalOpened);
  const { changePager, changeSearch, toggleEditModal } = useContainerKeys();

  const handleModalToggle = useCallback(() => {
    toggleEditModal({ isOpened: !isFormOpened });
  }, [isFormOpened, toggleEditModal]);

  const handlePagerChange = useCallback(
    (_event: React.ChangeEvent<unknown>, value: number) => {
      return changePager({ page: value });
    },
    [changePager],
  );

  const handleChangePerPage = useCallback(
    (val: number) => {
      return changePager({ perPage: val });
    },
    [changePager],
  );

  const handleChangeSearch = useCallback(
    (val: string) => {
      return changeSearch({ search: val });
    },
    [changeSearch],
  );

  return {
    handleChangePerPage,
    handleChangeSearch,
    handleModalToggle,
    handlePagerChange,
  };
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
    loaderWrap: {
      textAlign: 'center',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 145,
    },
    pagerHolder: {
      marginLeft: 'auto',
    },
    searchHolder: {
      marginLeft: 'auto',
      marginTop: 'auto',
    },
    wrap: {
      maxWidth: '100%',
      flexGrow: 1,
    },
    noItems: {
      marginTop: 20,
    },
  };
});

export default KeysList;
