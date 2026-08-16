import { useProgress as useProgressCtx } from '../context/ProgressContext';

export default function useProgress() {
  return useProgressCtx();
}
