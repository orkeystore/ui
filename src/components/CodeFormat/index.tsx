import React from 'react';
import { colors, makeStyles } from '@material-ui/core';

export interface IPropsCodeFormat {
  height?: number;
}

const CodeFormat: React.FC<IPropsCodeFormat> = (props) => {
  const styles = useStyles(props)();
  return (
      <pre className={styles.pre}><code className={styles.code}>{props.children}</code></pre>
  );
};

const useStyles = (props: IPropsCodeFormat) => makeStyles(() => {
  return {
    root: {
      padding: '5px 0',
    },
    pre: {
      display: 'block',
      overflowX: 'auto',
      height: () => props.height !== undefined ? props.height : 'auto',
      whiteSpace: 'pre',
      padding: '15px 20px',
      background: colors.grey[100],
    },
    code: {
      background: 'none',
    }
  }
})

export default CodeFormat;
