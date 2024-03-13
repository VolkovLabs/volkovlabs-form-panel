import { ContentType, PayloadMode, RequestMethod, ResetActionMode } from '../constants';
import { HeaderParameter } from './header-parameter';

/**
 * Request Options
 */
export interface RequestOptions {
  /**
   * Method
   *
   * @type {RequestMethod}
   */
  method: RequestMethod;

  /**
   * URL
   *
   * @type {string}
   */
  url: string;

  /**
   * Data Source
   *
   * @type {string}
   */
  datasource: string;

  /**
   * Header Parameters
   *
   * @type {HeaderParameter[]}
   */
  header: HeaderParameter[];

  /**
   * Content-Type
   *
   * @type {string}
   */
  contentType: ContentType;

  /**
   * Custom Code
   *
   * @type {string}
   */
  code: string;

  /**
   * Highlight updated values
   *
   * @type {boolean}
   */
  highlight: boolean;

  /**
   * Highlight Color
   *
   * @type {string}
   */
  highlightColor: string;

  /**
   * Ask for confirmation
   *
   * @type {boolean}
   */
  confirm: boolean;

  /**
   * Payload Mode
   *
   * @type {PayloadMode}
   */
  payloadMode: PayloadMode;

  /**
   * Get Payload
   *
   * @type {string}
   */
  getPayload: string;

  /**
   * Payload
   *
   * @type {unknown}
   */
  payload: unknown;
}

/**
 * Reset Action
 */
export interface ResetAction {
  /**
   * Mode
   *
   * @type {ResetActionMode}
   */
  mode: ResetActionMode;

  /**
   * Code
   *
   * @type {string}
   */
  code: string;

  /**
   * Data Source
   *
   * @type {string}
   */
  datasource: string;

  /**
   * Get Payload
   *
   * @type {string}
   */
  getPayload: string;

  /**
   * Payload
   *
   * @type {unknown}
   */
  payload: unknown;

  /**
   * Ask for confirmation
   *
   * @type {boolean}
   */
  confirm: boolean;
}
