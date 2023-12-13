import { InterpolateFunction } from '@grafana/data';

import { FormElementType, PayloadMode } from '../constants';
import { LocalFormElement, RequestOptions } from '../types';

/**
 * Get Payload For Request
 */
export const getPayloadForRequest = ({
  request,
  elements,
  initial,
  replaceVariables,
}: {
  request: RequestOptions;
  elements: LocalFormElement[];
  initial: Record<string, unknown>;
  replaceVariables: InterpolateFunction;
}) => {
  if (request.payloadMode === PayloadMode.CUSTOM) {
    /**
     * Get Payload Code Execution
     */
    const getPayloadFn = new Function('elements', 'initial', replaceVariables(request.getPayload));

    return getPayloadFn(elements, initial) as unknown;
  }

  /**
   * Use deprecated property for backward compatibility
   */
  const updatedOnly =
    request.payloadMode === undefined ? request.updatedOnly : request.payloadMode === PayloadMode.UPDATED;

  /**
   * Payload
   */
  const body: Record<string, unknown> = {};

  /**
   * Get payload
   */
  elements.forEach((element) => {
    if (!updatedOnly) {
      body[element.id] = element.value;
      return;
    }

    /**
     * Skip not updated elements
     */
    if (element.value === initial[element.id]) {
      return;
    }

    /**
     * Skip Disabled elements
     */
    if (element.type === FormElementType.DISABLED) {
      return;
    }

    body[element.id] = element.value;
  });

  return body;
};

/**
 * File To Base64
 * @param file
 * @constructor
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
      if (typeof event.target?.result === 'string') {
        resolve(event.target.result);
      }
    });

    // Convert data to base64
    reader.readAsDataURL(file);
  });
};

/**
 * To JSON
 */
export const toJson = async (payload: unknown, replaceVariables: InterpolateFunction): Promise<string> => {
  if (typeof payload !== 'object' || Array.isArray(payload) || payload === null) {
    return replaceVariables(JSON.stringify(payload));
  }

  const result: Record<string, unknown> = {};
  for (const [elementKey, elementValue] of Object.entries(payload)) {
    if (Array.isArray(elementValue) && elementValue[0] instanceof File) {
      /**
       * Read Files
       */
      result[elementKey] = await Promise.all(elementValue.map((file) => fileToBase64(file)));
    } else {
      result[elementKey] = elementValue;
    }
  }

  return replaceVariables(JSON.stringify(result));
};

/**
 * Get Form Data Value
 */
const getFormDataValue = (value: unknown, replaceVariables: InterpolateFunction): string | Blob => {
  if (typeof value === 'string') {
    return replaceVariables(value);
  }

  if (value instanceof File) {
    return value;
  }

  return `${value}`;
};

/**
 * To Form Data
 */
export const toFormData = (payload: object, replaceVariables: InterpolateFunction): FormData => {
  const formData = new FormData();

  Object.entries(payload).forEach(([elementKey, elementValue]) => {
    if (Array.isArray(elementValue)) {
      elementValue.forEach((value, index) => {
        formData.set(`${elementKey}[${index}]`, getFormDataValue(value, replaceVariables));
      });
      return;
    }
    formData.set(elementKey, getFormDataValue(elementValue, replaceVariables));
  });

  return formData;
};
