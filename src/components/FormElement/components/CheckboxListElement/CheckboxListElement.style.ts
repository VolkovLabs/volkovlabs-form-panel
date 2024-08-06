import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    checkboxWrap: css`
      width: 100%;
      & > div {
        flex: auto;
      }
    `,
    checkboxRow: css`
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      align-items: flex-start;
    `,
    checkbox: css`
      padding: ${theme.spacing(1)};
      background: unset !important;
    `,
  };
};
