import { AppEvents, EventBusSrv, FieldType, LoadingState, toDataFrame } from '@grafana/data';
import { getAppEvents, RefreshEvent } from '@grafana/runtime';
import { PanelContextProvider } from '@grafana/ui';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';

import {
  CONFIRM_MODAL_DEFAULT,
  ContentType,
  FORM_ELEMENT_DEFAULT,
  FormElementType,
  LayoutOrientation,
  LayoutVariant,
  PayloadMode,
  RequestMethod,
  ResetActionMode,
  SectionVariant,
  TEST_IDS,
} from '../../constants';
import { useDatasourceRequest } from '../../hooks';
import {
  ButtonOrientation,
  ButtonVariant,
  CustomButtonShow,
  FormElement,
  LocalFormElement,
  ModalColumnName,
  PanelOptions,
  UpdateEnabledMode,
} from '../../types';
import {
  getFormElementsSectionSelectors,
  getFormElementsSelectors,
  getPanelSelectors,
  toLocalFormElement,
} from '../../utils';
import { FormElements } from '../FormElements';
import { FormPanel } from './FormPanel';

/**
 * Mock Form Elements
 */
jest.mock('../FormElements', () => ({
  FormElements: jest.fn(jest.requireActual('../FormElements').FormElements),
}));

/**
 * Mock @grafana/runtime
 */
const appEventsMock = {
  publish: jest.fn(),
};

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getAppEvents: jest.fn(() => appEventsMock),
}));

/**
 * Mock hooks
 */
const datasourceRequestMock = jest.fn(() =>
  Promise.resolve({
    data: [],
    state: LoadingState.Done,
  })
);

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useDatasourceRequest: jest.fn(() => datasourceRequestMock),
}));

/**
 * Panel
 */
describe('Panel', () => {
  /**
   * Panel Selectors
   */
  const selectors = getPanelSelectors(screen);

  /**
   * Elements Selectors
   */
  const elementsSelectors = getFormElementsSelectors(screen);

  /**
   * Section Selectors
   */
  const sectionSelectors = getFormElementsSectionSelectors(screen);

  /**
   * Replace variables
   */
  const replaceVariablesMock = (code: string) => code;
  const replaceVariables = jest.fn(replaceVariablesMock);

  /**
   * Get Tested Component
   * @param props
   * @param options
   */
  const getComponent = ({ props = {}, options = {} } = {}) => {
    const finalOptions: any = {
      sync: true,
      submit: {},
      initial: {
        url: 'some-url',
        method: RequestMethod.POST,
        header: [
          {
            name: 'customHeader',
            value: '123',
          },
        ],
      },
      update: {
        url: 'some-url',
        method: RequestMethod.POST,
        header: [
          {
            name: 'customHeader',
            value: '123',
          },
        ],
      },
      updateEnabled: UpdateEnabledMode.AUTO,
      reset: {},
      saveDefault: {},
      layout: { variant: LayoutVariant.SINGLE },
      buttonGroup: { orientation: ButtonOrientation.CENTER },
      elements: [{ ...FORM_ELEMENT_DEFAULT, id: 'test' }],
      confirmModal: CONFIRM_MODAL_DEFAULT,
      resetAction: {},
      ...options,
    };

    const finalProps: any = {
      data: {
        state: LoadingState.Done,
      },
      eventBus: {
        getStream: jest.fn().mockImplementation(() => ({
          subscribe: jest.fn().mockImplementation(() => ({
            unsubscribe: jest.fn(),
          })),
        })),
      },
      replaceVariables,
      onOptionsChange: jest.fn(),
      ...props,
    };

    return <FormPanel {...finalProps} options={finalOptions} />;
  };

  beforeEach(() => {
    /**
     * Use datasource request
     */
    jest.mocked(useDatasourceRequest).mockReset();
    jest.mocked(useDatasourceRequest).mockReturnValue(datasourceRequestMock as any);

    jest.mocked(FormElements).mockClear();
    jest.mocked(FormElements).mockImplementation(jest.requireActual('../FormElements').FormElements);
    jest.mocked(fetch).mockClear();
    replaceVariables.mockClear();
    replaceVariables.mockImplementation(replaceVariablesMock);

    /**
     * App Events
     */
    jest.mocked(getAppEvents).mockReset();
    jest.mocked(getAppEvents).mockReturnValue(appEventsMock as any);
    appEventsMock.publish.mockReset();
  });

  it('Should find component with Elements', async () => {
    await act(async () => render(getComponent()));
    expect(selectors.root()).toBeInTheDocument();
  });

  /**
   * Alert
   */
  it('Should find component with Alert message if no elements', async () => {
    await act(async () => render(getComponent({ options: { elements: [] } })));
    expect(selectors.infoMessage()).toBeInTheDocument();
  });

  /**
   * Single Layout
   */
  it('Should render single layout', async () => {
    await act(async () => render(getComponent()));
    expect(selectors.singleLayoutContent()).toBeInTheDocument();
  });

  /**
   * Split Layout
   */
  it('Should render split layout', async () => {
    await act(async () =>
      render(
        getComponent({
          options: {
            layout: {
              variant: LayoutVariant.SPLIT,
              sections: [{ name: 'section1' }, { name: 'section2' }],
            },
          },
        })
      )
    );
    expect(selectors.splitLayoutContent(false, 'section1')).toBeInTheDocument();
    expect(selectors.splitLayoutContent(false, 'section2')).toBeInTheDocument();
  });

  /**
   * Split Vertical Layout
   */
  it('Should render split vertical layout', async () => {
    await act(async () =>
      render(
        getComponent({
          options: {
            layout: {
              variant: LayoutVariant.SPLIT,
              orientation: LayoutOrientation.VERTICAL,
              sections: [{ name: 'section1' }, { name: 'section2' }],
            },
          },
        })
      )
    );
    expect(selectors.splitLayoutContent(false, 'section1')).toBeInTheDocument();
    expect(selectors.splitLayoutContent(false, 'section2')).toBeInTheDocument();
  });

  /**
   * Split Vertical Layout with collapsable
   */
  it('Should render split vertical layout with collapsable', async () => {
    await act(async () =>
      render(
        getComponent({
          options: {
            elements: [{ ...FORM_ELEMENT_DEFAULT, section: 'section1', id: 'test' }],
            layout: {
              variant: LayoutVariant.SPLIT,
              orientation: LayoutOrientation.VERTICAL,
              sectionVariant: SectionVariant.COLLAPSABLE,
              sections: [
                { name: 'section1', id: 'section1' },
                { name: 'section2', id: 'section2' },
              ],
            },
          },
        })
      )
    );

    expect(selectors.splitLayoutContent(false, 'section1')).toBeInTheDocument();
    expect(selectors.splitLayoutContent(false, 'section2')).toBeInTheDocument();

    expect(sectionSelectors.sectionHeader(true, 'section1', 'section1')).toBeInTheDocument();
  });

  /**
   * Buttons
   */
  it('Should render buttons ', async () => {
    await act(async () => render(getComponent()));

    expect(selectors.buttonSubmit()).toBeInTheDocument();
    expect(selectors.buttonReset()).toBeInTheDocument();
  });

  it('Should render custom buttons after form buttons ', async () => {
    /**
     * Render
     */
    const replaceVariables = jest.fn((code) => code);

    await act(async () =>
      render(
        getComponent({
          props: {
            replaceVariables,
          },
          options: {
            initial: {
              method: RequestMethod.NONE,
            },
            elements: [
              { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
              { type: FormElementType.NUMBER, id: 'number', value: 111, unit: 'test' },
              { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              { type: FormElementType.STRING, id: 'string1', value: 'str1' },
              { type: FormElementType.STRING, id: 'string2', value: 'str2' },
              {
                type: FormElementType.CUSTOM_BUTTON,
                id: 'button1',
                value: '',
                customCode: `context.grafana.notifySuccess("success");`,
                title: 'Custom Button',
                buttonLabel: 'Test 1',
                show: CustomButtonShow.BOTTOM,
                unit: 'test 2',
                foregroundColor: 'red',
                backgroundColor: '#3274D9',
                variant: ButtonVariant.PRIMARY,
              },
            ],
          },
        })
      )
    );

    expect(selectors.buttonSubmit()).toBeInTheDocument();
    expect(selectors.buttonReset()).toBeInTheDocument();
    expect(elementsSelectors.customButtonsRow()).toBeInTheDocument();

    expect(elementsSelectors.fieldCustomButtonContainer(true)).not.toBeInTheDocument();

    expect(elementsSelectors.fieldCustomButton(false, 'button1')).toBeInTheDocument();
  });
  it('Should render custom buttons after form buttons and execute code', async () => {
    /**
     * Render
     */
    const replaceVariables = jest.fn((code) => code);

    await act(async () =>
      render(
        getComponent({
          props: {
            replaceVariables,
          },
          options: {
            initial: {
              method: RequestMethod.NONE,
            },
            elements: [
              { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
              { type: FormElementType.NUMBER, id: 'number', value: 111, unit: 'test' },
              { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              { type: FormElementType.STRING, id: 'string1', value: 'str1' },
              { type: FormElementType.STRING, id: 'string2', value: 'str2' },
              {
                type: FormElementType.CUSTOM_BUTTON,
                id: 'button1',
                value: '',
                customCode: `context.grafana.notifySuccess("success");`,
                title: 'Custom Button',
                buttonLabel: 'Test 1',
                show: CustomButtonShow.BOTTOM,
                unit: 'test 2',
                foregroundColor: 'red',
                backgroundColor: '#3274D9',
                variant: ButtonVariant.CUSTOM,
              },
            ],
          },
        })
      )
    );

    expect(selectors.buttonSubmit()).toBeInTheDocument();
    expect(selectors.buttonReset()).toBeInTheDocument();
    expect(elementsSelectors.customButtonsRow()).toBeInTheDocument();

    expect(elementsSelectors.fieldCustomButtonContainer(true)).not.toBeInTheDocument();

    expect(elementsSelectors.fieldCustomButton(false, 'button1')).toBeInTheDocument();

    expect(elementsSelectors.fieldCustomButton(false, 'button1')).toHaveStyle({
      'background-color': 'rgb(50, 116, 217)',
    });

    /**
     * Run Execute code
     */
    await act(async () => {
      fireEvent.click(elementsSelectors.fieldCustomButton(false, 'button1'));
    });

    expect(replaceVariables).toHaveBeenCalledWith('context.grafana.notifySuccess("success");');
    expect(appEventsMock.publish).toHaveBeenCalledWith({
      type: AppEvents.alertSuccess.name,
      payload: 'success',
    });
  });

  /**
   * Initial Request
   */
  describe('Initial request', () => {
    it('Should make initial request once', async () => {
      let fetchCalledOptions: any = {};
      jest.mocked(fetch).mockImplementationOnce((url, options) => {
        fetchCalledOptions = options;
        return Promise.resolve({
          json: Promise.resolve({}),
        } as any);
      });

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            props: {},
          })
        )
      );

      /**
       * Check if fetch is called
       */
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'some-url',
        expect.objectContaining({
          method: RequestMethod.POST,
        })
      );
      expect(fetchCalledOptions.headers.get('customHeader')).toEqual('123');
    });

    it('Should make initial request once if sync disabled', async () => {
      let fetchCalledOptions: any = {};
      jest.mocked(fetch).mockImplementationOnce((url, options) => {
        fetchCalledOptions = options;
        return Promise.resolve({
          json: Promise.resolve({}),
        } as any);
      });

      /**
       * Render
       */
      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              sync: false,
            },
          })
        )
      );

      rerender(
        getComponent({
          options: {
            sync: false,
          },
        })
      );

      /**
       * Check if fetch is called
       */
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'some-url',
        expect.objectContaining({
          method: RequestMethod.POST,
        })
      );
      expect(fetchCalledOptions.headers.get('customHeader')).toEqual('123');
    });

    it('Should show error if initial request failed', async () => {
      jest.mocked(fetch).mockRejectedValueOnce(new Error('message'));

      /**
       * Render
       */
      await act(async () => render(getComponent()));

      /**
       * Check if http error message shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(within(selectors.errorMessage()).getByText('Error: message')).toBeInTheDocument();
    });

    it('Should show error if error while execution', async () => {
      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: `throw new Error('execution error')`,
              },
            },
            props: {},
          })
        )
      );

      /**
       * Check if execution error message shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(within(selectors.errorMessage()).getByText('Error: execution error')).toBeInTheDocument();
    });

    it('Should make initial datasource request', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
          state: LoadingState.Done,
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '123',
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
            },
            props: {},
          })
        )
      );

      expect(datasourceRequestMock).toHaveBeenCalledWith({
        datasource: '123',
        payload: { key1: 'value' },
        replaceVariables: expect.any(Function),
        query: {
          sql: 'select *;',
        },
      });

      /**
       * Check if replace variables called for get payload function
       */
      expect(replaceVariables).toHaveBeenCalledTimes(1);
    });

    it('Should update elements with query result', async () => {
      /**
       * Render
       */
      await act(async () => {
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.QUERY,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'mapped',
                  queryField: {
                    refId: 'A',
                    value: 'metric',
                  },
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  queryField: undefined,
                },
              ],
            },
            props: {
              data: {
                state: LoadingState.Done,
                series: [
                  toDataFrame({
                    fields: [
                      {
                        name: 'metric',
                        values: ['metricA1', 'metricA2'],
                      },
                    ],
                    refId: 'A',
                  }),
                  toDataFrame({
                    fields: [
                      {
                        name: 'metric',
                        values: ['metricB1', 'metricB2'],
                      },
                    ],
                    refId: 'B',
                  }),
                ],
              },
            },
          })
        );

        await waitFor(() => expect(selectors.loadingBar(true)).not.toBeInTheDocument());
      });

      expect(FormElements).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: 'metricA2',
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );
    });

    it('Should not update elements if no query result', async () => {
      /**
       * Render
       */
      await act(async () => {
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.QUERY,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'mapped',
                  queryFieldName: 'metric',
                  value: '123',
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  queryFieldName: '',
                },
              ],
            },
            props: {
              data: {
                series: [],
              },
            },
          })
        );
        await waitFor(() => expect(selectors.loadingBar(true)).not.toBeInTheDocument());
      });

      expect(FormElements).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: '123',
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );
    });

    it('Should update elements with initial datasource result', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          state: LoadingState.Done,
          data: [
            toDataFrame({
              fields: [
                {
                  name: 'metric',
                  type: FieldType.string,
                  values: ['metric1', 'metric2'],
                },
              ],
            }),
          ],
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '123',
                getPayload: `return { key1: 'value' }`,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'mapped',
                  fieldName: 'metric',
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  fieldName: '',
                },
              ],
            },
            props: {},
          })
        )
      );

      expect(FormElements).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: 'metric2',
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );

      /**
       * Check if replace variables called for get payload function
       */
      expect(replaceVariables).toHaveBeenCalledTimes(1);
    });

    it('Should not update elements if datasource is unspecified', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          state: LoadingState.Done,
          data: [
            toDataFrame({
              fields: [
                {
                  name: 'metric',
                  type: FieldType.string,
                  values: ['metric1', 'metric2'],
                },
              ],
            }),
          ],
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementationOnce(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '',
                getPayload: `return { key1: 'value' }`,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'mapped',
                  fieldName: 'metric',
                  value: '123',
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  fieldName: '',
                },
              ],
            },
            props: {},
          })
        )
      );

      expect(FormElements).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: '123',
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );
    });

    it('Should show initial datasource request error', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.reject({
          data: [],
          state: LoadingState.Error,
        })
      );
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () => {
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '123',
                getPayload: `return { key1: 'value' }`,
              },
            },
            props: {},
          })
        );
      });

      await waitFor(() => expect(selectors.errorMessage()).toBeInTheDocument());
    });

    it('Should show error if initial request parameter is not defined', async () => {
      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables: () => null,
            },
          })
        )
      );

      /**
       * Check if request parameters error message is shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(
        within(selectors.errorMessage()).getByText('All request parameters should be defined. Remove empty parameters.')
      ).toBeInTheDocument();
    });

    it('Should show cors error', async () => {
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            type: 'opaque',
          }) as any
      );

      /**
       * Render
       */
      await act(async () => render(getComponent()));

      /**
       * Check if cors error message is shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(
        within(selectors.errorMessage()).getByText('CORS prevents access to the response for Initial values.')
      ).toBeInTheDocument();
    });

    it('Should make initial request on data change', async () => {
      /**
       * Render
       */
      const { rerender } = await act(async () =>
        render(
          getComponent({
            props: {
              data: {
                state: LoadingState.Done,
              },
            },
          })
        )
      );

      /**
       * Check if fetch is called
       */
      expect(fetch).toHaveBeenCalledTimes(1);

      await act(async () =>
        rerender(
          getComponent({
            props: {
              data: {
                state: LoadingState.Done,
              },
            },
          })
        )
      );

      /**
       * Check if fetch is called again
       */
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('Should make initial request once', async () => {
      let fetchCalledOptions: any = {};
      jest.mocked(fetch).mockImplementationOnce((url, options) => {
        fetchCalledOptions = options;
        return Promise.resolve({
          json: Promise.resolve({}),
        } as any);
      });

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            props: {},
          })
        )
      );

      /**
       * Check if fetch is called
       */
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'some-url',
        expect.objectContaining({
          method: RequestMethod.POST,
        })
      );
      expect(fetchCalledOptions.headers.get('customHeader')).toEqual('123');
    });

    it('Should enable submit from code', async () => {
      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: `context.panel.enableSubmit()`,
              },
              updateEnabled: UpdateEnabledMode.MANUAL,
            },
          })
        )
      );

      expect(selectors.buttonSubmit()).not.toBeDisabled();
    });

    it('Should disable submit from code', async () => {
      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: `context.panel.disableSubmit()`,
              },
              updateEnabled: UpdateEnabledMode.MANUAL,
            },
          })
        )
      );

      expect(selectors.buttonSubmit()).toBeDisabled();
    });

    describe('Dashboard Refresh', () => {
      /**
       * Event Bus
       */
      const eventBus = new EventBusSrv();

      it('Should make initial request on dashboard refresh', async () => {
        const data = {
          state: LoadingState.Done,
        };

        /**
         * Render
         */
        await act(async () =>
          render(
            getComponent({
              props: {
                data,
                eventBus,
              },
            })
          )
        );

        /**
         * Check if fetch is called
         */
        expect(fetch).toHaveBeenCalledTimes(1);

        /**
         * Simulate Dashboard Refresh
         */
        await act(async () => {
          eventBus.publish(new RefreshEvent());
        });

        /**
         * Check if fetch is called again
         */
        expect(fetch).toHaveBeenCalledTimes(2);
      });

      it('Should not make initial request on dashboard refresh if sync disabled', async () => {
        const data = {
          state: LoadingState.Done,
        };

        /**
         * Render
         */
        await act(async () =>
          render(
            getComponent({
              props: {
                data,
                eventBus,
              },
              options: {
                sync: false,
              },
            })
          )
        );

        /**
         * Check if fetch is called
         */
        expect(fetch).toHaveBeenCalledTimes(1);

        /**
         * Simulate Dashboard Refresh
         */
        await act(async () => {
          eventBus.publish(new RefreshEvent());
        });

        /**
         * Check if fetch is not called again
         */
        expect(fetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  /**
   * Update request
   */
  describe('Update request', () => {
    it('Should run update request', async () => {
      /**
       * Render
       */
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: jest.fn(() =>
              Promise.resolve({
                test: '123',
                number: 123,
              })
            ),
          }) as any
      );
      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );

      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                url: 'update-url',
                method: RequestMethod.POST,
                payloadMode: PayloadMode.UPDATED,
              },
            },
          })
        )
      );

      /**
       * Clear fetch mock
       */
      let requestData: Record<string, string> = {};
      jest.mocked(fetch).mockClear();
      jest.mocked(fetch).mockImplementationOnce((url, options) => {
        requestData = JSON.parse((options?.body as any) || '{}');
        return Promise.resolve({
          ok: true,
          json: jest.fn(() =>
            Promise.resolve({
              test: '123',
            })
          ),
        }) as any;
      });

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(fetch).toHaveBeenCalledWith(
        'update-url',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );

      /**
       * Check if only updated elements are sent
       */
      expect(requestData).toEqual({
        number: 111,
      });
    });

    it('Should run update request with form data', async () => {
      /**
       * Render
       */
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: jest.fn(() =>
              Promise.resolve({
                test: '123',
                number: 123,
              })
            ),
          }) as any
      );
      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );

      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                url: 'update-url',
                method: RequestMethod.POST,
                payloadMode: PayloadMode.UPDATED,
                contentType: ContentType.FORMDATA,
              },
            },
          })
        )
      );

      /**
       * Clear fetch mock
       */
      let requestData: FormData | any = undefined;
      jest.mocked(fetch).mockClear();
      jest.mocked(fetch).mockImplementationOnce((url, options) => {
        if (options?.body instanceof FormData) {
          requestData = options.body;
        }
        return Promise.resolve({
          ok: true,
          json: jest.fn(() =>
            Promise.resolve({
              test: '123',
            })
          ),
        }) as any;
      });

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(fetch).toHaveBeenCalledWith(
        'update-url',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );

      /**
       * Check if only updated elements are sent
       */
      expect(requestData.get('number')).toEqual('111');
    });

    it('Should show parameters error', async () => {
      /**
       * Render
       */
      const { rerender } = await act(async () => render(getComponent()));

      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            props: {
              replaceVariables: () => null,
            },
            options: {
              elements: [{ ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' }],
            },
          })
        )
      );

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(
        within(selectors.errorMessage()).getByText('All request parameters should be defined. Remove empty parameters.')
      ).toBeInTheDocument();
    });

    it('Should run update datasource request', async () => {
      /**
       * Render
       */
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: jest.fn(() =>
              Promise.resolve({
                test: '123',
                number: 123,
              })
            ),
          }) as any
      );

      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
          state: LoadingState.Done,
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );
      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                datasource: 'abc',
                method: RequestMethod.DATASOURCE,
                payloadMode: PayloadMode.CUSTOM,
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
            },
          })
        )
      );

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(datasourceRequestMock).toHaveBeenCalledWith({
        datasource: 'abc',
        payload: {
          key1: 'value',
        },
        replaceVariables: expect.any(Function),
        query: {
          sql: 'select *;',
        },
      });
    });

    it('Should show update datasource request error', async () => {
      /**
       * Render
       */
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: jest.fn(() =>
              Promise.resolve({
                test: '123',
                number: 123,
              })
            ),
          }) as any
      );

      const datasourceRequestMock = jest.fn(() =>
        Promise.reject({
          data: [],
          state: LoadingState.Error,
        })
      );
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );
      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                datasource: 'abc',
                method: RequestMethod.DATASOURCE,
                payloadMode: PayloadMode.CUSTOM,
                getPayload: `return { key1: 'value' }`,
              },
            },
          })
        )
      );

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      await waitFor(() => expect(selectors.errorMessage()).toBeInTheDocument());
    });

    it('Should show http error', async () => {
      /**
       * Render
       */
      const { rerender } = await act(async () => render(getComponent()));

      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [{ ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' }],
            },
          })
        )
      );

      /**
       * Clear fetch mock
       */
      jest.mocked(fetch).mockClear();
      jest.mocked(fetch).mockRejectedValueOnce(new Error('message'));

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(within(selectors.errorMessage()).getByText('Error: message')).toBeInTheDocument();
    });

    it('Should run update request after update confirmation', async () => {
      /**
       * Render
       */
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: jest.fn(() =>
              Promise.resolve({
                test: '123',
                number: 123,
              })
            ),
          }) as any
      );
      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
              update: {
                confirm: true,
              },
            },
          })
        )
      );

      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                url: 'update-url',
                method: RequestMethod.POST,
                payloadMode: PayloadMode.UPDATED,
                confirm: true,
              },
            },
          })
        )
      );

      /**
       * Clear fetch mock
       */
      let requestData: Record<string, string> = {};
      jest.mocked(fetch).mockClear();
      jest.mocked(fetch).mockImplementationOnce((url, options) => {
        requestData = JSON.parse((options?.body as any) || '{}');
        return Promise.resolve({
          ok: true,
          json: jest.fn(() =>
            Promise.resolve({
              test: '123',
            })
          ),
        }) as any;
      });

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update confirmation
       */
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      /**
       * Confirm update
       */
      expect(selectors.buttonConfirmUpdate()).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(selectors.buttonConfirmUpdate());
      });

      expect(fetch).toHaveBeenCalledWith(
        'update-url',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );

      /**
       * Check if only updated elements are sent
       */
      expect(requestData).toEqual({
        number: 111,
      });
    });
  });

  /**
   * Code execution
   */
  describe('Code execution', () => {
    it('Should execute code on initial request', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: 'context.grafana.notifySuccess("success"); context.grafana.notifyError("error"); context.grafana.notifyWarning("warning");',
              },
            },
          })
        )
      );

      expect(replaceVariables).toHaveBeenCalledWith(
        'context.grafana.notifySuccess("success"); context.grafana.notifyError("error"); context.grafana.notifyWarning("warning");'
      );
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertSuccess.name,
        payload: 'success',
      });
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertError.name,
        payload: 'error',
      });
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertWarning.name,
        payload: 'warning',
      });
    });

    it('Should execute code on update request', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const defaultOptions = {
        initial: {},
        update: {
          method: RequestMethod.NONE,
          code: 'context.grafana.notifySuccess("success"); context.grafana.notifyError("error");',
        },
      };
      const { rerender } = await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: defaultOptions,
          })
        )
      );

      await act(async () =>
        rerender(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              ...defaultOptions,
              elements: [
                { id: 'test', type: FormElementType.STRING, value: '111' },
                { id: 'test2', type: FormElementType.NUMBER, value: 10 },
              ],
            },
          })
        )
      );

      jest.mocked(replaceVariables).mockClear();
      jest.mocked(appEventsMock.publish).mockClear();

      expect(selectors.buttonSubmit()).not.toBeDisabled();
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(replaceVariables).toHaveBeenCalledWith(defaultOptions.update.code);
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertSuccess.name,
        payload: 'success',
      });
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertError.name,
        payload: 'error',
      });
    });
  });

  describe('Reset actions', () => {
    it('Should execute initial code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const defaultOptions = {
        initial: {
          code: `notifySuccess("success");`,
        },
        update: {},
        resetAction: {
          mode: ResetActionMode.INITIAL,
          code: 'notifyError("error");',
        },
      };
      const { rerender } = await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: defaultOptions,
          })
        )
      );

      await act(async () =>
        rerender(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              ...defaultOptions,
              elements: [
                { id: 'test', type: FormElementType.STRING, value: '111' },
                { id: 'test2', type: FormElementType.NUMBER, value: 10 },
              ],
            },
          })
        )
      );

      jest.mocked(replaceVariables).mockClear();
      jest.mocked(appEventsMock.publish).mockClear();

      expect(selectors.buttonReset()).not.toBeDisabled();
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      /**
       * Check if URL message shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(within(selectors.errorMessage()).getByText('Please select URL for Initial Request.')).toBeInTheDocument();
    });

    it('Should execute custom reset code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const defaultOptions = {
        initial: {
          code: `context.grafana.notifyError("error");`,
        },
        update: {},
        resetAction: {
          mode: ResetActionMode.CUSTOM,
          code: 'context.grafana.notifySuccess("success");',
        },
      };
      const { rerender } = await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: defaultOptions,
          })
        )
      );

      await act(async () =>
        rerender(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              ...defaultOptions,
              elements: [
                { id: 'test', type: FormElementType.STRING, value: '111' },
                { id: 'test2', type: FormElementType.NUMBER, value: 10 },
              ],
            },
          })
        )
      );

      jest.mocked(replaceVariables).mockClear();
      jest.mocked(appEventsMock.publish).mockClear();

      expect(selectors.buttonReset()).not.toBeDisabled();
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      expect(replaceVariables).toHaveBeenCalledWith(defaultOptions.resetAction.code);
      expect(replaceVariables).toHaveBeenCalledTimes(1);
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertSuccess.name,
        payload: 'success',
      });
      expect(appEventsMock.publish).not.toHaveBeenCalledWith({
        type: AppEvents.alertError.name,
        payload: 'error',
      });
    });

    it('Should run reset datasource request', async () => {
      /**
       * Render
       */
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: jest.fn(() =>
              Promise.resolve({
                test: '123',
                number: 123,
              })
            ),
          }) as any
      );

      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
          state: LoadingState.Done,
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );
      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              resetAction: {
                datasource: 'abc',
                mode: ResetActionMode.DATASOURCE,
                payloadMode: PayloadMode.CUSTOM,
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
            },
          })
        )
      );

      /**
       * Check if Reset can be run
       */
      expect(selectors.buttonReset()).toBeInTheDocument();
      expect(selectors.buttonReset()).not.toBeDisabled();

      /**
       * Reset replaceVariables calls count
       */
      replaceVariables.mockClear();

      /**
       * Run reset request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      expect(datasourceRequestMock).toHaveBeenCalledWith({
        datasource: 'abc',
        payload: {
          key1: 'value',
        },
        replaceVariables: expect.any(Function),
        query: {
          sql: 'select *;',
        },
      });

      /**
       * Check if replace variables called for get payload function
       */
      expect(replaceVariables).toHaveBeenCalledTimes(1);
    });

    it('Should not run reset datasource request if datasource not specified', async () => {
      /**
       * Render
       */
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: jest.fn(() =>
              Promise.resolve({
                test: '123',
                number: 123,
              })
            ),
          }) as any
      );

      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
          state: LoadingState.Done,
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );
      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              resetAction: {
                datasource: '',
                mode: ResetActionMode.DATASOURCE,
                payloadMode: PayloadMode.CUSTOM,
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
            },
          })
        )
      );

      /**
       * Check if Reset can be run
       */
      expect(selectors.buttonReset()).toBeInTheDocument();
      expect(selectors.buttonReset()).not.toBeDisabled();

      /**
       * Reset replaceVariables calls count
       */
      replaceVariables.mockClear();

      /**
       * Run reset request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      expect(datasourceRequestMock).not.toHaveBeenCalled();

      /**
       * Check if replace variables called for get payload function
       */
      expect(replaceVariables).toHaveBeenCalledTimes(0);
    });

    it('Should show reset datasource request error', async () => {
      /**
       * Render
       */
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: jest.fn(() =>
              Promise.resolve({
                test: '123',
                number: 123,
              })
            ),
          }) as any
      );

      const datasourceRequestMock = jest.fn(() =>
        Promise.reject({
          data: [],
          state: LoadingState.Error,
        })
      );
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );
      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              resetAction: {
                datasource: 'abc',
                mode: ResetActionMode.DATASOURCE,
                payloadMode: PayloadMode.CUSTOM,
                getPayload: `return { key1: 'value' }`,
              },
            },
          })
        )
      );

      /**
       * Check if Reset can be run
       */
      expect(selectors.buttonReset()).toBeInTheDocument();
      expect(selectors.buttonReset()).not.toBeDisabled();

      /**
       * Run reset request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      await waitFor(() => expect(selectors.errorMessage()).toBeInTheDocument());
    });

    it('Should ask to confirm', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const defaultOptions = {
        initial: {
          code: `context.grafana.notifySuccess("success");`,
        },
        update: {},
        resetAction: {
          mode: ResetActionMode.CUSTOM,
          code: 'context.grafana.notifySuccess("success");',
          confirm: true,
        },
      };

      const { rerender } = await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: defaultOptions,
          })
        )
      );

      await act(async () =>
        rerender(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              ...defaultOptions,
              elements: [
                { id: 'test', type: FormElementType.STRING, value: '111' },
                { id: 'test2', type: FormElementType.NUMBER, value: 10 },
              ],
            },
          })
        )
      );

      jest.mocked(replaceVariables).mockClear();
      jest.mocked(appEventsMock.publish).mockClear();

      expect(selectors.buttonReset()).not.toBeDisabled();
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      /**
       * Check if confirmation shown
       */
      expect(selectors.resetConfirmModal()).toBeInTheDocument();

      /**
       * Confirm reset
       */
      await act(async () => fireEvent.click(selectors.buttonConfirmReset()));

      expect(appEventsMock.publish).toHaveBeenCalled();
    });
  });

  describe('Confirm changes', () => {
    const prepareComponent = async (options?: Partial<PanelOptions>) => {
      let triggerChangeElement: (element: LocalFormElement) => void = jest.fn();
      jest.mocked(FormElements).mockImplementation(({ onChangeElement }) => {
        triggerChangeElement = onChangeElement;
        return null;
      });

      const elementWithoutInitialValue = toLocalFormElement({
        ...FORM_ELEMENT_DEFAULT,
        id: 'test',
        title: 'Field',
        value: '123',
        uid: 'test123',
      } as FormElement & { type: FormElementType.STRING });
      const elementWithInitialValue = toLocalFormElement({
        ...FORM_ELEMENT_DEFAULT,
        id: 'string',
        title: 'Field 2',
        value: '',
        uid: 'string123',
      } as FormElement & { type: FormElementType.STRING });
      const initialValues = {
        [elementWithInitialValue.id]: 'abc',
      };
      jest.mocked(fetch).mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          json: jest.fn(() => Promise.resolve(initialValues)),
        } as any);
      });

      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [elementWithInitialValue, elementWithoutInitialValue],
              update: { confirm: true },
              ...options,
            },
          })
        )
      );

      return {
        triggerChangeElement,
        elementWithoutInitialValue: elementWithoutInitialValue as LocalFormElement & { type: FormElementType.STRING },
        elementWithInitialValue: elementWithInitialValue as LocalFormElement & { type: FormElementType.STRING },
        initialValues,
      };
    };

    it('Should show changed values if field has initial value', async () => {
      const { triggerChangeElement, elementWithInitialValue, initialValues } = await prepareComponent();

      /**
       * Trigger field change
       */
      await act(async () =>
        triggerChangeElement({
          ...elementWithInitialValue,
          value: '111',
        })
      );

      /**
       * Check if submit button is enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Open confirm modal
       */
      await act(async () => fireEvent.click(selectors.buttonSubmit()));

      /**
       * Check confirm modal presence
       */
      expect(selectors.confirmModalContent()).toBeInTheDocument();

      /**
       * Check updated field presence in confirm modal
       */
      const updatedField = selectors.confirmModalField(false, elementWithInitialValue.id);
      expect(updatedField).toBeInTheDocument();

      /**
       * Check correct data is shown for updated field
       */
      const updatedFieldSelectors = getPanelSelectors(within(updatedField));
      expect(updatedFieldSelectors.confirmModalFieldTitle()).toHaveTextContent(elementWithInitialValue.title);
      expect(updatedFieldSelectors.confirmModalFieldPreviousValue()).toHaveTextContent(
        initialValues[elementWithInitialValue.id]
      );
      expect(updatedFieldSelectors.confirmModalFieldValue()).toHaveTextContent('111');
    });

    it('Should show changed values if field does not have initial value', async () => {
      const { triggerChangeElement, elementWithoutInitialValue } = await prepareComponent();

      /**
       * Trigger field change
       */
      await act(async () =>
        triggerChangeElement({
          ...elementWithoutInitialValue,
          value: '111',
        })
      );

      /**
       * Check if submit button is enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Open confirm modal
       */
      await act(async () => fireEvent.click(selectors.buttonSubmit()));

      /**
       * Check confirm modal presence
       */
      expect(selectors.confirmModalContent()).toBeInTheDocument();

      /**
       * Check updated field presence in confirm modal
       */
      const updatedField = selectors.confirmModalField(false, elementWithoutInitialValue.id);
      expect(updatedField).toBeInTheDocument();

      /**
       * Check correct data is shown for updated field
       */
      const updatedFieldSelectors = getPanelSelectors(within(updatedField));
      expect(updatedFieldSelectors.confirmModalFieldTitle()).toHaveTextContent(elementWithoutInitialValue.title);
      expect(updatedFieldSelectors.confirmModalFieldPreviousValue()).toHaveTextContent(
        elementWithoutInitialValue.value
      );
      expect(updatedFieldSelectors.confirmModalFieldValue()).toHaveTextContent('111');
    });

    it('Should not show hidden elements', async () => {
      let triggerChangeElement: (element: LocalFormElement) => void = jest.fn();
      jest.mocked(FormElements).mockImplementation(({ onChangeElement }) => {
        triggerChangeElement = onChangeElement;
        return null;
      });

      const elements = [
        toLocalFormElement({
          ...FORM_ELEMENT_DEFAULT,
          id: 'visible',
          title: 'Field',
          value: '1',
          uid: '1',
        } as FormElement & { type: FormElementType.STRING }),
        toLocalFormElement({
          ...FORM_ELEMENT_DEFAULT,
          id: 'hidden',
          title: 'Field',
          value: '2',
          uid: '2',
          hidden: true,
        } as FormElement & { type: FormElementType.STRING }),
        toLocalFormElement({
          ...FORM_ELEMENT_DEFAULT,
          id: 'hiddenByCode',
          title: 'Field',
          value: '3',
          uid: '3',
          hidden: true,
        } as FormElement & { type: FormElementType.STRING }),
      ];

      await act(async () =>
        render(
          getComponent({
            options: {
              elements,
              update: {
                confirm: true,
              },
            },
          })
        )
      );

      /**
       * Trigger field change
       */
      await act(async () => triggerChangeElement(elements[0]));

      /**
       * Check if submit button is enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Open confirm modal
       */
      await act(async () => fireEvent.click(selectors.buttonSubmit()));

      /**
       * Check confirm modal presence
       */
      expect(selectors.confirmModalContent()).toBeInTheDocument();

      /**
       * Check only visible field is shown
       */
      expect(selectors.confirmModalField(false, elements[0].id)).toBeInTheDocument();
      expect(selectors.confirmModalField(true, elements[1].id)).not.toBeInTheDocument();
      expect(selectors.confirmModalField(true, elements[2].id)).not.toBeInTheDocument();
    });

    it('Should show only included columns', async () => {
      const { triggerChangeElement, elementWithInitialValue } = await prepareComponent({
        confirmModal: {
          columns: {
            include: [ModalColumnName.NEW_VALUE],
          },
        } as any,
      });

      /**
       * Trigger field change
       */
      await act(async () =>
        triggerChangeElement({
          ...elementWithInitialValue,
          value: '111',
        })
      );

      /**
       * Check if submit button is enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Open confirm modal
       */
      await act(async () => fireEvent.click(selectors.buttonSubmit()));

      /**
       * Check confirm modal presence
       */
      expect(selectors.confirmModalContent()).toBeInTheDocument();

      /**
       * Check updated field presence in confirm modal
       */
      const updatedField = selectors.confirmModalField(false, elementWithInitialValue.id);
      expect(updatedField).toBeInTheDocument();

      /**
       * Check if only included columns are shown
       */
      const updatedFieldSelectors = getPanelSelectors(within(updatedField));
      expect(updatedFieldSelectors.confirmModalFieldTitle(true)).not.toBeInTheDocument();
      expect(updatedFieldSelectors.confirmModalFieldPreviousValue(true)).not.toBeInTheDocument();
      expect(updatedFieldSelectors.confirmModalFieldValue()).toBeInTheDocument();
    });

    it('Should not show table if no included columns', async () => {
      const { triggerChangeElement, elementWithInitialValue } = await prepareComponent({
        confirmModal: {
          columns: {
            include: [],
          },
        } as any,
      });

      /**
       * Trigger field change
       */
      await act(async () =>
        triggerChangeElement({
          ...elementWithInitialValue,
          value: '111',
        })
      );

      /**
       * Check if submit button is enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Open confirm modal
       */
      await act(async () => fireEvent.click(selectors.buttonSubmit()));

      /**
       * Check confirm modal presence
       */
      expect(selectors.confirmModalContent()).toBeInTheDocument();

      /**
       * Check no columns are show
       */
      expect(selectors.confirmModalField(true, elementWithInitialValue.id)).not.toBeInTheDocument();
    });
  });

  describe('Save default values', () => {
    it('Should update options', async () => {
      const onOptionsChange = jest.fn();
      let triggerChangeElement: (element: LocalFormElement) => void = jest.fn();
      jest.mocked(FormElements).mockImplementation(({ onChangeElement }) => {
        triggerChangeElement = onChangeElement;
        return null;
      });

      const elementWithoutInitialValue = toLocalFormElement({
        ...FORM_ELEMENT_DEFAULT,
        id: 'test',
        title: 'Field',
        value: '123',
        uid: 'test123',
      } as FormElement & { type: FormElementType.STRING });
      const elementWithInitialValue = toLocalFormElement({
        ...FORM_ELEMENT_DEFAULT,
        id: 'string',
        title: 'Field 2',
        value: '',
        uid: 'string123',
      } as FormElement & { type: FormElementType.STRING });
      const initialValues = {
        [elementWithInitialValue.id]: 'abc',
      };
      jest.mocked(fetch).mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          json: jest.fn(() => Promise.resolve(initialValues)),
        } as any);
      });

      await act(async () =>
        render(
          <PanelContextProvider value={{ canAddAnnotations: () => true } as any}>
            {getComponent({
              props: {
                onOptionsChange,
              },
              options: {
                elements: [elementWithInitialValue, elementWithoutInitialValue],
                saveDefault: {
                  variant: ButtonVariant.SECONDARY,
                },
              },
            })}
          </PanelContextProvider>
        )
      );

      await act(async () =>
        triggerChangeElement({
          ...elementWithoutInitialValue,
          value: '111',
        } as LocalFormElement & { type: FormElementType.STRING })
      );

      expect(selectors.buttonSaveDefault()).toBeInTheDocument();

      expect(onOptionsChange).not.toHaveBeenCalled();

      /**
       * Save Default values
       */
      await act(async () => fireEvent.click(selectors.buttonSaveDefault()));

      expect(onOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: elementWithoutInitialValue.id,
              value: '111',
            }),
            expect.objectContaining({
              id: elementWithInitialValue.id,
              value: initialValues[elementWithInitialValue.id],
            }),
          ]),
        })
      );
    });

    it('Should not show save default button if can not update dashboard', async () => {
      await act(async () =>
        render(
          <PanelContextProvider value={{ canAddAnnotations: () => false } as any}>
            {getComponent({
              options: {
                saveDefault: {
                  variant: ButtonVariant.SECONDARY,
                },
              },
            })}
          </PanelContextProvider>
        )
      );

      expect(selectors.buttonSaveDefault(true)).not.toBeInTheDocument();
    });
  });

  describe('Value Changed Code', () => {
    const element = {
      ...FORM_ELEMENT_DEFAULT,
      id: 'value',
    };

    beforeEach(() => {
      jest.mocked(FormElements).mockImplementation(({ onChangeElement, elements }) => {
        return (
          <input
            data-testid={TEST_IDS.formElements.fieldString}
            value={elements[0].value as string}
            onChange={(event) => {
              onChangeElement({
                ...elements[0],
                value: event.currentTarget.value,
              } as any);
            }}
          />
        );
      });
    });

    it('Should trigger if value changed', async () => {
      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                {
                  ...element,
                  value: '1',
                },
              ],
              elementValueChanged: `
                context.panel.disableSubmit();
              `,
            },
          })
        )
      );

      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Change to same value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '1' } }));

      /**
       * Value changed should not be called
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Change to new value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Should be enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();
    });

    it('Should allow to refresh dashboard', async () => {
      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                {
                  ...element,
                  value: '1',
                },
              ],
              elementValueChanged: `
                context.grafana.refresh();
              `,
            },
          })
        )
      );

      /**
       * Change value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Dashboard should be refreshed
       */
      expect(appEventsMock.publish).toHaveBeenCalledWith(expect.objectContaining({ type: 'variables-changed' }));
    });

    it('Should allow to manage submit button', async () => {
      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [element],
              elementValueChanged: `
                if (context.element.value === '11') {
                  context.panel.enableSubmit();
                } else {
                  context.panel.disableSubmit();
                }
              `,
              updateEnabled: UpdateEnabledMode.MANUAL,
            },
          })
        )
      );

      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).toBeDisabled();

      /**
       * Change to invalid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '1' } }));

      /**
       * Still should be disabled due to invalid value
       */
      expect(selectors.buttonSubmit()).toBeDisabled();

      /**
       * Change to valid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Should be enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();
    });

    it('Should allow to manage reset button', async () => {
      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [element],
              elementValueChanged: `
                if (context.element.value === '11') {
                  context.panel.enableReset();
                } else {
                  context.panel.disableReset();
                }
              `,
            },
          })
        )
      );

      expect(selectors.buttonReset()).toBeInTheDocument();
      expect(selectors.buttonReset()).not.toBeDisabled();

      /**
       * Change to invalid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '1' } }));

      /**
       * Still should be disabled due to invalid value
       */
      expect(selectors.buttonReset()).toBeDisabled();

      /**
       * Change to valid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Should be enabled
       */
      expect(selectors.buttonReset()).not.toBeDisabled();
    });

    it('Should allow to manage save default button', async () => {
      await act(async () =>
        render(
          <PanelContextProvider value={{ canAddAnnotations: () => true } as any}>
            {getComponent({
              options: {
                elements: [element],
                saveDefault: {
                  variant: ButtonVariant.SECONDARY,
                },
                elementValueChanged: `
                if (context.element.value === '11') {
                  context.panel.enableSaveDefault();
                } else {
                  context.panel.disableSaveDefault();
                }
              `,
              },
            })}
          </PanelContextProvider>
        )
      );

      expect(selectors.buttonSaveDefault()).toBeInTheDocument();
      expect(selectors.buttonSaveDefault()).not.toBeDisabled();

      /**
       * Change to invalid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '1' } }));

      /**
       * Still should be disabled due to invalid value
       */
      expect(selectors.buttonSaveDefault()).toBeDisabled();

      /**
       * Change to valid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Should be enabled
       */
      expect(selectors.buttonSaveDefault()).not.toBeDisabled();
    });
  });

  describe('Collapsable Sections', () => {
    it('Should expand section from the initial code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: false };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
                code: `
                  context.panel.expandSection("section1");
                `,
              },
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [section],
              },
            },
          })
        )
      );

      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(false, section.id, section.name)).toBeInTheDocument();
    });

    it('Should collapse section from the initial code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: true };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
                code: `
                  context.panel.collapseSection("section1");
                `,
              },
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [section],
              },
            },
          })
        )
      );

      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(true, section.id, section.name)).not.toBeInTheDocument();
    });

    it('Should toggle section from the initial code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: false };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
                code: `
                  context.panel.toggleSection("section1");
                `,
              },
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [section],
              },
            },
          })
        )
      );

      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(false, section.id, section.name)).toBeInTheDocument();
    });

    it('Should expand section from the value changed code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: false };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
              },
              elementValueChanged: `
                context.panel.expandSection("section1");
              `,
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [{ id: 'section2', name: 'Section 2', expanded: true }, section],
              },
              elements: [{ ...FORM_ELEMENT_DEFAULT, type: FormElementType.STRING, section: 'section2' }],
            },
          })
        )
      );

      /**
       * Trigger element value change
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(false), { target: { value: '123' } }));

      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(false, section.id, section.name)).toBeInTheDocument();
    });

    it('Should collapse section from the value changed code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: true };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
              },
              elementValueChanged: `
                context.panel.collapseSection("section1");
              `,
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [{ id: 'section2', name: 'Section 2', expanded: true }, section],
              },
              elements: [{ ...FORM_ELEMENT_DEFAULT, type: FormElementType.STRING, section: 'section2' }],
            },
          })
        )
      );

      /**
       * Check initial section state
       */
      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(false, section.id, section.name)).toBeInTheDocument();

      /**
       * Trigger element value change
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(false), { target: { value: '123' } }));

      /**
       * Check updated section state
       */
      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(true, section.id, section.name)).not.toBeInTheDocument();
    });

    it('Should toggle section from the value changed code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: true };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
              },
              elementValueChanged: `
                context.panel.toggleSection("section1");
              `,
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [{ id: 'section2', name: 'Section 2', expanded: true }, section],
              },
              elements: [{ ...FORM_ELEMENT_DEFAULT, type: FormElementType.STRING, section: 'section2' }],
            },
          })
        )
      );

      /**
       * Check initial section state
       */
      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(false, section.id, section.name)).toBeInTheDocument();

      /**
       * Trigger element value change
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(false), { target: { value: '123' } }));

      /**
       * Check updated section state
       */
      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(true, section.id, section.name)).not.toBeInTheDocument();
    });
  });
});
