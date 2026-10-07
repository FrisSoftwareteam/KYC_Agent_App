import {AppDispatch, RootState} from '@/lib/redux/Store';
import {useDispatch, TypedUseSelectorHook, useSelector} from 'react-redux';

export const useAppDispatch: () => AppDispatch =
  useDispatch as () => AppDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
