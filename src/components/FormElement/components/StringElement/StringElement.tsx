import { cx } from '@emotion/css';
import { InlineField, Input, useStyles2 } from '@grafana/ui';
import React, { ChangeEvent } from 'react';

import { FormElementType, TEST_IDS } from '../../../../constants';
import { FormElementByType, LocalFormElement } from '../../../../types';
import { applyLabelStyles, applyWidth } from '../../../../utils';
import { getStyles } from './StringElement.style';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.STRING>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.STRING>;

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
 * String Element
 */
export const StringElement: React.FC<Props> = ({ element, onChange, highlightClass }) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  return (
    <InlineField
      label={element.title}
      grow={!element.width}
      labelWidth={applyWidth(element.labelWidth)}
      tooltip={element.tooltip}
      transparent={!element.title}
      className={cx(
        {
          [styles.hidden]: element.hidden,
        },
        applyLabelStyles(element.labelBackground, element.labelColor)
      )}
      disabled={element.disabled}
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
        type="text"
        data-testid={TEST_IDS.formElements.fieldString}
      />
    </InlineField>
  );
};
