import React, { useState } from 'react';
import {
    View,
    Modal,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-asset';
import { DraggableWrapper } from './DraggableWrapper';

type Sound = {
    name: string;
    audio: string | Asset | number; // number pour require()
};

type DownloadButtonProps = {
    sounds: Sound[];
};

const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
        const androidVersion = Platform.Version as number;
        if (androidVersion < 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Permission d'accès au stockage",
                    message: "L'application a besoin de cette permission pour enregistrer les sons.",
                    buttonPositive: "OK",
                    buttonNegative: "Annuler",
                }
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("Permission refusée", "Impossible d'enregistrer les sons sans cette permission.");
                return false;
            }
        }
        const { status } = await MediaLibrary.requestPermissionsAsync();
        return status === 'granted';
    } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        return status === 'granted';
    }
};

export const DownloadButton = ({ sounds }: DownloadButtonProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSounds, setSelectedSounds] = useState<string[]>([]);

    const toggleSelect = (name: string) => {
        setSelectedSounds((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const downloadSelected = async () => {
        if (selectedSounds.length === 0) {
            Alert.alert('Aucun son sélectionné', 'Veuillez sélectionner au moins un son.');
            return;
        }

        const hasPermission = await requestStoragePermission();
        if (!hasPermission) return;

        try {
            for (const name of selectedSounds) {
                const sound = sounds.find((s) => s.name === name);
                if (!sound) continue;

                let audioUri: string;

                if (typeof sound.audio === 'string') {
                    audioUri = sound.audio;
                } else if (sound.audio && typeof sound.audio === 'object' && 'uri' in sound.audio) {
                    audioUri = sound.audio.uri;
                } else {
                    const asset = Asset.fromModule(sound.audio as number);
                    await asset.downloadAsync();
                    audioUri = asset.uri;
                }

                if (!audioUri) {
                    console.warn(`URI manquant pour le son "${name}"`);
                    continue;
                }

                const filename = name.replace(/\s+/g, '_') + '.mp3';
                const fileUri = FileSystem.cacheDirectory + filename;

                if (!audioUri.startsWith('file://')) {
                    await FileSystem.downloadAsync(audioUri, fileUri);
                }

                const asset = await MediaLibrary.createAssetAsync(fileUri);
                console.log('Asset créé:', asset);
            }

            Alert.alert('Succès', 'Les sons ont été téléchargés.');
            setModalVisible(false);
            setSelectedSounds([]);
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Le téléchargement a échoué.');
        }
    };

    return (
        <>
            <DraggableWrapper onPress={() => setModalVisible(true)}>
                <FontAwesome5 name="file-download" size={32} color="white" />
            </DraggableWrapper>

            <Modal animationType="slide" transparent visible={modalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Sélectionnez les sons à télécharger</Text>

                        <FlatList
                            data={sounds}
                            keyExtractor={(item, index) => `${item.name}-${index}`}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.soundItem}
                                    onPress={() => toggleSelect(item.name)}
                                >
                                    <Checkbox
                                        value={selectedSounds.includes(item.name)}
                                        onValueChange={() => toggleSelect(item.name)}
                                        color={selectedSounds.includes(item.name) ? '#4BBA31' : undefined}
                                    />
                                    <Text style={styles.soundName}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setSelectedSounds([]);
                                }}
                                style={[styles.modalButton, { backgroundColor: '#FD4D5D' }]}
                            >
                                <Text style={{ color: 'white' }}>Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={downloadSelected}
                                style={[styles.modalButton, { backgroundColor: '#4BBA31' }]}
                            >
                                <Text style={{ color: 'white' }}>Télécharger</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: '#19171C',
        borderRadius: 12,
        maxHeight: '80%',
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        color: '#FFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    soundItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    soundName: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: 'center',
    },
});
