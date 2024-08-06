import { InlineField, TextArea } from '@grafana/ui';
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
   * @type {FormElementByType<LocalFormElement, FormElementType.DISABLED_TEXTAREA>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.DISABLED_TEXTAREA>;

  /**
   * Highlight Class
   */
  highlightClass: (element: LocalFormElement) => string;
}

/**
 * Disabled Text Area Element
 */
export const DisabledTextAreaElement: React.FC<Props> = ({ element, highlightClass }) => {
  return (
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
  );
};
