import { InlineField, RadioButtonGroup } from '@grafana/ui';
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
   * @type {FormElementByType<LocalFormElement, FormElementType.RADIO>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.RADIO>;

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
 * Radio Element
 */
export const RadioElement: React.FC<Props> = ({ element, onChange, highlightClass }) => {
  return (
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
  );
};
