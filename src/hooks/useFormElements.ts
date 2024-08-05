import { EventBusSrv, SelectableValue } from '@grafana/data';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FormElement, LayoutSection, LocalFormElement } from '../types';
import {
  formValueHandler,
  isElementConflict,
  isElementOptionConflict,
  normalizeElementsForDashboard,
  normalizeElementsForLocalState,
  patchFormValueHandler,
  setFormValueHandler,
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
  sections = [],
}: {
  onChange: (elements: FormElement[]) => void;
  value?: FormElement[];
  isAutoSave?: boolean;
  sections?: LayoutSection[];
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
  const [sectionsExpandedState, setSectionsExpandedState] = useState<Record<string, boolean>>(
    sections.reduce(
      (acc, section) => ({
        ...acc,
        [section.id]: section.expanded,
      }),
      {}
    )
  );

  /**
   * On Change Section Expanded State
   */
  const onChangeSectionExpandedState = useCallback((name: string, isExpanded: boolean) => {
    setSectionsExpandedState((prev) => ({
      ...prev,
      [name]: isExpanded,
    }));
  }, []);

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
   * Patch Form Values
   */
  const patchFormValue = useCallback(
    (objectValues: Record<string, unknown>) =>
      onChangeElements(patchFormValueHandler(elementsRef.current, objectValues)),
    [elementsRef, onChangeElements]
  );

  /**
   * Form Values
   */
  const formValue = useCallback(() => {
    return formValueHandler(elementsRef.current);
  }, [elementsRef]);

  /**
   * Patch Form Values
   */
  const setFormValue = useCallback(
    (objectValues: Record<string, unknown>) => {
      onChangeElements(setFormValueHandler(elementsRef.current, normalizeElementsForLocalState(value), objectValues));
    },
    [elementsRef, onChangeElements, value]
  );

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
    sectionsExpandedState,
    onChangeSectionExpandedState,
    patchFormValue,
    setFormValue,
    formValue,
  };
};
