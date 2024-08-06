import { DateTime, dateTime } from '@grafana/data';
import { DatePickerWithInput, DateTimePicker, InlineField } from '@grafana/ui';
import React from 'react';

import { FormElementType, TEST_IDS } from '../../../../constants';
import { FormElementByType, LocalFormElement } from '../../../../types';
import { applyLabelStyles, applyWidth } from '../../../../utils';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.DATETIME>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.DATETIME>;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;
}

/**
 * Date Time Element
 */
export const DateTimeElement: React.FC<Props> = ({ element, onChange }) => {
  return (
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
        />
      )}
    </InlineField>
  );
};
