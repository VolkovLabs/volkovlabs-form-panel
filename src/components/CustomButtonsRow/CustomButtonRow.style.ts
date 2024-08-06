import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    row: css`
      display: flex;
      margin-right: ${theme.spacing(1)};
    `,
  };
};
