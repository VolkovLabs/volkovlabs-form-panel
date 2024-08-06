import { InlineField, Input } from '@grafana/ui';
import React, { ChangeEvent } from 'react';

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
   * @type {FormElementByType<LocalFormElement, FormElementType.PASSWORD>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.PASSWORD>;

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
 * Password Element
 */
export const PasswordElement: React.FC<Props> = ({ element, onChange, highlightClass }) => {
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
  );
};
