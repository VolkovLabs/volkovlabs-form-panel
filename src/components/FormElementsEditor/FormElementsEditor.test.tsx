import { toDataFrame } from '@grafana/data';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';

import {
  CODE_EDITOR_CONFIG,
  CUSTOM_BUTTON_DEFAULT,
  FORM_ELEMENT_DEFAULT,
  FORM_ELEMENT_OPTION_DEFAULT,
  FormElementType,
  NUMBER_DEFAULT,
  OptionsSource,
  RequestMethod,
  SELECT_DEFAULT,
  SLIDER_DEFAULT,
} from '../../constants';
import { ButtonVariant, CodeLanguage, LinkTarget } from '../../types';
import { getFormElementsEditorSelectors } from '../../utils';
import { FormElementsEditor } from './FormElementsEditor';

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * Form Elements Editor
 */
describe('Form Elements Editor', () => {
  const onChange = jest.fn();

  /**
   * Form Elements Editor Selectors
   */
  const selectors = getFormElementsEditorSelectors(screen);

  /**
   * Get Tested Component
   * @param value
   * @param context
   * @param restProps
   */
  const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
    return <FormElementsEditor {...restProps} value={value} context={context} />;
  };

  /**
   * Open Element
   * @param elementId
   * @param elementType
   */
  const openElement = (elementId: string, elementType: string): ReturnType<typeof getFormElementsEditorSelectors> => {
    /**
     * Check element presence
     */
    expect(selectors.sectionLabel(false, elementId, elementType)).toBeInTheDocument();

    /**
     * Make Select Element is opened
     */
    fireEvent.click(selectors.sectionLabel(false, elementId, elementType));

    /**
     * Check if element content exists
     */
    const elementContent = selectors.sectionContent(false, elementId, elementType);
    expect(elementContent).toBeInTheDocument();

    /**
     * Return selectors for opened element
     */
    return getFormElementsEditorSelectors(within(elementContent));
  };

  /**
   * New Element
   */
  describe('New Element', () => {
    it('Should find component with new Element', () => {
      render(getComponent({ value: [], onChange }));
      expect(selectors.root()).toBeInTheDocument();

      expect(selectors.sectionNewLabel()).toBeInTheDocument();
      expect(selectors.sectionNewContent()).toBeInTheDocument();
      expect(selectors.newElementId()).toBeInTheDocument();
      expect(selectors.newElementLabel()).toBeInTheDocument();
      expect(selectors.newElementType()).toBeInTheDocument();
    });

    it('Should add new element and reset form', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];
      render(getComponent({ value: elements, onChange }));

      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, 'newId', FormElementType.STRING)).not.toBeInTheDocument();

      /**
       * Check if empty element can't be created
       */
      expect(selectors.buttonAddElement()).toBeDisabled();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: 'newId' } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Id' } });
      fireEvent.change(selectors.newElementType(), { target: { value: FormElementType.STRING } });

      /**
       * Check if new element can be created
       */
      expect(selectors.buttonAddElement()).not.toBeDisabled();

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */
      expect(selectors.sectionLabel(false, 'newId', FormElementType.STRING)).toBeInTheDocument();

      /**
       * Check if form was reset
       */
      expect(selectors.newElementId()).toHaveValue('');
      expect(selectors.newElementLabel()).toHaveValue('');
      expect(selectors.newElementType()).toHaveValue(undefined);
    });

    it('Should add Slider element with default parameters', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      const newElementId = 'newSlider';
      const newElementType = FormElementType.SLIDER;
      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, newElementId, newElementType)).not.toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Slider' } });
      fireEvent.change(selectors.newElementType(), { target: { value: newElementType } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */

      const elementSelectors = openElement(newElementId, newElementType);

      expect(elementSelectors.fieldSliderStep()).toHaveValue(SLIDER_DEFAULT.step);
      expect(elementSelectors.fieldSliderMin()).toHaveValue(SLIDER_DEFAULT.min);
      expect(elementSelectors.fieldSliderMax()).toHaveValue(SLIDER_DEFAULT.max);
    });

    it('Should add Number element with default parameters', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      const newElementId = 'newSlider';
      const newElementType = FormElementType.NUMBER;
      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, newElementId, newElementType)).not.toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Number' } });
      fireEvent.change(selectors.newElementType(), { target: { value: newElementType } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */
      const elementSelectors = openElement(newElementId, newElementType);

      expect(elementSelectors.fieldNumberMin()).toHaveValue(null);
      expect(elementSelectors.fieldNumberMax()).toHaveValue(null);
    });

    it('Should add Code element with default parameters', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      const newElementId = 'newSlider';
      const newElementType = FormElementType.CODE;
      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, newElementId, newElementType)).not.toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Code' } });
      fireEvent.change(selectors.newElementType(), { target: { value: newElementType } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */
      const elementSelectors = openElement(newElementId, newElementType);

      expect(elementSelectors.fieldCodeHeight()).toHaveValue(CODE_EDITOR_CONFIG.height.min);
      expect(elementSelectors.fieldCodeLanguage()).toHaveValue(CodeLanguage.JAVASCRIPT);
    });

    it('Should add Checkbox List element', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      const newElementId = 'newCheckbox';
      const newElementType = FormElementType.CHECKBOX_LIST;
      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, newElementId, newElementType)).not.toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Checkbox' } });
      fireEvent.change(selectors.newElementType(), { target: { value: newElementType } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */
      const elementSelectors = openElement(newElementId, newElementType);

      expect(elementSelectors.options()).toBeInTheDocument();
    });

    it('Should add Custom Button element', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      const newElementId = 'button';
      const newElementType = FormElementType.CUSTOM_BUTTON;
      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, newElementId, newElementType)).not.toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Custom Button' } });
      fireEvent.change(selectors.newElementType(), { target: { value: newElementType } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */
      const elementSelectors = openElement(newElementId, newElementType);

      expect(elementSelectors.fieldCustomButtonIcon()).toBeInTheDocument();
    });

    it('Should not add element if element with the same id and type exists', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, id: 'id' };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      const newElementId = 'id';
      const newElementType = FORM_ELEMENT_DEFAULT.type;

      /**
       * Check if section exists
       */
      expect(selectors.sectionLabel(true, newElementId, newElementType)).toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Code' } });
      fireEvent.change(selectors.newElementType(), { target: { value: newElementType } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element are not added
       */
      expect(selectors.addElementError()).toBeInTheDocument();
      expect(selectors.buttonAddElement()).toBeDisabled();
      expect(selectors.newElementLabel()).toHaveValue('New Code');

      /**
       * Remove element conflict
       */
      fireEvent.change(selectors.newElementType(), { target: { value: FormElementType.NUMBER } });

      /**
       * Add element
       */
      expect(selectors.buttonAddElement()).not.toBeDisabled();
      fireEvent.click(selectors.buttonAddElement());

      expect(selectors.sectionLabel(false, newElementId, FormElementType.NUMBER)).toBeInTheDocument();
    });
  });

  /**
   * Id Element
   */
  it('Should find component with Id Element', () => {
    const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(false, 'id', FORM_ELEMENT_DEFAULT.type)).toBeInTheDocument();
    expect(selectors.sectionContent(true, 'id', FORM_ELEMENT_DEFAULT.type)).not.toBeInTheDocument();

    /**
     * Make Id Element is opened
     */
    const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

    expect(elementSelectors.fieldId()).toBeInTheDocument();
    expect(elementSelectors.fieldWidth()).toBeInTheDocument();
    expect(elementSelectors.fieldLabel()).toBeInTheDocument();
    expect(elementSelectors.fieldLabelWidth()).toBeInTheDocument();
    expect(elementSelectors.fieldTooltip()).toBeInTheDocument();
    expect(elementSelectors.fieldUnit()).toBeInTheDocument();
  });

  /**
   * No Elements
   */
  it('Should find component without elements', () => {
    render(getComponent({ value: null, onChange }));
    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(true, '123', '213')).not.toBeInTheDocument();
  });

  /**
   * Slider
   */
  it('Should find component with Slider', () => {
    const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'slider', type: FormElementType.SLIDER }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Slider Element is opened
     */
    const elementSelectors = openElement('slider', FormElementType.SLIDER);

    expect(elementSelectors.fieldSliderMin()).toBeInTheDocument();
    expect(elementSelectors.fieldSliderMax()).toBeInTheDocument();
    expect(elementSelectors.fieldSliderStep()).toBeInTheDocument();
  });

  /**
   * Number
   */
  it('Should find component with Number', () => {
    const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'number', type: FormElementType.NUMBER }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Number Element is opened
     */
    const elementSelectors = openElement('number', FormElementType.NUMBER);

    expect(elementSelectors.fieldNumberMin()).toBeInTheDocument();
    expect(elementSelectors.fieldNumberMax()).toBeInTheDocument();
  });

  /**
   * TextArea
   */
  it('Should find component with TextArea', () => {
    const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'textarea', type: FormElementType.TEXTAREA }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Textarea Element is opened
     */
    const elementSelectors = openElement('textarea', FormElementType.TEXTAREA);

    expect(elementSelectors.fieldTextareaRows()).toBeInTheDocument();
  });

  /**
   * Code Editor
   */
  it('Should find component with Code Editor', () => {
    const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'code', type: FormElementType.CODE }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Code Element is opened
     */
    const elementSelectors = openElement('code', FormElementType.CODE);

    expect(elementSelectors.fieldCodeLanguage()).toBeInTheDocument();
    expect(elementSelectors.fieldCodeHeight()).toBeInTheDocument();
  });

  /**
   * Select
   */
  it('Should find component with Select', () => {
    const elements = [
      {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [{ id: 'id', label: 'label', type: FormElementType.NUMBER }],
      },
    ];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Select Element is opened
     */
    const elementSelectors = openElement('select', FormElementType.SELECT);

    expect(elementSelectors.fieldType()).toBeInTheDocument();
    expect(elementSelectors.options()).toBeInTheDocument();
  });

  /**
   * Multi Select
   */
  it('Should find component with Multi Select', () => {
    const elements = [
      {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.MULTISELECT,
        options: [{ id: 'id', label: 'label', type: FormElementType.NUMBER }],
      },
    ];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Select Element is opened
     */
    const elementSelectors = openElement('select', FormElementType.MULTISELECT);

    expect(elementSelectors.fieldType()).toBeInTheDocument();
    expect(elementSelectors.options()).toBeInTheDocument();
  });

  /**
   * Multi Select
   */
  it('Should find component with File', () => {
    const elements = [
      {
        ...FORM_ELEMENT_DEFAULT,
        id: 'file',
        type: FormElementType.FILE,
      },
    ];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Select Element is opened
     */
    const elementSelectors = openElement('file', FormElementType.FILE);

    expect(elementSelectors.fieldType()).toBeInTheDocument();
    expect(elementSelectors.fieldAccept()).toBeInTheDocument();
  });

  /*
   * Field Name Disabled
   */
  it('Should not allow to select field name if initial method is not Datasource', () => {
    const elements = [
      {
        ...FORM_ELEMENT_DEFAULT,
        id: 'element',
        type: FormElementType.STRING,
      },
    ];

    render(
      getComponent({
        value: elements,
        onChange,
        context: {
          options: {
            initial: {
              method: RequestMethod.QUERY,
            },
          },
        },
      })
    );
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Element is opened
     */
    const elementSelectors = openElement('element', FormElementType.STRING);

    expect(elementSelectors.fieldNamePicker(true)).not.toBeInTheDocument();
  });

  /**
   * Query Field Name Disabled
   */
  it('Should not allow to select query field name if initial method is not Query', () => {
    const elements = [
      {
        ...FORM_ELEMENT_DEFAULT,
        id: 'element',
        type: FormElementType.STRING,
      },
    ];

    render(
      getComponent({
        value: elements,
        onChange,
        context: {
          options: {
            initial: {
              method: RequestMethod.DATASOURCE,
            },
          },
        },
      })
    );
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Element is opened
     */
    const elementSelectors = openElement('element', FormElementType.STRING);

    expect(elementSelectors.fieldFromQueryPicker(true)).not.toBeInTheDocument();
  });

  /**
   * Two elements
   */
  it('Should find component with Two Elements', () => {
    const numberElement = { ...FORM_ELEMENT_DEFAULT, id: 'number' };
    const textElement = { id: 'text', type: FormElementType.TEXTAREA };
    const elements = [numberElement, textElement];

    render(getComponent({ value: elements, onChange }));

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(false, textElement.id, textElement.type)).toBeInTheDocument();
    expect(selectors.sectionLabel(false, numberElement.id, numberElement.type)).toBeInTheDocument();
  });

  /**
   * Remove element
   */
  it('Should remove element', () => {
    const numberElement = { ...FORM_ELEMENT_DEFAULT, id: 'number' };
    const textElement = { id: 'text', type: FormElementType.TEXTAREA };
    const elements = [numberElement, textElement];

    render(getComponent({ value: elements, onChange }));

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(false, textElement.id, textElement.type)).toBeInTheDocument();
    expect(selectors.sectionLabel(false, numberElement.id, numberElement.type)).toBeInTheDocument();

    /**
     * Remove text section
     */
    const textSectionLabelSelectors = getFormElementsEditorSelectors(
      within(selectors.sectionLabel(false, textElement.id, textElement.type))
    );
    fireEvent.click(textSectionLabelSelectors.buttonRemoveElement());

    /**
     * Check if section is removed
     */
    expect(selectors.sectionLabel(true, textElement.id, textElement.type)).not.toBeInTheDocument();
    expect(selectors.sectionLabel(false, numberElement.id, numberElement.type)).toBeInTheDocument();
  });

  /**
   * Element order
   */
  describe('Element order', () => {
    it('Should reorder items', async () => {
      let onDragEndHandler: (result: DropResult) => void = () => null;
      jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
        onDragEndHandler = onDragEnd;
        return children;
      });

      const elementString = { ...FORM_ELEMENT_DEFAULT, id: 'number', uid: 'number123' };
      const elementTextarea = { id: 'text', type: FormElementType.TEXTAREA, uid: 'text123' };
      let elements = [elementString, elementTextarea];
      const onChange = jest.fn().mockImplementation((updatedElements) => (elements = updatedElements));

      render(getComponent({ value: elements, onChange }));

      /**
       * Simulate drop element 1 to index 0
       */
      await act(() =>
        onDragEndHandler({
          destination: {
            index: 0,
          },
          source: {
            index: 1,
          },
        } as any)
      );

      /**
       * Save changes
       */
      fireEvent.click(selectors.buttonSaveChanges());

      /**
       * Check if elements order is changed
       */
      expect(elements).toEqual([elementTextarea, elementString]);
    });

    it('Should not reorder items if drop outside the list', async () => {
      let onDragEndHandler: (result: DropResult) => void = () => null;
      jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
        onDragEndHandler = onDragEnd;
        return children;
      });

      const elementString = { ...FORM_ELEMENT_DEFAULT, id: 'number' };
      const elementTextarea = { id: 'text', type: FormElementType.TEXTAREA };
      const elements = [elementString, elementTextarea];

      render(getComponent({ value: elements }));

      /**
       * Simulate drop field 1 to outside the list
       */
      await act(() =>
        onDragEndHandler({
          destination: null,
          source: {
            index: 1,
          },
        } as any)
      );

      /**
       * Save button is not shown because there is no changes
       */
      expect(selectors.buttonSaveChanges(true)).not.toBeInTheDocument();
    });
  });

  /**
   * Fields interaction
   */
  describe('Fields interaction', () => {
    it('Should update Id', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Change id
       */
      await act(() => fireEvent.change(elementSelectors.fieldId(), { target: { value: '123' } }));

      /**
       * Element with new id is still opened because key=index
       */
      expect(elementSelectors.fieldId()).toHaveValue('123');
    });

    it('Should update Hidden', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', hidden: false }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Choose hidden option
       */
      const fieldVisibilitySelectors = getFormElementsEditorSelectors(within(elementSelectors.fieldVisibility()));
      expect(fieldVisibilitySelectors.radioOption(false, 'visibility-hidden')).toBeInTheDocument();

      await act(() => fireEvent.click(fieldVisibilitySelectors.radioOption(false, 'visibility-hidden')));

      expect(fieldVisibilitySelectors.radioOption(false, 'visibility-hidden')).toBeChecked();
    });

    describe('Type updates', () => {
      it('Should update type to number', async () => {
        const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.NUMBER } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.NUMBER);
      });

      it('Should update type to select', async () => {
        const element = {
          ...FORM_ELEMENT_DEFAULT,
          id: 'id',
          type: FormElementType.STRING,
          options: [],
          optionsSource: OptionsSource.CUSTOM,
        };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.SELECT } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.SELECT);
      });

      it('Should update type to radio', async () => {
        const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.RADIO } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.RADIO);
      });

      it('Should update type to file', async () => {
        const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.FILE } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.FILE);
      });

      it('Should update type to date time', async () => {
        const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() =>
          fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.DATETIME } })
        );

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.DATETIME);
      });

      it('Should update type to boolean', async () => {
        const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.BOOLEAN } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.BOOLEAN);
      });

      it('Should update type to link', async () => {
        const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.LINK } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.LINK);
      });

      it('Should not update Type if element with the same id and type exists', async () => {
        const elementOne = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elementTwo = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.NUMBER };
        const elements = [elementOne, elementTwo];
        jest.spyOn(window, 'alert').mockImplementationOnce(() => null);

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(elementTwo.id, elementTwo.type);

        /**
         * Change on already exist type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: elementOne.type } }));

        /**
         * Check if type is not updated because conflict
         */
        expect(selectors.sectionLabel(false, elementOne.id, elementOne.type)).toBeInTheDocument();
        expect(selectors.sectionLabel(false, elementTwo.id, elementTwo.type)).toBeInTheDocument();
      });

      it('Should keep optionsSource and queryOptions', async () => {
        const element = {
          ...FORM_ELEMENT_DEFAULT,
          id: 'id',
          type: FormElementType.SELECT,
          optionsSource: OptionsSource.QUERY,
          queryOptions: {
            source: 'A',
            value: 'Value',
            label: 'Label',
          },
        };
        const elements = [element];

        render(
          getComponent({
            value: elements,
            onChange,
            context: {
              data: [
                toDataFrame({
                  refId: 'A',
                  fields: [
                    {
                      name: 'Value',
                    },
                    {
                      name: 'Label',
                    },
                  ],
                }),
              ],
            },
          })
        );

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.RADIO } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.RADIO);

        expect(elementSelectors.optionsSourceOption(false, element.optionsSource)).toBeChecked();
        expect(elementSelectors.fieldQueryOptionsValue()).toHaveValue(
          `${element.queryOptions.source}:${element.queryOptions.value}`
        );
        expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue(element.queryOptions.label);
      });

      it('Should use default optionsSource', async () => {
        const element = {
          ...FORM_ELEMENT_DEFAULT,
          id: 'id',
          type: FormElementType.SELECT,
          optionsSource: undefined,
        };
        const elements = [element];

        render(
          getComponent({
            value: elements,
            onChange,
            context: {
              data: [],
            },
          })
        );

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.RADIO } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.RADIO);

        expect(elementSelectors.optionsSourceOption(false, SELECT_DEFAULT.optionsSource)).toBeChecked();
      });
    });

    it('Should update Width', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', width: 100 }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Change width
       */
      await act(() => fireEvent.change(elementSelectors.fieldWidth(), { target: { value: '123' } }));

      expect(elementSelectors.fieldWidth()).toHaveValue(123);
    });

    it('Should update Element background', async () => {
      const onChange = jest.fn();

      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', width: 100 }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Change Element background
       */
      await act(() => fireEvent.change(elementSelectors.fieldElementBackground(), { target: { value: '#ffffff' } }));

      expect(elementSelectors.fieldElementBackground()).toHaveValue('#ffffff');
    });

    it('Should render "Remove Element background" button', async () => {
      const onChange = jest.fn();

      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', width: 100, background: '#E02F44' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      openElement('id', FORM_ELEMENT_DEFAULT.type);

      expect(selectors.buttonRemoveBackground()).toBeInTheDocument();
    });

    it('Should remove element background', async () => {
      const onChange = jest.fn();

      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', width: 100, background: '#E02F44' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Remove background button
       */
      const buttonElement = selectors.buttonRemoveBackground();

      expect(buttonElement).toBeInTheDocument();

      /**
       * Change Element background
       */
      await act(() => fireEvent.change(elementSelectors.fieldElementBackground(), { target: { value: '#ffffff' } }));
      expect(elementSelectors.fieldElementBackground()).toHaveValue('#ffffff');

      /**
       * Remove Element background
       */
      await act(() => fireEvent.click(elementSelectors.buttonRemoveBackground()));

      expect(buttonElement).not.toBeInTheDocument();
    });

    it('Should update Label background', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', width: 100 }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Change Label background
       */
      await act(() => fireEvent.change(elementSelectors.fieldLabelBackground(), { target: { value: '#c1c1c1' } }));

      expect(elementSelectors.fieldLabelBackground()).toHaveValue('#c1c1c1');
    });

    it('Should render "Remove Label background" button', async () => {
      const onChange = jest.fn();

      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', width: 100, labelBackground: '#E02F44' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      openElement('id', FORM_ELEMENT_DEFAULT.type);

      expect(selectors.buttonRemoveLabelBackground()).toBeInTheDocument();
    });

    it('Should remove element label background', async () => {
      const onChange = jest.fn();

      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', width: 100, labelBackground: '#E02F44' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Remove label background button
       */
      const buttonElement = selectors.buttonRemoveLabelBackground();

      expect(buttonElement).toBeInTheDocument();

      /**
       * Change label background
       */
      await act(() => fireEvent.change(elementSelectors.fieldLabelBackground(), { target: { value: '#ffffff' } }));
      expect(elementSelectors.fieldLabelBackground()).toHaveValue('#ffffff');

      /**
       * Remove label background
       */
      await act(() => fireEvent.click(elementSelectors.buttonRemoveLabelBackground()));

      expect(buttonElement).not.toBeInTheDocument();
    });

    it('Should update Label Color', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', width: 100 }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Change Label Color
       */
      await act(() => fireEvent.change(elementSelectors.fieldLabelColor(), { target: { value: '#c2c2c2' } }));

      expect(elementSelectors.fieldLabelColor()).toHaveValue('#c2c2c2');
    });

    it('Should render "Remove Label Color" button', async () => {
      const onChange = jest.fn();

      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', width: 100, labelColor: '#E02F44' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      openElement('id', FORM_ELEMENT_DEFAULT.type);

      expect(selectors.buttonRemoveLabelColor()).toBeInTheDocument();
    });

    it('Should remove element label color', async () => {
      const onChange = jest.fn();

      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', width: 100, labelColor: '#E02F44' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Remove label color button
       */
      const buttonElement = selectors.buttonRemoveLabelColor();

      expect(buttonElement).toBeInTheDocument();

      /**
       * Change label color
       */
      await act(() => fireEvent.change(elementSelectors.fieldLabelColor(), { target: { value: '#ffffff' } }));
      expect(elementSelectors.fieldLabelColor()).toHaveValue('#ffffff');

      /**
       * Remove label background
       */
      await act(() => fireEvent.click(elementSelectors.buttonRemoveLabelColor()));

      expect(buttonElement).not.toBeInTheDocument();
    });

    it('Should update Label', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Change label
       */
      await act(() => fireEvent.change(elementSelectors.fieldLabel(), { target: { value: 'new label' } }));

      expect(elementSelectors.fieldLabel()).toHaveValue('new label');
    });

    it('Should update Label Width', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Change labelWidth
       */
      await act(() => fireEvent.change(elementSelectors.fieldLabelWidth(), { target: { value: '123' } }));

      expect(elementSelectors.fieldLabelWidth()).toHaveValue(123);
    });

    it('Should update Tooltip', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Change tooltip
       */
      await act(() => fireEvent.change(elementSelectors.fieldTooltip(), { target: { value: '123' } }));

      expect(elementSelectors.fieldTooltip()).toHaveValue('123');
    });

    it('Should update Unit', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, unit: '', id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Change tooltip
       */
      await act(() => fireEvent.change(elementSelectors.fieldUnit(), { target: { value: '123' } }));

      expect(elementSelectors.fieldUnit()).toHaveValue('123');
    });

    it('Should update Slider Min', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, ...SLIDER_DEFAULT, id: 'id', type: FormElementType.SLIDER };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change slider min
       */
      await act(() => fireEvent.change(elementSelectors.fieldSliderMin(), { target: { value: '123' } }));

      expect(elementSelectors.fieldSliderMin()).toHaveValue(123);
    });

    it('Should update Slider Max', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, ...SLIDER_DEFAULT, id: 'id', type: FormElementType.SLIDER };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change slider max
       */
      await act(() => fireEvent.change(elementSelectors.fieldSliderMax(), { target: { value: '123' } }));

      expect(elementSelectors.fieldSliderMax()).toHaveValue(123);
    });

    it('Should update Slider Step', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, ...SLIDER_DEFAULT, id: 'id', type: FormElementType.SLIDER };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change step
       */
      await act(() => fireEvent.change(elementSelectors.fieldSliderStep(), { target: { value: '123' } }));

      expect(elementSelectors.fieldSliderStep()).toHaveValue(123);
    });

    it('Should update Number Min', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, ...NUMBER_DEFAULT, id: 'id', type: FormElementType.NUMBER };
      const elements = [element];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change number min
       */
      await act(() => fireEvent.change(elementSelectors.fieldNumberMin(), { target: { value: '123' } }));

      expect(elementSelectors.fieldNumberMin()).toHaveValue(123);

      /**
       * Clean number min value
       */
      await act(() => fireEvent.change(elementSelectors.fieldNumberMin(), { target: { value: '' } }));

      expect(elementSelectors.fieldNumberMin()).toHaveDisplayValue('');

      /**
       * Check if empty number min is null
       */
      await act(() => fireEvent.click(selectors.buttonSaveChanges()));

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            min: undefined,
          }),
        ])
      );
    });

    it('Should update Number Max', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, ...NUMBER_DEFAULT, id: 'id', type: FormElementType.NUMBER };
      const elements = [element];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change number max
       */
      await act(() => fireEvent.change(elementSelectors.fieldNumberMax(), { target: { value: '123' } }));

      expect(elementSelectors.fieldNumberMax()).toHaveValue(123);

      /**
       * Clean number max value
       */
      await act(() => fireEvent.change(elementSelectors.fieldNumberMax(), { target: { value: '' } }));

      expect(elementSelectors.fieldNumberMax()).toHaveDisplayValue('');

      /**
       * Check if empty number max is null
       */
      await act(() => fireEvent.click(selectors.buttonSaveChanges()));

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            max: undefined,
          }),
        ])
      );
    });

    it('Should update date max', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.DATETIME, max: '' };
      const elements = [element];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      const field = elementSelectors.fieldMaxDate();
      const fieldSelectors = getFormElementsEditorSelectors(within(field));

      /**
       * Date is not set
       */
      expect(fieldSelectors.fieldMaxDate(true)).not.toBeInTheDocument();
      expect(fieldSelectors.buttonSetDate()).toBeInTheDocument();

      /**
       * Set Date
       */
      await act(() => fireEvent.click(fieldSelectors.buttonSetDate()));

      /**
       * Date
       */
      expect(fieldSelectors.fieldDateTime()).toBeInTheDocument();

      /**
       * Change Date
       */
      const date = new Date('2021-07-31 12:30:30');
      await act(() => fireEvent.change(fieldSelectors.fieldDateTime(), { target: { value: date.toISOString() } }));

      expect(fieldSelectors.fieldDateTime()).toHaveValue(date.toISOString());

      await act(() => fireEvent.click(selectors.buttonSaveChanges()));

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            max: date.toISOString(),
          }),
        ])
      );

      /**
       * Remove Date
       */
      expect(fieldSelectors.buttonRemoveDate()).toBeInTheDocument();

      await act(() => fireEvent.click(fieldSelectors.buttonRemoveDate()));

      /**
       * Date is not set
       */
      expect(fieldSelectors.fieldMaxDate(true)).not.toBeInTheDocument();
    });

    it('Should update date min', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.DATETIME, min: '' };
      const elements = [element];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      const field = elementSelectors.fieldMinDate();
      const fieldSelectors = getFormElementsEditorSelectors(within(field));

      /**
       * Date is not set
       */
      expect(fieldSelectors.fieldMinDate(true)).not.toBeInTheDocument();
      expect(fieldSelectors.buttonSetDate()).toBeInTheDocument();

      /**
       * Set Date
       */
      await act(() => fireEvent.click(fieldSelectors.buttonSetDate()));

      /**
       * Date
       */
      expect(fieldSelectors.fieldDateTime()).toBeInTheDocument();

      /**
       * Change Date
       */
      const date = new Date('2021-07-31 12:30:30');
      await act(() => fireEvent.change(fieldSelectors.fieldDateTime(), { target: { value: date.toISOString() } }));

      expect(fieldSelectors.fieldDateTime()).toHaveValue(date.toISOString());

      await act(() => fireEvent.click(selectors.buttonSaveChanges()));

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            min: date.toISOString(),
          }),
        ])
      );

      /**
       * Remove Date
       */
      expect(fieldSelectors.buttonRemoveDate()).toBeInTheDocument();

      await act(() => fireEvent.click(fieldSelectors.buttonRemoveDate()));

      /**
       * Date is not set
       */
      expect(fieldSelectors.fieldMinDate(true)).not.toBeInTheDocument();
    });

    it('Should update timeZone', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, id: 'timeID', type: FormElementType.DATETIME, isUseLocalTime: false };
      const elements = [element];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Choose hidden option
       */
      const fieldVisibilitySelectors = getFormElementsEditorSelectors(within(elementSelectors.fieldTimeZone()));
      expect(fieldVisibilitySelectors.timeTransformationOption(false, 'time-utc')).toBeInTheDocument();

      await act(() => fireEvent.click(fieldVisibilitySelectors.timeTransformationOption(true, 'time-local')));

      expect(fieldVisibilitySelectors.timeTransformationOption(true, 'time-local')).toBeChecked();
    });

    it('Should update Code Language', async () => {
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'id',
        type: FormElementType.CODE,
        language: CodeLanguage.JAVASCRIPT,
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change code language
       */
      await act(() => fireEvent.change(elementSelectors.fieldCodeLanguage(), { target: { value: CodeLanguage.JSON } }));

      expect(elementSelectors.fieldCodeLanguage()).toHaveValue(CodeLanguage.JSON);
    });

    it('Should update Code Height', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.CODE, height: 100 };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change code language
       */
      await act(() => fireEvent.change(elementSelectors.fieldCodeHeight(), { target: { value: '123' } }));

      expect(elementSelectors.fieldCodeHeight()).toHaveValue(123);
    });

    it('Should update Textarea rows', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.TEXTAREA, rows: 2 };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change textarea rows
       */
      await act(() => fireEvent.change(elementSelectors.fieldTextareaRows(), { target: { value: '123' } }));

      expect(elementSelectors.fieldTextareaRows()).toHaveValue(123);
    });

    it('Should update field accept', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.FILE }];
      const context = {
        options: {},
      };

      render(getComponent({ value: elements, onChange, context }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementType.FILE);

      /**
       * Change field name
       */
      await act(() => fireEvent.change(elementSelectors.fieldAccept(), { target: { value: '.png' } }));

      expect(elementSelectors.fieldAccept()).toHaveValue('.png');
    });

    it('Should update file field multiple', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.FILE }];
      const context = {
        options: {},
      };

      render(getComponent({ value: elements, onChange, context }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementType.FILE);

      /**
       * Check initial value
       */
      expect(elementSelectors.fileMultipleOption(false, true)).not.toBeChecked();

      /**
       * Change field multiple
       */
      await act(() => fireEvent.click(elementSelectors.fileMultipleOption(false, true)));

      expect(elementSelectors.fileMultipleOption(false, true)).toBeChecked();
    });

    it('Should update file options source', async () => {
      const elements = [
        { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.SELECT, optionsSource: OptionsSource.CUSTOM },
      ];
      const context = {
        data: [],
        options: {},
      };

      render(getComponent({ value: elements, onChange, context }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementType.SELECT);

      /**
       * Change field name
       */
      const sourceOption = elementSelectors.optionsSourceOption(false, OptionsSource.QUERY);
      await act(() => fireEvent.click(sourceOption));

      expect(sourceOption).toBeChecked();
      expect(elementSelectors.fieldQueryOptionsValue()).toBeInTheDocument();
    });

    it('Should update field target', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.LINK }];
      const context = {
        options: {},
      };

      render(getComponent({ value: elements, onChange, context }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementType.LINK);

      /**
       * Change target
       */
      await act(() => fireEvent.click(elementSelectors.linkTargetOption(false, LinkTarget.NEW_TAB)));

      expect(elementSelectors.linkTargetOption(false, LinkTarget.NEW_TAB)).toBeChecked();
    });

    it('Should update field link text', async () => {
      const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.LINK, linkText: 'abc' }];
      const context = {
        options: {},
      };

      render(getComponent({ value: elements, onChange, context }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementType.LINK);

      /**
       * Change link text
       */
      await act(() => fireEvent.change(elementSelectors.fieldLinkText(), { target: { value: '123' } }));

      expect(elementSelectors.fieldLinkText()).toHaveValue('123');
    });

    it('Should update showIf', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.TEXTAREA, rows: 2 };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change textarea rows
       */
      await act(() => fireEvent.blur(elementSelectors.fieldShowIf(), { target: { value: '123' } }));

      expect(elementSelectors.fieldShowIf()).toHaveValue('123');
    });

    it('Should update disableIf', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.TEXTAREA, rows: 2 };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldDisableIf()).toBeInTheDocument();
      /**
       * Change textarea rows
       */
      await act(() => fireEvent.blur(elementSelectors.fieldDisableIf(), { target: { value: '123' } }));

      expect(elementSelectors.fieldDisableIf()).toHaveValue('123');
    });

    describe('Apply default element options', () => {
      it('Should set default Slider options if NewType=SLIDER', async () => {
        const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.SLIDER } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.SLIDER);
        expect(elementSelectors.fieldSliderMin()).toHaveValue(SLIDER_DEFAULT.min);
        expect(elementSelectors.fieldSliderMax()).toHaveValue(SLIDER_DEFAULT.max);
        expect(elementSelectors.fieldSliderStep()).toHaveValue(SLIDER_DEFAULT.step);
      });

      it('Should set default Number options if NewType=NUMBER', async () => {
        const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.NUMBER } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.NUMBER);
        expect(elementSelectors.fieldNumberMin()).toHaveValue(null);
        expect(elementSelectors.fieldNumberMax()).toHaveValue(null);
      });

      it('Should set default Code options if NewType=CODE', async () => {
        const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.CODE } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.CODE);
        expect(elementSelectors.fieldCodeLanguage()).toHaveValue(CodeLanguage.JAVASCRIPT);
        expect(elementSelectors.fieldCodeHeight()).toHaveValue(CODE_EDITOR_CONFIG.height.min);
      });

      it('Should set default Textarea options if NewType=TEXTAREA', async () => {
        const element = { ...FORM_ELEMENT_DEFAULT, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() =>
          fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.TEXTAREA } })
        );

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.TEXTAREA);
        expect(elementSelectors.fieldTextareaRows()).toHaveValue(10);
      });
    });
  });

  /**
   * Options
   */
  describe('Options', () => {
    /**
     * Open Option
     * @param elementSelectors
     * @param id
     */
    const openOption = (elementSelectors: typeof selectors, id: string) => {
      /**
       * Check option presence
       */
      expect(elementSelectors.optionLabel(false, id)).toBeInTheDocument();

      /**
       * Check if option content exists
       */
      const optionContent = elementSelectors.optionContent(false, id);
      expect(optionContent).toBeInTheDocument();

      /**
       * Return selectors for opened option
       */
      return getFormElementsEditorSelectors(within(optionContent));
    };

    it('Should add option to element', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, id: 'select', type: FormElementType.SELECT };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Add option
       */
      await act(() => fireEvent.click(elementSelectors.buttonAddOption()));

      /**
       * Added option should be opened
       */
      expect(elementSelectors.optionLabel(false, FORM_ELEMENT_OPTION_DEFAULT.id)).toBeInTheDocument();
      expect(elementSelectors.optionContent(false, FORM_ELEMENT_OPTION_DEFAULT.id)).toBeInTheDocument();
    });

    it('Should add option to existing element options', async () => {
      const originalOption = { label: 'label', type: FormElementType.NUMBER, value: '111', id: '111' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [originalOption],
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Add option
       */
      await act(() => fireEvent.click(elementSelectors.buttonAddOption()));

      expect(elementSelectors.optionLabel(false, originalOption.id)).toBeInTheDocument();
      expect(elementSelectors.optionLabel(false, FORM_ELEMENT_OPTION_DEFAULT.id)).toBeInTheDocument();
    });

    it('Should update option type to number and convert value', async () => {
      const originalOption = { label: 'label', type: FormElementType.STRING, value: '123', id: '123' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [originalOption],
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Open option
       */
      const optionSelectors = openOption(elementSelectors, originalOption.id);

      /**
       * Change option type
       */
      await act(() =>
        fireEvent.change(optionSelectors.fieldOptionType(), { target: { value: FormElementType.NUMBER } })
      );

      /**
       * Value should be number
       */
      expect(optionSelectors.fieldOptionType()).toHaveValue(FormElementType.NUMBER);
      expect(optionSelectors.fieldOptionValue()).toHaveValue(123);
    });

    it('Should update option type to number and use default value if NaN', async () => {
      const originalOption = { label: 'label', type: FormElementType.STRING, value: 'abc', id: 'abc' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [originalOption],
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Open option
       */
      const optionSelectors = openOption(elementSelectors, originalOption.id);

      /**
       * Change option type
       */
      await act(() =>
        fireEvent.change(optionSelectors.fieldOptionType(), { target: { value: FormElementType.NUMBER } })
      );

      const updatedOption = openOption(elementSelectors, '0');

      /**
       * Value should be number
       */
      expect(updatedOption.fieldOptionType()).toHaveValue(FormElementType.NUMBER);
      expect(updatedOption.fieldOptionValue()).toHaveValue(0);
    });

    it('Should update option type to string and convert value', async () => {
      const originalOption = { label: 'label', type: FormElementType.NUMBER, value: 123, id: '123' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [originalOption],
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Open option
       */
      const optionSelectors = openOption(elementSelectors, originalOption.id);

      /**
       * Change option type
       */
      await act(() =>
        fireEvent.change(optionSelectors.fieldOptionType(), { target: { value: FormElementType.STRING } })
      );

      /**
       * Value should be string
       */
      expect(optionSelectors.fieldOptionType()).toHaveValue(FormElementType.STRING);
      expect(optionSelectors.fieldOptionValue()).toHaveValue('123');
    });

    it('Should update option value for STRING option', async () => {
      const originalOption = { label: 'label', type: FormElementType.STRING, value: '111', id: '111' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [originalOption],
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Open option
       */
      const optionSelectors = openOption(elementSelectors, originalOption.id);

      await act(() => fireEvent.change(optionSelectors.fieldOptionValue(), { target: { value: '123' } }));

      expect(optionSelectors.fieldOptionValue()).toHaveValue('123');

      /**
       * ID should be updated after lose focus
       */
      await act(() => fireEvent.blur(optionSelectors.fieldOptionValue()));

      expect(elementSelectors.optionLabel(false, '123')).toBeInTheDocument();
    });

    it('Should update option value for NUMBER option', async () => {
      const originalOption = { label: 'label', type: FormElementType.NUMBER, value: 0, id: '0' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [originalOption],
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Open option
       */
      const optionSelectors = openOption(elementSelectors, originalOption.id);

      /**
       * Change option number value
       */
      await act(() => fireEvent.change(optionSelectors.fieldOptionValue(), { target: { value: '123' } }));

      expect(optionSelectors.fieldOptionValue()).toHaveValue(123);

      /**
       * ID should be updated after lose focus
       */
      await act(() => fireEvent.blur(optionSelectors.fieldOptionValue()));

      expect(elementSelectors.optionLabel(false, '123')).toBeInTheDocument();
    });

    it('Should use default option id if empty value', async () => {
      const originalOption = { label: 'label', type: FormElementType.STRING, value: '111', id: '111' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [originalOption],
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Open option
       */
      const optionSelectors = openOption(elementSelectors, originalOption.id);

      await act(() => fireEvent.change(optionSelectors.fieldOptionValue(), { target: { value: '' } }));

      expect(optionSelectors.fieldOptionValue()).toHaveValue('');

      /**
       * ID should be updated after lose focus
       */
      await act(() => fireEvent.blur(optionSelectors.fieldOptionValue()));

      expect(elementSelectors.optionLabel(false, FORM_ELEMENT_OPTION_DEFAULT.id)).toBeInTheDocument();
    });

    it('Should update option label', async () => {
      const originalOption = { label: 'label', type: FormElementType.NUMBER, value: 0, id: '0' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [originalOption],
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Open option
       */
      const optionSelectors = openOption(elementSelectors, originalOption.id);

      /**
       * Change option label
       */
      await act(() => fireEvent.change(optionSelectors.fieldOptionLabel(), { target: { value: '123' } }));

      expect(optionSelectors.fieldOptionLabel()).toHaveValue('123');
    });

    it('Should update option icon', async () => {
      const originalOption = { label: 'label', type: FormElementType.NUMBER, value: 0, icon: undefined, id: '0' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [originalOption],
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Open option
       */
      const optionSelectors = openOption(elementSelectors, originalOption.id);

      /**
       * Change option icon
       */
      await act(() => fireEvent.change(optionSelectors.fieldOptionIcon(), { target: { value: 'check' } }));

      expect(optionSelectors.fieldOptionIcon()).toHaveValue('check');
    });

    it('Should remove option', async () => {
      const originalOption = { label: 'label', type: FormElementType.STRING, value: '111', id: '111' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [originalOption],
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Remove option
       */
      expect(elementSelectors.optionLabel(false, originalOption.id)).toBeInTheDocument();

      const optionLabelSelectors = getFormElementsEditorSelectors(
        within(elementSelectors.optionLabel(false, originalOption.id))
      );
      await act(() => fireEvent.click(optionLabelSelectors.buttonRemoveOption()));

      /**
       * Option should be removed
       */
      expect(elementSelectors.optionLabel(true, originalOption.id)).not.toBeInTheDocument();
    });

    it('Should not update option value if option with the same value exists', async () => {
      const option1 = { label: 'label', type: FormElementType.STRING, value: '111', id: '111' };
      const option2 = { label: 'label', type: FormElementType.STRING, value: '100', id: '100' };
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        options: [option1, option2],
      };
      const elements = [element];
      jest.spyOn(window, 'alert').mockImplementationOnce(() => null);

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Open 2 option
       */
      const option2Selectors = openOption(elementSelectors, option2.id);

      /**
       * Change value which is already exist
       */
      await act(() => fireEvent.change(option2Selectors.fieldOptionValue(), { target: { value: option1.value } }));

      /**
       * ID should not be updated after loosing focus
       */
      await act(() => fireEvent.blur(option2Selectors.fieldOptionValue()));

      /**
       * Check if option is not updated
       */
      expect(elementSelectors.optionLabel(false, option1.id)).toBeInTheDocument();
      expect(elementSelectors.optionLabel(false, option2.id)).toBeInTheDocument();

      /**
       * Check option 2 value
       */
      expect(option2Selectors.fieldOptionValue()).toHaveValue(option2.value);
    });

    /**
     * Option order
     */
    describe('Option order', () => {
      it('Should reorder items', async () => {
        let onDragEndHandler: (result: DropResult) => void = () => null;
        jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
          if (children.props.droppableId === 'options') {
            onDragEndHandler = onDragEnd;
          }
          return children;
        });

        const option1 = { label: 'label', type: FormElementType.STRING, value: '111', id: '111' };
        const option2 = { label: 'label', type: FormElementType.STRING, value: '100', id: '100' };
        const element = {
          ...FORM_ELEMENT_DEFAULT,
          id: 'select',
          type: FormElementType.SELECT,
          options: [option1, option2],
        };

        let elements = [element];
        const onChange = jest.fn().mockImplementation((updatedElements) => (elements = updatedElements));

        render(getComponent({ value: elements, onChange }));

        /**
         * Open Element
         */
        openElement(element.id, element.type);

        /**
         * Simulate drop option 1 to index 0
         */
        await act(async () =>
          onDragEndHandler({
            destination: {
              index: 0,
            },
            source: {
              index: 1,
            },
          } as any)
        );

        /**
         * Save changes
         */
        fireEvent.click(selectors.buttonSaveChanges());

        /**
         * Check if options order is changed
         */
        expect(elements[0].options).toEqual([option2, option1]);
      });

      it('Should not reorder items if drop outside the list', async () => {
        let onDragEndHandler: (result: DropResult) => void = () => null;
        jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
          if (children.props.droppableId === 'options') {
            onDragEndHandler = onDragEnd;
          }
          return children;
        });

        const option1 = { label: 'label', type: FormElementType.STRING, value: '111', id: '111' };
        const option2 = { label: 'label', type: FormElementType.STRING, value: '100', id: '100' };
        const element = {
          ...FORM_ELEMENT_DEFAULT,
          id: 'select',
          type: FormElementType.SELECT,
          options: [option1, option2],
        };

        let elements = [element];
        const onChange = jest.fn().mockImplementation((updatedElements) => (elements = updatedElements));

        render(getComponent({ value: elements, onChange }));

        /**
         * Open Element
         */
        openElement(element.id, element.type);

        /**
         * Simulate drop field 1 to outside the list
         */
        await act(() =>
          onDragEndHandler({
            destination: null,
            source: {
              index: 1,
            },
          } as any)
        );

        /**
         * Save button is not shown because there is no changes
         */
        expect(selectors.buttonSaveChanges(true)).not.toBeInTheDocument();
      });
    });
  });

  /**
   * Query Options
   */
  describe('Query Options', () => {
    const data = [
      toDataFrame({
        refId: 'A',
        fields: [{ name: 'Time' }, { name: 'Value' }],
      }),
      toDataFrame({
        refId: 'B',
        fields: [{ name: 'Value' }],
      }),
    ];

    it('Should change queryOptions value', async () => {
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.QUERY,
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange, context: { data } }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      await act(async () =>
        fireEvent.change(elementSelectors.fieldQueryOptionsValue(), { target: { value: 'A:Time' } })
      );

      expect(elementSelectors.fieldQueryOptionsValue()).toHaveValue('A:Time');
    });

    it('Should keep label if the same source', async () => {
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.QUERY,
        queryOptions: {
          source: 'A',
          value: 'Time',
          label: 'Time',
        },
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange, context: { data } }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('Time');

      /**
       * Change Value Field
       */
      await act(async () =>
        fireEvent.change(elementSelectors.fieldQueryOptionsValue(), { target: { value: 'A:Value' } })
      );

      expect(elementSelectors.fieldQueryOptionsValue()).toHaveValue('A:Value');
      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('Time');
    });

    it('Should use default label if the same source', async () => {
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.QUERY,
        queryOptions: {
          source: 'A',
          value: 'Time',
          label: 'Time',
        },
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange, context: { data } }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('Time');

      /**
       * Change Value Field
       */
      await act(async () =>
        fireEvent.change(elementSelectors.fieldQueryOptionsValue(), { target: { value: 'A:Value' } })
      );

      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('Time');
    });

    it('Should updated label if value.source and option.source are different', async () => {
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.QUERY,
        queryOptions: {
          source: 'A',
          value: 'Time',
          label: '',
        },
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange, context: { data } }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change Value Field
       */
      await act(async () =>
        fireEvent.change(elementSelectors.fieldQueryOptionsValue(), { target: { value: 'A:Value' } })
      );

      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('');
    });

    it('Should remove value', async () => {
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.QUERY,
        queryOptions: {
          source: 'A',
          value: 'Time',
          label: 'Time',
        },
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange, context: { data } }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('Time');

      /**
       * Change Value Field
       */
      await act(async () => fireEvent.change(elementSelectors.fieldQueryOptionsValue(), { target: { value: '' } }));

      expect(elementSelectors.fieldQueryOptionsValue()).toHaveValue('');
    });

    it('Should reset label if different source', async () => {
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.QUERY,
        queryOptions: {
          source: 'A',
          value: 'Time',
          label: 'Time',
        },
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange, context: { data } }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('Time');

      /**
       * Change Value Field
       */
      await act(async () =>
        fireEvent.change(elementSelectors.fieldQueryOptionsValue(), { target: { value: 'B:Value' } })
      );

      expect(elementSelectors.fieldQueryOptionsValue()).toHaveValue('B:Value');
      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('');
    });

    it('Should update label', async () => {
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.QUERY,
        queryOptions: {
          source: 'A',
          value: 'Time',
          label: 'Time',
        },
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange, context: { data } }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('Time');

      /**
       * Change Label Field
       */
      await act(async () =>
        fireEvent.change(elementSelectors.fieldQueryOptionsLabel(), { target: { value: 'Value' } })
      );

      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('Value');
    });

    it('Should remove label', async () => {
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.QUERY,
        queryOptions: {
          source: 'A',
          value: 'Time',
          label: 'Time',
        },
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange, context: { data } }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('Time');

      /**
       * Change Value Field
       */
      await act(async () => fireEvent.change(elementSelectors.fieldQueryOptionsLabel(), { target: { value: '' } }));

      expect(elementSelectors.fieldQueryOptionsLabel()).toHaveValue('');
    });
  });

  /**
   * Get Options Code
   */
  describe('Get Options Code', () => {
    it('Should update getOptions code value', async () => {
      const element = {
        ...FORM_ELEMENT_DEFAULT,
        id: 'select',
        type: FormElementType.SELECT,
        optionsSource: OptionsSource.CODE,
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change Get Options Field
       */
      await act(async () => fireEvent.change(elementSelectors.fieldGetOptions(), { target: { value: '123' } }));

      expect(elementSelectors.fieldGetOptions()).toHaveValue('123');
    });
  });

  /**
   * Layout Section
   */
  describe('Layout Section', () => {
    const sections = [
      { id: 'section', name: 'section' },
      { id: 'section 2', name: 'section 2' },
    ];
    const elements = [
      {
        ...FORM_ELEMENT_DEFAULT,
        id: 'id',
      },
    ];

    it('Should render layout section', () => {
      render(getComponent({ value: elements, onChange, context: { options: { layout: { sections } } } }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Check section field presence
       */
      expect(elementSelectors.fieldSection()).toBeInTheDocument();
    });

    it('Should update section for element', async () => {
      render(getComponent({ value: elements, onChange, context: { options: { layout: { sections } } } }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FORM_ELEMENT_DEFAULT.type);

      /**
       * Change section
       */
      await act(() => fireEvent.change(elementSelectors.fieldSection(), { target: { value: sections[1].name } }));

      expect(elementSelectors.fieldSection()).toHaveValue(sections[1].name);
    });
  });

  /**
   * Auto Save
   */
  describe('Auto Save', () => {
    it('Should call auto save changes if no changes on timeout', async () => {
      const element = { ...FORM_ELEMENT_DEFAULT, id: 'string', width: 0 };
      const elements = [element];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open element
       */
      const elementSelectors = openElement(element.id, element.type);

      await act(() => fireEvent.change(elementSelectors.fieldWidth(), { target: { value: '10' } }));
      await act(() => fireEvent.change(elementSelectors.fieldWidth(), { target: { value: '20' } }));

      await act(() => {
        jest.runAllTimers();
      });

      /**
       * Check call onChange
       */
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            width: 20,
          }),
        ])
      );

      /**
       * Check if save changes button doesn't exist
       */
      await waitFor(() => {
        expect(selectors.buttonSaveChanges(true)).not.toBeInTheDocument();
      });
    });
  });

  describe('Custom button', () => {
    it('Should update icon for custom button', async () => {
      const element = { ...CUSTOM_BUTTON_DEFAULT, id: 'button', uid: 'button-1', type: FormElementType.CUSTOM_BUTTON };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);
      expect(elementSelectors.fieldCustomButtonIcon()).toBeInTheDocument();
      expect(elementSelectors.fieldCustomButtonIcon()).toHaveValue('circle');

      await act(() => fireEvent.change(elementSelectors.fieldCustomButtonIcon(), { target: { value: 'arrow-down' } }));

      expect(elementSelectors.fieldCustomButtonIcon()).toHaveValue('arrow-down');
    });

    it('Should update button size', async () => {
      const element = { ...CUSTOM_BUTTON_DEFAULT, id: 'button', uid: 'button-1', type: FormElementType.CUSTOM_BUTTON };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Choose hidden option
       */
      const fieldVisibilitySelectors = getFormElementsEditorSelectors(within(elementSelectors.fieldCustomButtonSize()));
      expect(fieldVisibilitySelectors.customButtonSizeOption(false, 'md')).toBeInTheDocument();

      await act(() => fireEvent.click(fieldVisibilitySelectors.customButtonSizeOption(false, 'lg')));

      expect(fieldVisibilitySelectors.customButtonSizeOption(false, 'lg')).toBeChecked();
    });

    it('Should update button text label', async () => {
      const element = { ...CUSTOM_BUTTON_DEFAULT, id: 'button', uid: 'button-1', type: FormElementType.CUSTOM_BUTTON };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldCustomButtonLabel()).toBeInTheDocument();
      expect(elementSelectors.fieldCustomButtonLabel()).toHaveValue('Button');

      await act(() => fireEvent.change(elementSelectors.fieldCustomButtonLabel(), { target: { value: 'Text' } }));

      expect(elementSelectors.fieldCustomButtonLabel()).toHaveValue('Text');
    });

    it('Should update button place', async () => {
      const element = { ...CUSTOM_BUTTON_DEFAULT, id: 'button', uid: 'button-1', type: FormElementType.CUSTOM_BUTTON };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Choose hidden option
       */
      const fieldVisibilitySelectors = getFormElementsEditorSelectors(
        within(elementSelectors.fieldCustomButtonPlace())
      );
      expect(fieldVisibilitySelectors.customButtonPlaceOption(false, 'form')).toBeInTheDocument();

      await act(() => fireEvent.click(fieldVisibilitySelectors.customButtonPlaceOption(false, 'bottom')));

      expect(fieldVisibilitySelectors.customButtonPlaceOption(false, 'bottom')).toBeChecked();
    });

    it('Should update button variant', async () => {
      const element = { ...CUSTOM_BUTTON_DEFAULT, id: 'button', uid: 'button-1', type: FormElementType.CUSTOM_BUTTON };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Choose hidden option
       */
      const fieldVisibilitySelectors = getFormElementsEditorSelectors(
        within(elementSelectors.fieldCustomButtonVariant())
      );
      expect(fieldVisibilitySelectors.customButtonVariantOption(false, 'primary')).toBeInTheDocument();

      await act(() => fireEvent.click(fieldVisibilitySelectors.customButtonVariantOption(false, 'secondary')));

      expect(fieldVisibilitySelectors.customButtonVariantOption(false, 'secondary')).toBeChecked();
    });

    it('Should update button background for custom variant', async () => {
      const element = {
        ...CUSTOM_BUTTON_DEFAULT,
        id: 'button',
        uid: 'button-1',
        variant: ButtonVariant.CUSTOM,
        type: FormElementType.CUSTOM_BUTTON,
        backgroundColor: '',
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldCustomButtonBackground()).toHaveValue('');
      /**
       * Change Color
       */
      await act(() =>
        fireEvent.change(elementSelectors.fieldCustomButtonBackground(), { target: { value: '#c2c2c2' } })
      );

      expect(elementSelectors.fieldCustomButtonBackground()).toHaveValue('#c2c2c2');
    });

    it('Should update button Foreground for custom variant', async () => {
      const element = {
        ...CUSTOM_BUTTON_DEFAULT,
        id: 'button',
        uid: 'button-1',
        variant: ButtonVariant.CUSTOM,
        type: FormElementType.CUSTOM_BUTTON,
        backgroundColor: '',
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldCustomButtonForeground()).toHaveValue('');
      /**
       * Change Color
       */
      await act(() =>
        fireEvent.change(elementSelectors.fieldCustomButtonForeground(), { target: { value: '#c2c2c2' } })
      );

      expect(elementSelectors.fieldCustomButtonForeground()).toHaveValue('#c2c2c2');
    });

    it('Should update button custom code', async () => {
      const element = {
        ...CUSTOM_BUTTON_DEFAULT,
        id: 'button',
        uid: 'button-1',
        variant: ButtonVariant.CUSTOM,
        type: FormElementType.CUSTOM_BUTTON,
        backgroundColor: '',
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      expect(elementSelectors.fieldCustomButtonCustomCode()).toBeInTheDocument();
      expect(elementSelectors.fieldCustomButtonCustomCode()).toHaveValue('');

      /**
       * Change textarea rows
       */
      await act(() => fireEvent.blur(elementSelectors.fieldCustomButtonCustomCode(), { target: { value: '123' } }));

      expect(elementSelectors.fieldCustomButtonCustomCode()).toHaveValue('123');
    });
  });
  it('Should update local elements if prop elements is changed', async () => {
    const element = { ...FORM_ELEMENT_DEFAULT, id: 'string' };
    const elements = [element];

    const { rerender } = render(getComponent({ value: elements, onChange }));

    /**
     * Check element presence
     */
    expect(selectors.sectionLabel(false, element.id, element.type)).toBeInTheDocument();

    /**
     * Rerender with new elements
     */
    const updatedElement = { ...FORM_ELEMENT_DEFAULT, id: 'select' };
    const updatedElements = [updatedElement];

    await act(() => rerender(getComponent({ value: updatedElements, onChange })));

    /**
     * Check if only updated elements is rendered
     */
    expect(selectors.sectionLabel(true, element.id, element.type)).not.toBeInTheDocument();
    expect(selectors.sectionLabel(false, updatedElement.id, updatedElement.type)).toBeInTheDocument();
  });
});
