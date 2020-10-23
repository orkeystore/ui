import {
  Grid,
  InputAdornment,
  InputProps,
  Link,
  TextField,
  TextFieldProps,
  Typography,
} from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { useRef } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import CodeFormat from 'src/components/CodeFormat';
import TextFieldWithOptions from 'src/components/TextFieldWithOptions';
import { privateHostSelector } from 'src/containers/Session/selectors';
import CopyBtn from 'src/components/CopyBtn';
import { makeStyles } from '@material-ui/styles';
import { useContainerPreviewKey } from 'src/containers/KeyPreview/hooks';

export interface IPrivateKeyItem {
  accessCode: string;
  code: string;
  id: number;
}

export interface IPropsPrivateUrls {
  item: IPrivateKeyItem;
}

export interface IKeyFormat {
  id: 'jwk' | 'pem' | 'jwks';
  label: string;
}

export const KEY_FORMATS: IKeyFormat[] = [
  { id: 'jwk', label: 'JWK' },
  { id: 'jwks', label: 'JWKs' },
  { id: 'pem', label: 'PEM' },
];

const PrivateUrls: React.FC<IPropsPrivateUrls> = (props) => {
  const {
    fieldProps,
    inputProps,
    format,
    targetUrl,
    urlRef,
    accessRef,
    handleSetFormat,
    handleOpenPreviewModal,
    handleFocus,
  } = useHooks(props);
  const styles = useStyles();

  const { item } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Access key"
          variant="outlined"
          value={item.accessCode}
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
        <TextFieldWithOptions
          menu={KEY_FORMATS}
          currentMenuLabel={format.label}
          onSelectMenuItem={handleSetFormat}
          fieldProps={fieldProps}
          inputProps={inputProps}
          afterOptions={<CopyBtn inputRef={urlRef} message={`URL has been copied!`} />}
        />
      </Grid>
      {item.accessCode && (
        <Grid item xs={12}>
          <div className={styles.exampleMessage}>
            <Typography>Key can be fetched via POST with access code.</Typography>
            <Link onClick={handleOpenPreviewModal}>Preview</Link>
          </div>
          <CodeFormat>
            {`curl -d '{ "accessToken":"${item.accessCode}" }' -H "Content-Type: application/json" -X POST ${targetUrl}`}
          </CodeFormat>
        </Grid>
      )}
    </Grid>
  );
};

const useHooks = (props: IPropsPrivateUrls) => {
  const [formatId, setFormat] = useState<'jwk' | 'jwks' | 'pem'>(KEY_FORMATS[0].id);
  const { openKeyPreview } = useContainerPreviewKey();

  const format = useMemo(() => {
    return KEY_FORMATS.find((i) => i.id === formatId) || KEY_FORMATS[0];
  }, [formatId]);

  const keysHost = useSelector(privateHostSelector) || '';

  const urlRef = useRef<HTMLInputElement>(null);
  const accessRef = useRef<HTMLInputElement>(null);

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = useCallback((event) => {
    event.target.select();
  }, []);

  const fieldProps: TextFieldProps = useMemo(() => {
    return {
      label: 'Target URL',
      onFocus: handleFocus,
    };
  }, [handleFocus]);

  const targetUrl = useMemo(() => {
    return `${keysHost}/entry/private/${format.id}/${props.item.code}`;
  }, [keysHost, format.id, props.item.code]);

  const inputProps: InputProps = useMemo(() => {
    return {
      value: targetUrl,
      inputRef: urlRef,
    };
  }, [targetUrl]);

  const handleSetFormat = useCallback(
    (i: { id: string | number }) => {
      if (typeof i.id === 'string' && ['jwk', 'jwks', 'pem'].includes(i.id)) {
        setFormat(i.id as 'jwk' | 'jwks' | 'pem');
      }
    },
    [setFormat],
  );

  const handleOpenPreviewModal = useCallback(() => {
    return openKeyPreview(
      { id: props.item.id, isByEntry: true },
      { privacy: 'private', format: formatId },
    );
  }, [openKeyPreview, props.item.id, formatId]);

  return {
    keysHost,
    inputProps,
    formatId,
    fieldProps,
    format,
    targetUrl,
    urlRef,
    accessRef,
    setFormat,
    handleFocus,
    handleSetFormat,
    handleOpenPreviewModal,
  };
};

const useStyles = makeStyles(() => {
  return {
    exampleMessage: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
});

export default PrivateUrls;
