import React, { useEffect, useRef } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RFValue } from 'react-native-responsive-fontsize';
import { Audio } from 'expo-av';
import { FlatGrid } from 'react-native-super-grid';

import soundLibrary from '../../assets/category/config';
import { StackParams } from '../../App';
import {DownloadButton} from "../components/DownloadButton";
import CustomHeader from "../components/CustomHeader";
import {usePopup} from "../hooks/PopupContext";

type HomeScreenRouteProp = RouteProp<StackParams, 'Home'>;
type HomeScreenNavigationProp = NativeStackNavigationProp<StackParams, 'Home'>;

type Props = {
    route: HomeScreenRouteProp;
    navigation: HomeScreenNavigationProp;
};

export const Home = ({ navigation, route }: Props) => {
    const { openPopup } = usePopup();
    const { category } = route.params ?? {};
    const soundRef = useRef<Audio.Sound | null>(null);

    // Nettoyage du son à la désactivation du composant
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => {});
            }
        };
    }, []);

    // Récupération des sons selon catégorie ou tous
    const sounds = category !== undefined
        ? soundLibrary[category]?.sounds ?? []
        : soundLibrary.flatMap(s => s.sounds);

    // Fonction pour jouer un son, avec arrêt et nettoyage du son précédent
    const playSound = async (audioSource: any) => {
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }
            const { sound } = await Audio.Sound.createAsync(audioSource);
            soundRef.current = sound;
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#19171C" }}>
            <CustomHeader
                title="RPZ SoundBox"
                leftIconName="apps-outline"
                onLeftPress={() => navigation.replace('Categories')}
                onRightPressTwitter={() =>
                    openPopup({
                        url: 'https://twitter.com/Playa_Dev',
                        title: '🐦 Quitter l’application',
                        description: 'Tu viens nous suivre sur Twitter ?\nPromis, on ne poste pas que des gifs de Bazil !',
                    })
                }
                onRightPressDiscord={() =>
                    openPopup({
                        url: 'https://discord.gg/Ry5qNYJG83',
                        title: "Quitter l’application",
                        description: "Tu vas quitter l’application pour rejoindre notre serveur Discord.\nVeux-tu continuer ?",
                    })
                }
            />
            <View style={styles.container}>
                <Text style={[styles.textCat, { paddingVertical: 10 }]}>
                    {category !== undefined ? soundLibrary[category]?.name : 'Accueil'}
                </Text>
                <View style={{ flex: 1 }}>
                    <FlatGrid
                        data={sounds}
                        keyExtractor={(item, index) => item.name + index}
                        itemDimension={130}
                        spacing={15}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => playSound(item.audio)}
                            >
                                <ImageBackground
                                    style={styles.itemImage}
                                    imageStyle={{ borderRadius: 50 }}
                                    source={item.image}
                                />
                                <Text style={styles.text}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
            <DownloadButton sounds={sounds} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        backgroundColor: '#19171C',
        height: '100%',
        width: '100%',
    },
    text: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    textCat: {
        color: '#FFF',
        fontSize: RFValue(14, 580),
        marginLeft: 15,
    },
    textHeader: {
        fontSize: RFValue(18, 580),
        color: '#FFF',
    },
    item: {
        height: 175,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImage: {
        height: 100,
        width: 100,
        alignSelf: 'center',
        overflow: 'hidden',
    },
});
