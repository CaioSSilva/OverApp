import { Animated, Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, useColorScheme, View, ViewStyle } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { COLORS, getThemedStyles } from '../styles/theme';
import Button from '../components/Button';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../contexts/AppContext';
import { dataService } from '../hooks/data';
import Toast from 'react-native-toast-message'

export default function Welcome() {
    const isDarkMode = useColorScheme() === 'dark';
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(0)).current;
    const { checkUserExists } = dataService();
    const [input, setInput] = useState('')
    const [titleText, setTitleText] = useState('');
    const { t } = useTranslation();

    const { setUser } = useContext(AppContext)

    const originalTitle = 'OverApp';
    const chars = '!?#@%*<>$&';

    const animationTimerRef = useRef<any>(null);

    const styles = getThemedStyles(isDarkMode);
    const splashStyle: ViewStyle = {
        justifyContent: 'center',
        alignItems: 'center',
    };

    const loginSheet = useRef<ActionSheetRef>(null);

    const revealLetter = (letterIndex: number) => {
        const targetWord = originalTitle;

        if (letterIndex >= targetWord.length) {
            animationTimerRef.current = setTimeout(startFullAnimationCycle, 3000);
            return;
        }

        let scrambleIterations = 0;
        const maxScrambles = 10;
        const scrambleSpeed = 50;

        animationTimerRef.current = setInterval(() => {
            if (scrambleIterations >= maxScrambles) {
                clearInterval(animationTimerRef.current);

                setTitleText(prevText => {
                    const textChars = prevText.split('');
                    textChars[letterIndex] = targetWord[letterIndex];
                    return textChars.join('');
                });

                revealLetter(letterIndex + 1);

            } else {
                setTitleText(prevText => {
                    const textChars = prevText.split('');
                    textChars[letterIndex] = chars[Math.floor(Math.random() * chars.length)];
                    return textChars.join('');
                });
                scrambleIterations++;
            }
        }, scrambleSpeed);
    };

    const startFullAnimationCycle = () => {
        let initialScramble = '';
        for (let i = 0; i < originalTitle.length; i++) {
            initialScramble += chars[Math.floor(Math.random() * chars.length)];
        }
        setTitleText(initialScramble);

        animationTimerRef.current = setTimeout(() => {
            revealLetter(0);
        }, 100);
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        Animated.timing(imageAnim, {
            toValue: -Dimensions.get('screen').height * 0.1,
            duration: 2000,
            useNativeDriver: true
        }).start()

        Animated.timing(titleAnim, {
            toValue: -Dimensions.get('screen').height * 0.05,
            duration: 2000,
            useNativeDriver: true
        }).start(() => {
            animationTimerRef.current = setTimeout(startFullAnimationCycle, 1000);
        })

        return () => {
            if (animationTimerRef.current) {
                clearInterval(animationTimerRef.current);
                clearTimeout(animationTimerRef.current);
            }
        };

    }, []);

    const [requirements, setRequirements] = useState<{ text: string, meet: boolean }[]>([
        {
            text: t('requirements.length'),
            meet: false
        },
        {
            text: t('requirements.separator'),
            meet: false
        },
        {
            text: t('requirements.id'),
            meet: false
        }
    ])

    const handleLoginInput = (text: string) => {
        setInput(text)
        const lengthReq = /^.{3,30}$/.test(text);
        const separatorReq = /-/.test(text);
        const idReq = /-\d+$/.test(text);

        setRequirements([
            {
                text: t('requirements.length'),
                meet: lengthReq
            },
            {
                text: t('requirements.separator'),
                meet: separatorReq
            },
            {
                text: t('requirements.id'),
                meet: idReq
            }
        ])
    }

    const resetForm = () => {
        setInput('');
        setRequirements([
            {
                text: t('requirements.length'),
                meet: false
            },
            {
                text: t('requirements.separator'),
                meet: false
            },
            {
                text: t('requirements.id'),
                meet: false
            }
        ]);
    };

    const handleLogin = async () => {
        const profile = await checkUserExists(input);

        if (profile) {
            const userObj = { name: input };
            await AsyncStorage.setItem('user', JSON.stringify(userObj));
            loginSheet.current?.hide();
            setUser(userObj);
        } else {
            Toast.show({
                type: 'error',
                text1: t('errors.unexpectedError'),
                text2: t('errors.userNotFound'),
                position: 'top',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 50,
            });
        }
    };

    const onEnterPress = () => {
        if (loginSheet.current) {
            loginSheet.current.show();
            resetForm();
        }
    }

    return (
        <Animated.View
            style={[styles.container, { opacity: fadeAnim }, splashStyle]}
        >
            <Animated.View style={[{
                transform: [
                    {
                        translateY: imageAnim
                    }
                ]
            }]}>
                <ImageBackground
                    style={welcomeStyles(isDarkMode).imageBackground}
                    source={require('../assets/logo.png')}
                />
            </Animated.View>

            <Animated.View style={[{
                transform: [
                    {
                        translateY: titleAnim
                    }
                ]
            }]}>
                <Text style={welcomeStyles(isDarkMode).title}>{titleText}</Text>
            </Animated.View>

            {animationTimerRef.current && <Button title='Entrar' scale={1.3} onPress={() => onEnterPress()} />}

            <ActionSheet
                gestureEnabled={false}
                defaultOverlayOpacity={0}
                headerAlwaysVisible ref={loginSheet} containerStyle={[welcomeStyles(isDarkMode).actionSheetContainer, { borderWidth: 1, borderColor: isDarkMode ? COLORS.DARK.BORDER : COLORS.LIGHT.BORDER }]}>
                <Text
                    style={[
                        getThemedStyles(isDarkMode).text,
                        getThemedStyles(isDarkMode).title,
                    ]}
                >
                    {t('common.enter')}
                </Text>

                <TextInput onChangeText={handleLoginInput} cursorColor={COLORS.PRIMARY} selectionHandleColor={COLORS.PRIMARY} selectionColor={COLORS.PRIMARY} placeholderTextColor={COLORS.PRIMARY} placeholder='Place your BattleNet - ID' style={welcomeStyles(isDarkMode).input} />
                <View style={welcomeStyles(isDarkMode).reqContainer}>
                    {
                        requirements.map((req, index) => (
                            <Text key={index} style={{ color: !req.meet ? COLORS.ERROR : COLORS.SUCCESS }}>
                                {req.text}
                            </Text>
                        ))
                    }
                </View>

                <Button customStyles={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    margin: 10,
                    backgroundColor: '#009AE4'
                }} width={'90%'} title={t('common.loginBN')} onPress={() => { }} />
                <Button customStyles={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    margin: 10
                }} disabled={!requirements.every(r => r.meet)} width={'90%'} title={t('common.enter')} onPress={() => handleLogin()} />
            </ActionSheet>
        </Animated.View>

    )
}
const welcomeStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
        imageBackground: {
            width: 200,
            height: 200,
        },
        title: {
            color: isDarkMode ? COLORS.WHITE : COLORS.PRIMARY,
            fontWeight: '700',
            fontSize: 32,
        },
        actionSheetContainer: {
            height: 340,
            display: 'flex',
            backgroundColor: isDarkMode ? '#2d2d2d' : '#e2e2e2',
        },
        input: {
            width: '90%',
            padding: 10,
            margin: 10,
            backgroundColor: COLORS.WHITE,
            alignSelf: 'center',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: COLORS.DARK.BACKGROUND
        },
        reqContainer: {
            paddingLeft: 25
        }
    });