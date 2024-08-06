import { cx } from '@emotion/css';
import { InterpolateFunction } from '@grafana/data';
import { InlineFieldRow, InlineLabel, useStyles2 } from '@grafana/ui';
import React from 'react';

import { FormElementType, TEST_IDS } from '../../constants';
import { CustomButtonShow, ExecuteCustomCodeParams, LocalFormElement } from '../../types';
import {
  BooleanElement,
  CheckboxListElement,
  CodeElement,
  CustomButtonElement,
  DateTimeElement,
  DisabledElement,
  DisabledTextAreaElement,
  FileElement,
  LinkElement,
  NumberElement,
  PasswordElement,
  RadioElement,
  SelectElement,
  SliderElement,
  StringElement,
  TextAreaElement,
  TimeElement,
} from './components';
import { getStyles } from './FormElement.styles';
/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {LocalFormElement}
   */
  element: LocalFormElement;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;

  /**
   * Highlight Class
   */
  highlightClass: (element: LocalFormElement) => string;

  /**
   * Template variables interpolation function
   */
  replaceVariables: InterpolateFunction;

  /**
   * Execute Custom Code
   */
  executeCustomCode: (params: ExecuteCustomCodeParams) => Promise<unknown>;

  /**
   * Elements
   */
  elements: LocalFormElement[];

  /**
   * Initial values
   *
   * @type {[id: string]: unknown}
   */
  initial: { [id: string]: unknown };
}

/**
 * Form Element
 */
export const FormElement: React.FC<Props> = ({
  element,
  onChange,
  highlightClass,
  executeCustomCode,
  elements,
  initial,
}) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * Render Element
   */
  const renderElement = (element: LocalFormElement) => {
    switch (element.type) {
      case FormElementType.NUMBER: {
        return <NumberElement element={element} onChange={onChange} highlightClass={highlightClass} />;
      }
      case FormElementType.STRING: {
        return <StringElement element={element} onChange={onChange} highlightClass={highlightClass} />;
      }
      case FormElementType.PASSWORD: {
        return <PasswordElement element={element} onChange={onChange} highlightClass={highlightClass} />;
      }
      case FormElementType.DISABLED: {
        return <DisabledElement element={element} />;
      }
      case FormElementType.TEXTAREA: {
        return <TextAreaElement element={element} onChange={onChange} highlightClass={highlightClass} />;
      }
      case FormElementType.DISABLED_TEXTAREA: {
        return <DisabledTextAreaElement element={element} highlightClass={highlightClass} />;
      }
      case FormElementType.CODE: {
        return <CodeElement element={element} onChange={onChange} />;
      }
      case FormElementType.BOOLEAN: {
        return <BooleanElement element={element} onChange={onChange} highlightClass={highlightClass} />;
      }
      case FormElementType.DATETIME: {
        return <DateTimeElement element={element} onChange={onChange} />;
      }
      case FormElementType.TIME: {
        return <TimeElement element={element} onChange={onChange} />;
      }
      case FormElementType.SLIDER: {
        return <SliderElement element={element} onChange={onChange} />;
      }
      case FormElementType.RADIO: {
        return <RadioElement element={element} onChange={onChange} highlightClass={highlightClass} />;
      }
      case FormElementType.SELECT: {
        return <SelectElement element={element} onChange={onChange} highlightClass={highlightClass} />;
      }
      case FormElementType.MULTISELECT: {
        return <SelectElement element={element} onChange={onChange} highlightClass={highlightClass} />;
      }
      case FormElementType.FILE: {
        return <FileElement element={element} onChange={onChange} />;
      }
      case FormElementType.LINK: {
        return <LinkElement element={element} />;
      }
      case FormElementType.CHECKBOX_LIST: {
        return <CheckboxListElement element={element} onChange={onChange} />;
      }
      case FormElementType.CUSTOM_BUTTON: {
        if (element.show === CustomButtonShow.FORM) {
          return (
            <CustomButtonElement
              element={element}
              executeCustomCode={executeCustomCode}
              elements={elements}
              initial={initial}
            />
          );
        }
        return <></>;
      }
      default: {
        return <></>;
      }
    }
  };

  return (
    <InlineFieldRow
      data-testid={TEST_IDS.formElements.element(element.id, element.type)}
      className={cx({
        [styles.rootWithBackground]: !!element.background,
      })}
      style={{
        backgroundColor: element.background || undefined,
      }}
    >
      {renderElement(element)}
      {element.unit && (
        <InlineLabel data-testid={TEST_IDS.formElements.unit} transparent width={4}>
          {element.unit}
        </InlineLabel>
      )}
    </InlineFieldRow>
  );
};
