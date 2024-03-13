import { PanelPlugin, SelectableValue } from '@grafana/data';
import { getAvailableIcons } from '@grafana/ui';

import {
  CustomCodeEditor,
  DatasourceEditor,
  DatasourcePayloadEditor,
  FormElementsEditor,
  FormPanel,
  HeaderParametersEditor,
  LayoutSectionsEditor,
} from './components';
import {
  BOOLEAN_OPTIONS,
  BUTTON_ORIENTATION_OPTIONS,
  BUTTON_SIZE_OPTIONS,
  BUTTON_VARIANT_HIDDEN_OPTIONS,
  BUTTON_VARIANT_OPTIONS,
  CONFIRM_MODAL_COLUMNS_INCLUDE_OPTIONS,
  CONFIRM_MODAL_DEFAULT,
  CONTENT_TYPE_OPTIONS,
  ContentType,
  DATA_SYNC_OPTIONS,
  INITIAL_CODE_DEFAULT,
  INITIAL_HIGHLIGHT_COLOR_DEFAULT,
  INITIAL_PAYLOAD_DEFAULT,
  INITIAL_REQUEST_METHOD_OPTIONS,
  LAYOUT_ORIENTATION_OPTIONS,
  LAYOUT_VARIANT_OPTIONS,
  LayoutOrientation,
  LayoutVariant,
  PAYLOAD_MODE_OPTIONS,
  PayloadMode,
  RequestMethod,
  RESET_ACTION_OPTIONS,
  RESET_BUTTON_DEFAULT,
  RESET_CODE_DEFAULT,
  ResetActionMode,
  SAVE_DEFAULT_BUTTON_DEFAULT,
  SUBMIT_BUTTON_DEFAULT,
  UPDATE_CODE_DEFAULT,
  UPDATE_ENABLED_OPTIONS,
  UPDATE_PAYLOAD_DEFAULT,
  UPDATE_REQUEST_METHOD_OPTIONS,
} from './constants';
import { getMigratedOptions } from './migration';
import {
  ButtonOrientation,
  ButtonSize,
  ButtonVariant,
  CodeEditorType,
  ModalColumnName,
  PanelOptions,
  RequestOptions,
  UpdateEnabledMode,
} from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(FormPanel)
  .setNoPadding()
  .setMigrationHandler(getMigratedOptions)
  .setPanelOptions((builder) => {
    /**
     * Is Request Configured
     * @param request
     */
    const isRequestConfigured = (request: RequestOptions) => {
      return request.method !== RequestMethod.NONE;
    };

    /**
     * Is Rest API Request
     * @param request
     */
    const isRestApiRequest = (request: RequestOptions) => {
      return (
        request.method !== RequestMethod.NONE &&
        request.method !== RequestMethod.DATASOURCE &&
        request.method !== RequestMethod.QUERY
      );
    };

    /**
     * Layout
     */
    builder
      .addRadio({
        path: 'layout.variant',
        name: 'Layout',
        category: ['Layout'],
        settings: {
          options: LAYOUT_VARIANT_OPTIONS,
        },
        defaultValue: LayoutVariant.SINGLE,
      })
      .addSliderInput({
        path: 'layout.padding',
        name: 'Padding',
        category: ['Layout'],
        defaultValue: 10,
        settings: {
          min: 0,
          max: 20,
        },
      });

    /**
     * Sections
     */
    builder
      .addCustomEditor({
        id: 'layout.sections',
        path: 'layout.sections',
        name: 'Sections',
        category: ['Sections'],
        editor: LayoutSectionsEditor,
        showIf: (config) => config.layout.variant === LayoutVariant.SPLIT,
      })
      .addRadio({
        path: 'layout.orientation',
        name: 'Orientation',
        category: ['Sections'],
        settings: {
          options: LAYOUT_ORIENTATION_OPTIONS,
        },
        defaultValue: LayoutOrientation.HORIZONTAL,
        showIf: (config) => config.layout.variant === LayoutVariant.SPLIT,
      });

    /**
     * Elements
     */
    builder.addCustomEditor({
      id: 'elements',
      path: 'elements',
      name: 'Form Elements',
      category: ['Form Elements'],
      description: 'Form Elements',
      editor: FormElementsEditor,
      showIf: (config) => config.layout.variant !== LayoutVariant.NONE,
    });

    /**
     * Element value changed
     */
    builder.addCustomEditor({
      id: 'elementValueChanged',
      path: 'elementValueChanged',
      name: 'Element Value Changed',
      category: ['Form Events'],
      description: 'Code to run when element value changed',
      editor: CustomCodeEditor,
      settings: {
        type: CodeEditorType.ELEMENT_VALUE_CHANGED,
        variablesSuggestions: true,
      },
      showIf: (config) => config.layout.variant !== LayoutVariant.NONE,
      defaultValue: '',
    });

    /**
     * Initial Request
     */
    builder
      .addRadio({
        path: 'sync',
        name: 'Synchronize with data',
        description: 'Keeps the panel synched with the dashboard updates.',
        category: ['Initial Request'],
        settings: {
          options: DATA_SYNC_OPTIONS,
        },
        defaultValue: true,
      })
      .addRadio({
        path: 'initial.method',
        name: 'Initial Action',
        category: ['Initial Request'],
        settings: {
          options: INITIAL_REQUEST_METHOD_OPTIONS,
        },
        defaultValue: RequestMethod.NONE,
      })
      .addTextInput({
        path: 'initial.url',
        name: 'URL',
        category: ['Initial Request'],
        description: 'The URL to call. Leave empty to skip Initial Request.',
        settings: {
          placeholder: 'http://',
        },
        showIf: (config) => isRestApiRequest(config.initial),
      })
      .addCustomEditor({
        id: 'initial.header',
        path: 'initial.header',
        name: 'Header Parameters',
        category: ['Initial Request'],
        editor: HeaderParametersEditor,
        showIf: (config) => isRestApiRequest(config.initial),
      })
      .addCustomEditor({
        id: 'initial.datasource',
        path: 'initial.datasource',
        name: 'Data Source',
        category: ['Initial Request'],
        editor: DatasourceEditor,
        showIf: (config) => config.initial.method === RequestMethod.DATASOURCE,
      })
      .addSelect({
        path: 'initial.contentType',
        name: 'Content-Type',
        category: ['Initial Request'],
        description: 'Content-Type of the payload.',
        defaultValue: ContentType.JSON,
        settings: {
          allowCustomValue: true,
          options: CONTENT_TYPE_OPTIONS,
        },
        showIf: (config) => config.initial.method === RequestMethod.POST,
      })
      .addCustomEditor({
        id: 'initial.code',
        path: 'initial.code',
        name: 'Custom Code',
        description: 'Custom code to execute initial request.',
        editor: CustomCodeEditor,
        category: ['Initial Request'],
        settings: {
          type: CodeEditorType.REQUEST,
          variablesSuggestions: true,
        },
        defaultValue: INITIAL_CODE_DEFAULT,
        showIf: (config) => !isRequestConfigured(config.initial),
      })
      .addCustomEditor({
        id: 'initial.code',
        path: 'initial.code',
        name: 'Custom Code',
        description: 'Custom code to execute after initial request.',
        editor: CustomCodeEditor,
        category: ['Initial Request'],
        settings: {
          type: CodeEditorType.REQUEST,
          variablesSuggestions: true,
        },
        defaultValue: INITIAL_CODE_DEFAULT,
        showIf: (config) => isRequestConfigured(config.initial),
      });

    /**
     * Initial Payload For Data Source
     */
    builder
      .addCustomEditor({
        id: 'initial.getPayload',
        path: 'initial.getPayload',
        name: 'Create Payload',
        description: 'Custom code to create payload for the initial data source request.',
        editor: CustomCodeEditor,
        category: ['Initial Request Payload'],
        settings: {
          type: CodeEditorType.GET_PAYLOAD,
          variablesSuggestions: true,
        },
        defaultValue: INITIAL_PAYLOAD_DEFAULT,
        showIf: (config) => config.initial.method === RequestMethod.DATASOURCE && !!config.initial.datasource,
      })
      .addCustomEditor({
        id: 'initial.payload',
        path: 'initial.payload',
        name: 'Query Editor',
        description: 'Configure query for the selected data source. ${payload} variable contains all passed values.',
        editor: DatasourcePayloadEditor,
        category: ['Initial Request Payload'],
        settings: {
          datasourceKey: 'initial.datasource',
        },
        defaultValue: {},
        showIf: (config) => config.initial.method === RequestMethod.DATASOURCE && !!config.initial.datasource,
      });

    /**
     * Highlight
     */
    builder
      .addRadio({
        path: 'initial.highlight',
        name: 'Highlight Changes',
        description: 'Some elements are not supporting highlighting.',
        category: ['Highlight Changes'],
        settings: {
          options: BOOLEAN_OPTIONS,
        },
        defaultValue: false,
        showIf: (config) => config.layout.variant !== LayoutVariant.NONE,
      })
      .addColorPicker({
        path: 'initial.highlightColor',
        name: 'Color',
        category: ['Highlight Changes'],
        defaultValue: INITIAL_HIGHLIGHT_COLOR_DEFAULT,
        settings: {
          disableNamedColors: true,
        },
        showIf: (config) => config.initial.highlight && config.layout.variant !== LayoutVariant.NONE,
      });

    /**
     * Update Request
     */
    builder
      .addRadio({
        path: 'updateEnabled',
        name: 'Enable Update',
        category: ['Update Request'],
        settings: {
          options: UPDATE_ENABLED_OPTIONS,
        },
        defaultValue: UpdateEnabledMode.AUTO,
      })
      .addRadio({
        path: 'update.method',
        name: 'Update Action',
        category: ['Update Request'],
        settings: {
          options: UPDATE_REQUEST_METHOD_OPTIONS,
        },
        defaultValue: RequestMethod.NONE,
      })
      .addTextInput({
        path: 'update.url',
        name: 'URL',
        category: ['Update Request'],
        description: 'The URL to call.',
        settings: {
          placeholder: 'http://',
        },
        showIf: (config) => isRequestConfigured(config.update) && isRestApiRequest(config.update),
      })
      .addCustomEditor({
        id: 'update.datasource',
        path: 'update.datasource',
        name: 'Data Source',
        category: ['Update Request'],
        editor: DatasourceEditor,
        showIf: (config) => config.update.method === RequestMethod.DATASOURCE,
      })
      .addCustomEditor({
        id: 'update.header',
        path: 'update.header',
        name: 'Header Parameters',
        category: ['Update Request'],
        editor: HeaderParametersEditor,
        showIf: (config) => isRequestConfigured(config.update) && isRestApiRequest(config.update),
      })
      .addSelect({
        path: 'update.contentType',
        name: 'Content-Type',
        category: ['Update Request'],
        description: 'Content-Type of the payload.',
        defaultValue: ContentType.JSON,
        settings: {
          allowCustomValue: true,
          options: CONTENT_TYPE_OPTIONS,
        },
        showIf: (config) => isRequestConfigured(config.update) && isRestApiRequest(config.update),
      })
      .addCustomEditor({
        id: 'update.code',
        path: 'update.code',
        name: 'Custom Code',
        description: 'Custom code to execute after update request.',
        editor: CustomCodeEditor,
        category: ['Update Request'],
        settings: {
          type: CodeEditorType.REQUEST,
          variablesSuggestions: true,
        },
        defaultValue: UPDATE_CODE_DEFAULT,
        showIf: (config) => isRequestConfigured(config.update),
      })
      .addCustomEditor({
        id: 'update.code',
        path: 'update.code',
        name: 'Custom Code',
        description: 'Custom code to execute update request.',
        editor: CustomCodeEditor,
        category: ['Update Request'],
        settings: {
          type: CodeEditorType.REQUEST,
          variablesSuggestions: true,
        },
        defaultValue: UPDATE_CODE_DEFAULT,
        showIf: (config) => !isRequestConfigured(config.update),
      });

    /**
     * Update Payload
     */
    builder
      .addRadio({
        path: 'update.payloadMode',
        name: 'Request Payload',
        description: 'Choose what values will be included in payload.',
        category: ['Update Request Payload'],
        settings: {
          options: PAYLOAD_MODE_OPTIONS,
        },
        defaultValue: PayloadMode.ALL,
        showIf: (config) => isRequestConfigured(config.update) && config.layout.variant !== LayoutVariant.NONE,
      })
      .addCustomEditor({
        id: 'update.getPayload',
        path: 'update.getPayload',
        name: 'Create Payload',
        description: 'Custom code to create payload for the update request.',
        editor: CustomCodeEditor,
        category: ['Update Request Payload'],
        settings: {
          type: CodeEditorType.GET_PAYLOAD,
          variablesSuggestions: true,
        },
        defaultValue: UPDATE_PAYLOAD_DEFAULT,
        showIf: (config) => isRequestConfigured(config.update) && config.update.payloadMode === PayloadMode.CUSTOM,
      })
      .addCustomEditor({
        id: 'update.payload',
        path: 'update.payload',
        name: 'Query Editor',
        description: 'Configure query for the selected data source. ${payload} variable contains all passed values.',
        editor: DatasourcePayloadEditor,
        category: ['Update Request Payload'],
        settings: {
          datasourceKey: 'update.datasource',
        },
        defaultValue: UPDATE_PAYLOAD_DEFAULT,
        showIf: (config) =>
          isRequestConfigured(config.update) &&
          config.update.method === RequestMethod.DATASOURCE &&
          !!config.update.datasource,
      });

    builder
      .addRadio({
        path: 'update.confirm',
        name: 'Confirmation Window',
        description: 'Ask to confirm updated values.',
        category: ['Update Confirmation Window'],
        settings: {
          options: BOOLEAN_OPTIONS,
        },
        defaultValue: false,
      })
      .addTextInput({
        path: 'confirmModal.title',
        name: 'Title',
        category: ['Update Confirmation Window'],
        defaultValue: CONFIRM_MODAL_DEFAULT.title,
        showIf: (config) => config.update.confirm,
      })
      .addTextInput({
        path: 'confirmModal.body',
        name: 'Text',
        category: ['Update Confirmation Window'],
        defaultValue: CONFIRM_MODAL_DEFAULT.body,
        showIf: (config) => config.update.confirm,
      })
      .addMultiSelect({
        path: 'confirmModal.columns.include',
        name: 'Include columns',
        category: ['Update Confirmation Window'],
        defaultValue: CONFIRM_MODAL_DEFAULT.columns.include as unknown,
        showIf: (config) => config.update.confirm,
        settings: {
          options: CONFIRM_MODAL_COLUMNS_INCLUDE_OPTIONS,
        },
      })
      .addTextInput({
        path: 'confirmModal.columns.name',
        name: 'Label column',
        category: ['Update Confirmation Window'],
        defaultValue: CONFIRM_MODAL_DEFAULT.columns.name,
        showIf: (config) => config.update.confirm && config.confirmModal.columns.include.includes(ModalColumnName.NAME),
      })
      .addTextInput({
        path: 'confirmModal.columns.oldValue',
        name: 'Old value column',
        category: ['Update Confirmation Window'],
        defaultValue: CONFIRM_MODAL_DEFAULT.columns.oldValue,
        showIf: (config) =>
          config.update.confirm && config.confirmModal.columns.include.includes(ModalColumnName.OLD_VALUE),
      })
      .addTextInput({
        path: 'confirmModal.columns.newValue',
        name: 'New value column',
        category: ['Update Confirmation Window'],
        defaultValue: CONFIRM_MODAL_DEFAULT.columns.newValue,
        showIf: (config) => config.update.confirm && config.confirmModal.columns.include.includes(ModalColumnName.NAME),
      })
      .addTextInput({
        path: 'confirmModal.confirm',
        name: 'Confirm button',
        category: ['Update Confirmation Window'],
        description: 'The text on the confirm button.',
        defaultValue: CONFIRM_MODAL_DEFAULT.confirm,
        showIf: (config) => config.update.confirm,
      })
      .addTextInput({
        path: 'confirmModal.cancel',
        name: 'Cancel button',
        category: ['Update Confirmation Window'],
        description: 'The text on the cancel button.',
        defaultValue: CONFIRM_MODAL_DEFAULT.cancel,
        showIf: (config) => config.update.confirm,
      });

    /**
     * Buttons
     */
    builder
      .addRadio({
        path: 'buttonGroup.orientation',
        name: 'Orientation',
        category: ['Buttons'],
        description: 'Buttons orientation on the form.',
        settings: {
          options: BUTTON_ORIENTATION_OPTIONS,
        },
        defaultValue: ButtonOrientation.CENTER,
      })
      .addRadio({
        path: 'buttonGroup.size',
        name: 'Size',
        category: ['Buttons'],
        description: 'Buttons size on the form.',
        settings: {
          options: BUTTON_SIZE_OPTIONS,
        },
        defaultValue: ButtonSize.MEDIUM,
      });

    /**
     * Submit Button
     */
    builder
      .addRadio({
        path: 'submit.variant',
        name: 'Submit Button',
        category: ['Submit Button'],
        description: 'Button variant.',
        settings: {
          options: BUTTON_VARIANT_OPTIONS,
        },
        defaultValue: SUBMIT_BUTTON_DEFAULT.variant,
      })
      .addColorPicker({
        path: 'submit.foregroundColor',
        name: 'Foreground Color',
        category: ['Submit Button'],
        description: 'Foreground color of the button.',
        defaultValue: SUBMIT_BUTTON_DEFAULT.foregroundColor,
        settings: {
          disableNamedColors: true,
        },
        showIf: (config) => config.submit.variant === ButtonVariant.CUSTOM,
      })
      .addColorPicker({
        path: 'submit.backgroundColor',
        name: 'Background Color',
        category: ['Submit Button'],
        description: 'Background color of the button.',
        defaultValue: SUBMIT_BUTTON_DEFAULT.backgroundColor,
        settings: {
          disableNamedColors: true,
        },
        showIf: (config) => config.submit.variant === ButtonVariant.CUSTOM,
      })
      .addSelect({
        path: 'submit.icon',
        name: 'Icon',
        category: ['Submit Button'],
        settings: {
          options: getAvailableIcons().map((icon): SelectableValue => {
            return {
              value: icon,
              label: icon,
            };
          }),
        },
        defaultValue: SUBMIT_BUTTON_DEFAULT.icon,
      })
      .addTextInput({
        path: 'submit.text',
        name: 'Text',
        category: ['Submit Button'],
        description: 'The text on the button.',
        defaultValue: SUBMIT_BUTTON_DEFAULT.text,
      });

    /**
     * Reset Button
     */
    builder
      .addRadio({
        path: 'reset.variant',
        name: 'Reset Button',
        category: ['Reset Button'],
        description: 'Button variant.',
        settings: {
          options: [...BUTTON_VARIANT_HIDDEN_OPTIONS, ...BUTTON_VARIANT_OPTIONS],
        },
        defaultValue: RESET_BUTTON_DEFAULT.variant,
      })
      .addColorPicker({
        path: 'reset.foregroundColor',
        name: 'Foreground Color',
        category: ['Reset Button'],
        description: 'Foreground color of the button.',
        defaultValue: RESET_BUTTON_DEFAULT.foregroundColor,
        settings: {
          disableNamedColors: true,
        },
        showIf: (config) => config.reset.variant === ButtonVariant.CUSTOM,
      })
      .addColorPicker({
        path: 'reset.backgroundColor',
        name: 'Background Color',
        category: ['Reset Button'],
        description: 'Background color of the button.',
        defaultValue: RESET_BUTTON_DEFAULT.backgroundColor,
        settings: {
          disableNamedColors: true,
        },
        showIf: (config) => config.reset.variant === ButtonVariant.CUSTOM,
      })
      .addSelect({
        path: 'reset.icon',
        name: 'Icon',
        category: ['Reset Button'],
        settings: {
          options: getAvailableIcons().map((icon): SelectableValue => {
            return {
              value: icon,
              label: icon,
            };
          }),
        },
        defaultValue: RESET_BUTTON_DEFAULT.icon,
        showIf: (config) => config.reset.variant !== ButtonVariant.HIDDEN,
      })
      .addTextInput({
        path: 'reset.text',
        name: 'Text',
        category: ['Reset Button'],
        description: 'The text on the button.',
        defaultValue: RESET_BUTTON_DEFAULT.text,
        showIf: (config) => config.reset.variant !== ButtonVariant.HIDDEN,
      });

    /**
     * Reset Action
     */
    builder
      .addRadio({
        path: 'resetAction.mode',
        name: 'Reset Action',
        category: ['Reset Request'],
        description: 'What action should be called by clicking on reset button.',
        settings: {
          options: RESET_ACTION_OPTIONS,
        },
        defaultValue: ResetActionMode.INITIAL,
        showIf: (config) => config.reset.variant !== ButtonVariant.HIDDEN,
      })
      .addCustomEditor({
        id: 'resetAction.code',
        path: 'resetAction.code',
        name: 'Custom Code',
        description: 'Custom code to execute reset request.',
        editor: CustomCodeEditor,
        category: ['Reset Request'],
        settings: {
          type: CodeEditorType.REQUEST,
          variablesSuggestions: true,
        },
        defaultValue: RESET_CODE_DEFAULT,
        showIf: (config) =>
          config.reset.variant !== ButtonVariant.HIDDEN && config.resetAction.mode === ResetActionMode.CUSTOM,
      })
      .addCustomEditor({
        id: 'resetAction.datasource',
        path: 'resetAction.datasource',
        name: 'Data Source',
        category: ['Reset Request'],
        editor: DatasourceEditor,
        showIf: (config) =>
          config.reset.variant !== ButtonVariant.HIDDEN && config.resetAction.mode === ResetActionMode.DATASOURCE,
      })
      .addCustomEditor({
        id: 'resetAction.code',
        path: 'resetAction.code',
        name: 'Custom Code',
        description: 'Custom code to execute after reset request.',
        editor: CustomCodeEditor,
        category: ['Reset Request'],
        settings: {
          type: CodeEditorType.REQUEST,
          variablesSuggestions: true,
        },
        defaultValue: UPDATE_CODE_DEFAULT,
        showIf: (config) =>
          config.reset.variant !== ButtonVariant.HIDDEN && config.resetAction.mode === ResetActionMode.DATASOURCE,
      })
      .addRadio({
        path: 'resetAction.confirm',
        name: 'Confirmation Window',
        description: 'Ask to reset values.',
        category: ['Reset Request'],
        settings: {
          options: BOOLEAN_OPTIONS,
        },
        defaultValue: false,
      });

    /**
     * Reset Request Payload
     */
    builder
      .addCustomEditor({
        id: 'resetAction.getPayload',
        path: 'resetAction.getPayload',
        name: 'Create Payload',
        description: 'Custom code to create payload for the reset data source request.',
        editor: CustomCodeEditor,
        category: ['Reset Request Payload'],
        settings: {
          type: CodeEditorType.GET_PAYLOAD,
          variablesSuggestions: true,
        },
        defaultValue: INITIAL_PAYLOAD_DEFAULT,
        showIf: (config) =>
          config.reset.variant !== ButtonVariant.HIDDEN &&
          config.resetAction.mode === ResetActionMode.DATASOURCE &&
          !!config.resetAction.datasource,
      })
      .addCustomEditor({
        id: 'resetAction.payload',
        path: 'resetAction.payload',
        name: 'Query Editor',
        description: 'Configure query for the selected data source. ${payload} variable contains all passed values.',
        editor: DatasourcePayloadEditor,
        category: ['Reset Request Payload'],
        settings: {
          datasourceKey: 'resetAction.datasource',
        },
        defaultValue: {},
        showIf: (config) =>
          config.reset.variant !== ButtonVariant.HIDDEN &&
          config.resetAction.mode === ResetActionMode.DATASOURCE &&
          !!config.resetAction.datasource,
      });

    /**
     * Save Defaults Button
     */
    builder
      .addRadio({
        path: 'saveDefault.variant',
        name: 'Save Default Button',
        category: ['Save Default Button'],
        description: 'Button variant.',
        settings: {
          options: [...BUTTON_VARIANT_HIDDEN_OPTIONS, { value: ButtonVariant.SECONDARY, label: 'Auto' }],
        },
        defaultValue: SAVE_DEFAULT_BUTTON_DEFAULT.variant,
      })
      .addSelect({
        path: 'saveDefault.icon',
        name: 'Icon',
        category: ['Save Default Button'],
        settings: {
          options: getAvailableIcons().map((icon): SelectableValue => {
            return {
              value: icon,
              label: icon,
            };
          }),
        },
        defaultValue: SAVE_DEFAULT_BUTTON_DEFAULT.icon,
        showIf: (config) => config.saveDefault.variant !== ButtonVariant.HIDDEN,
      })
      .addTextInput({
        path: 'saveDefault.text',
        name: 'Text',
        category: ['Save Default Button'],
        description: 'The text on the button.',
        defaultValue: SAVE_DEFAULT_BUTTON_DEFAULT.text,
        showIf: (config) => config.saveDefault.variant !== ButtonVariant.HIDDEN,
      });

    return builder;
  });
