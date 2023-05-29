import Slider from 'rc-slider';
import React, { ChangeEvent, useCallback } from 'react';
import { css, cx } from '@emotion/css';
import { dateTime, DateTime, SelectableValue } from '@grafana/data';
import {
  CodeEditor,
  DateTimePicker,
  InlineField,
  InlineFieldRow,
  InlineLabel,
  Input,
  RadioButtonGroup,
  Select,
  TextArea,
  useStyles2,
  useTheme2,
} from '@grafana/ui';
import {
  BooleanElementOptions,
  CodeEditorHeight,
  CodeLanguage,
  FormElementType,
  InitialHighlightColorDefault,
  TestIds,
} from '../../constants';
import { Styles } from '../../styles';
import { FormElement, LayoutSection, PanelOptions } from '../../types';
import { useFormElements } from '../../hooks';
import { ToNumberValue } from '../../utils';

/**
 * Properties
 */
interface Props {
  /**
   * Options
   *
   * @type {PanelOptions}
   */
  options: PanelOptions;

  /**
   * On Options Change
   */
  onOptionsChange: (options: PanelOptions) => void;

  /**
   * Initial values
   *
   * @type {[id: string]: any}
   */
  initial: { [id: string]: any };

  /**
   * Section
   */
  section: LayoutSection | null;
}

/**
 * Form Elements
 */
export const FormElements: React.FC<Props> = ({ options, onOptionsChange, section, initial }) => {
  /**
   * Theme and Styles
   */
  const theme = useTheme2();
  const styles = useStyles2(Styles);

  /**
   * Save Options
   */
  const onSaveOptions = useCallback(
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
  const { elements, onChangeElement } = useFormElements(onSaveOptions, options.elements);

  /**
   * Highlight Color
   */
  const highlightColor = theme.visualization.getColorByName(
    options.initial.highlightColor || InitialHighlightColorDefault
  );

  /**
   * Highlight CSS
   */
  const highlightClass = (element: FormElement) => {
    return options.initial.highlight && Object.keys(initial).length && initial[element.id] !== element.value
      ? css`
          -webkit-text-fill-color: ${highlightColor};
        `
      : css`
          -webkit-text-fill-color: ${theme.colors.text.primary};
        `;
  };

  return (
    <div data-testid={TestIds.formElements.root}>
      {elements.map((element, index) => {
        /**
         * Skip Hidden Elements
         */
        if (section && element.section !== section.name) {
          return;
        }

        /**
         * Return
         */
        return (
          <InlineFieldRow key={index} data-testid={TestIds.formElements.element(element.id, element.type)}>
            {element.type === FormElementType.NUMBER && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <Input
                  value={element.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    let value = ToNumberValue(event.target.value);

                    /**
                     * Validate Maximum
                     */
                    if (element.max !== undefined && element.max !== null) {
                      value = Math.min(element.max, value || 0);
                    }

                    /**
                     * Validate Minimum
                     */
                    if (element.min !== undefined && element.min !== null) {
                      value = Math.max(element.min, value || 0);
                    }

                    onChangeElement({
                      ...element,
                      value,
                    });
                  }}
                  type="number"
                  className={highlightClass(element)}
                  width={element.width}
                  min={element.min !== null ? element.min : ''}
                  max={element.max !== null ? element.max : ''}
                  data-testid={TestIds.formElements.fieldNumber}
                />
              </InlineField>
            )}

            {element.type === FormElementType.STRING && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!element.title}
                className={cx(element.hidden && styles.hidden)}
              >
                <Input
                  value={element.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onChangeElement({
                      ...element,
                      value: event.target.value,
                    });
                  }}
                  className={highlightClass(element)}
                  width={element.width}
                  type="text"
                  data-testid={TestIds.formElements.fieldString}
                />
              </InlineField>
            )}

            {element.type === FormElementType.PASSWORD && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <Input
                  value={element.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onChangeElement({
                      ...element,
                      value: event.target.value,
                    });
                  }}
                  className={highlightClass(element)}
                  width={element.width}
                  type="password"
                  data-testid={TestIds.formElements.fieldPassword}
                />
              </InlineField>
            )}

            {element.type === FormElementType.DISABLED && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                disabled
                transparent={!element.title}
              >
                <Input
                  value={
                    !element.options?.length
                      ? element.value
                      : element.options.find((option) => option.value === element.value)?.label
                  }
                  type="text"
                  width={element.width}
                  data-testid={TestIds.formElements.fieldDisabled}
                />
              </InlineField>
            )}

            {element.type === FormElementType.TEXTAREA && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <TextArea
                  value={element.value}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                    onChangeElement({
                      ...element,
                      value: event.target.value,
                    });
                  }}
                  className={highlightClass(element)}
                  cols={element.width}
                  rows={element.rows}
                  data-testid={TestIds.formElements.fieldTextarea}
                />
              </InlineField>
            )}

            {element.type === FormElementType.CODE && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <CodeEditor
                  language={element.language || CodeLanguage.JAVASCRIPT}
                  showLineNumbers={true}
                  showMiniMap={(element.value && element.value.length) > 100}
                  value={element.value}
                  height={element.height || `${CodeEditorHeight}px`}
                  width={element.width}
                  onBlur={(code) => {
                    onChangeElement({
                      ...element,
                      value: code,
                    });
                  }}
                  monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                  data-testid={TestIds.formElements.fieldCode}
                />
              </InlineField>
            )}

            {element.type === FormElementType.BOOLEAN && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!element.title}
                data-testid={TestIds.formElements.fieldBooleanContainer}
              >
                <RadioButtonGroup
                  value={element.value}
                  onChange={(value: Boolean) => {
                    onChangeElement({
                      ...element,
                      value,
                    });
                  }}
                  className={highlightClass(element)}
                  fullWidth={!element.width}
                  options={BooleanElementOptions}
                />
              </InlineField>
            )}

            {element.type === FormElementType.DATETIME && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <DateTimePicker
                  date={dateTime(element.value)}
                  onChange={(dateTime: DateTime) => {
                    onChangeElement({
                      ...element,
                      value: dateTime,
                    });
                  }}
                  data-testid={TestIds.formElements.fieldDateTime}
                />
              </InlineField>
            )}

            {element.type === FormElementType.SLIDER && element.value != null && (
              <>
                <InlineField
                  label={element.title}
                  grow={!element.width}
                  labelWidth={element.labelWidth}
                  tooltip={element.tooltip}
                  transparent={!element.title}
                  className={cx(styles.slider)}
                >
                  <Slider
                    value={element.value || 0}
                    onChange={(value: number | number[]) => {
                      onChangeElement({
                        ...element,
                        value,
                      });
                    }}
                    min={element.min || 0}
                    max={element.max || 0}
                    step={element.step || 0}
                    ariaLabelForHandle={TestIds.formElements.fieldSlider}
                  />
                </InlineField>
                <InlineField className={cx(styles.sliderInput)}>
                  <Input
                    type="number"
                    width={8}
                    min={element.min || 0}
                    max={element.max || 0}
                    value={element.value || 0}
                    onChange={(e) => {
                      onChangeElement({
                        ...element,
                        value: Math.max(element.min || 0, Math.min(element.max || 0, Number(e.currentTarget.value))),
                      });
                    }}
                    data-testid={TestIds.formElements.fieldSliderInput}
                  />
                </InlineField>
              </>
            )}

            {element.type === FormElementType.RADIO && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!element.title}
                data-testid={TestIds.formElements.fieldRadioContainer}
              >
                <RadioButtonGroup
                  value={element.value}
                  onChange={(value: unknown) => {
                    onChangeElement({
                      ...element,
                      value,
                    });
                  }}
                  fullWidth={!element.width}
                  options={element.options || []}
                  className={highlightClass(element)}
                />
              </InlineField>
            )}

            {element.type === FormElementType.SELECT && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <Select
                  aria-label={TestIds.formElements.fieldSelect}
                  value={element.value}
                  onChange={(event: SelectableValue) => {
                    onChangeElement({
                      ...element,
                      value: event?.value,
                    });
                  }}
                  width={element.width}
                  options={element.options || []}
                  className={highlightClass(element)}
                />
              </InlineField>
            )}

            {element.unit && (
              <InlineLabel data-testid={TestIds.formElements.unit} transparent width={4}>
                {element.unit}
              </InlineLabel>
            )}
          </InlineFieldRow>
        );
      })}
    </div>
  );
};
