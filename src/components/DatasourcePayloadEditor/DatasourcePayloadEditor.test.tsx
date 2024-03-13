import { getDataSourceSrv } from '@grafana/runtime';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { DatasourcePayloadEditor } from './DatasourcePayloadEditor';

/**
 * Props
 */
type Props = React.ComponentProps<typeof DatasourcePayloadEditor>;

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getDataSourceSrv: jest.fn(),
}));

/**
 * In Test Ids
 */
const InTestIds = {
  queryEditor: 'data-testid query-editor',
};

describe('DatasourcePayloadEditor', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors({
    ...TEST_IDS.payloadEditor,
    ...InTestIds,
  });
  const selectors = getSelectors(screen);

  /**
   * Get component
   */
  const getComponent = (props: Partial<Props>) => {
    return <DatasourcePayloadEditor context={{ options: {} }} item={{ settings: {} }} {...(props as any)} />;
  };

  beforeEach(() => {
    jest.mocked(getDataSourceSrv).mockReset();
  });

  it('Should show loading message', async () => {
    await act(async () => render(getComponent({})));

    expect(selectors.loadingMessage()).toBeInTheDocument();
  });

  it('Should show error message', async () => {
    const dataSourceSrv = {
      get: jest.fn(() => ({
        name: 'postgres',
        components: {},
      })),
    };
    jest.mocked(getDataSourceSrv).mockReturnValue(dataSourceSrv as any);

    await act(async () =>
      render(
        getComponent({
          context: {
            options: {
              datasource: 'postgres',
            },
          } as any,
          item: {
            settings: {
              datasourceKey: 'datasource',
            },
          } as any,
        })
      )
    );

    expect(selectors.errorMessage()).toBeInTheDocument();
  });

  it('Should show query editor', async () => {
    /**
     * Data Source Mock
     */
    const dataSourceSrv = {
      get: jest.fn(() => ({
        name: 'postgres',
        components: {
          QueryEditor: jest.fn(({ onChange, query }) => (
            <input
              data-testid={InTestIds.queryEditor}
              value={query?.name || ''}
              onChange={(event) =>
                onChange({
                  name: event.target.value,
                })
              }
            />
          )),
        },
      })),
    };
    jest.mocked(getDataSourceSrv).mockReturnValue(dataSourceSrv as any);

    /**
     * On Change
     */
    const onChange = jest.fn();

    await act(async () =>
      render(
        getComponent({
          context: {
            options: {
              datasource: 'postgres',
            },
          } as any,
          item: {
            settings: {
              datasourceKey: 'datasource',
            },
          } as any,
          onChange,
          value: {
            name: 'bye',
          },
        })
      )
    );

    expect(selectors.queryEditor()).toBeInTheDocument();
    expect(selectors.queryEditor()).toHaveValue('bye');

    /**
     * Change query
     */
    fireEvent.change(selectors.queryEditor(), { target: { value: 'hello' } });

    /**
     * Check updated value
     */
    expect(selectors.queryEditor()).toHaveValue('hello');

    /**
     * Run auto save timer
     */
    await act(async () => jest.runOnlyPendingTimersAsync());

    /**
     * Check if saved
     */
    expect(onChange).toHaveBeenCalledWith({
      name: 'hello',
    });
  });

  it('Should clear query if different data source', async () => {
    /**
     * Data Source Mock
     */
    const dataSourceSrv = {
      get: jest.fn(() => ({
        name: 'postgres',
        components: {
          QueryEditor: jest.fn(({ onChange, query }) => (
            <input
              data-testid={InTestIds.queryEditor}
              value={query?.name || ''}
              onChange={(event) =>
                onChange({
                  name: event.target.value,
                })
              }
            />
          )),
        },
      })),
    };
    jest.mocked(getDataSourceSrv).mockReturnValue(dataSourceSrv as any);

    /**
     * On Change
     */
    const onChange = jest.fn();

    const { rerender } = await act(async () =>
      render(
        getComponent({
          context: {
            options: {
              datasource: 'postgres',
            },
          } as any,
          item: {
            settings: {
              datasourceKey: 'datasource',
            },
          } as any,
          onChange,
          value: {
            name: 'hello',
          },
        })
      )
    );

    expect(selectors.queryEditor()).toBeInTheDocument();

    /**
     * Check if value reset
     */
    expect(selectors.queryEditor()).toHaveValue('hello');

    /**
     * Data Source Mock
     */
    jest.mocked(getDataSourceSrv).mockReturnValue({
      get: jest.fn(() => ({
        name: 'postgres1',
        components: {
          QueryEditor: jest.fn(({ onChange, query }) => (
            <input
              data-testid={InTestIds.queryEditor}
              value={query?.name || ''}
              onChange={(event) =>
                onChange({
                  name: event.target.value,
                })
              }
            />
          )),
        },
      })),
    } as any);

    /**
     * Rerender with new datasource
     */
    await act(async () =>
      rerender(
        getComponent({
          context: {
            options: {
              datasource: 'postgres1',
            },
          } as any,
          item: {
            settings: {
              datasourceKey: 'datasource',
            },
          } as any,
          onChange,
          value: {
            name: 'hello',
          },
        })
      )
    );

    /**
     * Check if value reset
     */
    expect(selectors.queryEditor()).toHaveValue('');

    /**
     * Run auto save timer
     */
    await act(async () => jest.runOnlyPendingTimersAsync());

    /**
     * Check if saved
     */
    expect(onChange).toHaveBeenCalledWith({});
  });

  it('Should show error if unable to get datasource', async () => {
    /**
     * Data Source Mock
     */
    const dataSourceSrv = {
      get: jest.fn(() => null),
    };
    jest.mocked(getDataSourceSrv).mockReturnValue(dataSourceSrv as any);

    await act(async () =>
      render(
        getComponent({
          context: {
            options: {
              datasource: 'postgres',
            },
          } as any,
          item: {
            settings: {
              datasourceKey: 'datasource',
            },
          } as any,
        })
      )
    );

    expect(selectors.errorMessage()).toBeInTheDocument();
  });
});
