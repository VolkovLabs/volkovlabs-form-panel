import { toDataFrame } from '@grafana/data';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';

import { FORM_ELEMENT_DEFAULT, FormElementType, OptionsSource } from '../../constants';
import { ButtonVariant, CustomButtonShow, LinkTarget } from '../../types';
import { getFormElementsSelectors, normalizeElementsForLocalState } from '../../utils';
import { FormElements } from './FormElements';

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * Mock @volkovlabs/components
 */
jest.mock('@volkovlabs/components');

/**
 * Form Elements
 */
describe('Form Elements', () => {
  const onChangeElement = jest.fn();
  /**
   * Form Elements Selectors
   */
  const selectors = getFormElementsSelectors(screen);

  /**
   * Get tested component
   * @param options
   * @param restProps
   */
  const getComponent = ({ options = {}, ...restProps }: any) => {
    return (
      <FormElements options={options} elements={normalizeElementsForLocalState(options.elements)} {...restProps} />
    );
  };

  describe('Render elements', () => {
    const options = {
      submit: {},
      initial: { highlight: true },
      update: {},
      reset: {},
      elements: [
        { ...FORM_ELEMENT_DEFAULT, id: 'string' },
        { id: 'password', type: FormElementType.PASSWORD },
        { id: 'number', type: FormElementType.NUMBER },
        { id: 'textarea', type: FormElementType.TEXTAREA },
        { id: 'code', type: FormElementType.CODE },
        { id: 'boolean', type: FormElementType.BOOLEAN },
        { id: 'datetime', type: FormElementType.DATETIME },
        { id: 'time', type: FormElementType.TIME },
        { id: 'radioGroup', type: FormElementType.RADIO },
        { id: 'checkboxList', type: FormElementType.CHECKBOX_LIST },
        { id: 'disabled', type: FormElementType.DISABLED },
        {
          id: 'disabledWithOptions',
          type: FormElementType.DISABLED,
          value: 'option',
          options: [{ value: 'option', label: 'OptionLabel' }],
        },
        {
          id: 'visibleByValue',
          type: FormElementType.STRING,
          value: '123',
          showIf: `
            const field = context.panel.elements.find((element) => element.id === 'disabledWithOptions');
            
            if (field) {
              return field.value === 'option'
            }
          `,
        },
        {
          id: 'hiddenByValue',
          type: FormElementType.STRING,
          value: '123',
          showIf: `
            const field = context.panel.elements.find((element) => element.id === 'disabledWithOptions');
            
            if (field) {
              return field.value !== 'option'
            }
          `,
        },
        { id: 'file', type: FormElementType.FILE },
        { id: 'highlighted', type: FormElementType.STRING, value: 'hello' },
        { id: 'disabledTextarea', type: FormElementType.DISABLED_TEXTAREA, value: 'hello' },
        {
          id: 'externalLink',
          type: FormElementType.LINK,
          value: 'https://123',
          target: LinkTarget.NEW_TAB,
          linkText: 'My Link',
          width: 10,
        },
        {
          id: 'internalLink',
          type: FormElementType.LINK,
          value: 'https://domain.com',
          target: LinkTarget.SELF_TAB,
          linkText: '',
        },
      ],
    };

    const findElementById = (id: string): any => {
      return options.elements.find((item) => item.id === id);
    };

    beforeEach(() => {
      render(getComponent({ options, onChangeElement, initial: { changed: 'bye' } }));
    });

    it('Should render container', () => {
      expect(selectors.root()).toBeInTheDocument();
    });

    it('Should render string field', () => {
      const elementOption = findElementById('string');
      const element = selectors.element(false, elementOption.id, elementOption.type);

      expect(element).toBeInTheDocument();

      const elementSelectors = getFormElementsSelectors(within(element));
      expect(elementSelectors.fieldString()).toBeInTheDocument();
    });

    it('Should render number field', () => {
      expect(selectors.fieldNumber()).toBeInTheDocument();
    });

    it('Should render password field', () => {
      expect(selectors.fieldPassword()).toBeInTheDocument();
    });

    it('Should render textarea field', () => {
      expect(selectors.fieldTextarea()).toBeInTheDocument();
    });

    it('Should render disabled textarea field', () => {
      expect(selectors.fieldDisabledTextarea()).toBeInTheDocument();
    });

    it('Should render code field', () => {
      expect(selectors.fieldCode()).toBeInTheDocument();
    });

    it('Should render radio field', () => {
      expect(selectors.fieldRadioContainer()).toBeInTheDocument();
    });

    it('Should render checkboxList field', () => {
      expect(selectors.fieldCheckboxListContainer()).toBeInTheDocument();
    });

    it('Should render dateTime field', () => {
      expect(selectors.fieldDateTime()).toBeInTheDocument();
    });
    it('Should render time field', () => {
      expect(selectors.fieldTime()).toBeInTheDocument();
    });
    it('Should render file field', () => {
      expect(selectors.fieldFile()).toBeInTheDocument();
    });

    it('Should render external link', () => {
      const elementOption = findElementById('externalLink');
      const element = selectors.element(false, elementOption.id, elementOption.type);

      expect(element).toBeInTheDocument();

      const elementSelectors = getFormElementsSelectors(within(element));
      expect(elementSelectors.link()).toBeInTheDocument();
      expect(elementSelectors.link()).toHaveTextContent('My Link');
      expect(elementSelectors.link()).toHaveProperty('target', '_blank');
    });

    it('Should render internal link', () => {
      const elementOption = findElementById('internalLink');
      const element = selectors.element(false, elementOption.id, elementOption.type);

      expect(element).toBeInTheDocument();

      const elementSelectors = getFormElementsSelectors(within(element));
      expect(elementSelectors.link()).toBeInTheDocument();
      expect(elementSelectors.link()).toHaveTextContent('https://domain.com');
      expect(elementSelectors.link()).toHaveProperty('target', '_self');
    });

    it('Should render disabled field', () => {
      const elementOption = findElementById('disabled');
      const element = selectors.element(false, elementOption.id, elementOption.type);

      expect(element).toBeInTheDocument();

      const elementSelectors = getFormElementsSelectors(within(element));
      expect(elementSelectors.fieldDisabled()).toBeInTheDocument();
    });

    it('Should render disabled field with option label', () => {
      const elementOption = findElementById('disabledWithOptions');
      const element = selectors.element(false, elementOption.id, elementOption.type);

      expect(element).toBeInTheDocument();

      const elementSelectors = getFormElementsSelectors(within(element));
      expect(elementSelectors.fieldDisabled()).toBeInTheDocument();
      expect(elementSelectors.fieldDisabled()).toHaveValue('OptionLabel');
    });

    it('Should render field if showIf returns true', () => {
      const elementOption = findElementById('visibleByValue');
      const element = selectors.element(false, elementOption.id, elementOption.type);

      expect(element).toBeInTheDocument();
    });

    it('Should not render field if showIf returns falsy', () => {
      const elementOption = findElementById('hiddenByValue');
      const element = selectors.element(true, elementOption.id, elementOption.type);

      expect(element).not.toBeInTheDocument();
    });

    it('Should highlight field if value is different', () => {
      const elementOption = findElementById('highlighted');
      const element = selectors.element(false, elementOption.id, elementOption.type);
      expect(element).toBeInTheDocument();

      const elementSelectors = getFormElementsSelectors(within(element));

      /**
       * We can't check styles here so just check class
       */
      expect(elementSelectors.fieldString().getAttribute('class')).toBeTruthy();
    });
  });

  it('Should find component with Slider', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'slider', type: FormElementType.SLIDER, value: 0 }],
    };

    render(getComponent({ options, onChangeElement }));
    expect(selectors.fieldSlider()).toBeInTheDocument();

    /**
     * Input
     */
    expect(selectors.fieldSliderInput()).toBeInTheDocument();
  });

  it('Should find component with Radio', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'radio', type: FormElementType.RADIO }],
    };

    render(getComponent({ options, onChangeElement }));

    /**
     * Radio
     */
    expect(selectors.fieldRadioContainer()).toBeInTheDocument();
  });

  it('Should find component with CheckboxList', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'checkboxList', type: FormElementType.CHECKBOX_LIST }],
    };

    render(getComponent({ options, onChangeElement }));

    /**
     * CheckboxList
     */
    expect(selectors.fieldCheckboxListContainer()).toBeInTheDocument();
  });

  it('Should find component with Select', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'select', type: FormElementType.SELECT, value: '123' }],
    };

    render(getComponent({ options, onChangeElement }));

    /**
     * Select
     */
    expect(selectors.fieldSelect()).toBeInTheDocument();
  });

  it('Should find component with disabled DateTime', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [
        {
          id: 'dateTime',
          type: FormElementType.DATETIME,
          value: new Date('10-10-10').toISOString(),
          disableIf: 'return true;',
        },
      ],
    };

    render(getComponent({ options, onChangeElement }));

    /**
     * Date Time
     */
    expect(selectors.fieldDateTime()).toBeInTheDocument();
  });

  it('Should find component Time', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [
        {
          id: 'elementTime',
          type: FormElementType.TIME,
          value: '2021-04-10T12:30:00Z',
        },
      ],
    };

    render(getComponent({ options, onChangeElement }));

    /**
     * Time Element
     */
    expect(selectors.fieldTime()).toBeInTheDocument();
  });

  it('Should find component Custom Button', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [
        {
          id: 'elementButton-1-1',
          type: FormElementType.CUSTOM_BUTTON,
          value: '',
          show: CustomButtonShow.FORM,
          customCode: '',
          title: 'Custom Button',
          foregroundColor: 'red',
          backgroundColor: '#3274D9',
          variant: ButtonVariant.CUSTOM,
        },
      ],
    };

    render(getComponent({ options, onChangeElement }));

    /**
     * Element
     */
    expect(selectors.element(false, 'elementButton-1-1', FormElementType.CUSTOM_BUTTON)).toBeInTheDocument();

    expect(selectors.fieldCustomButtonContainer()).toBeInTheDocument();
  });

  it('Should execute code on click', async () => {
    const executeCustomCode = jest.fn();
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [
        {
          id: 'elementButton-1-1',
          type: FormElementType.CUSTOM_BUTTON,
          value: '',
          show: CustomButtonShow.FORM,
          customCode: `console.log('test')`,
          title: 'Custom Button',
          buttonLabel: 'Test 1',
        },
      ],
    };

    render(getComponent({ options, onChangeElement, executeCustomCode, initial: {} }));

    /**
     * Element
     */
    expect(selectors.element(false, 'elementButton-1-1', FormElementType.CUSTOM_BUTTON)).toBeInTheDocument();

    expect(selectors.fieldCustomButtonContainer()).toBeInTheDocument();
    expect(selectors.fieldCustomButton(false, 'elementButton-1-1')).toBeInTheDocument();

    await act(() => fireEvent.click(selectors.fieldCustomButton(false, 'elementButton-1-1')));

    expect(executeCustomCode).toHaveBeenCalledWith(
      expect.objectContaining({
        initial: {},
        code: "console.log('test')",
      })
    );
  });

  it('Should find component with Select and unset value', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'select', type: FormElementType.SELECT }],
    };

    render(getComponent({ options, onChangeElement }));

    /**
     * Select
     */
    expect(selectors.fieldSelect()).toBeInTheDocument();
    expect(selectors.fieldSelect()).toHaveDisplayValue([]);
  });

  describe('Query Options', () => {
    it('Should render if no config', async () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [{ id: 'select', type: FormElementType.SELECT, optionsSource: OptionsSource.QUERY }],
      };

      render(getComponent({ options, onChangeElement }));

      /**
       * Select
       */
      expect(selectors.fieldSelect()).toBeInTheDocument();
      expect(selectors.fieldSelect()).toHaveDisplayValue([]);
    });

    it('Should render if no frame', async () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [
          {
            id: 'select',
            type: FormElementType.SELECT,
            optionsSource: OptionsSource.QUERY,
            queryOptions: {
              source: 'A',
              value: 'Value',
              label: 'Label',
            },
          },
        ],
      };

      render(getComponent({ options, onChangeElement, data: { series: [] } }));

      /**
       * Select
       */
      expect(selectors.fieldSelect()).toBeInTheDocument();
      expect(selectors.fieldSelect()).toHaveDisplayValue([]);
    });

    it('Should use value field if no label field', async () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [
          {
            id: 'select',
            type: FormElementType.SELECT,
            optionsSource: OptionsSource.QUERY,
            queryOptions: {
              source: 'A',
              value: 'Value',
            },
          },
        ],
      };

      render(
        getComponent({
          options,
          onChangeElement,
          data: {
            series: [
              toDataFrame({
                fields: [
                  {
                    name: 'Value',
                    values: ['1', '2'],
                  },
                ],
                refId: 'A',
              }),
            ],
          },
        })
      );

      /**
       * Select
       */
      expect(selectors.fieldSelect()).toBeInTheDocument();

      expect(selectors.fieldSelect()).toHaveTextContent('2');
    });
  });

  describe('Get Options Code', () => {
    it('Should use options from code', async () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [
          {
            id: 'select',
            type: FormElementType.SELECT,
            optionsSource: OptionsSource.CODE,
            getOptions: `return [{ value: 1, label: '1' }]`,
          },
        ],
      };

      render(getComponent({ options, onChangeElement }));

      /**
       * Select
       */
      expect(selectors.fieldSelect()).toBeInTheDocument();

      /**
       * Change value
       */
      await act(async () => fireEvent.change(selectors.fieldSelect(), { target: { value: 1 } }));

      expect(selectors.fieldSelect()).toHaveValue('1');
    });
  });

  it('Should find unit element', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'select', type: FormElementType.STRING, unit: '123' }],
    };

    render(getComponent({ options, onChangeElement }));

    /**
     * Unit
     */
    expect(selectors.unit()).toBeInTheDocument();
  });

  it('Should not find component without section', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'select', type: FormElementType.SELECT }],
    };

    render(getComponent({ options, onChangeElement, section: { id: 'left', name: 'left' } }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Select
     */
    expect(selectors.fieldSelect(true)).not.toBeInTheDocument();
  });

  /**
   * Field updates
   */
  describe('Field updates', () => {
    const runFieldChangeScenario = ({
      name,
      elements = [{ id: 'number', type: FormElementType.NUMBER }],
      getField,
      newValue,
      expectedValue,
    }: {
      name: string;
      getField: () => HTMLElement;
      newValue: unknown;
      elements?: any[];
      expectedValue: any;
    }) => {
      it(name, async () => {
        let appliedElements = elements;
        const options = {
          submit: {},
          initial: { highlightColor: false },
          update: {},
          reset: {},
          elements: appliedElements,
        };
        const onChangeElement = jest.fn(
          (updatedElement) =>
            (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
        );
        const data = {
          series: [
            toDataFrame({
              refId: 'A',
              fields: [
                {
                  name: 'Value',
                  values: ['Value1', 'Value2'],
                },
                {
                  name: 'Label',
                  values: ['Label1', 'Label2'],
                },
              ],
            }),
          ],
        };

        /**
         * First render
         */
        const { rerender } = render(getComponent({ options, onChangeElement, data }));

        /**
         * Change field value
         */
        await act(() =>
          fireEvent.change(getField(), {
            target: { value: newValue, values: Array.isArray(newValue) ? newValue : [newValue] },
          })
        );

        /**
         * Rerender with updated elements
         */
        await act(() =>
          rerender(
            getComponent({
              options: {
                ...options,
                elements: appliedElements,
              },
              onChangeElement,
              data,
            })
          )
        );

        expect(getField()).toHaveValue(expectedValue);
      });
    };

    /**
     * Number
     */
    describe('Number Field', () => {
      [
        {
          name: 'Should update value',
          elements: [{ id: 'number', type: FormElementType.NUMBER, value: 0 }],
          getField: selectors.fieldNumber,
          newValue: '123',
          expectedValue: 123,
        },
        {
          name: 'Should update with max value',
          elements: [{ id: 'number', type: FormElementType.NUMBER, max: 100, value: 0 }],
          getField: selectors.fieldNumber,
          newValue: '123',
          expectedValue: 100,
        },
        {
          name: 'Should update with max value for empty value',
          elements: [{ id: 'number', type: FormElementType.NUMBER, max: 100, value: 10 }],
          getField: selectors.fieldNumber,
          newValue: '',
          expectedValue: 0,
        },
        {
          name: 'Should update with min value',
          elements: [{ id: 'number', type: FormElementType.NUMBER, min: 200, value: 0 }],
          getField: selectors.fieldNumber,
          newValue: '123',
          expectedValue: 200,
        },
        {
          name: 'Should update with min value for empty value',
          elements: [{ id: 'number', type: FormElementType.NUMBER, min: 200, value: 10 }],
          getField: selectors.fieldNumber,
          newValue: '',
          expectedValue: 200,
        },
      ].forEach((scenario) => runFieldChangeScenario(scenario));
    });

    [
      {
        name: 'Should update string value',
        elements: [{ id: 'number', type: FormElementType.STRING, value: '' }],
        getField: selectors.fieldString,
        newValue: '123',
        expectedValue: '123',
      },
      {
        name: 'Should update password value',
        elements: [{ id: 'number', type: FormElementType.PASSWORD, value: '' }],
        getField: selectors.fieldPassword,
        newValue: '123',
        expectedValue: '123',
      },
      {
        name: 'Should update textarea value',
        elements: [{ id: 'number', type: FormElementType.TEXTAREA, value: '' }],
        getField: selectors.fieldTextarea,
        newValue: '123',
        expectedValue: '123',
      },
      {
        name: 'Should update select value',
        elements: [
          { id: 'number', type: FormElementType.SELECT, value: '111', options: [{ value: '111' }, { value: '123' }] },
        ],
        getField: selectors.fieldSelect,
        newValue: '123',
        expectedValue: '123',
      },
      {
        name: 'Should update select value from query options',
        elements: [
          {
            id: 'queryOptions',
            type: FormElementType.SELECT,
            value: '111',
            options: [],
            optionsSource: OptionsSource.QUERY,
            queryOptions: {
              source: 'A',
              value: 'Value',
              label: 'Label',
            },
          },
        ],
        getField: selectors.fieldSelect,
        newValue: 'Value1',
        expectedValue: 'Value1',
      },
      {
        name: 'Should update multi select value',
        elements: [
          {
            id: 'number',
            type: FormElementType.MULTISELECT,
            value: ['111'],
            options: [{ value: '111' }, { value: '123' }],
          },
        ],
        getField: selectors.fieldSelect,
        newValue: ['111', '123'],
        expectedValue: ['111', '123'],
      },
    ].forEach((scenario) => runFieldChangeScenario(scenario));

    /**
     * Code
     */
    it('Should update code value', async () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [{ id: 'number', type: FormElementType.CODE, value: '111' }],
      };
      const onChangeElement = jest.fn();

      /**
       * Render Component
       */
      render(getComponent({ options, onChangeElement }));

      /**
       * Blur code field
       */
      await act(() => fireEvent.blur(selectors.fieldCode(), { target: { value: '123' } }));

      expect(selectors.fieldCode()).toHaveValue('123');
    });

    /**
     * Boolean
     */
    it('Should update boolean value', async () => {
      let appliedElements = [{ id: 'number', type: FormElementType.BOOLEAN }];
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: appliedElements,
      };
      const onChangeElement = jest.fn(
        (updatedElement) =>
          (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
      );

      /**
       * Render Component
       */
      const { rerender } = render(getComponent({ options, onChangeElement }));

      /**
       * Click on true option
       */
      const booleanSelectors = getFormElementsSelectors(within(selectors.fieldBooleanContainer()));
      await act(() => fireEvent.click(booleanSelectors.booleanOption(false, 'true')));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      expect(booleanSelectors.booleanOption(false, 'true')).toBeChecked();
    });

    /**
     * Date Time
     */
    it('Should update dateTime value', () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [
          {
            id: 'number',
            type: FormElementType.DATETIME,
            value: '2023-05-31 12:30:30',
            min: '2023-05-20 12:30:30',
            max: '2023-06-15 12:30:30',
          },
        ],
      };
      const onChangeElement = jest.fn();

      /**
       * Render Component
       */
      render(getComponent({ options, onChangeElement }));

      /**
       * Change date time
       */
      fireEvent.change(selectors.fieldDateTime(), { target: { value: '2021-07-31 12:30:30' } });

      expect(selectors.fieldDateTime()).toHaveValue('2021-07-31 12:30:30');
    });

    it('Should handle onChange event for time input', async () => {
      let appliedElements = [{ id: 'timeElement', type: FormElementType.TIME, value: '', disabled: false }];
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: appliedElements,
      };

      const onChangeElement = jest.fn(
        (updatedElement) =>
          (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
      );

      /**
       * Render Component
       */
      render(getComponent({ options, onChangeElement }));

      expect(selectors.fieldTime()).toBeInTheDocument();

      /**
       * Change date time
       */
      await act(() => fireEvent.change(selectors.fieldTime(), { target: { value: '2024-04-10T12:30:00Z' } }));

      expect(onChangeElement).toHaveBeenCalledWith(
        expect.objectContaining({
          value: '2024-04-10T12:30:00.000Z',
        })
      );
    });

    /**
     * Slider
     */
    it('Should update slider value', async () => {
      let appliedElements = [{ id: 'number', type: FormElementType.SLIDER, value: 100, min: 1, max: 200 }];
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: appliedElements,
      };
      const onChangeElement = jest.fn(
        (updatedElement) =>
          (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
      );

      /**
       * Render Component
       */
      const { rerender } = render(getComponent({ options, onChangeElement }));

      /**
       * Change slider input value
       */
      await act(() => fireEvent.change(selectors.fieldSliderInput(), { target: { value: '123' } }));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      expect(selectors.fieldSliderInput()).toHaveValue(123);

      /**
       * Change slider value
       */
      await act(() => fireEvent.change(selectors.fieldSlider(), { target: { value: '150' } }));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      expect(selectors.fieldSlider()).toHaveValue(150);
    });

    /**
     * File
     */
    it('Should update file value', async () => {
      let appliedElements = [{ id: 'file', type: FormElementType.FILE, value: [] }];
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: appliedElements,
      };
      const onChangeElement = jest.fn(
        (updatedElement) =>
          (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
      );

      const image = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

      /**
       * Render Component
       */
      const { rerender } = render(getComponent({ options, onChangeElement }));

      /**
       * Select file
       */
      await act(() =>
        fireEvent.change(selectors.fieldFile(), {
          target: {
            files: [image],
          },
        })
      );

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      /**
       * Remove File
       */
      const removeFileButton = screen.getByLabelText('Remove File');
      expect(removeFileButton).toBeInTheDocument();
      await act(() => fireEvent.click(removeFileButton));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      expect(screen.queryByLabelText('Remove File')).not.toBeInTheDocument();
    });

    it('Should update slider value when min and max are not set', async () => {
      let appliedElements = [{ id: 'number', type: FormElementType.SLIDER, value: 100 }];
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: appliedElements,
      };
      const onChangeElement = jest.fn(
        (updatedElement) =>
          (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
      );

      /**
       * Render Component
       */
      const { rerender } = render(getComponent({ options, onChangeElement }));

      /**
       * Change slider input value
       */
      await act(() => fireEvent.change(selectors.fieldSliderInput(), { target: { value: '123' } }));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      expect(selectors.fieldSliderInput()).toHaveValue(0);
    });

    /**
     * Radio
     */
    it('Should update radio value', async () => {
      const elementOption = { value: 'optionValue', label: 'Option Label' };
      const element = { id: 'number', type: FormElementType.RADIO, options: [elementOption] };
      let appliedElements = [element];
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: appliedElements,
      };
      const onChangeElement = jest.fn(
        (updatedElement) =>
          (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
      );

      /**
       * Render Component
       */
      const { container, rerender } = render(getComponent({ options, onChangeElement }));

      /**
       * Check option
       */
      const radioGroupContainer = within(selectors.fieldRadioContainer());

      await act(() => fireEvent.click(radioGroupContainer.getByText(elementOption.label)));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      /**
       * Use native querySelector due to impossible to set aria-label because dynamic options
       */
      const radioLabel = radioGroupContainer.getByText(elementOption.label);
      const radioInput = container.querySelector(`#${radioLabel.getAttribute('for')}`);

      expect(radioInput).toBeInTheDocument();
      expect(radioInput).toBeChecked();
    });

    it('Should update the CheckboxList value via checkbox if the value of the element is empty', async () => {
      const elementOption1 = {
        id: 'Check box 1',
        label: 'Check box 1',
        type: 'string',
        value: 'Check box 1',
      };
      const elementOption2 = {
        id: 'Checkbox 2',
        label: 'Checkbox 2',
        type: 'string',
        value: 'Checkbox 2',
      };
      const element = {
        id: 'checkboxList',
        type: FormElementType.CHECKBOX_LIST,
        width: 25,
        options: [elementOption1, elementOption2],
        value: [],
      };
      let appliedElements = [element];

      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: appliedElements,
      };

      const onChangeElement = jest.fn(
        (updatedElement) =>
          (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
      );

      /**
       * Render
       */
      const { rerender } = render(getComponent({ options, onChangeElement }));

      const checkboxContainer = within(selectors.fieldCheckboxListContainer());

      /**
       * Select option 1
       */
      await act(() => fireEvent.click(checkboxContainer.getByText(elementOption1.value)));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      const checkboxes = checkboxContainer.getAllByRole('checkbox');

      /**
       * Option 1 selected
       */
      expect(checkboxes[0]).toBeInTheDocument();
      expect(checkboxes[0]).toBeChecked();

      /**
       * Select option 2
       */
      await act(() => fireEvent.click(checkboxes[1]));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      /**
       * Option 2 selected
       */
      expect(checkboxes[1]).toBeInTheDocument();
      expect(checkboxes[1]).toBeChecked();

      /**
       * Unselect option 1
       */
      await act(() => fireEvent.click(checkboxContainer.getByText(elementOption1.value)));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      expect(checkboxes[0]).toBeInTheDocument();
      expect(checkboxes[0]).not.toBeChecked();
    });
  });

  it('Should update local elements if prop elements is changed', async () => {
    const element = { id: 'number', type: FormElementType.STRING, value: '123' };
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [element],
    };

    const { rerender } = render(getComponent({ options, onChangeElement }));

    /**
     * Check element presence
     */
    expect(selectors.element(false, element.id, element.type)).toBeInTheDocument();

    /**
     * Rerender with new elements
     */
    const updatedElement = {
      ...element,
      type: FormElementType.NUMBER,
    };

    await act(() =>
      rerender(
        getComponent({
          options: {
            ...options,
            elements: [updatedElement],
          },
          onChangeElement,
        })
      )
    );

    /**
     * Check if only updated elements is rendered
     */
    expect(selectors.element(true, element.id, element.type)).not.toBeInTheDocument();
    expect(selectors.element(false, updatedElement.id, updatedElement.type)).toBeInTheDocument();
  });

  /**
   * Apply styles for row
   */
  describe('Form styles', () => {
    it('Should render element with background', () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [{ id: 'radio', type: FormElementType.RADIO, background: 'red' }],
      };

      render(getComponent({ options, onChangeElement }));

      /**
       * Radio
       */
      expect(selectors.fieldRadioContainer()).toBeInTheDocument();
      expect(selectors.element(false, 'radio', FormElementType.RADIO)).toHaveStyle({
        backgroundColor: 'red',
      });
    });
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
});
