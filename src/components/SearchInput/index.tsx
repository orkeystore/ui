import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import debounce from 'lodash.debounce';

export type IPropsSearchInput = TextFieldProps & {
  onThrottledChange?: (val: string) => void;
};

const SearchInput: React.FC<IPropsSearchInput> = (props) => {
  const { InputPropsMemo, restProps, handleChange } = useHooks(props);
  return (
    <>
      <TextField {...restProps} onChange={handleChange} size="small" variant={'outlined'} InputProps={InputPropsMemo} />
    </>
  );
};

const useHooks = (props: IPropsSearchInput) => {
  const { InputProps, onChange, onThrottledChange, ...restProps } = props;
  const InputPropsMemo = useMemo(() => {
    return {
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
      ...InputProps,
    };
  }, [InputProps]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledChange = useCallback(debounce((val: string)=> {
    if (onThrottledChange) {
      onThrottledChange(val)
    }
  }, 500), [onThrottledChange]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (onChange) {
      onChange(event);
    }
    throttledChange(val);
  }, [throttledChange, onChange]);

  return {
    InputPropsMemo,
    restProps,
    handleChange,
  };
};

export default SearchInput;
