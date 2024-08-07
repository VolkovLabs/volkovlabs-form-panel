import { cx } from '@emotion/css';
import { DateTime, dateTime, dateTimeForTimeZone, getTimeZone } from '@grafana/data';
import {
  Checkbox,
  DatePickerWithInput,
  DateTimePicker,
  FileDropzone,
  InlineField,
  InlineFieldRow,
  InlineLabel,
  Input,
  RadioButtonGroup,
  Select,
  TextArea,
  TextLink,
  TimeOfDayPicker,
  useStyles2,
  useTheme2,
} from '@grafana/ui';
import { AutosizeCodeEditor, NumberInput } from '@volkovlabs/components';
import Slider from 'rc-slider';
import React, { ChangeEvent, useCallback } from 'react';

import { BOOLEAN_ELEMENT_OPTIONS, FormElementType, TEST_IDS } from '../../constants';
import { CodeLanguage, LinkTarget, LocalFormElement } from '../../types';
import { applyAcceptedFiles, applyLabelStyles, applyWidth, formatNumberValue, isFormElementType } from '../../utils';
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
   * Time Zone
   *
   * @type {string}
   */
  timeZone: string;
}

/**
 * Form Element
 */
export const FormElement: React.FC<Props> = ({ element, onChange, highlightClass, timeZone }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  /**
   * To Date Time With Time Zone
   */
  const toDateTimeWithTimeZone = useCallback(
    (date?: string) => {
      return dateTimeForTimeZone(getTimeZone({ timeZone }), date);
    },
    [timeZone]
  );

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
      {element.type === FormElementType.NUMBER && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <NumberInput
            value={formatNumberValue(element.value)}
            onChange={(value: number) => {
              onChange<typeof element>({
                ...element,
                value,
              });
            }}
            type="number"
            className={highlightClass(element)}
            width={applyWidth(element.width)}
            min={element.min}
            max={element.max}
            data-testid={TEST_IDS.formElements.fieldNumber}
          />
        </InlineField>
      )}

      {element.type === FormElementType.STRING && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          className={cx(
            {
              [styles.hidden]: element.hidden,
            },
            applyLabelStyles(element.labelBackground, element.labelColor)
          )}
          disabled={element.disabled}
        >
          <Input
            value={element.value || ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange<typeof element>({
                ...element,
                value: event.target.value,
              });
            }}
            className={highlightClass(element)}
            width={applyWidth(element.width)}
            type="text"
            data-testid={TEST_IDS.formElements.fieldString}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.PASSWORD) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <Input
            value={element.value || ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange<typeof element>({
                ...element,
                value: event.target.value,
              });
            }}
            className={highlightClass(element)}
            width={applyWidth(element.width)}
            type="password"
            data-testid={TEST_IDS.formElements.fieldPassword}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.DISABLED) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          disabled
          transparent={!element.title}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <Input
            value={
              !element.options?.length
                ? element.value?.toString() || ''
                : element.options?.find((option) => option.value === element.value)?.label
            }
            type="text"
            width={applyWidth(element.width)}
            data-testid={TEST_IDS.formElements.fieldDisabled}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.TEXTAREA) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <TextArea
            value={element.value}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              onChange<typeof element>({
                ...element,
                value: event.target.value,
              });
            }}
            className={highlightClass(element)}
            cols={applyWidth(element.width)}
            rows={element.rows}
            data-testid={TEST_IDS.formElements.fieldTextarea}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.DISABLED_TEXTAREA) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.type === FormElementType.DISABLED_TEXTAREA}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <TextArea
            value={element.value}
            className={highlightClass(element)}
            cols={applyWidth(element.width)}
            rows={element.rows}
            data-testid={TEST_IDS.formElements.fieldDisabledTextarea}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.CODE) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <AutosizeCodeEditor
            language={element.language || CodeLanguage.JAVASCRIPT}
            showLineNumbers={true}
            showMiniMap={(element.value?.length || 0) > 100}
            value={element.value || ''}
            height={element.height}
            width={applyWidth(element.width)}
            onBlur={(code) => {
              onChange<typeof element>({
                ...element,
                value: code,
              });
            }}
            monacoOptions={{ formatOnPaste: true, formatOnType: true }}
            aria-label={TEST_IDS.formElements.fieldCode}
            readOnly={element.disabled}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.BOOLEAN) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          data-testid={TEST_IDS.formElements.fieldBooleanContainer}
          disabled={element.disabled}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <RadioButtonGroup
            value={element.value}
            onChange={(value: boolean) => {
              onChange<typeof element>({
                ...element,
                value,
              });
            }}
            className={highlightClass(element)}
            fullWidth={!element.width}
            options={BOOLEAN_ELEMENT_OPTIONS}
          />
        </InlineField>
      )}

      {element.type === FormElementType.DATETIME && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          {element.disabled ? (
            <DatePickerWithInput
              onChange={undefined as never}
              value={element.value}
              data-testid={TEST_IDS.formElements.fieldDateTime}
            />
          ) : (
            <DateTimePicker
              minDate={element.min ? new Date(element.min) : undefined}
              maxDate={element.max ? new Date(element.max) : undefined}
              date={dateTime(element.value)}
              onChange={(dateTime?: DateTime) => {
                if (dateTime) {
                  onChange<typeof element>({
                    ...element,
                    value: dateTime.toISOString(element.isUseLocalTime),
                  });
                }
              }}
              data-testid={TEST_IDS.formElements.fieldDateTime}
              timeZone={timeZone}
            />
          )}
        </InlineField>
      )}

      {element.type === FormElementType.TIME && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
        >
          <TimeOfDayPicker
            data-testid={TEST_IDS.formElements.fieldTime}
            value={
              element.value ? toDateTimeWithTimeZone(element.value) : toDateTimeWithTimeZone(new Date().toISOString())
            }
            onChange={(dateTime: DateTime) => {
              onChange<typeof element>({
                ...element,
                value: dateTime.toISOString(),
              });
            }}
          />
        </InlineField>
      )}

      {element.type === FormElementType.SLIDER && element.value != null && (
        <>
          <InlineField
            label={element.title}
            grow={!element.width}
            labelWidth={applyWidth(element.labelWidth)}
            tooltip={element.tooltip}
            transparent={!element.title}
            className={cx(styles.slider, applyLabelStyles(element.labelBackground, element.labelColor))}
            disabled={element.disabled}
          >
            <Slider
              value={element.value || 0}
              onChange={(value) => {
                onChange<typeof element>({
                  ...element,
                  value: Array.isArray(value) ? value[value.length - 1] : value,
                });
              }}
              min={element.min || 0}
              max={element.max || 0}
              step={element.step || 0}
              ariaLabelForHandle={TEST_IDS.formElements.fieldSlider}
            />
          </InlineField>
          <InlineField className={cx(styles.sliderInput)} disabled={element.disabled}>
            <Input
              type="number"
              width={8}
              min={element.min || 0}
              max={element.max || 0}
              value={element.value || 0}
              onChange={(e) => {
                onChange<typeof element>({
                  ...element,
                  value: Math.max(element.min || 0, Math.min(element.max || 0, Number(e.currentTarget.value))),
                });
              }}
              data-testid={TEST_IDS.formElements.fieldSliderInput}
            />
          </InlineField>
        </>
      )}

      {element.type === FormElementType.RADIO && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          data-testid={TEST_IDS.formElements.fieldRadioContainer}
          disabled={element.disabled}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <RadioButtonGroup
            value={element.value}
            onChange={(value: unknown) => {
              onChange<typeof element>({
                ...element,
                value,
              });
            }}
            fullWidth={!element.width}
            options={element.options}
            className={highlightClass(element)}
          />
        </InlineField>
      )}

      {(element.type === FormElementType.SELECT || element.type === FormElementType.MULTISELECT) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <Select
            key={element.id}
            isMulti={element.type === FormElementType.MULTISELECT}
            aria-label={TEST_IDS.formElements.fieldSelect}
            value={element.value !== undefined ? element.value : null}
            onChange={(event) => {
              onChange<typeof element>({
                ...element,
                value: Array.isArray(event) ? event.map(({ value }) => value) : event.value,
              });
            }}
            width={applyWidth(element.width)}
            options={element.options}
            className={highlightClass(element)}
          />
        </InlineField>
      )}

      {element.type === FormElementType.FILE && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <FileDropzone
            options={{
              accept: applyAcceptedFiles(element.accept),
              multiple: element.multiple,
              onDrop: (files: File[]) => {
                onChange<typeof element>({
                  ...element,
                  value: files,
                });
              },
            }}
            onFileRemove={(removedItem) => {
              onChange<typeof element>({
                ...element,
                value: element.value?.filter((item: File) => item.name !== removedItem.file.name) || [],
              });
            }}
            data-testid={TEST_IDS.formElements.fieldFile}
          />
        </InlineField>
      )}

      {element.type === FormElementType.LINK && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          className={applyLabelStyles(element.labelBackground, element.labelColor)}
        >
          <div className={styles.link} style={{ width: element.width ? theme.spacing(element.width) : 'auto' }}>
            <TextLink
              href={element.value}
              external={element.target === LinkTarget.NEW_TAB}
              data-testid={TEST_IDS.formElements.link}
            >
              {element.linkText || element.value}
            </TextLink>
          </div>
        </InlineField>
      )}

      {element.type === FormElementType.CHECKBOX_LIST && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
          className={cx(styles.checkboxWrap, applyLabelStyles(element.labelBackground, element.labelColor))}
          data-testid={TEST_IDS.formElements.fieldCheckboxListContainer}
        >
          <div style={{ width: element.width ? theme.spacing(element.width) : 'auto' }} className={styles.checkboxRow}>
            {element.options.map((option) => (
              <Checkbox
                className={styles.checkbox}
                key={option.id}
                value={element.value.some((val) => val === option.value)}
                label={option.label}
                onChange={(event) => {
                  onChange<typeof element>({
                    ...element,
                    value: event.currentTarget.checked
                      ? element.value.concat(option.value)
                      : element.value.filter((value) => value !== option.value),
                  });
                }}
              />
            ))}
          </div>
        </InlineField>
      )}

      {element.unit && (
        <InlineLabel data-testid={TEST_IDS.formElements.unit} transparent width={4}>
          {element.unit}
        </InlineLabel>
      )}
    </InlineFieldRow>
  );
};
