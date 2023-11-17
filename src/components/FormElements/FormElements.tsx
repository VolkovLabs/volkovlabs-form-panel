import { css } from '@emotion/css';
import { InterpolateFunction, PanelData } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import React, { useCallback, useMemo } from 'react';

import { InitialHighlightColorDefault, TestIds } from '../../constants';
import { LayoutSection, LocalFormElement, PanelOptions } from '../../types';
import { GetLayoutUniqueId } from '../../utils';
import { FormElement } from '../FormElement';

/**
 * Properties
 */
interface Props {
  /**
   * Options
   *
   * @type {PanelOptions}
   */
  options: PanelOptions;

  /**
   * Elements
   */
  elements: LocalFormElement[];

  /**
   * On Element Change
   */
  onChangeElement: <T extends LocalFormElement>(element: T) => void;

  /**
   * Initial values
   *
   * @type {[id: string]: any}
   */
  initial: { [id: string]: any };

  /**
   * Section
   */
  section: LayoutSection | null;

  /**
   * Template variables interpolation function
   */
  replaceVariables: InterpolateFunction;

  /**
   * Data
   */
  data: PanelData;
}

/**
 * Form Elements
 */
export const FormElements: React.FC<Props> = ({
  options,
  elements,
  onChangeElement,
  section,
  initial,
  replaceVariables,
  data,
}) => {
  /**
   * Theme and Styles
   */
  const theme = useTheme2();

  /**
   * Highlight Color
   */
  const highlightColor = theme.visualization.getColorByName(
    options.initial.highlightColor || InitialHighlightColorDefault
  );

  /**
   * Highlight CSS
   */
  const highlightClass = useCallback(
    (element: LocalFormElement) => {
      return options.initial.highlight && Object.keys(initial).length && initial[element.id] !== element.value
        ? css`
            -webkit-text-fill-color: ${highlightColor};
          `
        : css`
            -webkit-text-fill-color: ${theme.colors.text.primary};
          `;
    },
    [highlightColor, initial, options.initial.highlight, theme.colors.text.primary]
  );

  /**
   * Visible Elements
   */
  const visibleElements = useMemo(() => {
    return elements.filter((element) => {
      return element.helpers.showIf({ elements, replaceVariables });
    });
  }, [elements, replaceVariables]);

  return (
    <div data-testid={TestIds.formElements.root}>
      {visibleElements.map((element, index) => {
        /**
         * Skip Hidden Elements
         */
        if (section && element.section !== GetLayoutUniqueId(section)) {
          return;
        }

        /**
         * Return
         */
        return (
          <FormElement
            key={index}
            element={element}
            onChange={onChangeElement}
            highlightClass={highlightClass}
            data={data}
          />
        );
      })}
    </div>
  );
};
