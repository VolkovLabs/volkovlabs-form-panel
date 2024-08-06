import { InlineField, Select } from '@grafana/ui';
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
   * @type {FormElementByType<LocalFormElement, FormElementType.SELECT>}
   */
  element:
    | FormElementByType<LocalFormElement, FormElementType.SELECT>
    | FormElementByType<LocalFormElement, FormElementType.MULTISELECT>;

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
 * Select Element
 */
export const SelectElement: React.FC<Props> = ({ element, onChange, highlightClass }) => {
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
  );
};
