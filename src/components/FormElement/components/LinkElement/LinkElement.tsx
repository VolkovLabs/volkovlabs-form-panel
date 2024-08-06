import { InlineField, TextLink, useStyles2, useTheme2 } from '@grafana/ui';
import React from 'react';

import { FormElementType, TEST_IDS } from '../../../../constants';
import { FormElementByType, LinkTarget, LocalFormElement } from '../../../../types';
import { applyLabelStyles, applyWidth } from '../../../../utils';
import { getStyles } from './LinkElement.style';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.LINK>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.LINK>;
}

/**
 * Link Element
 */
export const LinkElement: React.FC<Props> = ({ element }) => {
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
      className={applyLabelStyles(element.labelBackground, element.labelColor)}
    >
      <div className={styles.link} style={{ width: element.width ? theme.spacing(element.width) : 'auto' }}>
        <TextLink
          href={element.value}
          external={element.target === LinkTarget.NEW_TAB}
          data-testid={TEST_IDS.formElements.link}
        >
          {element.linkText || element.value}
        </TextLink>
      </div>
    </InlineField>
  );
};
