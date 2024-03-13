import { DataSourceApi, StandardEditorProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { DataQuery } from '@grafana/schema';
import { Alert, LoadingPlaceholder } from '@grafana/ui';
import { get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { TEST_IDS } from '../../constants';
import { useAutoSave } from '../../hooks';
import { PanelOptions } from '../../types';

/**
 * Properties
 */
type Props = StandardEditorProps<unknown, { datasourceKey: string }, PanelOptions>;

/**
 * Payload Editor
 */
export const DatasourcePayloadEditor: React.FC<Props> = ({ context, value, onChange, item }) => {
  /**
   * Data Source Service
   */
  const dataSourceService = getDataSourceSrv();

  /**
   * Data Source
   */
  const [datasource, setDatasource] = useState<DataSourceApi>();
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Query Auto Save
   */
  const { startTimer, removeTimer } = useAutoSave();
  const [query, setQuery] = useState(value);
  const [isChanged, setIsChanged] = useState(false);

  /**
   * On Change Query
   */
  const onChangeQuery = useCallback((query: unknown) => {
    setQuery(query);
    setIsChanged(true);
  }, []);

  /**
   * On Run query
   */
  const onRunQuery = useCallback(() => null, []);

  /**
   * Save Updates
   */
  const onSaveUpdates = useCallback(() => {
    onChange(query);
    setIsChanged(false);
  }, [onChange, query]);

  /**
   * Load Query Editor
   */
  useEffect(() => {
    const datasourceName = get(context.options, item.settings?.datasourceKey || '');

    const getDataSource = async () => {
      setIsLoading(true);

      const ds = await dataSourceService.get(datasourceName);

      setDatasource(ds);
      setIsLoading(false);
    };

    /**
     * Reset query if new datasource
     */
    if (datasource && datasource.name !== datasourceName) {
      onChangeQuery({});
    }

    /**
     * Load data source
     */
    if (datasourceName && (!datasource || datasource.name !== datasourceName)) {
      getDataSource();
    }
  }, [context.options, dataSourceService, datasource, item.settings?.datasourceKey, onChangeQuery]);

  /**
   * Auto Save Timer
   */
  useEffect(() => {
    if (isChanged) {
      startTimer(onSaveUpdates);
    } else {
      removeTimer();
    }

    return () => {
      removeTimer();
    };
  }, [startTimer, isChanged, onSaveUpdates, removeTimer]);

  if (isLoading) {
    return (
      <Alert severity="info" title="Please Wait" data-testid={TEST_IDS.payloadEditor.loadingMessage}>
        <LoadingPlaceholder text="Loading..." />
      </Alert>
    );
  }

  /**
   * No editor or data source
   */
  if (!datasource || !datasource.components?.QueryEditor) {
    return <Alert title="No Query Editor" severity="error" data-testid={TEST_IDS.payloadEditor.errorMessage} />;
  }

  /**
   * Query Editor
   */
  const Editor = datasource.components.QueryEditor;

  return <Editor datasource={datasource} query={query as DataQuery} onChange={onChangeQuery} onRunQuery={onRunQuery} />;
};
