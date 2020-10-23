import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Button, Dialog } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AccountForm from 'src/components/AccountForm';
import { accountsListSelector } from 'src/containers/Accounts/selectors';
import { useSelector } from 'react-redux';
import AccountItem from '../AccountItem';
import { useContainerAccounts } from 'src/containers/Accounts/hooks';

const AccountsList: React.FC = () => {
  const accountsData = useSelector(accountsListSelector);
  const { isFormOpened, handleModalToggle } = useHooks();

  return (
    <>
      <Dialog open={isFormOpened} onClose={handleModalToggle}>
        <AccountForm onSubmit={handleModalToggle} />
      </Dialog>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleModalToggle}
          >
            Add account
          </Button>
        </Grid>
        <Grid container item spacing={2} xs={12}>
          {accountsData.accounts.map((account) => {
            return (
              <Grid item key={account.id} xs={6}>
                <AccountItem data={account} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
};

const useHooks = () => {
  const [isFormOpened, toggleForm] = useState(false);
  const { fetchAccountsList } = useContainerAccounts();

  const handleModalToggle = useCallback(() => {
    toggleForm(!isFormOpened);
  }, [isFormOpened, toggleForm]);

  useEffect(() => {
    void fetchAccountsList();
  }, [fetchAccountsList]);

  return {
    isFormOpened,
    toggleForm,
    handleModalToggle,
  }
};

export default AccountsList;
