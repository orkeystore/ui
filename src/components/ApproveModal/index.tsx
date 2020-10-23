import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, DialogTitle, Typography } from '@material-ui/core';

export interface IPropsApproveModal {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onSubmit?: () => void;
}

export const ApproveModal: React.FC<IPropsApproveModal> = (props) => {
  const [isOpen, toggleDialog] = useState(false);
  const { onSubmit } = props;
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
    toggleDialog(false);
  }

  return (
    <>
      <Dialog open={isOpen} onClose={() => toggleDialog(false)}>
        { props.title &&
          <DialogTitle>
            <Typography variant={'h4'} component={'div'}>{ props.title }</Typography>
          </DialogTitle>
        }
        { props.content &&
          <DialogContent>{ props.content }</DialogContent>
        }
        <DialogActions>
          <Button onClick={() => toggleDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <div onClick={() => toggleDialog(true)}>{props.children}</div>
    </>
  );
};

export default ApproveModal;
