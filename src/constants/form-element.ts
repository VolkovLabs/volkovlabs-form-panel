import { SelectableValue } from '@grafana/data';
import { getAvailableIcons } from '@grafana/ui';

import { ButtonSize, ButtonVariant, CustomButtonShow, LinkTarget } from '../types';
import { TEST_IDS } from './tests';

/**
 * Form Element Type
 */
export const enum FormElementType {
  BOOLEAN = 'boolean',
  CODE = 'code',
  CUSTOM_BUTTON = 'Custom button',
  DATETIME = 'datetime',
  DISABLED = 'disabled',
  DISABLED_TEXTAREA = 'disabledTextarea',
  FILE = 'file',
  LINK = 'link',
  MULTISELECT = 'multiselect',
  NUMBER = 'number',
  PASSWORD = 'password',
  RADIO = 'radio',
  SECRET = 'secret',
  SELECT = 'select',
  SLIDER = 'slider',
  STRING = 'string',
  TEXTAREA = 'textarea',
  TIME = 'time',
  CHECKBOX_LIST = 'checkboxList',
}

/**
 * Form Element Type Options
 */
export const FORM_ELEMENT_TYPE_OPTIONS: SelectableValue[] = [
  {
    value: FormElementType.CHECKBOX_LIST,
    label: 'Checkbox list with custom options',
  },
  {
    value: FormElementType.CODE,
    label: 'Code Editor',
  },
  {
    value: FormElementType.CUSTOM_BUTTON,
    label: 'Custom Button',
  },
  {
    value: FormElementType.DATETIME,
    label: 'Date and time',
  },
  {
    value: FormElementType.FILE,
    label: 'File',
  },
  {
    value: FormElementType.LINK,
    label: 'Link',
  },
  {
    value: FormElementType.MULTISELECT,
    label: 'Multi select with custom options',
  },
  {
    value: FormElementType.NUMBER,
    label: 'Number input',
  },
  {
    value: FormElementType.SLIDER,
    label: 'Number slider',
  },
  {
    value: FormElementType.PASSWORD,
    label: 'Password input',
  },
  {
    value: FormElementType.BOOLEAN,
    label: 'Radio group with boolean options',
  },
  {
    value: FormElementType.RADIO,
    label: 'Radio group with custom options',
  },
  {
    value: FormElementType.DISABLED,
    label: 'Read-only',
  },
  {
    value: FormElementType.DISABLED_TEXTAREA,
    label: 'Read-only text area',
  },
  {
    value: FormElementType.SELECT,
    label: 'Select with custom options',
  },
  {
    value: FormElementType.STRING,
    label: 'String input',
  },
  {
    value: FormElementType.TEXTAREA,
    label: 'Text area',
  },
  {
    value: FormElementType.TIME,
    label: 'Time',
  },
];

/**
 * Boolean Element Options
 */
export const BOOLEAN_ELEMENT_OPTIONS: SelectableValue[] = [
  {
    ariaLabel: TEST_IDS.formElements.booleanOption('true'),
    value: true,
    label: 'True',
  },
  {
    ariaLabel: TEST_IDS.formElements.booleanOption('false'),
    value: false,
    label: 'False',
  },
];

/**
 * Select and Radio Type Options
 */
export const SELECT_ELEMENT_OPTIONS: SelectableValue[] = [
  {
    value: FormElementType.NUMBER,
    label: 'Number',
  },
  {
    value: FormElementType.STRING,
    label: 'String',
  },
];

/**
 * Options to Hide String element
 */
export const STRING_ELEMENT_OPTIONS: SelectableValue[] = [
  {
    ariaLabel: TEST_IDS.formElementsEditor.radioOption('visibility-display'),
    description: 'Display',
    icon: 'eye',
    value: false,
  },
  {
    ariaLabel: TEST_IDS.formElementsEditor.radioOption('visibility-hidden'),
    description: 'Hidden',
    icon: 'eye-slash',
    value: true,
  },
];

/**
 * Options to Hide String element
 */
export const TIME_TRANSFORMATION_OPTIONS: SelectableValue[] = [
  {
    ariaLabel: TEST_IDS.formElementsEditor.timeTransformationOption('time-utc'),
    description: 'UTC',
    label: 'UTC',
    value: false,
  },
  {
    ariaLabel: TEST_IDS.formElementsEditor.timeTransformationOption('time-local'),
    description: 'Local',
    label: 'Local',
    value: true,
  },
];

/**
 * Auto Save timeout ms
 */
export const AUTO_SAVE_TIMEOUT = 1000;

/**
 * Loading Mode
 */
export enum LoadingMode {
  NONE = '',
  INITIAL = 'initial',
  UPDATE = 'update',
  RESET = 'reset',
}

/**
 * Icon Options
 */
export const ICON_OPTIONS = getAvailableIcons().map((name) => ({
  label: name,
  value: name,
  icon: name,
}));

/**
 * Options Source
 */
export enum OptionsSource {
  QUERY = 'Query',
  CUSTOM = 'Custom',
  CODE = 'Code',
}

/**
 * Options Source Options
 */
export const OPTIONS_SOURCE_OPTIONS = [
  {
    label: 'Query',
    value: OptionsSource.QUERY,
    ariaLabel: TEST_IDS.formElementsEditor.optionsSourceOption(OptionsSource.QUERY),
  },
  {
    label: 'Custom',
    value: OptionsSource.CUSTOM,
    ariaLabel: TEST_IDS.formElementsEditor.optionsSourceOption(OptionsSource.CUSTOM),
    icon: 'keyboard',
  },
  {
    label: 'Code',
    value: OptionsSource.CODE,
    ariaLabel: TEST_IDS.formElementsEditor.optionsSourceOption(OptionsSource.CODE),
    icon: 'calculator-alt',
  },
];

/**
 * Link Target Options
 */
export const LINK_TARGET_OPTIONS = [
  {
    label: 'Same Tab',
    value: LinkTarget.SELF_TAB,
    ariaLabel: TEST_IDS.formElementsEditor.linkTargetOption(LinkTarget.SELF_TAB),
  },
  {
    label: 'New Tab',
    value: LinkTarget.NEW_TAB,
    ariaLabel: TEST_IDS.formElementsEditor.linkTargetOption(LinkTarget.NEW_TAB),
    icon: 'external-link-alt',
  },
];

/**
 * Show Custom Button Options
 */
export const SHOW_CUSTOM_BUTTON_OPTIONS: SelectableValue[] = [
  {
    ariaLabel: TEST_IDS.formElementsEditor.customButtonPlaceOption('form'),
    value: CustomButtonShow.FORM,
    label: 'In Line',
  },
  {
    ariaLabel: TEST_IDS.formElementsEditor.customButtonPlaceOption('bottom'),
    value: CustomButtonShow.BOTTOM,
    label: 'Footer',
  },
];

/**
 * Custom Button Size Options
 */
export const CUSTOM_BUTTON_SIZE_OPTIONS: SelectableValue[] = [
  {
    ariaLabel: TEST_IDS.formElementsEditor.customButtonSizeOption('sm'),
    value: ButtonSize.SMALL,
    label: 'Small',
  },
  {
    ariaLabel: TEST_IDS.formElementsEditor.customButtonSizeOption('md'),
    value: ButtonSize.MEDIUM,
    label: 'Medium',
  },
  {
    ariaLabel: TEST_IDS.formElementsEditor.customButtonSizeOption('lg'),
    value: ButtonSize.LARGE,
    label: 'Large',
  },
];

/**
 * Custom Button Variant
 */
export const CUSTOM_BUTTON_VARIANT_OPTIONS: SelectableValue[] = [
  {
    ariaLabel: TEST_IDS.formElementsEditor.customButtonVariantOption('primary'),
    value: ButtonVariant.PRIMARY,
    label: 'Primary',
  },
  {
    ariaLabel: TEST_IDS.formElementsEditor.customButtonVariantOption('secondary'),
    value: ButtonVariant.SECONDARY,
    label: 'Secondary',
  },
  {
    ariaLabel: TEST_IDS.formElementsEditor.customButtonVariantOption('destructive'),
    value: ButtonVariant.DESTRUCTIVE,
    label: 'Destructive',
  },
  {
    ariaLabel: TEST_IDS.formElementsEditor.customButtonVariantOption('custom'),
    value: ButtonVariant.CUSTOM,
    label: 'Custom',
  },
];
