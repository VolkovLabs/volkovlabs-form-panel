import { DataQueryResponse, InterpolateFunction } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { useCallback } from 'react';
import { lastValueFrom } from 'rxjs';

/**
 * Use Data Source Request
 */
export const useDatasourceRequest = () => {
  return useCallback(
    async ({
      query,
      datasource,
      replaceVariables,
      payload,
    }: {
      query: unknown;
      datasource: string;
      replaceVariables: InterpolateFunction;
      payload: unknown;
    }): Promise<DataQueryResponse> => {
      const ds = await getDataSourceSrv().get(datasource);

      /**
       * Replace Variables
       */
      const target = JSON.parse(
        replaceVariables(JSON.stringify(query), {
          payload: {
            value: payload,
          },
        })
      );

      /**
       * Response
       */
      const response = ds.query({
        targets: [target],
      } as never);

      /**
       * Handle as promise
       */
      if (response instanceof Promise) {
        return await response;
      }

      /**
       * Handle as observable
       */
      return await lastValueFrom(response);
    },
    []
  );
};
