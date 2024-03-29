import { StandardEditorProps } from '@grafana/data';
import { Button, InlineField, InlineFieldRow, Input } from '@grafana/ui';
import React, { ChangeEvent } from 'react';

import { TEST_IDS } from '../../constants';
import { HeaderParameter } from '../../types';

/**
 * Properties
 */
type Props = StandardEditorProps<HeaderParameter[]>;

/**
 * Header Parameters Editor
 */
export const HeaderParametersEditor: React.FC<Props> = ({ value: parameters, onChange }) => {
  if (!parameters || !parameters.length) {
    parameters = [];
  }

  /**
   * Return
   */
  return (
    <div data-testid={TEST_IDS.headerParametersEditor.root}>
      {parameters.map((parameter, id) => (
        <InlineFieldRow key={id} data-testid={TEST_IDS.headerParametersEditor.parameter(parameter.name)}>
          <InlineField label="Name" labelWidth={8} invalid={parameter.name === ''}>
            <Input
              placeholder="name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                parameter.name = event.target.value;
                onChange(parameters);
              }}
              value={parameter.name}
              data-testid={TEST_IDS.headerParametersEditor.fieldName}
            />
          </InlineField>
          <InlineField label="Value" labelWidth={8} grow>
            <Input
              placeholder="value"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                parameter.value = event.target.value;
                onChange(parameters);
              }}
              type="password"
              value={parameter.value}
              data-testid={TEST_IDS.headerParametersEditor.fieldValue}
            />
          </InlineField>
          <Button
            variant="secondary"
            onClick={() => {
              parameters = parameters.filter((p) => p.name !== parameter.name);
              onChange(parameters);
            }}
            icon="trash-alt"
            data-testid={TEST_IDS.headerParametersEditor.buttonRemove}
          />
        </InlineFieldRow>
      ))}

      <Button
        variant="secondary"
        onClick={() => {
          parameters.push({ name: '', value: '' });
          onChange(parameters);
        }}
        icon="plus"
        data-testid={TEST_IDS.headerParametersEditor.buttonAdd}
      >
        Add Parameter
      </Button>
    </div>
  );
};
