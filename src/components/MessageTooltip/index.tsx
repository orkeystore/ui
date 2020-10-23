import React from 'react';
import { Theme, Tooltip, TooltipProps } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 280,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    padding: 20,
  },
}))(Tooltip);

const MessageTooltip: React.FC<TooltipProps> = (props) => {
  return (
    <HtmlTooltip
      {...props}
    />
  );
};

export default MessageTooltip;
