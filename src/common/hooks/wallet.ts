import {useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {useProfileQuery} from '@/apis/auth';
import {
  TBank,
  useBanksQuery,
  useResolveAccountMutation,
  useUpsertBankMutation,
  useWalletTransactionsQuery,
  useWithdrawFundMutation,
} from '@/apis/wallet';
import {useAppDispatch} from './redux';
import {setToast} from '../component/toast/slice';

export const formatNaira = (value: number | string | undefined) => {
  const n = Number(value || 0);
  const [whole, dec] = n.toFixed(2).split('.');
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `₦${withCommas}${dec === '00' ? '' : `.${dec}`}`;
};

const hasValue = (v?: string) => Boolean(v && v !== 'N/A');

export const useWallet = () => {
  const dispatch = useAppDispatch();
  const {
    data: profile,
    isFetching: profileLoading,
    refetch,
  } = useProfileQuery('');
  const {
    data: txData,
    isFetching: txLoading,
    refetch: refetchTx,
  } = useWalletTransactionsQuery(1);
  const {data: banksData} = useBanksQuery();
  const [resolveAccount, {isLoading: resolving}] = useResolveAccountMutation();
  const [upsertBank, {isLoading: savingBank}] = useUpsertBankMutation();
  const [withdrawFund, {isLoading: withdrawing}] = useWithdrawFundMutation();

  const wallet = profile?.data?.wallet;
  const bank = profile?.data?.bank;
  const hasBank = hasValue(bank?.accountNumber);
  const withdrawable = Number(wallet?.withdrawable || 0);

  // Bank form
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [selectedBank, setSelectedBank] = useState<TBank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // Withdrawal form
  const [amount, setAmount] = useState('');

  const bankMatches = useMemo(() => {
    const q = bankSearch.trim().toLowerCase();
    if (!q || selectedBank) {
      return [];
    }
    return (banksData?.data || [])
      .filter(b => b.active !== false && b.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [bankSearch, banksData, selectedBank]);

  const chooseBank = (b: TBank) => {
    setSelectedBank(b);
    setBankSearch(b.name);
    setAccountName('');
    if (accountNumber.length === 10) {
      checkAccount(accountNumber, b);
    }
  };

  const changeBankSearch = (text: string) => {
    setBankSearch(text);
    setSelectedBank(null);
    setAccountName('');
  };

  const checkAccount = async (num: string, b: TBank | null = selectedBank) => {
    setAccountName('');
    if (!b || !/^\d{10}$/.test(num)) {
      return;
    }
    try {
      const res = await resolveAccount({
        accountNumber: num,
        bankCode: String(b.code),
      }).unwrap();
      setAccountName(res?.data?.accountName || '');
    } catch {
      // the error toast is shown by the API layer
    }
  };

  const changeAccountNumber = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(digits);
    setAccountName('');
    if (digits.length === 10) {
      checkAccount(digits);
    }
  };

  const resetBankForm = () => {
    setShowBankForm(false);
    setBankSearch('');
    setSelectedBank(null);
    setAccountNumber('');
    setAccountName('');
  };

  const saveBank = async () => {
    if (!selectedBank || !accountName) {
      return;
    }
    try {
      // The server currently expects the bank code as a number.
      await upsertBank({
        accountNumber,
        bankCode: Number(selectedBank.code),
      }).unwrap();
      dispatch(setToast({description: 'Bank account saved', type: 'success'}));
      resetBankForm();
    } catch {
      // the error toast is shown by the API layer
    }
  };

  const amountNumber = Number(amount || 0);
  const amountError =
    amount && amountNumber > withdrawable
      ? 'Amount is more than your available balance'
      : '';
  const canWithdraw =
    hasBank && amountNumber > 0 && amountNumber <= withdrawable && !withdrawing;

  const changeAmount = (text: string) => {
    setAmount(text.replace(/\D/g, '').slice(0, 9));
  };

  const doWithdraw = async () => {
    try {
      const res = await withdrawFund({amount: amountNumber}).unwrap();
      dispatch(
        setToast({
          description:
            res?.data || 'Withdrawal requested. It will be paid to your bank.',
          type: 'success',
        }),
      );
      setAmount('');
    } catch {
      // the error toast is shown by the API layer
    }
  };

  const confirmWithdraw = () => {
    if (!canWithdraw) {
      return;
    }
    Alert.alert(
      'Confirm withdrawal',
      `Send ${formatNaira(amountNumber)} to ${bank?.bankName} ${
        bank?.accountNumber
      } (${bank?.accountName})?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Withdraw', onPress: doWithdraw},
      ],
    );
  };

  const refresh = () => {
    refetch();
    refetchTx();
  };

  return {
    wallet,
    bank,
    hasBank,
    withdrawable,
    transactions: txData?.data?.transactions || [],
    loading: profileLoading || txLoading,
    refresh,
    // bank form
    showBankForm,
    setShowBankForm,
    resetBankForm,
    bankSearch,
    changeBankSearch,
    bankMatches,
    chooseBank,
    selectedBank,
    accountNumber,
    changeAccountNumber,
    accountName,
    resolving,
    saveBank,
    savingBank,
    // withdrawal
    amount,
    changeAmount,
    amountError,
    canWithdraw,
    confirmWithdraw,
    withdrawing,
  };
};
