import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from './redux';
import {setToast} from '../component/toast/slice';

type TToast = {
  title: string;
  description: string;
  id: string;
  type: string;
};

function extractErrorDetails(errorData: any) {
  if (typeof errorData === 'string') {
    return {code: null, message: errorData};
  } else if (errorData && errorData.status === 'FETCH_ERROR') {
    return {
      code: null,
      message: 'Check your network connectivity',
    };
  } else if (typeof errorData === 'object' && errorData !== null) {
    const data = errorData.data;
    if (typeof data === 'object' && data !== null) {
      const {code, message, error} = data;
      return {code: code || '', message: message || error || 'Unknown error'};
    } else {
      return {code: null, message: 'Error data is not properly formatted'};
    }
  } else {
    return {code: null, message: 'Invalid error format'};
  }
}

export const useCustomToast = () => {
  const dispatch = useAppDispatch();
  const {description, title, type} = useAppSelector(state => state.toast);
  const [toasts, setToasts] = useState<Array<TToast>>([]);

  useEffect(() => {
    if (description) {
      const {code, message} = extractErrorDetails(description);
      const id = Date.now().toString();
      const newToast = {
        id,
        title: title || code,
        description: message,
        type: type || 'default',
      };

      setToasts(prev => [...prev, newToast]);
    }
  }, [description, title, type, dispatch]);

  useEffect(() => {
    if (toasts.length) {
      const timer = setTimeout(() => {
        setToasts(prev => prev.slice(1));
        if (toasts.length === 1) {
          dispatch(setToast({description: null, type: null}));
        }
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [dispatch, toasts]);

  return {toasts};
};
