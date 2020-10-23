import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Button, Box, Container, CircularProgress, Typography } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import RepoItem from 'src/components/RepoItem';
import * as reposSelectors from 'src/containers/Repos/selectors';
import { useContainerRepos } from 'src/containers/Repos/hooks';
import PerPageSelect from '../PerPageSelect';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import SearchInput from '../SearchInput';
import Portal from '../Portal';
import EmptyReposList from '../EmptyReposList';

const ReposList: React.FC = () => {
  const styles = useStyles();
  const { loading, items, pager, pagerOptions } = useSelector(reposSelectors.reposListSelector);
  const search = useSelector(reposSelectors.searchSelector);
  const isEmpty = useSelector(reposSelectors.isEmptySelector);

  const {
    handleModalToggle,
    handleChangePerPage,
    handlePagerChange,
    handleChangeSearch,
  } = useHooks();

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item spacing={2} container xs={12} alignItems="center">
          {!isEmpty && (
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleModalToggle}
              >
                Add repository
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
        {items.length > 0 && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {items.map((repo) => {
                return (
                  <Grid item xs={6} key={repo.id}>
                    <RepoItem data={repo} />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        )}
        {!isEmpty && items.length === 0 && (
          <Typography className={styles.notFound}>No items found</Typography>
        )}
        {isEmpty && (
          <Grid item xs={12}>
            <EmptyReposList onAddNewOne={handleModalToggle} />
          </Grid>
        )}
        {pager.totalItems !== undefined && pager.totalItems > 0 && (
          <Portal id="layout_dashboard_footer">
            <Container className={styles.footerWrap}>
              <Grid container item xs={12} spacing={2} alignItems="center">
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
  const { changePager, changeSearch, toggleEditModal } = useContainerRepos();
  const isEditFormOpened = useSelector(reposSelectors.isEditModalOpened);
  const handleChangeSearch = useCallback(
    (val: string) => {
      return changeSearch(val);
    },
    [changeSearch],
  );

  const handleChangePerPage = useCallback(
    (val: number) => {
      return changePager({ perPage: val });
    },
    [changePager],
  );

  const handlePagerChange = useCallback(
    (_: unknown, page: number) => {
      return changePager({ page });
    },
    [changePager],
  );

  const handleModalToggle = useCallback(() => {
    toggleEditModal({ isOpened: !isEditFormOpened });
  }, [toggleEditModal, isEditFormOpened]);

  return {
    handleChangeSearch,
    handleModalToggle,
    handleChangePerPage,
    handlePagerChange,
  };
};

const useStyles = makeStyles(() => ({
  notFound: {
    marginTop: 20,
  },
  footerWrap: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  pagerHolder: {
    marginLeft: 'auto',
  },
  searchHolder: {
    marginLeft: 'auto',
  },
  noItems: {
    marginTop: 20,
  },
}));

export default ReposList;
