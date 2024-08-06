import { cx } from '@emotion/css';
import { InlineField, Input, useStyles2 } from '@grafana/ui';
import Slider from 'rc-slider';
import React from 'react';

import { FormElementType, TEST_IDS } from '../../../../constants';
import { FormElementByType, LocalFormElement } from '../../../../types';
import { applyLabelStyles, applyWidth } from '../../../../utils';
import { getStyles } from './SliderElement.style';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.SLIDER>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.SLIDER>;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;
}

/**
 * Slider Element
 */
export const SliderElement: React.FC<Props> = ({ element, onChange }) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  return (
    <>
      <InlineField
        label={element.title}
        grow={!element.width}
        labelWidth={applyWidth(element.labelWidth)}
        tooltip={element.tooltip}
        transparent={!element.title}
        className={cx(styles.slider, applyLabelStyles(element.labelBackground, element.labelColor))}
        disabled={element.disabled}
      >
        <Slider
          value={element.value || 0}
          onChange={(value) => {
            onChange<typeof element>({
              ...element,
              value: Array.isArray(value) ? value[value.length - 1] : value,
            });
          }}
          min={element.min || 0}
          max={element.max || 0}
          step={element.step || 0}
          ariaLabelForHandle={TEST_IDS.formElements.fieldSlider}
        />
      </InlineField>
      <InlineField className={cx(styles.sliderInput)} disabled={element.disabled}>
        <Input
          type="number"
          width={8}
          min={element.min || 0}
          max={element.max || 0}
          value={element.value || 0}
          onChange={(e) => {
            onChange<typeof element>({
              ...element,
              value: Math.max(element.min || 0, Math.min(element.max || 0, Number(e.currentTarget.value))),
            });
          }}
          data-testid={TEST_IDS.formElements.fieldSliderInput}
        />
      </InlineField>
    </>
  );
};
