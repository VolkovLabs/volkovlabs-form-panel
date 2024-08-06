import { InlineField, RadioButtonGroup } from '@grafana/ui';
import React from 'react';

import { BOOLEAN_ELEMENT_OPTIONS, FormElementType, TEST_IDS } from '../../../../constants';
import { FormElementByType, LocalFormElement } from '../../../../types';
import { applyLabelStyles, applyWidth } from '../../../../utils';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.BOOLEAN>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.BOOLEAN>;

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
 * Boolean Element
 */
export const BooleanElement: React.FC<Props> = ({ element, onChange, highlightClass }) => {
  return (
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
  );
};
