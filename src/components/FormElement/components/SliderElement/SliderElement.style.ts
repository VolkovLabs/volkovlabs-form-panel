import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    slider: css`
      .rc-slider {
        margin: 10px 0 0 0;
      }
      .rc-slider-mark-text {
        color: ${theme.colors.text.disabled};
        font-size: ${theme.typography.bodySmall.fontSize};
      }
      .rc-slider-mark-text-active {
        color: ${theme.colors.text.primary};
      }
      .rc-slider-handle {
        border: none;
        background-color: ${theme.colors.primary.main};
        box-shadow: ${theme.shadows.z1};
        cursor: pointer;
      }
      .rc-slider-handle:hover,
      .rc-slider-handle:active,
      .rc-slider-handle:focus,
      .rc-slider-handle-click-focused:focus,
      .rc-slider-dot-active {
        ${`box-shadow: 0px 0px 0px 6px ${theme.colors.primary.transparent}`};
      }
      .rc-slider-track {
        background-color: ${theme.colors.primary.main};
      }
      .rc-slider-rail {
        background-color: ${theme.colors.border.strong};
        cursor: pointer;
      }
    `,
    sliderInput: css`
      margin-left: 15px;
    `,
  };
};
