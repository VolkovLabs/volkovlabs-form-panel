import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    content: css`
      border: 1px solid ${theme.colors.border.weak};
      padding: ${theme.spacing(1)};
    `,
    item: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    dragHandle: css`
      display: flex;
      margin: ${theme.spacing(0, 0.5)};
    `,
    dragIcon: css`
      cursor: grab;
      color: ${theme.colors.text.disabled};
      &:hover {
        color: ${theme.colors.text};
      }
    `,
    removeButton: css`
      margin-left: ${theme.spacing(1)};
      color: ${theme.colors.text.secondary};
    `,
  };
};
