import { cx } from '@emotion/css';
import { Checkbox, InlineField, useStyles2, useTheme2 } from '@grafana/ui';
import React from 'react';

import { FormElementType, TEST_IDS } from '../../../../constants';
import { FormElementByType, LocalFormElement } from '../../../../types';
import { applyLabelStyles, applyWidth } from '../../../../utils';
import { getStyles } from './CheckboxListElement.style';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.CHECKBOX_LIST>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.CHECKBOX_LIST>;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;
}

/**
 * Checkbox List Element
 */
export const CheckboxListElement: React.FC<Props> = ({ element, onChange }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  return (
    <InlineField
      label={element.title}
      grow={!element.width}
      labelWidth={applyWidth(element.labelWidth)}
      tooltip={element.tooltip}
      transparent={!element.title}
      disabled={element.disabled}
      className={cx(styles.checkboxWrap, applyLabelStyles(element.labelBackground, element.labelColor))}
      data-testid={TEST_IDS.formElements.fieldCheckboxListContainer}
    >
      <div style={{ width: element.width ? theme.spacing(element.width) : 'auto' }} className={styles.checkboxRow}>
        {element.options.map((option) => (
          <Checkbox
            className={styles.checkbox}
            key={option.id}
            value={element.value.some((val) => val === option.value)}
            label={option.label}
            onChange={(event) => {
              onChange<typeof element>({
                ...element,
                value: event.currentTarget.checked
                  ? element.value.concat(option.value)
                  : element.value.filter((value) => value !== option.value),
              });
            }}
          />
        ))}
      </div>
    </InlineField>
  );
};
