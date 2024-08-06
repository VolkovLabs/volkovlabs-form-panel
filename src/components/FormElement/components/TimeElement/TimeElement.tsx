import { DateTime, dateTime } from '@grafana/data';
import { InlineField, TimeOfDayPicker } from '@grafana/ui';
import React from 'react';

import { FormElementType, TEST_IDS } from '../../../../constants';
import { FormElementByType, LocalFormElement } from '../../../../types';
import { applyWidth } from '../../../../utils';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.TIME>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.TIME>;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;
}

/**
 * Time Element
 */
export const TimeElement: React.FC<Props> = ({ element, onChange }) => {
  return (
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
        value={element.value ? dateTime(element.value) : dateTime(new Date().toISOString())}
        onChange={(dateTime: DateTime) => {
          onChange<typeof element>({
            ...element,
            value: dateTime.toISOString(),
          });
        }}
      />
    </InlineField>
  );
};
