import {theme} from '@/providers/theme-provider';
import {
  VStack,
  View,
  Text,
  Center,
  Button,
  ButtonGroup,
  ButtonText,
  InputField,
  Input,
} from '@gluestack-ui/themed';
import {Redo, Undo} from 'lucide-react-native';
import React, {Fragment, useState} from 'react';
import SignatureScreen from 'react-native-signature-canvas';

export function StepFour({
  SignatureRef,
  handleSignature,
  handleEnd,
  signature,
  handleRedoSignature,
  handleUndoSignature,
  handleChange,
}: any) {
  const [state, setState] = useState('Draw');
  return (
    <View>
      <Text
        color={theme.colors.primary.DEFAULT}
        fontFamily={theme.fontFamily.medium}
        fontSize={'$lg'}>
        Signatory Information
      </Text>

      <ButtonGroup space={'md'} mt={'$4'}>
        {['Draw', 'Type'].map(item => (
          <Button
            key={item}
            borderRadius={'$full'}
            borderColor={theme.colors.grey.solid}
            borderWidth={'$1'}
            bg={
              state === item
                ? theme.colors.primary.DEFAULT
                : theme.colors.primary.white
            }
            onPress={() => setState(item)}>
            <ButtonText
              fontFamily={theme.fontFamily.regular}
              color={
                state === item
                  ? theme.colors.primary.white
                  : theme.colors.grey.solid
              }>
              {item}
            </ButtonText>
          </Button>
        ))}
      </ButtonGroup>

      <VStack mt={'$6'} space={'md'}>
        {state === 'Draw' ? (
          <Fragment>
            <View w={'$full'} alignItems={'flex-end'}>
              <ButtonGroup space={'lg'} mt={'$4'}>
                <Button
                  h={'$8'}
                  w={'$8'}
                  variant={'outline'}
                  borderColor={'transparent'}
                  borderRadius={'$full'}
                  bg={theme.colors.grey[500]}
                  onPress={handleUndoSignature}>
                  <Undo
                    width={20}
                    height={20}
                    color={theme.colors.grey.solid}
                  />
                </Button>
                <Button
                  h={'$8'}
                  w={'$8'}
                  variant={'outline'}
                  borderRadius={'$full'}
                  borderColor={'transparent'}
                  bg={theme.colors.grey[500]}
                  onPress={handleRedoSignature}>
                  <Redo
                    width={20}
                    height={20}
                    color={theme.colors.grey.solid}
                  />
                </Button>
              </ButtonGroup>
            </View>
            <VStack
              minHeight={'$72'}
              borderStyle={'dashed'}
              borderWidth={'$1'}
              borderRadius={'$md'}
              borderColor={theme.colors.primary.DEFAULT}>
              <SignatureScreen
                ref={SignatureRef}
                onEnd={handleEnd}
                onOK={handleSignature}
                descriptionText=""
                backgroundColor={'#F7F7FF'}
                webStyle={`.m-signature-pad--footer
                .button {
                display: none;
                }
                `}
                autoClear={false}
              />
            </VStack>
          </Fragment>
        ) : (
          <VStack
            h={'$72'}
            borderStyle={'dashed'}
            borderWidth={'$1'}
            borderRadius={'$md'}
            borderColor={theme.colors.primary.DEFAULT}
            bg={'#F7F7FF'}>
            <Center h={'$full'}>
              <Input
                variant="underlined"
                size="xl"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
                width={'90%'}>
                <InputField
                  onChangeText={(e: any) => handleChange(e, 'typed')}
                  value={signature}
                  placeholder="Type your signature here"
                  textAlign={'center'}
                  fontFamily={theme.fontFamily.iBold}
                />
              </Input>
            </Center>
          </VStack>
        )}
      </VStack>
    </View>
  );
}
