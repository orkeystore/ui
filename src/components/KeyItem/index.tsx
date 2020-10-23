import React, { useCallback } from 'react';
import moment from 'moment';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardActions,
  Button,
  makeStyles,
  Grid,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreOutlined';
import HelpIcon from '@material-ui/icons/Help';

import UrlsList from 'src/components/UrlsList';
import ApproveModal from 'src/components/ApproveModal';
import { publicHostSelector } from 'src/containers/Session/selectors';
import MessageTooltip from 'src/components/MessageTooltip';
import PrivateUrls from '../PrivateUrls';
import { useContainerKeys } from 'src/containers/Keys/hooks';
import { useMemo } from 'react';

export interface IKeyItemData {
  id: number;
  name: string;
  code: string;
  accessCode: string;
  rotateInterval: number | null;
  archivedAt: number | null;
}

export interface IKeyItemProps {
  data?: IKeyItemData;
}

const KeyItem: React.FC<IKeyItemProps> = (props) => {
  const styles = useStyles();
  const { deleteItem, archiveItem, restoreItem, rotation, publicUrls } = useHooks(props);
  const { data } = props;

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} justify={'space-between'}>
          <Grid item>
            <Typography variant={'caption'}>Name</Typography>
            <Typography variant={'h5'}>{data.name}</Typography>
          </Grid>
          <Grid item className={styles.codeHolder}>
            <Typography variant={'caption'}>Unique code</Typography>
            <Typography variant={'h5'}>{data.code}</Typography>
          </Grid>
        </Grid>
        <Divider className={styles.divider} />
        <Typography variant={'caption'}>
          {!data.rotateInterval ? 'Non rotatable key' : rotation}
        </Typography>
        <Divider className={styles.divider} />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant={'h6'}>Public key</Typography>
            <MessageTooltip
              placement="top-start"
              title={
                <Typography gutterBottom variant={'body1'} color={'textPrimary'}>
                  {`Anyone can get public key by GET request in formats listed below. Rotatable response contain "expires" header.`}
                </Typography>
              }
            >
              <HelpIcon className={styles.tooltip} color={'primary'} fontSize={'small'} />
            </MessageTooltip>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ flexGrow: 1 }}>
              <UrlsList items={publicUrls} />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant={'h6'}>Private key</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={styles.privateWrap}>
              <PrivateUrls item={data} />
            </div>
          </AccordionDetails>
        </Accordion>
      </CardContent>
      <CardActions className={styles.actions}>
        {data.archivedAt !== null && (
          <>
            <ApproveModal
              title={'Are you sure want to delete key?'}
              content={'Every associated keys will be unavailable'}
              onSubmit={() => deleteItem(data.id)}
            >
              <Button size="small">Delete</Button>
            </ApproveModal>
            <Button size="small" onClick={() => restoreItem(data.id)}>
              Restore
            </Button>
          </>
        )}
        {data.archivedAt === null && (
          <ApproveModal
            title={'Are you sure want to archive entry in storage?'}
            content={
              'Associated keys will be marked as archived and unavailable. You can restore entry from the archive at any time.'
            }
            onSubmit={() => archiveItem(data.id)}
          >
            <Button size="small">Archive</Button>
          </ApproveModal>
        )}
      </CardActions>
    </Card>
  );
};

const useHooks = (props: IKeyItemProps) => {
  const publicHost = useSelector(publicHostSelector);
  const { fetchRemoveKeyItem, fetchArchiveKeyItem, fetchRestoreKeyItem } = useContainerKeys();
  const { data } = props;
  const rotateInterval = data ? data.rotateInterval : null;
  const code = data ? data.code : null;

  const publicUrls = useMemo(() => {
    if (publicHost === undefined || code === null) {
      return [];
    }
    return [
      { code: 'jwk', url: `${publicHost}/entry/public/jwk/${code}`, label: 'JWK' },
      { code: 'jwks', url: `${publicHost}/entry/public/jwks/${code}`, label: 'JWKs' },
      { code: 'pem', url: `${publicHost}/entry/public/pem/${code}`, label: 'PEM' },
    ];
  }, [code, publicHost]);

  const deleteItem = useCallback(
    (id: number) => {
      return fetchRemoveKeyItem({ id });
    },
    [fetchRemoveKeyItem],
  );

  const archiveItem = useCallback(
    (id: number) => {
      return fetchArchiveKeyItem({ id });
    },
    [fetchArchiveKeyItem],
  );

  const restoreItem = useCallback(
    (id: number) => {
      return fetchRestoreKeyItem({ id });
    },
    [fetchRestoreKeyItem],
  );

  const rotation = useMemo(() => {
    return rotateInterval && `Rotation period: ${moment.duration(rotateInterval, 's').humanize()}`;
  }, [rotateInterval]);

  return {
    host: publicHost,
    rotation,
    publicUrls,
    deleteItem,
    archiveItem,
    restoreItem,
  };
};

const useStyles = makeStyles(() => ({
  actions: {
    justifyContent: 'flex-end',
  },
  privateWrap: {
    width: '100%',
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  tooltip: {
    marginLeft: 10,
    opacity: 0.2,
    '&:hover': {
      opacity: 1,
    },
  },
  codeHolder: {
    textAlign: 'right',
  },
}));

export default KeyItem;
