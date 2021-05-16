import React from 'react';
import {Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import DrawerOpen from "../navigation/DrawerOpen";
import {AudioName} from "../components/Sound";
import soundLibrary from "../../assets/category/config";
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from '@react-navigation/native';
import {DrawerParams} from "../../App";


const {width, height} = Dimensions.get("window");

type HomeScreenRouteProp = RouteProp<DrawerParams, 'Home'>;

type HomeScreenNavigationProp = StackNavigationProp<DrawerParams, 'Home'>;

type Props = {
    route: HomeScreenRouteProp;
    navigation: HomeScreenNavigationProp;
};

export class Home extends React.Component<Props, {}> {
    render() {
        const {category} = this.props.route.params;
        const play = (i: number) => {
            soundLibrary[category]?.sounds[i].audio?.replayAsync().catch(console.error);
        };

        return (
            <View>
                <Text>
                    Home
                </Text>
                <View>
                    {soundLibrary[category]?.sounds.map((s: AudioName, i: number) => {
                        return (
                            <TouchableOpacity style={styles.tile} key={s.name} onPress={() => play(i)}>
                                <ImageBackground source={soundLibrary[category].image}
                                                 style={{width: 100, height: 100, borderRadius: 50}}/>
                                <Text>{s.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tile: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    container: {
        paddingTop: 0,
        backgroundColor: "#19171C",
        height: height,
        width: width,
        color: "#FFF"
    },
    tinyLogo: {
        width: width,
        height: height / 5,
        resizeMode: 'contain',
    },
    containrLogo: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 66,
        height: 58,
    },
    text: {
        color: "#FFF",
        fontSize: 24,
        textAlign: 'center'
    },
    textCat: {
        color: "#FFF",
        fontSize: 24,
        marginLeft: 15
    },
    item: {
        borderRadius: 4,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
});