import React from 'react';
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
import { useAudioPlayer } from 'expo-audio';
import { FlatGrid } from 'react-native-super-grid';

import soundLibrary from '../../assets/category/config';
import { StackParams } from '../../App';
import { DownloadButton } from '../components/DownloadButton';
import CustomHeader from '../components/CustomHeader';
import { usePopup } from '../hooks/PopupContext';

type HomeScreenRouteProp = RouteProp<StackParams, 'Home'>;
type HomeScreenNavigationProp = NativeStackNavigationProp<StackParams, 'Home'>;

type Props = {
    route: HomeScreenRouteProp;
    navigation: HomeScreenNavigationProp;
};

export const Home = ({ navigation, route }: Props) => {
    const { openPopup } = usePopup();
    const { category } = route.params ?? {};

    // On récupère la liste des sons à jouer selon catégorie ou tous
    const sounds = category !== undefined
        ? soundLibrary[category]?.sounds ?? []
        : soundLibrary.flatMap(s => s.sounds);

    // Hook expo-audio: on crée un player audio "vide" au départ (sans source)
    // On remplacera la source à chaque lecture
    const player = useAudioPlayer();

    // Fonction pour jouer un son
    const playSound = (audioSource: any) => {
        try {
            // Remplace la source audio (format : require ou { uri: string })
            player.replace(audioSource);

            // Remet la lecture au début
            player.seekTo(0);

            // Lance la lecture
            player.play();
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
        flex: 1,
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
