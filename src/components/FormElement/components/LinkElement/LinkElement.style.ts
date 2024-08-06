import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    link: css`
      min-height: ${theme.spacing(4)};
      display: flex;
      align-items: center;
    `,
  };
};
