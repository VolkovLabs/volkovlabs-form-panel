import { SelectableValue } from '@grafana/data';

/**
 * Layout Variants
 */
export const enum LayoutVariant {
  NONE = 'none',
  SINGLE = 'single',
  SPLIT = 'split',
}

/**
 * Layout Orientation
 */
export const enum LayoutOrientation {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

/**
 * Layout Variant Options
 */
export const LAYOUT_VARIANT_OPTIONS: SelectableValue[] = [
  {
    value: LayoutVariant.SINGLE,
    description: 'All elements together.',
    label: 'Basic',
  },
  {
    value: LayoutVariant.NONE,
    description: 'Buttons only.',
    label: 'Buttons only',
  },
  {
    value: LayoutVariant.SPLIT,
    description: 'Elements split in separate sections.',
    label: 'Sections',
    icon: 'columns',
  },
];

/**
 * Layout Orientation Options
 */
export const LAYOUT_ORIENTATION_OPTIONS: SelectableValue[] = [
  {
    value: LayoutOrientation.HORIZONTAL,
    description: 'Horizontal Orientation',
    label: 'Horizontal',
  },
  {
    value: LayoutOrientation.VERTICAL,
    description: 'Vertical Orientation',
    label: 'Vertical',
  },
];
