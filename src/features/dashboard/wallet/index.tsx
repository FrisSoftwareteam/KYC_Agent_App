import React from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {
  Button,
  ButtonSpinner,
  ButtonText,
  Center,
  HStack,
  Input,
  InputField,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {MoveLeft} from 'lucide-react-native';
import {theme} from '@/providers/theme-provider';
import {TNavigation} from '@/common/types/navigation';
import {formatNaira, useWallet} from '@/common/hooks/wallet';
import {Status} from '@/common/component/status';

const Label = ({children}: {children: React.ReactNode}) => (
  <Text
    fontSize={'$sm'}
    fontWeight={'$medium'}
    fontFamily={theme.fontFamily.regular}
    color={theme.colors.grey[200]}>
    {children}
  </Text>
);

const SectionTitle = ({children}: {children: React.ReactNode}) => (
  <Text
    fontFamily={theme.fontFamily.medium}
    fontSize={'$sm'}
    color={theme.colors.primary.DEFAULT}>
    {children}
  </Text>
);

function Header() {
  const {goBack} = useNavigation<TNavigation>();
  return (
    <Center
      h={'$12'}
      w={'$full'}
      borderBottomColor={theme.colors.grey[500]}
      borderBottomWidth={'$4'}>
      <HStack w={'85%'} justifyContent={'center'} position={'relative'}>
        <Text
          color={theme.colors.primary.DEFAULT}
          fontFamily={theme.fontFamily.bold}
          fontWeight={'$medium'}
          fontSize={'$md'}>
          Wallet
        </Text>
        <Pressable position={'absolute'} left={0} zIndex={2} onPress={goBack}>
          <MoveLeft width={20} height={20} color={theme.colors.grey.solid} />
        </Pressable>
      </HStack>
    </Center>
  );
}

export function Wallet() {
  const w = useWallet();

  return (
    <View w={'$full'} h={'$full'} bg={theme.colors.primary.white}>
      <StatusBar
        animated={true}
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
      />
      <SafeAreaView flex={1}>
        <Header />
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          refreshControl={
            <RefreshControl refreshing={w.loading} onRefresh={w.refresh} />
          }>
          <Center w={'$full'}>
            <VStack w={'85%'} space={'2xl'} mt={'$5'} pb={'$32'}>
              {/* Balance */}
              <VStack bg={'#F5FFFB'} p={'$4'} space={'xs'}>
                <Label>Available to withdraw</Label>
                <Text
                  fontFamily={theme.fontFamily.bold}
                  fontSize={'$2xl'}
                  color={'#333333'}>
                  {formatNaira(w.wallet?.withdrawable)}
                </Text>
                <HStack justifyContent={'space-between'} mt={'$2'}>
                  <VStack>
                    <Label>Total paid out</Label>
                    <Text color={'#333333'}>
                      {formatNaira(w.wallet?.totalPaidOut)}
                    </Text>
                  </VStack>
                  <VStack alignItems={'flex-end'}>
                    <Label>Not yet paid out</Label>
                    <Text color={'#333333'}>
                      {formatNaira(w.wallet?.outstanding)}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>

              {/* Bank account */}
              <VStack space={'sm'}>
                <SectionTitle>BANK ACCOUNT</SectionTitle>
                {w.hasBank && !w.showBankForm ? (
                  <VStack
                    borderWidth={'$1'}
                    borderColor={theme.colors.grey[500]}
                    p={'$3'}
                    space={'xs'}>
                    <Text color={'#333333'}>{w.bank?.accountName}</Text>
                    <Text color={theme.colors.grey[200]}>
                      {`${w.bank?.bankName} · ${w.bank?.accountNumber}`}
                    </Text>
                    <Pressable onPress={() => w.setShowBankForm(true)}>
                      <Text
                        mt={'$1'}
                        color={theme.colors.primary.DEFAULT}
                        fontFamily={theme.fontFamily.medium}>
                        Change bank account
                      </Text>
                    </Pressable>
                  </VStack>
                ) : null}

                {!w.hasBank && !w.showBankForm ? (
                  <VStack space={'sm'}>
                    <Text color={theme.colors.grey[200]}>
                      Add the bank account your earnings should be paid into.
                    </Text>
                    <Button
                      variant={'outline'}
                      borderColor={theme.colors.primary.DEFAULT}
                      onPress={() => w.setShowBankForm(true)}>
                      <ButtonText color={theme.colors.primary.DEFAULT}>
                        Add bank account
                      </ButtonText>
                    </Button>
                  </VStack>
                ) : null}

                {w.showBankForm ? (
                  <VStack space={'md'}>
                    <VStack space={'xs'}>
                      <Label>Bank</Label>
                      <Input size={'xl'}>
                        <InputField
                          placeholder={'Type your bank name'}
                          placeholderTextColor={theme.colors.grey[300]}
                          value={w.bankSearch}
                          onChangeText={w.changeBankSearch}
                        />
                      </Input>
                      {w.bankMatches.map(b => (
                        <Pressable
                          key={`${b.code}-${b.name}`}
                          onPress={() => w.chooseBank(b)}
                          py={'$2'}
                          px={'$3'}
                          borderBottomWidth={'$1'}
                          borderColor={theme.colors.grey[500]}>
                          <Text color={'#333333'}>{b.name}</Text>
                        </Pressable>
                      ))}
                    </VStack>

                    <VStack space={'xs'}>
                      <Label>Account number</Label>
                      <Input size={'xl'}>
                        <InputField
                          placeholder={'10-digit account number'}
                          placeholderTextColor={theme.colors.grey[300]}
                          keyboardType={'number-pad'}
                          value={w.accountNumber}
                          onChangeText={w.changeAccountNumber}
                        />
                      </Input>
                      {w.resolving ? (
                        <Text color={theme.colors.grey[200]}>
                          Checking account…
                        </Text>
                      ) : null}
                      {w.accountName ? (
                        <Text
                          color={theme.colors.status.success}
                          fontFamily={theme.fontFamily.medium}>
                          {w.accountName}
                        </Text>
                      ) : null}
                    </VStack>

                    <HStack space={'md'}>
                      <Button
                        flex={1}
                        variant={'outline'}
                        borderColor={theme.colors.grey.solid}
                        onPress={w.resetBankForm}>
                        <ButtonText color={theme.colors.grey.solid}>
                          Cancel
                        </ButtonText>
                      </Button>
                      <Button
                        flex={1}
                        bg={theme.colors.primary.DEFAULT}
                        isDisabled={
                          !w.selectedBank || !w.accountName || w.savingBank
                        }
                        onPress={w.saveBank}>
                        <ButtonText>Save</ButtonText>
                        {w.savingBank && <ButtonSpinner ml="$1" />}
                      </Button>
                    </HStack>
                  </VStack>
                ) : null}
              </VStack>

              {/* Withdraw */}
              <VStack space={'sm'}>
                <SectionTitle>WITHDRAW</SectionTitle>
                <Input size={'xl'} isDisabled={!w.hasBank}>
                  <InputField
                    placeholder={
                      w.hasBank ? 'Amount in naira' : 'Add a bank account first'
                    }
                    placeholderTextColor={theme.colors.grey[300]}
                    keyboardType={'number-pad'}
                    value={w.amount}
                    onChangeText={w.changeAmount}
                  />
                </Input>
                {w.amountError ? (
                  <Text color={theme.colors.status.error} fontSize={'$sm'}>
                    {w.amountError}
                  </Text>
                ) : null}
                <Button
                  bg={theme.colors.primary.DEFAULT}
                  size={'lg'}
                  isDisabled={!w.canWithdraw}
                  onPress={w.confirmWithdraw}>
                  <ButtonText>Withdraw</ButtonText>
                  {w.withdrawing && <ButtonSpinner ml="$1" />}
                </Button>
              </VStack>

              {/* History */}
              <VStack space={'sm'}>
                <SectionTitle>HISTORY</SectionTitle>
                {w.transactions.length === 0 ? (
                  <Text color={theme.colors.grey[200]}>
                    Your job payments and withdrawals will show here.
                  </Text>
                ) : (
                  w.transactions.map(t => {
                    const isWithdrawal = t.type === 'withdrawal';
                    return (
                      <HStack
                        key={t._id}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        py={'$3'}
                        borderBottomWidth={'$1'}
                        borderColor={theme.colors.grey[500]}>
                        <VStack>
                          <Text color={'#333333'}>
                            {isWithdrawal ? 'Withdrawal' : 'Job payment'}
                          </Text>
                          <Text fontSize={'$xs'} color={theme.colors.grey[200]}>
                            {new Date(t.createdAt).toDateString()}
                          </Text>
                        </VStack>
                        <VStack alignItems={'flex-end'} space={'xs'}>
                          <Text
                            fontFamily={theme.fontFamily.medium}
                            color={
                              isWithdrawal
                                ? '#333333'
                                : theme.colors.status.success
                            }>
                            {`${isWithdrawal ? '−' : '+'}${formatNaira(
                              t.amount,
                            )}`}
                          </Text>
                          {t.status ? <Status status={t.status} /> : null}
                        </VStack>
                      </HStack>
                    );
                  })
                )}
              </VStack>
            </VStack>
          </Center>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
