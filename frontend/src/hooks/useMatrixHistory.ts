import { useCallback, useEffect, useRef, useState } from 'react';
import type { Matrix } from '../types';

const HISTORY_LIMIT = 50;
const COALESCE_MS = 600;

export type MatrixHistory = {
  value: Matrix;
  set: (next: Matrix) => void;
  commit: (next: Matrix) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export function useMatrixHistory(
  initial: Matrix | (() => Matrix),
): MatrixHistory {
  const [value, setValue] = useState<Matrix>(initial);

  const pastRef = useRef<Matrix[]>([]);
  const futureRef = useRef<Matrix[]>([]);
  const pendingRef = useRef<{ snapshot: Matrix } | null>(null);
  const timerRef = useRef<number | null>(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncFlags = useCallback(() => {
    setCanUndo(pastRef.current.length > 0 || pendingRef.current !== null);
    setCanRedo(futureRef.current.length > 0);
  }, []);

  const pushPast = useCallback((snapshot: Matrix) => {
    pastRef.current.push(snapshot);
    if (pastRef.current.length > HISTORY_LIMIT) pastRef.current.shift();
    futureRef.current = [];
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const flushPending = useCallback(() => {
    clearTimer();
    const pending = pendingRef.current;
    if (!pending) return;
    pendingRef.current = null;
    pushPast(pending.snapshot);
    syncFlags();
  }, [clearTimer, pushPast, syncFlags]);

  const set = useCallback(
    (next: Matrix) => {
      if (!pendingRef.current) {
        pendingRef.current = { snapshot: value };
      }
      setValue(next);
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        flushPending();
      }, COALESCE_MS);
      syncFlags();
    },
    [value, clearTimer, flushPending, syncFlags],
  );

  const commit = useCallback(
    (next: Matrix) => {
      clearTimer();
      const pending = pendingRef.current;
      pendingRef.current = null;
      const snapshot = pending ? pending.snapshot : value;
      pushPast(snapshot);
      setValue(next);
      syncFlags();
    },
    [value, clearTimer, pushPast, syncFlags],
  );

  const undo = useCallback(() => {
    if (pendingRef.current) {
      const { snapshot } = pendingRef.current;
      pendingRef.current = null;
      clearTimer();
      futureRef.current.push(value);
      setValue(snapshot);
      syncFlags();
      return;
    }
    const prev = pastRef.current.pop();
    if (!prev) return;
    futureRef.current.push(value);
    setValue(prev);
    syncFlags();
  }, [value, clearTimer, syncFlags]);

  const redo = useCallback(() => {
    flushPending();
    const next = futureRef.current.pop();
    if (!next) return;
    pastRef.current.push(value);
    if (pastRef.current.length > HISTORY_LIMIT) pastRef.current.shift();
    setValue(next);
    syncFlags();
  }, [value, flushPending, syncFlags]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return { value, set, commit, undo, redo, canUndo, canRedo };
}