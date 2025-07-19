import React from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

type Props = {
    title: string;
    onLeftPress: () => void;
    leftIconName: string;
    onRightPressTwitter: () => void;
    onRightPressDiscord: () => void;
};

const CustomHeader = ({
                          title,
                          onLeftPress,
                          leftIconName,
                          onRightPressTwitter,
                          onRightPressDiscord,
                      }: Props) => {
    return (
        <>
            {/* Gérer StatusBar ici pour éviter chevauchement */}
            <StatusBar barStyle="light-content" backgroundColor="#19171C" />
            <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={{
                    height: 50 + StatusBar.currentHeight!,
                    paddingTop: StatusBar.currentHeight,
                    backgroundColor: '#19171C',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                }}
            >
                <TouchableOpacity onPress={onLeftPress}>
                    <Ionicons name={leftIconName} size={32} color="#FFF" />
                </TouchableOpacity>

                <Text
                    style={{
                        color: '#FFF',
                        fontSize: RFValue(18, 580),
                        fontWeight: 'bold',
                    }}
                >
                    {title}
                </Text>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={onRightPressTwitter} style={{ marginRight: 15 }}>
                        <Ionicons name="logo-twitter" size={32} color="#00acee" />
                    </TouchableOpacity>
                    {(Platform.OS === 'ios' || Platform.OS === 'android') && (
                        <TouchableOpacity onPress={onRightPressDiscord}>
                            <Ionicons name="logo-discord" size={32} color="#7289da" />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </>
    );
};

export default CustomHeader;
