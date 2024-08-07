import { cx } from '@emotion/css';
import { InterpolateFunction, PanelData } from '@grafana/data';
import { FieldSet, useTheme2 } from '@grafana/ui';
import { CollapsableSection } from '@volkovlabs/components';
import React from 'react';

import { LayoutOrientation, SectionVariant, TEST_IDS } from '../../constants';
import { LocalFormElement, PanelOptions } from '../../types';
import { FormElements } from '../FormElements';
import { getStyles } from './ElementSections.styles';

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
   *
   * @type {LocalFormElement[]}
   */
  elements: LocalFormElement[];

  /**
   * On Element Change
   *
   */
  onChangeElement: <T extends LocalFormElement>(element: T) => void;

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
   * Collapse Sections
   */
  sectionsExpandedState: Record<string, boolean>;

  /**
   * On Change Section Expanded State
   */
  onChangeSectionExpandedState: (id: string, isExpanded: boolean) => void;

  /**
   * Time Zone
   *
   * @type {string}
   */
  timeZone: string;
}

/**
 * Panel
 */
export const ElementSections: React.FC<Props> = ({
  options,
  elements,
  onChangeElement,
  initial,
  replaceVariables,
  data,
  sectionsExpandedState,
  onChangeSectionExpandedState,
  timeZone,
}) => {
  /**
   * Theme and Styles
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

  return (
    <div
      className={cx(styles.root, {
        vertical: options.layout.orientation === LayoutOrientation.VERTICAL,
      })}
    >
      {options.layout?.sections?.map((section, id) => {
        const isOpen = sectionsExpandedState[section.id];

        const renderContainer = (children: React.ReactNode) => {
          if (options.layout.sectionVariant === SectionVariant.COLLAPSABLE) {
            return (
              <CollapsableSection
                headerDataTestId={TEST_IDS.formElementsSection.sectionHeader(section.id, section.name)}
                contentDataTestId={TEST_IDS.formElementsSection.sectionContent(section.id, section.name)}
                isOpen={isOpen}
                onToggle={() => onChangeSectionExpandedState(section.id, !isOpen)}
                label={
                  <>
                    {section.name} [{section.id}]
                  </>
                }
              >
                {children}
              </CollapsableSection>
            );
          }

          return <FieldSet label={section.name}>{children}</FieldSet>;
        };

        return (
          <div
            key={id}
            className={cx(styles.section, {
              collapsable: options.layout.sectionVariant === SectionVariant.COLLAPSABLE,
            })}
            data-testid={TEST_IDS.panel.splitLayoutContent(section.name)}
          >
            {renderContainer(
              <FormElements
                options={options}
                elements={elements}
                onChangeElement={onChangeElement}
                initial={initial}
                section={section}
                replaceVariables={replaceVariables}
                data={data}
                timeZone={timeZone}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
