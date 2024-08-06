import { IconName } from '@grafana/ui';

/**
 * Button Orientations
 */
export const enum ButtonOrientation {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

/**
 * Button Size
 */
export const enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

/**
 * Button Variants
 */
export const enum ButtonVariant {
  CUSTOM = 'custom',
  DESTRUCTIVE = 'destructive',
  HIDDEN = 'hidden',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

/**
 * Button Group Options
 */
export interface ButtonGroupOptions {
  /**
   * Orientation
   *
   * @type {ButtonOrientation}
   */
  orientation: ButtonOrientation;

  /**
   * Size
   *
   * @type {ButtonSize}
   */
  size: ButtonSize;
}

/**
 * Button Options
 */
export interface ButtonOptions {
  /**
   * Variant
   *
   * @type {ButtonVariant}
   */
  variant: ButtonVariant;

  /**
   * Text
   *
   * @type {string}
   */
  text: string;

  /**
   * Icon
   *
   * @type {IconName}
   */
  icon: IconName;

  /**
   * Foreground Color
   *
   * @type {string}
   */
  foregroundColor: string;

  /**
   * Background Color
   *
   * @type {string}
   */
  backgroundColor: string;
}

/**
 * Custom button show
 */
export const enum CustomButtonShow {
  FORM = 'form',
  BOTTOM = 'bottom',
}
