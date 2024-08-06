import { InlineField, TextArea } from '@grafana/ui';
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
   * @type {FormElementByType<LocalFormElement, FormElementType.TEXTAREA>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.TEXTAREA>;

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
 * Text Area Element
 */
export const TextAreaElement: React.FC<Props> = ({ element, onChange, highlightClass }) => {
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
  );
};
