import { InterpolateFunction, PanelData } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import React, { useMemo } from 'react';

import { FormElementType, TEST_IDS } from '../../constants';
import { CustomButtonShow, ExecuteCustomCodeParams, LocalFormElement } from '../../types';
import { CustomButtonElement } from '../FormElement/components';
import { getStyles } from './CustomButtonRow.style';
/**
 * Properties
 */
interface Props {
  /**
   * Elements
   */
  elements: LocalFormElement[];

  /**
   * Initial values
   *
   * @type {[id: string]: unknown}
   */
  initial: { [id: string]: unknown };

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
 * CustomButtonsRow
 */
export const CustomButtonsRow: React.FC<Props> = ({ elements, initial, replaceVariables, data, executeCustomCode }) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

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
    <div data-testid={TEST_IDS.formElements.customButtonsRow} className={styles.row}>
      {!!visibleElements.length &&
        visibleElements.map((element) => {
          /**
           * Return
           */
          if (element.type === FormElementType.CUSTOM_BUTTON && element.show === CustomButtonShow.BOTTOM) {
            return (
              <CustomButtonElement
                key={element.id}
                element={element}
                executeCustomCode={executeCustomCode}
                initial={initial}
                elements={elements}
              />
            );
          }

          return null;
        })}
    </div>
  );
};
