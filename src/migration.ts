import { PanelModel } from '@grafana/data';
import semver from 'semver';

import { FormElementType, PayloadMode } from './constants';
import { LayoutOptions, LayoutSection, PanelOptions, RequestOptions } from './types';

/**
 * Outdated Request Options
 */
interface OutdatedRequestOptions extends RequestOptions {
  /**
   * Add only updated elements to payload
   *
   * Removed in 3.4.0
   */
  updatedOnly?: boolean;
}

/**
 * Outdated Layout Options
 */
interface OutdatedLayoutOptions extends Omit<LayoutOptions, 'sections'> {
  sections: Array<
    Omit<LayoutSection, 'id'> & {
      /**
       * ID
       * Optional to backward compatibility
       *
       * @type {string}
       */
      id?: string;
    }
  >;
}

/**
 * Outdated Panel Options
 */
interface OutdatedPanelOptions extends Omit<PanelOptions, 'initial' | 'update' | 'layout'> {
  initial: OutdatedRequestOptions;
  update: OutdatedRequestOptions;
  layout: OutdatedLayoutOptions;
}

/**
 * Normalize Request Options
 */
const normalizeRequestOptions = ({ updatedOnly, payloadMode, ...actual }: OutdatedRequestOptions): RequestOptions => {
  return {
    ...actual,
    payloadMode: payloadMode ?? (updatedOnly ? PayloadMode.UPDATED : PayloadMode.ALL),
  };
};

/**
 * Normalize Code Options
 */
const normalizeCodeOptions = (code: string): string => {
  const search =
    /^(?!.*context\.)(?:.*)(options\.|data\.|response|elements\.|onChange\(|locationService|templateService|onOptionsChange\(|initialRequest\(|setInitial\(|initial\.|notifyError\(|notifySuccess\(|notifyWarning\(|toDataQueryResponse\(|replaceVariables\()/gm;

  return code
    .split(' ')
    .map((part) => {
      return part.replace(search, (value, ...args) => {
        const searchTerm = args[0] || value;

        return value.replace(searchTerm, (valueToReplace) => {
          switch (valueToReplace) {
            case 'options.': {
              return 'context.panel.options.';
            }
            case 'data.': {
              return 'context.panel.data.';
            }
            case 'response': {
              return 'context.panel.response';
            }
            case 'elements.': {
              return 'context.panel.elements.';
            }
            case 'onChange(': {
              return 'context.panel.onChangeElements(';
            }
            case 'locationService': {
              return 'context.grafana.locationService';
            }
            case 'templateService': {
              return 'context.grafana.templateService';
            }
            case 'onOptionsChange(': {
              return 'context.panel.onOptionsChange(';
            }
            case 'initialRequest(': {
              return 'context.panel.initialRequest(';
            }
            case 'setInitial(': {
              return 'context.panel.setInitial(';
            }
            case 'initial.': {
              return 'context.panel.initial.';
            }
            case 'notifyError(': {
              return 'context.grafana.notifyError(';
            }
            case 'notifySuccess(': {
              return 'context.grafana.notifySuccess(';
            }
            case 'notifyWarning(': {
              return 'context.grafana.notifyWarning(';
            }
            case 'toDataQueryResponse(': {
              return 'context.utils.toDataQueryResponse(';
            }
            case 'replaceVariables(': {
              return 'context.grafana.replaceVariables(';
            }
            default: {
              return value;
            }
          }
        });
      });
    })
    .join(' ');
};

/**
 * Normalize Payload Options
 *
 * @param obj
 *
 */
export const normalizePayloadOptions = (obj: Record<string, unknown>) => {
  /**
   * Check passed object
   */
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const normalizedObj: Record<string, unknown> = {};

  /**
   * Check keys
   */
  for (const key in obj) {
    const value = obj[key];
    if (!isNaN(Number(key)) && typeof value === 'string' && value.toString().length === 1) {
      continue;
    } else {
      normalizedObj[key] = value;
    }
  }

  return normalizedObj;
};

/**
 * Get Migrated Options
 * @param panel
 */
export const getMigratedOptions = (panel: PanelModel<OutdatedPanelOptions>): PanelOptions => {
  const { ...options } = panel.options;

  /**
   * Normalize non context code parameters before 4.0.0
   */
  if (panel.pluginVersion && semver.lt(panel.pluginVersion, '4.0.0')) {
    options.initial.code = normalizeCodeOptions(options.initial.code);
    options.resetAction.code = normalizeCodeOptions(options.resetAction.code);
    options.update.code = normalizeCodeOptions(options.update.code);

    options.initial.getPayload = normalizeCodeOptions(options.initial.getPayload);
    options.resetAction.getPayload = normalizeCodeOptions(options.resetAction.getPayload);
    options.update.getPayload = normalizeCodeOptions(options.update.getPayload);

    if (options.elements && options.elements.length > 0) {
      options.elements.forEach((element) => {
        if (element.showIf) {
          element.showIf = normalizeCodeOptions(element.showIf);
        }
        if (element.disableIf) {
          element.disableIf = normalizeCodeOptions(element.disableIf);
        }
        if (
          (element.type === FormElementType.DISABLED ||
            element.type === FormElementType.SELECT ||
            element.type === FormElementType.MULTISELECT ||
            element.type === FormElementType.RADIO ||
            element.type === FormElementType.CHECKBOX_LIST) &&
          element.getOptions
        ) {
          element.getOptions = normalizeCodeOptions(element.getOptions);
        }
      });
    }
  }

  /**
   * Remove datasource payload code
   */
  if (typeof options.initial.payload === 'string') {
    options.initial.payload = {};
  }

  if (typeof options.update.payload === 'string') {
    options.update.payload = {};
  }

  if (typeof options.resetAction.payload === 'string') {
    options.resetAction.payload = {};
  }

  /**
   * Normalize request options
   */
  if ('updatedOnly' in options.initial || 'updatedOnly' in options.update) {
    options.initial = normalizeRequestOptions(options.initial);
    options.update = normalizeRequestOptions(options.update);
  }

  /**
   * Normalize layout sections
   */
  if (options.layout?.sections) {
    options.layout = {
      ...options.layout,
      sections: options.layout.sections.map(({ id, ...rest }) => ({
        ...rest,
        id: id ?? rest.name,
      })),
    } as LayoutOptions;
  }

  /**
   * Normalize payload object
   */
  if (panel.pluginVersion && semver.lt(panel.pluginVersion, '4.3.0')) {
    options.initial.payload = normalizePayloadOptions(options.initial.payload as Record<string, unknown>);
    options.update.payload = normalizePayloadOptions(options.update.payload as Record<string, unknown>);
    options.resetAction.payload = normalizePayloadOptions(options.resetAction.payload as Record<string, unknown>);
  }

  return options as PanelOptions;
};
