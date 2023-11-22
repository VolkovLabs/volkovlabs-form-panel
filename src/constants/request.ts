import { SelectableValue } from '@grafana/data';

import { CapitalizeFirstLetter } from './button';

/**
 * Request Methods
 */
export const enum RequestMethod {
  DATASOURCE = 'datasource',
  DELETE = 'DELETE',
  GET = 'GET',
  NONE = '-',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  QUERY = 'query',
}

/**
 * Initial Request Method
 */
export const RequestMethodInitialOptions: SelectableValue[] = [
  {
    value: RequestMethod.NONE,
    label: 'Custom Code',
  },
  {
    value: RequestMethod.DATASOURCE,
    label: 'Data Source',
    icon: 'database',
  },
  {
    value: RequestMethod.QUERY,
    label: 'Query',
  },
  {
    value: RequestMethod.GET,
    label: RequestMethod.GET,
  },
];

/**
 * Update Request Method
 */
export const RequestMethodUpdateOptions: SelectableValue[] = [
  {
    value: RequestMethod.NONE,
    label: 'Custom Code',
  },
  {
    value: RequestMethod.DATASOURCE,
    label: 'Data Source',
    icon: 'database',
  },
  {
    value: RequestMethod.DELETE,
    label: RequestMethod.DELETE,
  },
  {
    value: RequestMethod.PATCH,
    label: RequestMethod.PATCH,
  },
  {
    value: RequestMethod.POST,
    label: RequestMethod.POST,
  },
  {
    value: RequestMethod.PUT,
    label: RequestMethod.PUT,
  },
];

/**
 * Content Types
 */
export const enum ContentType {
  FORMDATA = 'multipart/form-data',
  JSON = 'application/json',
  PLAIN = 'text/plain',
}

/**
 * Content Type Options
 */
export const ContentTypeOptions: SelectableValue[] = [
  { label: CapitalizeFirstLetter(ContentType.JSON), value: ContentType.JSON },
  { label: CapitalizeFirstLetter(ContentType.PLAIN), value: ContentType.PLAIN },
  { label: CapitalizeFirstLetter(ContentType.FORMDATA), value: ContentType.FORMDATA },
];

/**
 * Payload Mode
 */
export const enum PayloadMode {
  ALL = 'all',
  UPDATED = 'updated',
  CUSTOM = 'custom',
}

/**
 * Payload Mode Options
 */
export const PayloadModeOptions = [
  { label: 'All Elements', value: PayloadMode.ALL },
  { label: 'Updated Only', value: PayloadMode.UPDATED },
  { label: 'Custom Code', value: PayloadMode.CUSTOM },
];

/**
 * Reset Action Mode
 */
export const enum ResetActionMode {
  INITIAL = 'initial',
  CUSTOM = 'custom',
  DATASOURCE = 'datasource',
}

/**
 * Reset Action Options
 */
export const ResetActionOptions = [
  { label: 'Custom Code', value: ResetActionMode.CUSTOM },
  { label: 'Initial Request', value: ResetActionMode.INITIAL },
  { label: 'Data Source', value: ResetActionMode.DATASOURCE, icon: 'database' },
];
