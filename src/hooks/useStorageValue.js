"use client";

import { useCallback, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const getNullSnapshot = () => null;

function getEventName(storageType, key) {
  return `gbp-storage:${storageType}:${key}`;
}

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
}

export function useStorageValue(storageType, key) {
  const subscribe = useCallback(
    (callback) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const eventName = getEventName(storageType, key);

      const handleStorage = (event) => {
        if (event.key === key && event.storageArea === window[storageType]) {
          callback();
        }
      };

      window.addEventListener("storage", handleStorage);
      window.addEventListener(eventName, callback);

      return () => {
        window.removeEventListener("storage", handleStorage);

        window.removeEventListener(eventName, callback);
      };
    },
    [storageType, key],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return window[storageType].getItem(key);
    } catch {
      return null;
    }
  }, [storageType, key]);

  return useSyncExternalStore(subscribe, getSnapshot, getNullSnapshot);
}

export function setStorageValue(storageType, key, value) {
  if (typeof window === "undefined") return;

  window[storageType].setItem(key, value);

  window.dispatchEvent(new Event(getEventName(storageType, key)));
}

export function removeStorageValue(storageType, key) {
  if (typeof window === "undefined") return;

  window[storageType].removeItem(key);

  window.dispatchEvent(new Event(getEventName(storageType, key)));
}

export function refreshStorageValue(storageType, key) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(getEventName(storageType, key)));
}
