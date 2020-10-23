import { useCallback } from 'react';
import { IApiParamsKeysPreview } from 'libs/api/keys/preview';
import { useAppDispatch } from 'src/store';

import { actions as keyPreviewActions } from './reducer';
import { IStoreKeyPreview } from './types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useContainerPreviewKey = () => {
  const dispatch = useAppDispatch();

  const toggleModal = useCallback(
    (isOpen?: boolean) => {
      dispatch(keyPreviewActions.toggleModal({ isOpen }));
    },
    [dispatch],
  );

  const fetchKeyPreview = useCallback(
    (params: IApiParamsKeysPreview) => {
      return dispatch(keyPreviewActions.fetchKeyPreview(params));
    },
    [dispatch],
  );

  const setPreviewParams = useCallback((params: IStoreKeyPreview['params']) => {
    dispatch(keyPreviewActions.setParams(params));
  }, [dispatch])

  const openKeyPreview = useCallback(
    async (apiParams: IApiParamsKeysPreview, previewParams?: IStoreKeyPreview['params']) => {
      toggleModal(true);
      previewParams && setPreviewParams(previewParams);
      await fetchKeyPreview(apiParams);
    },
    [fetchKeyPreview, toggleModal, setPreviewParams],
  );

  return { toggleModal, fetchKeyPreview, openKeyPreview, setPreviewParams };
};
