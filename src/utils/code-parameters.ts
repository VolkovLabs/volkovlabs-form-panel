import { AlertPayload, DataQueryResponse, EventBus, InterpolateFunction, PanelData } from '@grafana/data';
import { BackendSrv, FetchResponse, LocationService, TemplateSrv, toDataQueryResponse } from '@grafana/runtime';
import { CodeEditorSuggestionItemKind } from '@grafana/ui';
import { CodeParameterItem, CodeParametersBuilder } from '@volkovlabs/components';

import { FormElement, LocalFormElement, PanelOptions } from '../types';
import { fileToBase64 } from './request';

/**
 * Request Code Parameters
 */
export const requestCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        data: new CodeParameterItem<PanelData>('Panel data.'),
        options: new CodeParameterItem<PanelOptions>('Panel options.'),
        onOptionsChange: new CodeParameterItem<(options: PanelOptions) => void>(
          'Update panel options on dashboard.',
          CodeEditorSuggestionItemKind.Method
        ),
        elements: new CodeParameterItem<LocalFormElement[]>('Panel elements.'),
        onChangeElements: new CodeParameterItem<(elements: LocalFormElement[]) => void>(
          'Update panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        patchFormValue: new CodeParameterItem<(objectValues: Record<string, unknown>) => void>(
          'Patch panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        setFormValue: new CodeParameterItem<(objectValues: Record<string, unknown>) => void>(
          'Set panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        formValue: new CodeParameterItem<() => Record<string, unknown>>(
          'Return Current form value.',
          CodeEditorSuggestionItemKind.Method
        ),
        initial: new CodeParameterItem<unknown>('Initial values.'),
        setInitial: new CodeParameterItem<(value: { [id: string]: unknown }) => void>(
          'Allows to specify the initial values.',
          CodeEditorSuggestionItemKind.Method
        ),
        initialRequest: new CodeParameterItem<(() => Promise<void>) | undefined>(
          'Run Initial Request.',
          CodeEditorSuggestionItemKind.Method
        ),
        enableSubmit: new CodeParameterItem<() => void>('Enable submit button.', CodeEditorSuggestionItemKind.Method),
        disableSubmit: new CodeParameterItem<() => void>('Disable submit button.', CodeEditorSuggestionItemKind.Method),
        response: new CodeParameterItem<FetchResponse | Response | DataQueryResponse | null | undefined>(
          'Response object.'
        ),
        toggleSection: new CodeParameterItem<(id: string) => void>(
          'Toggle Section',
          CodeEditorSuggestionItemKind.Method
        ),
        collapseSection: new CodeParameterItem<(id: string) => void>(
          'Collapse Section',
          CodeEditorSuggestionItemKind.Method
        ),
        expandSection: new CodeParameterItem<(id: string) => void>(
          'Expand Section',
          CodeEditorSuggestionItemKind.Method
        ),
        sectionsExpandedState: new CodeParameterItem<Record<string, boolean>>('Sections Expanded State'),
      },
    },
    grafana: {
      detail: 'Grafana properties and methods.',
      items: {
        backendService: new CodeParameterItem<BackendSrv>('Backend service.'),
        locationService: new CodeParameterItem<LocationService>('Location service.'),
        templateService: new CodeParameterItem<TemplateSrv>('Template variables service.'),
        notifyError: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show error notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        notifySuccess: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show success notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        notifyWarning: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show warning notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        eventBus: new CodeParameterItem<EventBus>('Panels events.'),
        appEvents: new CodeParameterItem<EventBus>('Application events.'),
        refresh: new CodeParameterItem<() => void>('Refresh dashboard.', CodeEditorSuggestionItemKind.Method),
      },
    },
    utils: {
      detail: 'Utils and helpers functions.',
      items: {
        toDataQueryResponse: new CodeParameterItem<typeof toDataQueryResponse>(
          'Parse the results from /api/ds/query.',
          CodeEditorSuggestionItemKind.Method
        ),
        fileToBase64: new CodeParameterItem<typeof fileToBase64>(
          'Converts File to Base64 string.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});

/**
 * Element Value Changed Code Parameters
 */
export const elementValueChangedCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        data: new CodeParameterItem<PanelData>('Panel data.'),
        options: new CodeParameterItem<PanelOptions>('Panel options.'),
        onOptionsChange: new CodeParameterItem<(options: PanelOptions) => void>(
          'Update panel options on dashboard.',
          CodeEditorSuggestionItemKind.Method
        ),
        elements: new CodeParameterItem<LocalFormElement[]>('Panel elements.'),
        onChangeElements: new CodeParameterItem<(elements: LocalFormElement[]) => void>(
          'Update panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        patchFormValue: new CodeParameterItem<(objectValues: Record<string, unknown>) => void>(
          'Patch panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        setFormValue: new CodeParameterItem<(objectValues: Record<string, unknown>) => void>(
          'Set panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        formValue: new CodeParameterItem<() => Record<string, unknown>>(
          'Return Current form value.',
          CodeEditorSuggestionItemKind.Method
        ),
        initial: new CodeParameterItem<unknown>('Initial values.'),
        initialRequest: new CodeParameterItem<(() => Promise<void>) | undefined>(
          'Run Initial Request.',
          CodeEditorSuggestionItemKind.Method
        ),
        enableSubmit: new CodeParameterItem<() => void>('Enable submit button.', CodeEditorSuggestionItemKind.Method),
        disableSubmit: new CodeParameterItem<() => void>('Disable submit button.', CodeEditorSuggestionItemKind.Method),
        setError: new CodeParameterItem<(error: string) => void>(
          'Set panel error.',
          CodeEditorSuggestionItemKind.Method
        ),
        enableReset: new CodeParameterItem<() => void>('Enable reset button.', CodeEditorSuggestionItemKind.Method),
        disableReset: new CodeParameterItem<() => void>('Disable reset button.', CodeEditorSuggestionItemKind.Method),
        enableSaveDefault: new CodeParameterItem<() => void>(
          'Enable save default button.',
          CodeEditorSuggestionItemKind.Method
        ),
        disableSaveDefault: new CodeParameterItem<() => void>(
          'Disable save default button.',
          CodeEditorSuggestionItemKind.Method
        ),
        toggleSection: new CodeParameterItem<(id: string) => void>(
          'Toggle Section',
          CodeEditorSuggestionItemKind.Method
        ),
        collapseSection: new CodeParameterItem<(id: string) => void>(
          'Collapse Section',
          CodeEditorSuggestionItemKind.Method
        ),
        expandSection: new CodeParameterItem<(id: string) => void>(
          'Expand Section',
          CodeEditorSuggestionItemKind.Method
        ),
        sectionsExpandedState: new CodeParameterItem<Record<string, boolean>>('Sections Expanded State'),
      },
    },
    grafana: {
      detail: 'Grafana properties and methods.',
      items: {
        locationService: new CodeParameterItem<LocationService>('Location service.'),
        templateService: new CodeParameterItem<TemplateSrv>('Template variables service.'),
        notifyError: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show error notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        notifySuccess: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show success notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        notifyWarning: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show warning notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        eventBus: new CodeParameterItem<EventBus>('Panels events.'),
        appEvents: new CodeParameterItem<EventBus>('Application events.'),
        refresh: new CodeParameterItem<() => void>('Refresh dashboard.', CodeEditorSuggestionItemKind.Method),
      },
    },
    utils: {
      detail: 'Utils and helpers functions.',
      items: {
        toDataQueryResponse: new CodeParameterItem<typeof toDataQueryResponse>(
          'Parse the results from /api/ds/query.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
    element: new CodeParameterItem<LocalFormElement>('Form Element which value has been changed.'),
  },
});

/**
 * Show If Code Parameters
 */
export const showIfCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        elements: new CodeParameterItem<FormElement[]>('Panel elements.'),
      },
    },
    grafana: {
      detail: 'Grafana properties and methods.',
      items: {
        replaceVariables: new CodeParameterItem<InterpolateFunction>(
          'Interpolate variables.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});

/**
 * Disable If Code Parameters
 */
export const disableIfCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        elements: new CodeParameterItem<FormElement[]>('Panel elements.'),
      },
    },
    grafana: {
      detail: 'Grafana properties and methods.',
      items: {
        replaceVariables: new CodeParameterItem<InterpolateFunction>(
          'Interpolate variables.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});

/**
 * Get Options Code Parameters
 */
export const getOptionsCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        data: new CodeParameterItem<PanelData>('Panel data.'),
        elements: new CodeParameterItem<FormElement[]>('Panel elements.'),
      },
    },
    grafana: {
      detail: 'Grafana properties and methods.',
      items: {
        replaceVariables: new CodeParameterItem<InterpolateFunction>(
          'Interpolate variables.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});

/**
 * Get Payload Code Parameters
 */
export const getPayloadCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        initial: new CodeParameterItem<unknown>('Initial values.'),
        elements: new CodeParameterItem<LocalFormElement[]>('Panel elements.'),
      },
    },
    utils: {
      detail: 'Utils and helpers functions.',
      items: {
        fileToBase64: new CodeParameterItem<typeof fileToBase64>(
          'Converts File to Base64 string.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});
