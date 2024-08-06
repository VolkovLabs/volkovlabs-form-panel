import { css } from '@emotion/css';
import { InterpolateFunction, PanelData } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import React, { useCallback, useMemo } from 'react';

import { INITIAL_HIGHLIGHT_COLOR_DEFAULT, TEST_IDS } from '../../constants';
import { ExecuteCustomCodeParams, LayoutSection, LocalFormElement, PanelOptions } from '../../types';
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
   * @type {[id: string]: unknown}
   */
  initial: { [id: string]: unknown };

  /**
   * Section
   *
   * @type {LayoutSection | null}
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

  /**
   * Execute Custom Code
   */
  executeCustomCode: (params: ExecuteCustomCodeParams) => Promise<unknown>;
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
  executeCustomCode,
}) => {
  /**
   * Theme and Styles
   */
  const theme = useTheme2();

  /**
   * Highlight Color
   */
  const highlightColor = theme.visualization.getColorByName(
    options.initial.highlightColor || INITIAL_HIGHLIGHT_COLOR_DEFAULT
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
    return elements
      .filter((element) => {
        return element.helpers.showIf({ elements, replaceVariables });
      })
      .map((element) => ({
        ...element,
        disabled: element.helpers.disableIf({ elements, replaceVariables }),
        options: element.helpers.getOptions({ elements, replaceVariables, data }),
      }));
  }, [data, elements, replaceVariables]);

  return (
    <div data-testid={TEST_IDS.formElements.root}>
      {visibleElements.map((element, index) => {
        /**
         * Skip elements from another groups
         */
        if (section && element.section !== section.id) {
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
            replaceVariables={replaceVariables}
            executeCustomCode={executeCustomCode}
            initial={initial}
            elements={elements}
          />
        );
      })}
    </div>
  );
};
