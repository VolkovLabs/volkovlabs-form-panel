import { InterpolateFunction, PanelData, SelectableValue } from '@grafana/data';

import { FormElementType, OptionsSource } from '../constants';
import { CodeLanguage } from '../types';

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
   * Field Name
   */
  fieldName?: string;

  /**
   * Query Field
   */
  queryField?: QueryField;
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
  options?: SelectableValue[];
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
   */
  accept: string;
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
    | ({ type: FormElementType.FILE } & FileOptions)
  );

/**
 * Get Options Helper
 */
export type GetOptionsHelper = (params: { data: PanelData }) => SelectableValue[];

/**
 * Show If Helper
 */
export type ShowIfHelper = (params: {
  elements: FormElement[];
  replaceVariables: InterpolateFunction;
}) => boolean | undefined;

/**
 * Local Form Element
 */
export type LocalFormElement = FormElement & {
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
     * Get Options Function
     *
     * @type {GetOptionsHelper}
     */
    getOptions: GetOptionsHelper;
  };
};

/**
 * FormElementByType
 */
export type FormElementByType<ElementType, Type> = Extract<ElementType, { type: Type }>;
