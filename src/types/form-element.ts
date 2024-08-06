import { DataQueryResponse, IconName, InterpolateFunction, PanelData, SelectableValue } from '@grafana/data';
import { FetchResponse } from '@grafana/runtime';

import { FormElementType, OptionsSource } from '../constants';
import { ButtonSize, ButtonVariant, CodeLanguage } from '../types';

/**
 * Query Field
 */
export type QueryField = SelectableValue<string> & {
  refId?: string;
};

/**
 * Form Element Base
 */
export interface FormElementBase {
  /**
   * Uid
   *
   * @type {string}
   */
  uid: string;

  /**
   * Id
   *
   * @type {string}
   */
  id: string;

  /**
   * Title
   *
   * @type {string}
   */
  title: string;

  /**
   * Type
   *
   * @type {FormElementType}
   */
  type: FormElementType;

  /**
   * Label Width
   *
   * @type {number | null}
   */
  labelWidth: number | null;

  /**
   * Width
   *
   * @type {number | null}
   */
  width: number | null;

  /**
   * Tooltip
   *
   * @type {string}
   */
  tooltip: string;

  /**
   * Section's Name
   *
   * @type {string}
   */
  section: string;

  /**
   * Unit
   *
   * @type {string}
   */
  unit: string;

  /**
   * Value
   *
   * @type {unknown}
   */
  value?: unknown;

  /**
   * Show If
   *
   * @type {string}
   */
  showIf?: string;

  /**
   * Disable If
   *
   * @type {string}
   */
  disableIf?: string;

  /**
   * Field Name
   *
   * @type {string}
   */
  fieldName?: string;

  /**
   * Query Field
   *
   * @type {QueryField}
   */
  queryField?: QueryField;

  /**
   * Background
   *
   * @type {string}
   */
  background?: string;

  /**
   * Label Background
   *
   * @type {string}
   */
  labelBackground?: string;

  /**
   * Label Color
   *
   * @type {string}
   */
  labelColor?: string;
}

/**
 * String Options
 */
export interface StringOptions {
  /**
   * Hidden
   *
   * @type {boolean}
   */
  hidden: boolean;

  /**
   * Value
   *
   * @type {string}
   */
  value: string;
}

/**
 * Code Options
 */
export interface CodeOptions {
  /**
   * Height
   *
   * @type {number}
   */
  height: number;

  /**
   * Language
   *
   * @type {CodeLanguage}
   */
  language: CodeLanguage;

  /**
   * Value
   *
   * @type {string}
   */
  value: string;
}

/**
 * Slider Options
 */
export interface SliderOptions {
  /**
   * Maximum Value
   *
   * @type {number}
   */
  max: number;

  /**
   * Minimum Value
   *
   * @type {number}
   */
  min: number;

  /**
   * Step
   *
   * @type {number}
   */
  step: number;

  /**
   * Value
   *
   * @type {number}
   */
  value: number;
}

/**
 * Number Options
 */
export interface NumberOptions {
  /**
   * Maximum Value
   *
   * @type {number}
   */
  max?: number;

  /**
   * Minimum Value
   *
   * @type {number}
   */
  min?: number;

  /**
   * Value
   *
   * @type {number | null}
   */
  value: number | null;
}

/**
 * Textarea Options
 */
export interface TextareaOptions {
  /**
   * Rows
   *
   * @type {number}
   */
  rows: number;

  /**
   * Value
   *
   * @type {string}
   */
  value: string;
}

/**
 * Time Options
 */
export interface TimeOptions {
  /**
   * Value
   *
   * @type {string}
   */
  value?: string;
}

/**
 * Query Options Mapper
 */
export interface QueryOptionsMapper {
  /**
   * Source
   */
  source: string;

  /**
   * Value Field
   *
   * @type {string}
   */
  value: string;

  /**
   * Label Field
   *
   * @type {string}
   */
  label: string | null;
}

/**
 * Select Options
 */
export interface SelectOptions {
  /**
   * Source
   *
   * @type {OptionsSource}
   */
  optionsSource: OptionsSource;

  /**
   * Options Mapper
   */
  queryOptions?: QueryOptionsMapper;

  /**
   * Options
   *
   * @type {SelectableValue[]}
   */
  options: SelectableValue[];

  /**
   * Get Options
   *
   * @type {string}
   */
  getOptions?: string;
}

/**
 * Date Time Options
 */
export interface DateTimeOptions {
  /**
   * Min Date
   *
   * @type {string}
   */
  min?: string;

  /**
   * Max Date
   *
   * @type {string}
   */
  max?: string;

  /**
   * Value
   *
   * @type {string}
   */
  value?: string;

  /**
   * Is Transfrom to UTC
   *
   * @type {boolean}
   */
  isUseLocalTime: boolean;
}

/**
 * File Options
 */
export interface FileOptions {
  /**
   * Value
   *
   * @type {File[] | null}
   */
  value: File[] | null;

  /**
   * Accept
   *
   * @type {string}
   */
  accept: string;

  /**
   * Multiple files
   *
   * @type {boolean}
   */
  multiple: boolean;
}

/**
 * Password Options
 */
export interface PasswordOptions {
  /**
   * Value
   *
   * @type {string}
   */
  value: string;
}

/**
 * Boolean Options
 */
export interface BooleanOptions {
  /**
   * Value
   *
   * @type {boolean}
   */
  value: boolean;
}

/**
 * Custom Button Options
 */
export interface CustomButtonOptions {
  /**
   * Custom Code
   *
   * @type {string}
   */
  customCode: string;

  /**
   * Title
   *
   * @type {string}
   */
  title?: string;

  /**
   * Icon
   *
   * @type {IconName}
   */
  icon: IconName;

  /**
   * Size
   *
   * @type {ButtonSize}
   */
  size: ButtonSize;

  /**
   * Show
   *
   * @type {string}
   */
  show: string;

  /**
   * Variant
   *
   * @type {ButtonVariant}
   */
  variant: ButtonVariant;

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

  /**
   * Button label
   *
   * @type {string}
   */
  buttonLabel: string;
}

/**
 * Secret Options
 */
export interface SecretOptions {
  /**
   * Value
   *
   * @type {string}
   */
  value: string;
}

/**
 * Link Target
 */
export enum LinkTarget {
  NEW_TAB = '_blank',
  SELF_TAB = '_self',
}

/**
 * Link Options
 */
export interface LinkOptions {
  /**
   * Value
   *
   * @type {string}
   */
  value: string;

  /**
   * Target
   *
   * @type {LinkTarget}
   */
  target: LinkTarget;

  /**
   * Link Text
   *
   * @type {string}
   */
  linkText: string;
}

/**
 * Checkbox List Options
 */
export interface CheckboxListOptions extends SelectOptions {
  /**
   * Value
   *
   * @type {unknown[]}
   */
  value: unknown[];
}

/**
 * Form Element
 */
export type FormElement = FormElementBase &
  (
    | ({ type: FormElementType.STRING } & StringOptions)
    | ({ type: FormElementType.CODE } & CodeOptions)
    | ({ type: FormElementType.SLIDER } & SliderOptions)
    | ({ type: FormElementType.NUMBER } & NumberOptions)
    | ({ type: FormElementType.TEXTAREA } & TextareaOptions)
    | ({ type: FormElementType.SELECT } & SelectOptions)
    | ({ type: FormElementType.MULTISELECT } & SelectOptions)
    | ({ type: FormElementType.RADIO } & SelectOptions)
    | ({ type: FormElementType.DISABLED } & SelectOptions)
    | ({ type: FormElementType.DISABLED_TEXTAREA } & TextareaOptions)
    | ({ type: FormElementType.PASSWORD } & PasswordOptions)
    | ({ type: FormElementType.DATETIME } & DateTimeOptions)
    | ({ type: FormElementType.SECRET } & SecretOptions)
    | ({ type: FormElementType.BOOLEAN } & BooleanOptions)
    | ({ type: FormElementType.CUSTOM_BUTTON } & CustomButtonOptions)
    | ({ type: FormElementType.FILE } & FileOptions)
    | ({ type: FormElementType.LINK } & LinkOptions)
    | ({ type: FormElementType.CHECKBOX_LIST } & CheckboxListOptions)
    | ({ type: FormElementType.TIME } & TimeOptions)
  );

/**
 * Get Options Helper
 */
export type GetOptionsHelper = (params: {
  data: PanelData;
  elements: LocalFormElement[];
  replaceVariables: InterpolateFunction;
}) => SelectableValue[];

/**
 * Show If Helper
 */
export type ShowIfHelper = (params: {
  elements: FormElement[];
  replaceVariables: InterpolateFunction;
}) => boolean | undefined;

/**
 * Disable If Helper
 */
export type DisableIfHelper = (params: {
  elements: FormElement[];
  replaceVariables: InterpolateFunction;
}) => boolean | undefined;

/**
 * Local Form Element
 */
export type LocalFormElement = FormElement & {
  /**
   * Disabled
   */
  disabled?: boolean;

  /**
   * Helpers
   */
  helpers: {
    /**
     * Show If Function
     *
     * @type {ShowIfHelper}
     */
    showIf: ShowIfHelper;

    /**
     * Disable If Function
     *
     * @type {DisableIfHelper}
     */
    disableIf: DisableIfHelper;

    /**
     * Get Options Function
     *
     * @type {GetOptionsHelper}
     */
    getOptions: GetOptionsHelper;
  };
};

/**
 * Form Element By Type
 */
export type FormElementByType<TElement, TType> = Extract<TElement, { type: TType }>;

/**
 * Execute Custom Code Params
 */
export type ExecuteCustomCodeParams = {
  /**
   * Code
   *
   * @type {string}
   */
  code: string;

  /**
   * Initial
   *
   * @type {unknown}
   */
  initial: unknown;

  /**
   * Response
   *
   * @type {FetchResponse | Response | DataQueryResponse | null}
   */
  response?: FetchResponse | Response | DataQueryResponse | null;

  /**
   * Initial Request
   *
   */
  initialRequest?: () => Promise<void>;

  /**
   * Current Elements
   *
   * @type {LocalFormElement[]}
   */
  currentElements?: LocalFormElement[];
};
