import { getDataSourceSrv } from '@grafana/runtime';
import { renderHook } from '@testing-library/react';
import { Observable } from 'rxjs';

import { useDatasourceRequest } from './useDatasourceRequest';

/**
 * Response
 *
 * @param response
 */
export const getResponse = (response: any) =>
  new Observable((subscriber) => {
    subscriber.next(response);
    subscriber.complete();
  });

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getDataSourceSrv: jest.fn(),
}));

describe('Use Datasource Request', () => {
  it('Should run query', async () => {
    const dataSourceSrv = {
      query: jest.fn(() =>
        getResponse({
          data: {
            message: 'hello',
          },
        })
      ),
    };
    const getDataSourceSrvMock = jest.fn(() => dataSourceSrv);

    jest.mocked(getDataSourceSrv).mockImplementationOnce(
      () =>
        ({
          get: getDataSourceSrvMock,
        }) as any
    );
    const { result } = renderHook(() => useDatasourceRequest());

    const response = await result.current({
      query: {
        key1: 'value1',
        key2: 'value2',
      },
      datasource: 'abc',
      replaceVariables: jest.fn((str) => str),
      payload: {},
    });

    /**
     * Should get datasource
     */
    expect(getDataSourceSrvMock).toHaveBeenCalledWith('abc');

    /**
     * Should pass query
     */
    expect(dataSourceSrv.query).toHaveBeenCalledWith({
      targets: [{ key1: 'value1', key2: 'value2' }],
    });

    /**
     * Should return result
     */
    expect(response).toEqual({
      data: {
        message: 'hello',
      },
    });
  });

  it('Should handle promise result query', async () => {
    const dataSourceSrv = {
      query: jest.fn(() =>
        Promise.resolve({
          data: {
            message: 'hello',
          },
        })
      ),
    };
    const getDataSourceSrvMock = jest.fn(() => dataSourceSrv);

    jest.mocked(getDataSourceSrv).mockImplementationOnce(
      () =>
        ({
          get: getDataSourceSrvMock,
        }) as any
    );
    const { result } = renderHook(() => useDatasourceRequest());

    const response = await result.current({
      query: {
        key1: 'value1',
        key2: 'value2',
      },
      datasource: 'abc',
      replaceVariables: jest.fn((str) => str),
      payload: {},
    });

    /**
     * Should get datasource
     */
    expect(getDataSourceSrvMock).toHaveBeenCalledWith('abc');

    /**
     * Should pass query
     */
    expect(dataSourceSrv.query).toHaveBeenCalledWith({
      targets: [{ key1: 'value1', key2: 'value2' }],
    });

    /**
     * Should return result
     */
    expect(response).toEqual({
      data: {
        message: 'hello',
      },
    });
  });
});
