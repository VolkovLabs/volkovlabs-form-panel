import { EventBusSrv, SelectableValue } from '@grafana/data';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FormElement, LocalFormElement } from '../types';
import {
  isElementConflict,
  isElementOptionConflict,
  normalizeElementsForDashboard,
  normalizeElementsForLocalState,
  ValueChangedEvent,
} from '../utils';
import { useAutoSave } from './useAutoSave';
import { useMutableState } from './useMutableState';

/**
 * Form Elements
 * @param onChange
 * @param value
 * @param isAutoSave
 * @param onItemChange
 */
export const useFormElements = ({
  onChange,
  value,
  isAutoSave = true,
}: {
  onChange: (elements: FormElement[]) => void;
  value?: FormElement[];
  isAutoSave?: boolean;
}) => {
  const eventBus = useRef(new EventBusSrv());

  /**
   * States
   */
  const [elements, setElements, elementsRef] = useMutableState<LocalFormElement[]>(
    normalizeElementsForLocalState(value)
  );

  /**
   * Expand/Collapse State for Sections
   */
  const [expandSectionsState, setExpandSectionsState] = useState<Record<string, boolean>>({});

  const [isChanged, setIsChanged] = useState(false);
  const { startTimer, removeTimer } = useAutoSave();

  /**
   * Save Updates
   */
  const onSaveUpdates = useCallback(() => {
    onChange(normalizeElementsForDashboard(elements));
    setIsChanged(false);
  }, [elements, onChange]);

  /**
   * Change Elements
   */
  const onChangeElements = useCallback(
    (newElements: LocalFormElement[]) => {
      setElements(newElements);
      setIsChanged(true);
    },
    [setElements]
  );

  /**
   * Change Element
   */
  const onChangeElement = useCallback(
    (updatedElement: LocalFormElement, checkConflict = false) => {
      const elements = elementsRef.current;
      if (checkConflict && isElementConflict(elements, updatedElement)) {
        alert('Element with the same id and type exists.');
        return;
      }

      let isValueChanged = false;

      const updatedElements = elements.map((element) => {
        if (element.uid === updatedElement.uid) {
          isValueChanged = updatedElement.value !== element.value;
          return updatedElement;
        }
        return element;
      });

      onChangeElements(updatedElements);

      if (isValueChanged) {
        eventBus.current.publish(
          new ValueChangedEvent({
            elements: updatedElements,
            element: updatedElement,
          })
        );
      }
    },
    [elementsRef, onChangeElements]
  );

  /**
   * Change Element Option
   */
  const onChangeElementOption = useCallback(
    (
      element: LocalFormElement,
      updatedOption: SelectableValue,
      { value = updatedOption.value }: SelectableValue = {},
      checkConflict = false
    ): boolean => {
      if ('options' in element && element.options) {
        if (checkConflict && isElementOptionConflict(element.options, updatedOption)) {
          alert('Option with the same value exists');
          return false;
        }

        onChangeElement({
          ...element,
          options: element.options?.map((item) => (item.value === value ? updatedOption : item)),
        });

        return true;
      }

      return false;
    },

    [onChangeElement]
  );

  /**
   * Remove Element
   */
  const onElementRemove = useCallback(
    (uid: string) => {
      const elements = elementsRef.current;
      const updated = elements.filter((e) => e.uid !== uid);

      /**
       * Update Elements
       */
      onChangeElements(updated);
    },
    [elementsRef, onChangeElements]
  );

  /**
   * Toggle collapse state for sections
   */
  const onToggleSection = useCallback((id: string) => {
    setExpandSectionsState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  /**
   * Collapse Section
   */
  const collapseSection = useCallback((id: string) => {
    setExpandSectionsState((prev) => ({
      ...prev,
      [id]: false,
    }));
  }, []);

  /**
   * Expand Section
   */
  const expandSection = useCallback((id: string) => {
    setExpandSectionsState((prev) => ({
      ...prev,
      [id]: true,
    }));
  }, []);

  /**
   * Update local elements
   */
  useEffect(() => {
    setElements(normalizeElementsForLocalState(value));
    setIsChanged(false);
  }, [setElements, value]);

  /**
   * Auto Save Timer
   */
  useEffect(() => {
    if (isAutoSave && isChanged) {
      startTimer(onSaveUpdates);
    } else {
      removeTimer();
    }

    return () => {
      removeTimer();
    };
  }, [startTimer, isChanged, onSaveUpdates, removeTimer, isAutoSave]);

  /**
   * Return
   */
  return {
    elements,
    isChanged,
    onSaveUpdates,
    onChangeElements,
    onChangeElement,
    onChangeElementOption,
    onElementRemove,
    eventBus: eventBus.current,
    elementsRef,
    expandSectionsState,
    onToggleSection,
    collapseSection,
    expandSection,
  };
};
