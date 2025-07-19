import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import soundLibrary from '../../assets/category/config';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import { FlatGrid } from 'react-native-super-grid';
import { StackParams } from '../../App';
import CustomHeader from "../components/CustomHeader";
import {usePopup} from "../hooks/PopupContext";

type CategoriesScreenRouteProp = RouteProp<StackParams, 'Categories'>;
type CategoriesScreenNavigationProp = NativeStackNavigationProp<StackParams, 'Categories'>;

type Props = {
    route: CategoriesScreenRouteProp;
    navigation: CategoriesScreenNavigationProp;
};

const { height } = Dimensions.get('window');

export const Categories = ({ navigation }: Props) => {
    const { openPopup } = usePopup();
    const [firstLaunch, setFirstLaunch] = useState(false);
    const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);

    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const value = await AsyncStorage.getItem('@alreadyLaunched');
                if (value === null) {
                    await AsyncStorage.setItem('@alreadyLaunched', 'true');
                    setFirstLaunch(true);
                } else {
                    setFirstLaunch(false);
                    setShowWelcomeDialog(false);
                }
            } catch (error) {
                console.error('AsyncStorage error:', error);
            }
        };
        checkFirstLaunch();
    }, []);

    return (
        <View style={styles.container}>
            <CustomHeader
                title="Catégories"
                leftIconName="home-outline"
                onLeftPress={() => navigation.replace('Home')}
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
            {firstLaunch && showWelcomeDialog && (
                <Dialog.Container visible={showWelcomeDialog}>
                    <Dialog.Title>Merci d'avoir téléchargé l'application !</Dialog.Title>
                    <Dialog.Description>
                        <Text>
                            Cette application a été créée avec passion par des fans de GTA RPZ.{"\n\n"}
                            Tu veux ajouter un nouveau son ou participer au développement ? Rejoins-nous vite sur :{"\n"}
                            •{" "}
                            <Text
                                style={styles.link}
                                onPress={() => Linking.openURL('https://github.com/enzosabry/rpzSoundbox')}
                            >
                                Github
                            </Text>
                            {"\n"}
                            •{" "}
                            <Text
                                style={styles.link}
                                onPress={() => Linking.openURL('https://discord.gg/Ry5qNYJG83')}
                            >
                                Discord
                            </Text>
                            {"\n\n"}
                            Bisou.
                        </Text>
                    </Dialog.Description>
                    <Dialog.Button
                        color="#169689"
                        label="Laisse moi m'amuser !"
                        onPress={() => setShowWelcomeDialog(false)}
                    />
                </Dialog.Container>
            )}
            <ScrollView style={{ height: Platform.OS === 'web' ? height : '100%' }}>
                <Text style={[styles.textCat, { marginBottom: 15 }]}>Choisis une catégorie :</Text>
                <FlatGrid
                    data={[undefined, ...soundLibrary.map((s) => ({ name: s.name, image: s.image }))]}
                    keyExtractor={(item, index) => (item?.name ?? 'general') + '-' + index}
                    itemDimension={130}
                    spacing={15}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={item?.name ?? 'general'}
                            onPress={() => navigation.push('Home', { category: item ? index - 1 : undefined })}
                            style={[styles.item, { height: 175, borderRadius: 50, alignItems: 'center' }]}
                        >
                            <ImageBackground
                                style={styles.itemImage}
                                imageStyle={{ height: 80, resizeMode: 'center' }}
                                source={item?.image ?? require('../../assets/img/logorpz.png')}
                            />
                            <Text style={styles.text}>{item?.name ?? 'Tout'}</Text>
                        </TouchableOpacity>
                    )}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#19171C',
        height: '100%',
        width: '100%',
    },
    text: {
        color: '#fff',
        fontSize: height * 0.024,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    textCat: {
        color: '#FFF',
        fontSize: RFValue(14, 580),
        marginLeft: 15,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImage: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        width: 80,
        borderRadius: 15,
        overflow: 'hidden',
    },
    link: {
        textDecorationLine: 'underline',
        color: 'blue',
    }
});
