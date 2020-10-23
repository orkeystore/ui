import React, { useCallback } from 'react';
import { Card, CardContent, Typography, CardActions, Button, makeStyles } from '@material-ui/core';
import ApproveModal from '../ApproveModal';
import { useContainerAccounts } from 'src/containers/Accounts/hooks';

export interface IAccountData {
  id: number;
  login: string;
}

export interface IPropsAccountItem {
  data: IAccountData;
}

const AccountItem: React.FC<IPropsAccountItem> = (props) => {
  const styles = useStyles();
  const { deleteAccount } = useHooks();

  const { data } = props;

  return (
    <Card>
      <CardContent>
        <Typography variant={'caption'} component={'div'}>
          Account
        </Typography>
        <Typography variant={'h4'} component={'div'}>
          {data.login}
        </Typography>
      </CardContent>
      <CardActions className={styles.actions}>
        <ApproveModal
          title={'Are you sure want to delete account?'}
          content={'Every associated keys will be unavailable'}
          onSubmit={() => deleteAccount(data.id)}
        >
          <Button size="small">Remove account</Button>
        </ApproveModal>
      </CardActions>
    </Card>
  );
};

const useHooks = () => {
  const { fetchRemoveAccounts } = useContainerAccounts();
  const deleteAccount = useCallback(
    async (id: number) => {
      await fetchRemoveAccounts({ ids: [id] });
    },
    [fetchRemoveAccounts],
  );

  return {
    deleteAccount,
  };
};

const useStyles = makeStyles(() => ({
  actions: {
    justifyContent: 'flex-end',
  },
}));

export default AccountItem;
