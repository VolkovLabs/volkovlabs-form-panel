import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    rootWithBackground: css`
      padding: ${theme.spacing(0.5, 0, 0, 0.5)};
      margin-bottom: ${theme.spacing(0.5)};
    `,
    margin: css`
      margin-top: ${theme.spacing(0.5)};
    `,
  };
};
