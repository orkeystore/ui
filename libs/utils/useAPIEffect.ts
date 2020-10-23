import { useEffect } from 'react';

export const useAsyncEffect = <R, E extends Error>(
  func: () => Promise<R>,
  onSuccess: (result: R) => void,
  onError?: (error: E) => void,
): void => {
  useEffect(() => {
    let isUnmounted = false;

    func().then((result: R) => {
      !isUnmounted && onSuccess(result);
    }).catch((err: E) => {
      if (!isUnmounted && onError) {
        onError(err);
      } else if (!isUnmounted) {
        throw err;
      }
    });

    return () => {
      isUnmounted = true;
    }
  }, [func, onSuccess, onError]);
};
