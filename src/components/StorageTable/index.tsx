import React, { useCallback } from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { IApiStorageItem } from 'libs/api/types';
import moment from 'moment';
import { useContainerPreviewKey } from 'src/containers/KeyPreview/hooks';

export interface IStorageTableItem {
  expUnix: number;
  activateUnix: number;
  entry: {
    name: string;
    archivedAt: number | null;
  };
}

export interface IPropsStorageTable {
  items: IApiStorageItem[];
}

const StorageTable: React.FC<IPropsStorageTable> = (props) => {
  const { items } = props;
  const { handleOpenKeyPreview } = useHooks();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Algorithm</TableCell>
            <TableCell>Entry name</TableCell>
            <TableCell>Entry code</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Period</TableCell>
            <TableCell align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const now = moment();
            const expMoment = moment.unix(item.expUnix);
            const activateMoment = moment.unix(item.activateUnix);
            const dateFormat = 'LL';

            let currentStatus = '';

            if (item.entry.archivedAt !== null) {
              currentStatus = 'Archived';
            } else if (Boolean(item.expUnix) && expMoment.isBefore(now)) {
              currentStatus = 'Expired';
            } else if (activateMoment.isAfter(now)) {
              currentStatus = 'Awaiting';
            } else {
              currentStatus = 'Active';
            }

            return (
              <TableRow key={item.key.kid}>
                <TableCell>{item.key.kid}</TableCell>
                <TableCell>{item.key.kty}</TableCell>
                <TableCell>{item.key.alg}</TableCell>
                <TableCell>{item.entry.name}</TableCell>
                <TableCell>{item.entry.code}</TableCell>
                <TableCell>{currentStatus}</TableCell>
                <TableCell>
                  {item.expUnix
                    ? `${activateMoment.format(dateFormat)} - ${expMoment.format(dateFormat)}`
                    : `Non-rotatable`}
                </TableCell>
                <TableCell align="center" >
                  <Grid container spacing={2} justify="center">
                    <Grid item>
                      <IconButton size="small" onClick={() => handleOpenKeyPreview(item.key.kid)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const useHooks = () => {
  const { openKeyPreview } = useContainerPreviewKey();

  const handleOpenKeyPreview = useCallback(async (id: string) => {
    await openKeyPreview({ id: parseInt(id) }, { format: 'jwk', privacy: 'public' });
  }, [openKeyPreview]);

  return {
    handleOpenKeyPreview,
  }
}

export default StorageTable;
