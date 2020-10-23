import React, { useCallback, useState } from 'react';
import { IconButton, Snackbar, Typography } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Alert } from '@material-ui/lab';

export interface IPropsCopyBtn {
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  message: string;
}

const CopyBtn: React.FC<IPropsCopyBtn> = (props) => {
  const { isCopied, handleCopy, handleCloseSnack } = useHooks(props);

  return (
    <>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        open={isCopied}
        autoHideDuration={1000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          <Typography variant="h6" component={'div'}>
            {props.message}
          </Typography>
        </Alert>
      </Snackbar>
      <IconButton onClick={handleCopy}>
        <FileCopyIcon fontSize={'small'} />
      </IconButton>
    </>
  );
};

const useHooks = (props: IPropsCopyBtn) => {
  const [isCopied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const input = props.inputRef.current;

    if (input) {
      input.select();
      document.execCommand('copy');
      setCopied(true);
    }
  }, [props.inputRef]);

  const handleCloseSnack = useCallback(() => {
    setCopied(false);
  }, []);

  return {
    isCopied,
    setCopied,
    handleCopy,
    handleCloseSnack,
  };
};

export default CopyBtn;
