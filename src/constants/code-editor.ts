import { SelectableValue } from '@grafana/data';
import { CodeEditorSuggestionItem } from '@grafana/ui';

import { CodeEditorType, CodeLanguage } from '../types';
import {
  disableIfCodeParameters,
  elementValueChangedCodeParameters,
  getOptionsCodeParameters,
  getPayloadCodeParameters,
  requestCodeParameters,
  showIfCodeParameters,
} from '../utils/code-parameters';

/**
 * Code Editor Config
 */
export const CODE_EDITOR_CONFIG = {
  height: {
    min: 200,
    max: 1000,
  },
  lineHeight: 18,
};

/**
 * Code Language Options
 */
export const CODE_LANGUAGE_OPTIONS: SelectableValue[] = [
  {
    value: CodeLanguage.C,
    label: 'C',
  },
  {
    value: CodeLanguage.CPP,
    label: 'C++',
  },
  {
    value: CodeLanguage.CSHARP,
    label: 'C#',
  },
  {
    value: CodeLanguage.GO,
    label: 'GO',
  },
  {
    value: CodeLanguage.JAVA,
    label: 'Java',
  },
  {
    value: CodeLanguage.JAVASCRIPT,
    label: 'Javascript',
  },
  {
    value: CodeLanguage.JSON,
    label: 'JSON',
  },
  {
    value: CodeLanguage.MYSQL,
    label: 'MySQL',
  },
  {
    value: CodeLanguage.PHP,
    label: 'PHP',
  },
  {
    value: CodeLanguage.PGSQL,
    label: 'PostgreSQL',
  },
  {
    value: CodeLanguage.PYTHON,
    label: 'Python',
  },
  {
    value: CodeLanguage.RUBY,
    label: 'Ruby',
  },
  {
    value: CodeLanguage.SQL,
    label: 'SQL',
  },
  {
    value: CodeLanguage.TYPESCRIPT,
    label: 'TypeScript',
  },
];

/**
 * Suggestions
 */
export const CODE_EDITOR_SUGGESTIONS: Record<CodeEditorType, CodeEditorSuggestionItem[]> = {
  /**
   * Initial, execute custom code, update or reset request
   */
  [CodeEditorType.REQUEST]: requestCodeParameters.suggestions,

  /**
   * Get data source payload
   */
  [CodeEditorType.GET_PAYLOAD]: getPayloadCodeParameters.suggestions,

  /**
   * Element value changed
   */
  [CodeEditorType.ELEMENT_VALUE_CHANGED]: elementValueChangedCodeParameters.suggestions,

  /**
   * Element disable if
   */
  [CodeEditorType.ELEMENT_DISABLE_IF]: disableIfCodeParameters.suggestions,

  /**
   * Element show if
   */
  [CodeEditorType.ELEMENT_SHOW_IF]: showIfCodeParameters.suggestions,

  /**
   * Element get options
   */
  [CodeEditorType.ELEMENT_GET_OPTIONS]: getOptionsCodeParameters.suggestions,
};
