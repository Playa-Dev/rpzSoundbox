import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import {TouchableOpacity, View, Platform} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Home } from "./src/screens/Home";
import { Categories } from "./src/screens/Categories";
import LogoDiscord from "./src/components/LogoDiscord";
import Popup from "./src/components/Popup";
import { RFValue } from "react-native-responsive-fontsize";

export enum ROUTES {
    Home = "Home",
    Categories = "Categories",
}

export type StackParams = {
    Home: { category?: number };
    Categories: { group: number; setCategory?: (category: number) => void };
};

const Stack = createNativeStackNavigator<StackParams>();

const HeaderLeftHome = ({ navigation }: { navigation: any }) => (
    <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.Categories)}
        style={{ marginLeft: 15 }}
    >
        <Ionicons name="apps-outline" size={32} color="#FFF" />
    </TouchableOpacity>
);

const HeaderLeftCategories = ({ navigation }: { navigation: any }) => (
    <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.Home)}
        style={{
            marginLeft: 15,
            marginTop: 5,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Ionicons name="home-outline" size={32} color="#FFF" />
    </TouchableOpacity>
);

export const App = () => {
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupData, setPopupData] = useState<{
        url: string;
        title: string;
        description: string;
    } | null>(null);

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }, []);

    const openPopup = (url: string, title: string, description: string) => {
        setPopupData({ url, title, description });
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
        setPopupData(null);
    };

    const HeaderRight = () => (
        <View style={{
            flexDirection: "row",
            marginRight: 15,
            width: 80,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <TouchableOpacity
                onPress={() =>
                    openPopup(
                        "https://twitter.com/Playa_Dev",
                        "🐦 Quitter l’application",
                        "Tu viens nous suivre sur Twitter ?\n" +
                        "Promis, on ne poste pas que des gifs de Bazil !"
                    )
                }
                style={{ marginRight: 15 }}
            >
                <Ionicons name="logo-twitter" size={32} color="#00acee" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    if (Platform.OS === "android" || Platform.OS === "ios") {
                        openPopup(
                            "https://discord.gg/Ry5qNYJG83",
                            "Quitter l'application",
                            "Tu vas quitter l’application pour rejoindre notre serveur Discord.\n" +
                            "Viens nous proposer tes répliques, idées et participe à l’amélioration de RPZ SoundBox !\n\n" +
                            "Veux-tu continuer ?"
                        );
                    }
                }}
            >
                <LogoDiscord width={32} height={32} />
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <NavigationContainer>
                <StatusBar style="light" />
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: { backgroundColor: "#19171C" },
                        headerTintColor: "#FFF",
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                            fontSize: RFValue(18, 580),
                            color: "#FFF",
                        },
                    }}
                >
                    <Stack.Screen
                        name={ROUTES.Categories}
                        component={Categories}
                        initialParams={{ group: 0 }}
                        options={({ navigation }) => ({
                            headerTitle: "Catégories",
                            headerLeft: () => <HeaderLeftCategories navigation={navigation} />,
                            headerRight: () => <HeaderRight />,
                        })}
                    />
                    <Stack.Screen
                        name={ROUTES.Home}
                        component={Home}
                        initialParams={{ category: undefined }}
                        options={({ navigation }) => ({
                            headerTitle: "RPZ SoundBox",
                            headerLeft: () => <HeaderLeftHome navigation={navigation} />,
                            headerRight: () => <HeaderRight />,
                        })}
                    />
                </Stack.Navigator>
            </NavigationContainer>

            {popupData && (
                <Popup
                    visible={popupVisible}
                    close={closePopup}
                    url={popupData.url}
                    title={popupData.title}
                    description={popupData.description}
                    confirmLabel="Aller"
                    cancelLabel="Rester ici"
                />
            )}
        </>
    );
};
