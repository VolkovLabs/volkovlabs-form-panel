import { css, cx } from '@emotion/css';
import {
  AlertErrorPayload,
  AlertPayload,
  AppEvents,
  DataFrame,
  DataQueryError,
  DataQueryResponse,
  Field,
  LoadingState,
  PanelProps,
} from '@grafana/data';
import {
  FetchResponse,
  getAppEvents,
  getBackendSrv,
  getTemplateSrv,
  locationService,
  RefreshEvent,
  toDataQueryResponse,
} from '@grafana/runtime';
import { Alert, Button, ButtonGroup, ConfirmModal, usePanelContext, useStyles2, useTheme2 } from '@grafana/ui';
import { CustomButtonsRow } from 'components/CustomButtonsRow';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ConfirmationElementDisplayMode,
  ContentType,
  FormElementType,
  LayoutVariant,
  LoadingMode,
  PayloadMode,
  RequestMethod,
  ResetActionMode,
  TEST_IDS,
} from '../../constants';
import { useDatasourceRequest, useFormElements, useMutableState } from '../../hooks';
import {
  ButtonVariant,
  FormElement,
  LocalFormElement,
  ModalColumnName,
  PanelOptions,
  UpdateEnabledMode,
} from '../../types';
import {
  convertToElementValue,
  createExecutionCode,
  elementValueChangedCodeParameters,
  fileToBase64,
  formatElementValue,
  getButtonVariant,
  getFieldValues,
  getInitialValuesMap,
  getPayloadForRequest,
  requestCodeParameters,
  toFormData,
  toJson,
  ValueChangedEvent,
} from '../../utils';
import { ElementSections } from '../ElementSections';
import { FormElements } from '../FormElements';
import { LoadingBar } from '../LoadingBar';
import { getStyles } from './FormPanel.styles';

/**
 * Properties
 */
type Props = PanelProps<PanelOptions>;

/**
 * Panel
 */
export const FormPanel: React.FC<Props> = ({
  options,
  width,
  height,
  onOptionsChange,
  eventBus,
  replaceVariables,
  data,
}) => {
  /**
   * State
   */
  const [loading, setLoading] = useState<LoadingMode>(LoadingMode.INITIAL);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [initial, setInitial, initialRef] = useMutableState<{ [id: string]: unknown }>({});
  const [updateConfirmation, setUpdateConfirmation] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState(false);
  const [isInitialized, setInitialized] = useState(false);

  /**
   * Controlled form state
   */
  const [resetEnabled, setResetEnabled] = useState(true);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [saveDefaultEnabled, setSaveDefaultEnabled] = useState(true);

  /**
   * Use Datasource Request
   */
  const datasourceRequest = useDatasourceRequest();

  /**
   * Can User Save Options
   */
  const { canAddAnnotations } = usePanelContext();
  const canSaveDefaultValues = useMemo(() => {
    return canAddAnnotations ? canAddAnnotations() : false;
  }, [canAddAnnotations]);

  /**
   * Change Options
   */
  const onChangeOptions = useCallback(
    (elements: FormElement[]) => {
      onOptionsChange({
        ...options,
        elements,
      });
    },
    [onOptionsChange, options]
  );

  /**
   * Form Elements
   */
  const {
    elements,
    onChangeElement,
    onChangeElements,
    onSaveUpdates,
    eventBus: elementsEventBus,
    elementsRef,
    sectionsExpandedState,
    onChangeSectionExpandedState,
  } = useFormElements({
    onChange: onChangeOptions,
    value: options.elements,
    isAutoSave: false,
    sections: options.layout.sections,
  });

  /**
   * Theme and Styles
   */
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  /**
   * Template Service
   */
  const templateSrv = getTemplateSrv();

  /**
   * Events
   */
  const appEvents = getAppEvents();
  const notifySuccess = useCallback(
    (payload: AlertPayload) => appEvents.publish({ type: AppEvents.alertSuccess.name, payload }),
    [appEvents]
  );
  const notifyError = useCallback(
    (payload: AlertErrorPayload) => appEvents.publish({ type: AppEvents.alertError.name, payload }),
    [appEvents]
  );
  const notifyWarning = useCallback(
    (payload: AlertErrorPayload) => appEvents.publish({ type: AppEvents.alertWarning.name, payload }),
    [appEvents]
  );

  /**
   * On Change Elements With Field Values
   */
  const getElementsWithFieldValues = useCallback(
    (frames: DataFrame[], sourceType: RequestMethod.QUERY | RequestMethod.DATASOURCE): LocalFormElement[] => {
      /**
       * Get elements values
       */
      return elementsRef.current.map((element): LocalFormElement => {
        const fieldConfig = sourceType === RequestMethod.QUERY ? element.queryField : { value: element.fieldName };
        const field = frames
          .filter((frame) => (fieldConfig?.refId ? frame.refId === fieldConfig.refId : true))
          .reduce((acc: Field | undefined, { fields }) => {
            const field = fields?.find((field: Field) => field.name === fieldConfig?.value);
            if (field) {
              return field;
            }
            return acc;
          }, undefined);

        if (field) {
          /**
           * Update with initial value
           */
          const values = getFieldValues(field);

          return convertToElementValue(element, values[values.length - 1]);
        }

        return element;
      });
    },
    [elementsRef]
  );

  /**
   * Execute Custom Code
   */
  const executeCustomCode = useCallback(
    async ({
      code,
      initial,
      response,
      initialRequest,
      currentElements,
    }: {
      code: string;
      initial: unknown;
      response?: FetchResponse | Response | DataQueryResponse | null;
      initialRequest?: () => Promise<void>;
      currentElements?: LocalFormElement[];
    }): Promise<void> => {
      if (!code) {
        return;
      }

      /**
       * Function
       */
      const f = createExecutionCode('context', replaceVariables(code));

      try {
        await f(
          requestCodeParameters.create({
            grafana: {
              locationService,
              templateService: templateSrv,
              notifyError,
              notifySuccess,
              notifyWarning,
              eventBus,
              appEvents,
              refresh: () => appEvents.publish({ type: 'variables-changed', payload: { refreshAll: true } }),
              backendService: getBackendSrv(),
            },
            panel: {
              options,
              data,
              onOptionsChange,
              elements: currentElements || elementsRef.current,
              onChangeElements,
              setInitial,
              initial,
              initialRequest,
              response,
              enableSubmit: () => setSubmitEnabled(true),
              disableSubmit: () => setSubmitEnabled(false),
              collapseSection: (id: string) => onChangeSectionExpandedState(id, false),
              expandSection: (id: string) => onChangeSectionExpandedState(id, true),
              toggleSection: (id: string) => onChangeSectionExpandedState(id, !sectionsExpandedState[id]),
              sectionsExpandedState,
            },
            utils: {
              toDataQueryResponse,
              fileToBase64,
            },
          })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.toString());
        }
      }
    },
    [
      replaceVariables,
      options,
      data,
      elementsRef,
      onChangeElements,
      templateSrv,
      onOptionsChange,
      setInitial,
      notifyError,
      notifySuccess,
      notifyWarning,
      eventBus,
      appEvents,
      sectionsExpandedState,
      onChangeSectionExpandedState,
    ]
  );

  /**
   * Initial Request
   */
  const initialRequest = useCallback(async () => {
    /**
     * Clear Error
     */
    setError('');

    /**
     * Loading
     */
    setLoading(LoadingMode.INITIAL);

    let currentElements = elementsRef.current;

    if (
      !elementsRef.current.length ||
      options.initial.method === RequestMethod.NONE ||
      options.initial.method === RequestMethod.QUERY
    ) {
      if (options.initial.method === RequestMethod.QUERY) {
        /**
         * Change Elements with Query Values
         */
        currentElements = getElementsWithFieldValues(data.series, RequestMethod.QUERY);
      }

      /**
       * Update Elements and Initial values
       */
      onChangeElements(currentElements);
      setInitial(getInitialValuesMap(currentElements));

      /**
       * No method specified
       */
      await executeCustomCode({ code: options.initial.code, initial: initialRef.current, currentElements });

      /**
       * Reset Loading
       */
      setLoading(LoadingMode.NONE);

      return;
    }

    let response: Response | FetchResponse | DataQueryResponse | null;
    let json: { [id: string]: unknown } = {};

    /**
     * Data Source
     */
    if (options.initial.method === RequestMethod.DATASOURCE) {
      if (!options.initial.datasource) {
        /**
         * Show No Data Source Error and Reset Loading
         */
        setError('Please select Data Source for Initial Request.');
        setLoading(LoadingMode.NONE);

        return;
      }

      /**
       * Run Datasource Query
       */
      const payload = await getPayloadForRequest({
        request: {
          ...options.initial,
          payloadMode: PayloadMode.CUSTOM,
        },
        elements: elementsRef.current,
        initial: initialRef.current,
        replaceVariables,
      });

      response = await datasourceRequest({
        query: options.initial.payload,
        datasource: options.initial.datasource,
        replaceVariables,
        payload,
      }).catch((error: DataQueryError) => {
        setError(JSON.stringify(error));
        return null;
      });

      if (response && response.state === LoadingState.Done) {
        /**
         * Change Elements With Data Source Values
         */
        currentElements = getElementsWithFieldValues(response.data, RequestMethod.DATASOURCE);

        /**
         * Update Elements and Initial Values
         */
        onChangeElements(currentElements);
        setInitial(
          currentElements.reduce(
            (acc, element) => ({
              ...acc,
              [element.id]: element.value,
            }),
            {}
          )
        );
      }
    } else {
      if (!options.initial.url) {
        /**
         * Show no URL Error and Reset Loading
         */
        setError('Please select URL for Initial Request.');
        setLoading(LoadingMode.NONE);

        return;
      }

      /**
       * Set Content Type
       */
      const headers: HeadersInit = new Headers();
      if (options.initial.method === RequestMethod.POST) {
        headers.set('Content-Type', options.initial.contentType);
      }

      /**
       * Set Header
       */
      options.initial.header?.forEach((parameter) => {
        const name = replaceVariables(parameter.name);
        if (!name) {
          setError(`All request parameters should be defined. Remove empty parameters.`);
          return;
        }

        headers.set(name, replaceVariables(parameter.value));
      });

      /**
       * Fetch
       */
      response = await fetch(replaceVariables(options.initial.url, undefined, encodeURIComponent), {
        method: options.initial.method,
        headers,
      }).catch((error: Error) => {
        setError(error.toString());
        return null;
      });

      /**
       * CORS
       */
      if (response?.type === 'opaque') {
        setError('CORS prevents access to the response for Initial values.');
      }

      /**
       * OK
       */
      if (response?.ok) {
        json = await response.json();

        /**
         * Update values
         */
        const valuesMap =
          options.elements?.reduce((acc: Record<string, unknown>, element) => {
            return {
              ...acc,
              [element.id]: json[element.id] !== undefined ? json[element.id] : element.value,
            };
          }, {}) || {};

        currentElements = elementsRef.current.map(
          (element): LocalFormElement => convertToElementValue(element, valuesMap[element.id])
        );

        onChangeElements(currentElements);

        setInitial({
          ...json,
          ...valuesMap,
        });
        setTitle('Values updated.');
      }
    }

    /**
     * Execute Custom Code and reset Loading
     */
    await executeCustomCode({ code: options.initial.code, initial: json, response, currentElements });
    setLoading(LoadingMode.NONE);
  }, [
    data.series,
    datasourceRequest,
    elementsRef,
    executeCustomCode,
    getElementsWithFieldValues,
    initialRef,
    onChangeElements,
    options.elements,
    options.initial,
    replaceVariables,
    setInitial,
  ]);

  /**
   * Reset Request
   */
  const resetRequest = useCallback(async () => {
    /**
     * Clear Error
     */
    setError('');

    if (options.resetAction.mode === ResetActionMode.INITIAL) {
      /**
       * Use Initial Request
       */
      await initialRequest();
      return;
    }

    if (options.resetAction.mode === ResetActionMode.CUSTOM) {
      /**
       * Loading
       */
      setLoading(LoadingMode.RESET);

      /**
       * Execute Custom Code and reset Loading
       */
      await executeCustomCode({ code: options.resetAction.code, initial: initialRef.current });
      setLoading(LoadingMode.NONE);

      return;
    }

    /**
     * Loading
     */
    setLoading(LoadingMode.RESET);

    if (!options.resetAction.datasource) {
      /**
       * Show No Data Source Error and Reset Loading
       */
      setError('Please select Data Source for Reset Request.');
      setLoading(LoadingMode.NONE);

      return;
    }

    /**
     * Set payload
     */
    const payload = await getPayloadForRequest({
      request: {
        datasource: options.resetAction.datasource,
        payloadMode: PayloadMode.CUSTOM,
        method: RequestMethod.NONE,
        url: '',
        header: [],
        getPayload: options.resetAction.getPayload,
        contentType: ContentType.PLAIN,
        code: options.resetAction.code,
        highlight: false,
        highlightColor: '',
        confirm: false,
        payload: options.resetAction.payload,
      },
      elements: elementsRef.current,
      initial: initialRef.current,
      replaceVariables,
    });

    /**
     * Datasource query
     */
    const response = await datasourceRequest({
      query: options.resetAction.payload,
      datasource: options.resetAction.datasource,
      replaceVariables,
      payload,
    }).catch((error: DataQueryError) => {
      setError(JSON.stringify(error));
      return null;
    });

    let currentElements = elementsRef.current;
    if (response && response.state === LoadingState.Done) {
      /**
       * Change Elements With Data Source Values
       */
      currentElements = getElementsWithFieldValues(response.data, RequestMethod.DATASOURCE);

      /**
       * Update Elements
       */
      onChangeElements(currentElements);
    }

    /**
     * Execute Custom Code and reset Loading
     */
    await executeCustomCode({ code: options.resetAction.code, initial: initialRef.current, response, currentElements });
    setLoading(LoadingMode.NONE);
  }, [
    datasourceRequest,
    elementsRef,
    executeCustomCode,
    getElementsWithFieldValues,
    initialRef,
    initialRequest,
    onChangeElements,
    options.resetAction.code,
    options.resetAction.datasource,
    options.resetAction.getPayload,
    options.resetAction.mode,
    options.resetAction.payload,
    replaceVariables,
  ]);

  /**
   * Update Request
   */
  const updateRequest = useCallback(async () => {
    /**
     * Clear Error
     */
    setError('');

    /**
     * Loading
     */
    setLoading(LoadingMode.UPDATE);

    /**
     * Execute Custom Code
     */
    if (options.update.method === RequestMethod.NONE) {
      /**
       * Execute Custom Code and reset Loading
       */
      await executeCustomCode({ code: options.update.code, initial: initialRef.current, initialRequest });
      setLoading(LoadingMode.NONE);

      return;
    }

    /**
     * Set payload
     */
    const payload = await getPayloadForRequest({
      request: options.update,
      elements,
      initial: initialRef.current,
      replaceVariables,
    });

    /**
     * Response
     */
    let response: Response | FetchResponse | DataQueryResponse | null;

    /**
     * Datasource query
     */
    if (options.update.method === RequestMethod.DATASOURCE) {
      response = await datasourceRequest({
        query: options.update.payload,
        datasource: options.update.datasource,
        replaceVariables,
        payload,
      }).catch((error: DataQueryError) => {
        setError(JSON.stringify(error));
        return null;
      });
    } else {
      /**
       * Set Content Type
       */
      const headers: HeadersInit = new Headers();

      /**
       * Browser should add header itself for form data content
       */
      if (options.update.contentType !== ContentType.FORMDATA) {
        headers.set('Content-Type', options.update.contentType);
      }

      /**
       * Set Header
       */
      options.update.header?.forEach((parameter) => {
        const name = replaceVariables(parameter.name);
        if (!name) {
          setError(`All request parameters should be defined. Remove empty parameters.`);
          return;
        }

        headers.set(name, replaceVariables(parameter.value));
      });

      let body: string | FormData;

      if (options.update.contentType === ContentType.FORMDATA && payload instanceof Object) {
        /**
         * Form Data
         */
        body = toFormData(payload, replaceVariables);
      } else {
        /**
         * JSON or Text Plain
         */
        body = await toJson(payload, replaceVariables);
      }

      /**
       * Fetch
       */
      response = await fetch(replaceVariables(options.update.url, undefined, encodeURIComponent), {
        method: options.update.method,
        headers,
        body,
      }).catch((error: Error) => {
        setError(error.toString());
        return null;
      });

      /**
       * Check Response
       */
      if (response?.ok) {
        setTitle(response.toString());
      }
    }

    /**
     * Execute Custom Code and reset Loading
     */
    await executeCustomCode({ code: options.update.code, initial: initialRef.current, response, initialRequest });
    setLoading(LoadingMode.NONE);
  }, [datasourceRequest, elements, executeCustomCode, initialRef, initialRequest, options.update, replaceVariables]);

  /**
   * Execute Initial Request on dashboard or data update
   */
  useEffect(() => {
    /**
     * On Load
     */
    if (data.state === LoadingState.Done && (options.sync || !isInitialized)) {
      initialRequest();

      /**
       * Set Initialized only when sync disabled to prevent unnecessary re-render
       */
      if (!options.sync) {
        setInitialized(true);
      }
    }

    /**
     * On Refresh
     */
    const subscriber = eventBus.getStream(RefreshEvent).subscribe(() => {
      if (options.sync) {
        initialRequest();
      }
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [options.initial, options.sync, eventBus, data.state, isInitialized, initialRequest]);

  /**
   * Check updated values
   */
  const isUpdated = useMemo(() => {
    for (const element of elements) {
      if (!isEqual(initial[element.id], element.value)) {
        return true;
      }
    }

    return false;
  }, [elements, initial]);

  /**
   * Is Submit Disabled
   */
  const isSubmitDisabled = useMemo(() => {
    if (loading) {
      return true;
    }

    if (options.updateEnabled === UpdateEnabledMode.AUTO) {
      return !isUpdated && options.layout.variant !== LayoutVariant.NONE;
    }

    return !submitEnabled;
  }, [isUpdated, loading, options.layout.variant, options.updateEnabled, submitEnabled]);

  /**
   * On Element Value Changed
   */
  const onElementValueChanged = useCallback(
    ({ elements, element }: { elements: LocalFormElement[]; element: LocalFormElement }) => {
      const fn = createExecutionCode('context', replaceVariables(options.elementValueChanged));

      fn(
        elementValueChangedCodeParameters.create({
          element,
          grafana: {
            locationService,
            templateService: templateSrv,
            notifyError,
            notifySuccess,
            notifyWarning,
            eventBus,
            appEvents,
            refresh: () => appEvents.publish({ type: 'variables-changed', payload: { refreshAll: true } }),
          },
          panel: {
            options,
            data,
            onOptionsChange,
            elements,
            onChangeElements,
            collapseSection: (id: string) => onChangeSectionExpandedState(id, false),
            expandSection: (id: string) => onChangeSectionExpandedState(id, true),
            toggleSection: (id: string) => onChangeSectionExpandedState(id, !sectionsExpandedState[id]),
            sectionsExpandedState,
            initial: initialRef.current,
            setError,
            enableReset: () => setResetEnabled(true),
            disableReset: () => setResetEnabled(false),
            enableSubmit: () => setSubmitEnabled(true),
            disableSubmit: () => setSubmitEnabled(false),
            enableSaveDefault: () => setSaveDefaultEnabled(true),
            disableSaveDefault: () => setSaveDefaultEnabled(false),
            initialRequest,
          },
          utils: {
            toDataQueryResponse,
          },
        })
      );
    },
    [
      appEvents,
      data,
      eventBus,
      initialRef,
      initialRequest,
      notifyError,
      notifySuccess,
      notifyWarning,
      onChangeElements,
      onChangeSectionExpandedState,
      onOptionsChange,
      options,
      replaceVariables,
      sectionsExpandedState,
      templateSrv,
    ]
  );

  /**
   * Subscribe on change value event
   */
  useEffect(() => {
    const subscription = elementsEventBus.subscribe(ValueChangedEvent, (event) => {
      onElementValueChanged(event.payload);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [elementsEventBus, eventBus, onElementValueChanged]);

  /**
   * Return
   */
  return (
    <div
      data-testid={TEST_IDS.panel.root}
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
          padding: ${options.layout.padding}px;
        `
      )}
    >
      {loading === LoadingMode.INITIAL && (
        <div className={styles.loadingBar} data-testid={TEST_IDS.panel.loadingBar}>
          <LoadingBar width={width} />
        </div>
      )}

      {!elements.length && options.layout.variant !== LayoutVariant.NONE && (
        <Alert data-testid={TEST_IDS.panel.infoMessage} severity="info" title="Form Elements">
          Please add elements in Panel Options or Custom Code.
        </Alert>
      )}

      <div>
        {options.layout.variant === LayoutVariant.SINGLE ? (
          <div data-testid={TEST_IDS.panel.singleLayoutContent}>
            <FormElements
              data={data}
              options={options}
              elements={elements}
              onChangeElement={onChangeElement}
              initial={initial}
              section={null}
              replaceVariables={replaceVariables}
              executeCustomCode={executeCustomCode}
            />
          </div>
        ) : (
          <ElementSections
            data={data}
            options={options}
            elements={elements}
            onChangeElement={onChangeElement}
            initial={initial}
            replaceVariables={replaceVariables}
            sectionsExpandedState={sectionsExpandedState}
            onChangeSectionExpandedState={onChangeSectionExpandedState}
            executeCustomCode={executeCustomCode}
          />
        )}
      </div>
      <ButtonGroup className={cx(styles.button[options.buttonGroup.orientation])}>
        <CustomButtonsRow
          data={data}
          executeCustomCode={executeCustomCode}
          initial={initial}
          elements={elements}
          replaceVariables={replaceVariables}
        />
        {options.updateEnabled !== UpdateEnabledMode.DISABLED && (
          <Button
            className={cx(styles.margin)}
            variant={getButtonVariant(options.submit.variant)}
            icon={loading === LoadingMode.UPDATE ? 'fa fa-spinner' : options.submit.icon}
            title={title}
            style={
              options.submit.variant === ButtonVariant.CUSTOM
                ? {
                    background: 'none',
                    border: 'none',
                    backgroundColor: theme.visualization.getColorByName(options.submit.backgroundColor),
                    color: theme.visualization.getColorByName(options.submit.foregroundColor),
                  }
                : {}
            }
            disabled={isSubmitDisabled}
            onClick={
              options.update.confirm
                ? () => {
                    setUpdateConfirmation(true);
                  }
                : updateRequest
            }
            size={options.buttonGroup.size}
            data-testid={TEST_IDS.panel.buttonSubmit}
          >
            {options.submit.text}
          </Button>
        )}

        {options.reset.variant !== ButtonVariant.HIDDEN && (
          <Button
            className={cx(styles.margin)}
            variant={getButtonVariant(options.reset.variant)}
            icon={loading === LoadingMode.RESET ? 'fa fa-spinner' : options.reset.icon}
            style={
              options.reset.variant === ButtonVariant.CUSTOM
                ? {
                    background: 'none',
                    border: 'none',
                    backgroundColor: theme.visualization.getColorByName(options.reset.backgroundColor),
                    color: theme.visualization.getColorByName(options.reset.foregroundColor),
                  }
                : {}
            }
            disabled={!!loading || !resetEnabled}
            onClick={() => {
              if (options.resetAction.confirm) {
                setResetConfirmation(true);
                return;
              }

              resetRequest();
            }}
            size={options.buttonGroup.size}
            data-testid={TEST_IDS.panel.buttonReset}
          >
            {options.reset.text}
          </Button>
        )}

        {options.saveDefault.variant !== ButtonVariant.HIDDEN && canSaveDefaultValues && (
          <Button
            className={cx(styles.margin)}
            variant={getButtonVariant(options.saveDefault.variant)}
            icon={options.saveDefault.icon}
            disabled={!!loading || !saveDefaultEnabled}
            onClick={onSaveUpdates}
            size={options.buttonGroup.size}
            data-testid={TEST_IDS.panel.buttonSaveDefault}
            title="Save values in the dashboard. Requires to Save dashboard."
          >
            {options.saveDefault.text}
          </Button>
        )}
      </ButtonGroup>

      {error && (
        <Alert data-testid={TEST_IDS.panel.errorMessage} severity="error" title="Request">
          {error}
        </Alert>
      )}

      <ConfirmModal
        isOpen={updateConfirmation}
        title={options.confirmModal.title}
        body={
          <div data-testid={TEST_IDS.panel.confirmModalContent}>
            <h4>{options.confirmModal.body}</h4>
            {options.layout.variant !== LayoutVariant.NONE && options.confirmModal.columns.include.length > 0 && (
              <table className={styles.confirmTable}>
                <thead>
                  <tr className={styles.confirmTable}>
                    {options.confirmModal.columns.include.includes(ModalColumnName.NAME) && (
                      <td className={styles.confirmTableTd}>
                        <b>{options.confirmModal.columns.name}</b>
                      </td>
                    )}
                    {options.confirmModal.columns.include.includes(ModalColumnName.OLD_VALUE) && (
                      <td className={styles.confirmTableTd}>
                        <b>{options.confirmModal.columns.oldValue}</b>
                      </td>
                    )}
                    {options.confirmModal.columns.include.includes(ModalColumnName.NEW_VALUE) && (
                      <td className={styles.confirmTableTd}>
                        <b>{options.confirmModal.columns.newValue}</b>
                      </td>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {elements.map((element) => {
                    /**
                     * Skip not changed element
                     */
                    if (
                      element.value === initial[element.id] &&
                      options.confirmModal.elementDisplayMode !== ConfirmationElementDisplayMode.ALL
                    ) {
                      return;
                    }

                    /**
                     * Skip Disabled elements, which can be updated in the custom code as previous values
                     */
                    if (element.type === FormElementType.DISABLED) {
                      return;
                    }

                    /**
                     * Skip hidden element
                     */
                    if (
                      ('hidden' in element && element.hidden) ||
                      !element.helpers.showIf({ elements, replaceVariables })
                    ) {
                      return;
                    }

                    return (
                      <tr
                        className={styles.confirmTable}
                        key={element.id}
                        data-testid={TEST_IDS.panel.confirmModalField(element.id)}
                      >
                        {options.confirmModal.columns.include.includes(ModalColumnName.NAME) && (
                          <td className={styles.confirmTableTd} data-testid={TEST_IDS.panel.confirmModalFieldTitle}>
                            {element.title || element.tooltip}
                          </td>
                        )}
                        {options.confirmModal.columns.include.includes(ModalColumnName.OLD_VALUE) && (
                          <td
                            className={styles.confirmTableTd}
                            data-testid={TEST_IDS.panel.confirmModalFieldPreviousValue}
                          >
                            {formatElementValue(element, initial[element.id])}
                          </td>
                        )}
                        {options.confirmModal.columns.include.includes(ModalColumnName.NEW_VALUE) && (
                          <td className={styles.confirmTableTd} data-testid={TEST_IDS.panel.confirmModalFieldValue}>
                            {formatElementValue(element, element.value)}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        }
        confirmText={options.confirmModal.confirm}
        onConfirm={() => {
          updateRequest();
          setUpdateConfirmation(false);
        }}
        onDismiss={() => setUpdateConfirmation(false)}
        dismissText={options.confirmModal.cancel}
      />

      <ConfirmModal
        isOpen={resetConfirmation}
        title="Confirm reset values"
        body={<div data-testid={TEST_IDS.panel.resetConfirmModal}>Please confirm to reset values</div>}
        confirmText="Confirm"
        onConfirm={() => {
          resetRequest();
          setResetConfirmation(false);
        }}
        onDismiss={() => setResetConfirmation(false)}
      />
    </div>
  );
};
