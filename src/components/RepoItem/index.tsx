import React, { useCallback, useRef } from 'react';
import {
  CardContent,
  Card,
  Typography,
  CardActions,
  Button,
  makeStyles,
  Grid,
  Chip,
  Divider,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import ApproveModal from 'src/components/ApproveModal';
import { useContainerRepos } from 'src/containers/Repos/hooks';
import * as sessionSelectors from 'src/containers/Session/selectors';
import CopyBtn from '../CopyBtn';
import CodeFormat from '../CodeFormat';
import { useSelector } from 'react-redux';

export interface IRepoItemData {
  id: number;
  name: string;
  code: string;
  accessToken: string;
  entries: { name: string }[];
}

export interface IPropsRepoItem {
  data: IRepoItemData;
}

const RepoItem: React.FC<IPropsRepoItem> = (props) => {
  const { data } = props;
  const styles = useStyles();
  const host = useSelector(sessionSelectors.privateHostSelector);
  const { deleteRepos, accessRef, handleFocus } = useHooks();
  const targetUrl = `${host || ''}/repo/bunch/${data.code}`;

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant={'caption'} component={'div'}>
              Repository
            </Typography>
            <Typography variant={'h5'} component={'div'}>
              {data.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid container item xs={12} spacing={1}>
            <Grid item xs={12}>
              <Typography variant={'caption'} component={'div'}>
                Contained keys
              </Typography>
            </Grid>
            {data.entries.map(({ name }, i) => {
              return (
                <Grid item key={i}>
                  <Chip label={name} variant={'outlined'} />
                </Grid>
              );
            })}
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Access token"
              variant="outlined"
              value={data.accessToken}
              onFocus={handleFocus}
              InputProps={{
                inputRef: accessRef,
                endAdornment: (
                  <InputAdornment position="end">
                    <CopyBtn inputRef={accessRef} message={`URL has been copied!`} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Key can be fetched via POST with access token.</Typography>
            <CodeFormat>
              {`curl -d '{ "accessToken":"${data.accessToken}" }' -H "Content-Type: application/json" -X POST ${targetUrl}`}
            </CodeFormat>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={styles.actions}>
        <ApproveModal
          title={'Are you sure want to delete repo?'}
          onSubmit={() => deleteRepos({ ids: [data.id] })}
        >
          <Button size="small">Remove</Button>
        </ApproveModal>
      </CardActions>
    </Card>
  );
};

const useHooks = () => {
  const { deleteRepos } = useContainerRepos();

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = useCallback((event) => {
    event.target.select();
  }, []);

  const accessRef = useRef<HTMLInputElement>(null);

  return {
    accessRef,
    deleteRepos,
    handleFocus,
  };
};

const useStyles = makeStyles(() => ({
  actions: {
    justifyContent: 'flex-end',
  },
  contentItems: {
    display: 'flex',
  },
  contentItem: {
    marginRight: 20,
  },
}));

export default RepoItem;
