import { FileDropzone, InlineField } from '@grafana/ui';
import React from 'react';

import { FormElementType, TEST_IDS } from '../../../../constants';
import { FormElementByType, LocalFormElement } from '../../../../types';
import { applyAcceptedFiles, applyLabelStyles, applyWidth } from '../../../../utils';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.FILE>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.FILE>;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;
}

/**
 * File Element
 */
export const FileElement: React.FC<Props> = ({ element, onChange }) => {
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
      <FileDropzone
        options={{
          accept: applyAcceptedFiles(element.accept),
          multiple: element.multiple,
          onDrop: (files: File[]) => {
            onChange<typeof element>({
              ...element,
              value: files,
            });
          },
        }}
        onFileRemove={(removedItem) => {
          onChange<typeof element>({
            ...element,
            value: element.value?.filter((item: File) => item.name !== removedItem.file.name) || [],
          });
        }}
        data-testid={TEST_IDS.formElements.fieldFile}
      />
    </InlineField>
  );
};
