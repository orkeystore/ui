import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Grid, makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CodeFormat from 'src/components/CodeFormat';
import CopyBtn from 'src/components/CopyBtn';
import { useContainerPreviewKey } from 'src/containers/KeyPreview/hooks';
import * as keyPreviewSelectors from 'src/containers/KeyPreview/selectors';
import PopMenu, { IMenuItem } from '../PopMenu';
import moment from 'moment';

export interface IPropsKeyPreview {}

const KeyPreview: React.FC<IPropsKeyPreview> = () => {
  const styles = useStyles();

  const {
    availFormats,
    availPrivacy,
    keyData,
    previewParams,
    keyInputRef,
    formatsBtnRef,
    privacyBtnRef,
    targetKey,
    isFormatsMenuOpen,
    isPrivacyMenuOpen,
    handleFormatsMenuClose,
    handleFormatsMenuOpen,
    handlePrivacyMenuClose,
    handlePrivacyMenuOpen,
    handleFormatsMenuItemSelect,
    handlePrivacyMenuItemSelect,
    handleDialogClose,
  } = useHooks();

  if (keyData.error || keyData.data === undefined) {
    return <div>Data error in KeyPreview component</div>;
  }

  if (targetKey === undefined) {
    return <div>Key data unavailable</div>;
  }

  const formatString = previewParams.format?.toUpperCase();
  const privacyString = previewParams.privacy?.toUpperCase();
  const activatesAt = moment.unix(keyData.data.activatesAt).format('LLL');
  const expiresAt = keyData.data.expiresAt && moment.unix(keyData.data.expiresAt).format('LLL');

  return (
    <Paper className={styles.wrap}>
      <PopMenu
        anchorEl={isFormatsMenuOpen ? formatsBtnRef.current : null}
        handleClose={handleFormatsMenuClose}
        onSelectMenuItem={handleFormatsMenuItemSelect}
        menu={availFormats}
      />
      <PopMenu
        anchorEl={isPrivacyMenuOpen ? privacyBtnRef.current : null}
        handleClose={handlePrivacyMenuClose}
        onSelectMenuItem={handlePrivacyMenuItemSelect}
        menu={availPrivacy}
      />
      <Grid container spacing={2}>
        <Grid container item xs={12} alignItems={'center'}>
          <Grid item xs={6}>
            <Typography variant={'h3'}>Key preview</Typography>
          </Grid>
          <Grid container item xs={6} justify={'flex-end'}>
            <Button size={'small'} ref={privacyBtnRef} onClick={handlePrivacyMenuOpen}>
              {privacyString}
            </Button>
            <Button size={'small'} ref={formatsBtnRef} onClick={handleFormatsMenuOpen}>
              {formatString}
            </Button>
            <div className={styles.copyHolder}>
              <textarea readOnly ref={keyInputRef} value={targetKey} className={styles.keyInput} />
              <CopyBtn inputRef={keyInputRef} message={'Key has been copied!'} />
            </div>
          </Grid>
        </Grid>
        <Grid item container xs={12} justify="flex-start" spacing={2}>
          <Grid item>
            <Typography variant="caption">Activates at: {activatesAt}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {expiresAt ? `Expires at: ${expiresAt}` : `No expiration`}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <CodeFormat>{targetKey}</CodeFormat>
        </Grid>
        <Grid item container xs={12} justify={'flex-end'}>
          <Button onClick={handleDialogClose}>Close</Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export const KeyPreviewModal: React.FC<IPropsKeyPreview> = (props) => {
  const { modalState, handleDialogClose } = useHooks();

  return (
    <Dialog open={Boolean(modalState.isOpen)} onClose={handleDialogClose} {...props}>
      <KeyPreview />
    </Dialog>
  );
};

const useHooks = () => {
  const keyData = useSelector(keyPreviewSelectors.details);
  const modalState = useSelector(keyPreviewSelectors.modal);
  const previewParams = useSelector(keyPreviewSelectors.params);
  const availFormats = useSelector(keyPreviewSelectors.availFormats);
  const availPrivacy = useSelector(keyPreviewSelectors.availPrivacy);

  const [isFormatsMenuOpen, toggleFormatsMenu] = useState(false);
  const [isPrivacyMenuOpen, togglePrivacyMenu] = useState(false);

  const { setPreviewParams, toggleModal } = useContainerPreviewKey();

  const handleDialogClose = useCallback(() => {
    toggleModal(false);
  }, [toggleModal]);

  const handleFormatsMenuClose = useCallback(() => {
    toggleFormatsMenu(false);
  }, [toggleFormatsMenu]);

  const handleFormatsMenuOpen = useCallback(() => {
    toggleFormatsMenu(true);
  }, [toggleFormatsMenu]);

  const handlePrivacyMenuClose = useCallback(() => {
    togglePrivacyMenu(false);
  }, [togglePrivacyMenu]);

  const handlePrivacyMenuOpen = useCallback(() => {
    togglePrivacyMenu(true);
  }, [togglePrivacyMenu]);

  const handleFormatsMenuItemSelect = useCallback(
    (item: IMenuItem) => {
      setPreviewParams({ format: item.id as 'jwk' | 'pem' });
    },
    [setPreviewParams],
  );

  const handlePrivacyMenuItemSelect = useCallback(
    (item: IMenuItem) => {
      setPreviewParams({ privacy: item.id as 'private' | 'public' });
    },
    [setPreviewParams],
  );

  const keyInputRef = useRef<HTMLTextAreaElement>(null);
  const formatsBtnRef = useRef<HTMLButtonElement>(null);
  const privacyBtnRef = useRef<HTMLButtonElement>(null);

  const targetKey = useMemo(() => {
    if (keyData.data === undefined) {
      return undefined;
    }

    const { publicKey, privateKey } = keyData.data;
    const isPrivate = previewParams.privacy === 'private';
    const targetKeys = isPrivate ? privateKey : publicKey;

    if (targetKeys === undefined) {
      return undefined;
    }

    switch (previewParams.format) {
      case 'pem':
        return targetKeys.pem;
      default:
        return JSON.stringify(targetKeys.jwk, null, 2);
    }
  }, [keyData.data, previewParams.format, previewParams.privacy]);

  return {
    availFormats,
    availPrivacy,
    isPrivacyMenuOpen,
    isFormatsMenuOpen,
    targetKey,
    modalState,
    keyData,
    previewParams,
    keyInputRef,
    privacyBtnRef,
    formatsBtnRef,
    handleFormatsMenuClose,
    handleFormatsMenuOpen,
    handlePrivacyMenuClose,
    handlePrivacyMenuOpen,
    handleFormatsMenuItemSelect,
    handlePrivacyMenuItemSelect,
    handleDialogClose,
    toggleFormatsMenu,
    togglePrivacyMenu,
    togglePreviewModal: toggleModal,
  };
};

const useStyles = makeStyles(() => {
  return {
    wrap: {
      width: '600px',
      padding: '20px',
    },
    copyHolder: {
      position: 'relative',
    },
    keyInput: {
      position: 'absolute',
      overflow: 'hidden',
      width: 10,
      height: 20,
      left: 15,
      top: 15,
      opacity: 0,
    },
  };
});

export default KeyPreview;
