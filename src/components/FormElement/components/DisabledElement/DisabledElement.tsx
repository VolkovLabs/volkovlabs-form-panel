import { InlineField, Input } from '@grafana/ui';
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
   * @type {FormElementByType<LocalFormElement, FormElementType.DISABLED>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.DISABLED>;
}

/**
 * Disabled Element
 */
export const DisabledElement: React.FC<Props> = ({ element }) => {
  return (
    <>
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
    </>
  );
};
