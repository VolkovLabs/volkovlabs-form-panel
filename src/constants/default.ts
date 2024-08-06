import {
  ButtonOptions,
  ButtonSize,
  ButtonVariant,
  CodeLanguage,
  CodeOptions,
  CustomButtonOptions,
  CustomButtonShow,
  FormElement,
  ModalColumnName,
  ModalOptions,
  NumberOptions,
  SelectOptions,
  SliderOptions,
  TextareaOptions,
} from '../types';
import { CODE_EDITOR_CONFIG } from './code-editor';
import { FormElementType, OptionsSource } from './form-element';
import { ConfirmationElementDisplayMode } from './request';

/**
 * Initial Request
 */
export const INITIAL_CODE_DEFAULT = `console.log(context.panel.data, context.panel.response, context.panel.initial, context.panel.elements);

return;

/**
 * Data Source
 * Requires form elements to be defined
 */
const dataQuery = context.utils.toDataQueryResponse(context.panel.response);
console.log(dataQuery);`;

/**
 * Update Request
 */
export const UPDATE_CODE_DEFAULT = `if (context.panel.response) {
  context.grafana.notifySuccess(['Update', 'Values updated successfully.']);
  context.grafana.locationService.reload();
} else {
  context.grafana.notifyError(['Update', 'An error occurred updating values.']);
}`;

/**
 * Reset Request
 */
export const RESET_CODE_DEFAULT = `console.log(context.panel.data, context.panel.response, context.panel.initial, context.panel.elements);`;

/**
 * Initial Payload
 */
export const INITIAL_PAYLOAD_DEFAULT = `return {}`;

/**
 * Update Payload
 */
export const UPDATE_PAYLOAD_DEFAULT = `const payload = {};

context.panel.elements.forEach((element) => {
  if (!element.value) {
    return;
  }

  payload[element.id] = element.value;
})

return payload;`;

/**
 * Initial Request
 */
export const INITIAL_HIGHLIGHT_COLOR_DEFAULT = 'red';

/**
 * Submit Button
 */
export const SUBMIT_BUTTON_DEFAULT: ButtonOptions = {
  icon: 'cloud-upload',
  backgroundColor: 'purple',
  foregroundColor: 'yellow',
  text: 'Submit',
  variant: ButtonVariant.PRIMARY,
};

/**
 * Reset Button
 */
export const RESET_BUTTON_DEFAULT: ButtonOptions = {
  icon: 'process',
  backgroundColor: 'purple',
  foregroundColor: 'yellow',
  text: 'Reset',
  variant: ButtonVariant.HIDDEN,
};

/**
 * Save Default Button
 */
export const SAVE_DEFAULT_BUTTON_DEFAULT: ButtonOptions = {
  icon: 'save',
  backgroundColor: 'purple',
  foregroundColor: 'yellow',
  text: 'Save Default',
  variant: ButtonVariant.HIDDEN,
};

/**
 * Number Defaults
 */
export const NUMBER_DEFAULT: NumberOptions = {
  value: 0,
};

/**
 * Slider Defaults
 */
export const SLIDER_DEFAULT: SliderOptions = {
  min: 0,
  max: 10,
  step: 1,
  value: 0,
};

/**
 * Code Defaults
 */
export const CODE_DEFAULT: CodeOptions = {
  height: CODE_EDITOR_CONFIG.height.min,
  language: CodeLanguage.JAVASCRIPT,
  value: '',
};

/**
 * Textarea Defaults
 */
export const TEXTAREA_DEFAULT: TextareaOptions = {
  rows: 10,
  value: '',
};

/**
 * Select Defaults
 */
export const SELECT_DEFAULT: SelectOptions = {
  options: [],
  optionsSource: OptionsSource.CUSTOM,
};

/**
 * Form Element
 */
export const FORM_ELEMENT_DEFAULT: FormElement = {
  uid: '',
  id: '',
  title: '',
  type: FormElementType.STRING,
  width: null,
  labelWidth: 10,
  tooltip: '',
  section: '',
  hidden: false,
  unit: '',
  value: '',
};

/**
 * Form Element Option
 */
export const FORM_ELEMENT_OPTION_DEFAULT = {
  id: '_',
  type: FormElementType.NUMBER,
  label: '',
  value: '',
};

/**
 * Confirm Modal
 */
export const CONFIRM_MODAL_DEFAULT: ModalOptions = {
  title: 'Confirm update request',
  body: 'Please confirm to update changed values',
  columns: {
    include: [ModalColumnName.NAME, ModalColumnName.OLD_VALUE, ModalColumnName.NEW_VALUE],
    name: 'Label',
    oldValue: 'Old Value',
    newValue: 'New Value',
  },
  confirm: 'Confirm',
  cancel: 'Cancel',
  elementDisplayMode: ConfirmationElementDisplayMode.MODIFIED,
};

/**
 * Custom Button Default
 */
export const CUSTOM_BUTTON_DEFAULT: CustomButtonOptions = {
  customCode: '',
  icon: 'circle',
  size: ButtonSize.MEDIUM,
  show: CustomButtonShow.FORM,
  variant: ButtonVariant.PRIMARY,
  foregroundColor: '',
  backgroundColor: '',
  buttonLabel: 'Button',
};
