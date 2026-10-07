import {useChangePasswordMutation} from '@/apis/auth';
import {useState} from 'react';
import {useAppDispatch} from './redux';
import {setToast} from '../component/toast/slice';

export const useChangePassword = () => {
  const dispatch = useAppDispatch();
  const [changePassword, {isLoading}] = useChangePasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [payload, setPayload] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: string, key: string) => {
    setPayload((prev: any) => {
      return {
        ...prev,
        [key]: e,
      };
    });
  };

  const handleSave = async () => {
    const res = await changePassword({...payload}).unwrap();
    if (res.data) {
      dispatch(
        setToast({
          description: res.data,
          type: 'success',
        }),
      );
    }
  };

  const validatePayload = () => {
    return Object.values(payload).every(val => Boolean(val));
  };

  return {
    showPassword,
    showConfirmPassword,
    isLoading,
    payload,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    validatePayload,
    handleSave,
  };
};
