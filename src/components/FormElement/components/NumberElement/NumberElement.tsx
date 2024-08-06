import { InlineField } from '@grafana/ui';
import { NumberInput } from '@volkovlabs/components';
import React from 'react';

import { FormElementType, TEST_IDS } from '../../../../constants';
import { FormElementByType, LocalFormElement } from '../../../../types';
import { applyLabelStyles, applyWidth, formatNumberValue } from '../../../../utils';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.NUMBER>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.NUMBER>;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;

  /**
   * Highlight Class
   */
  highlightClass: (element: LocalFormElement) => string;
}

/**
 * Number Element
 */
export const NumberElement: React.FC<Props> = ({ element, onChange, highlightClass }) => {
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
  );
};
