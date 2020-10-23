import { Box, MenuItem, Select } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import { makeStyles } from '@material-ui/styles';
import React, { useCallback } from 'react';

export interface IPropsPerPageSelect {
  current: number;
  options: number[];
  onSelect?: (val: number) => void;
}

const PerPageSelect: React.FC<IPropsPerPageSelect> = (props) => {
  const styles = useStyles();
  const { current, options } = props;
  const { handleChange } = useHooks(props);

  return (
    <Box>
      <Grid container alignItems="center">
        <Grid item className={styles.label}>
          Items per page:
        </Grid>
        <Grid item>
          <Select value={current} onChange={handleChange}>
            {options.map((val) => {
              return (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
      </Grid>
    </Box>
  );
};

const useHooks = (props: IPropsPerPageSelect) => {
  const { onSelect } = props;

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
      }>,
    ) => {
      onSelect && onSelect(e.target.value as number);
    },
    [onSelect],
  );

  return {
    handleChange,
  };
};

const useStyles = makeStyles(() => {
  return {
    label: {
      marginRight: 10,
      fontSize: 12,
    },
  };
});

export default PerPageSelect;
