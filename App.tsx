import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ScreenOrientation from "expo-screen-orientation";
import { View, Platform } from "react-native";

import { Home } from "./src/screens/Home";
import { Categories } from "./src/screens/Categories";
import CustomHeader from "./src/components/CustomHeader";

import { PopupProvider, usePopup } from "./src/hooks/PopupContext";

export enum ROUTES {
    Home = "Home",
    Categories = "Categories",
}

export type StackParams = {
    Home: { category?: number };
    Categories: { group: number; setCategory?: (category: number) => void };
};

const Stack = createNativeStackNavigator<StackParams>();

// Wrapper component pour injecter openPopup dans le header via usePopup
const HeaderWrapper = ({
                           title,
                           leftIconName,
                           navigation,
                           leftRoute,
                       }: {
    title: string;
    leftIconName: string;
    navigation: any;
    leftRoute: ROUTES;
}) => {
    const { openPopup } = usePopup();

    return (
        <CustomHeader
            title={title}
            leftIconName={leftIconName}
            onLeftPress={() => navigation.navigate(leftRoute)}
            onRightPressTwitter={() =>
                openPopup({
                    url: "https://twitter.com/Playa_Dev",
                    title: "🐦 Quitter l’application",
                    description:
                        "Tu viens nous suivre sur Twitter ?\nPromis, on ne poste pas que des gifs de Bazil !",
                })
            }
            onRightPressDiscord={() => {
                if (Platform.OS === "android" || Platform.OS === "ios") {
                    openPopup({
                        url: "https://discord.gg/Ry5qNYJG83",
                        title: "Quitter l'application",
                        description:
                            "Tu vas quitter l’application pour rejoindre notre serveur Discord.\nViens nous proposer tes répliques, idées et participe à l’amélioration de RPZ SoundBox !\n\nVeux-tu continuer ?",
                    });
                }
            }}
        />
    );
};

export const App = () => {
    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#19171C" }}>
            <PopupProvider>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            contentStyle: { backgroundColor: "#19171C" },
                            headerShown: false,
                            animation: "simple_push",
                        }}
                    >
                        <Stack.Screen
                            name={ROUTES.Categories}
                            component={Categories}
                            initialParams={{ group: 0 }}
                            options={({ navigation }) => ({
                                header: () => (
                                    <HeaderWrapper
                                        title="Catégories"
                                        leftIconName="home-outline"
                                        navigation={navigation}
                                        leftRoute={ROUTES.Home}
                                    />
                                ),
                            })}
                        />
                        <Stack.Screen
                            name={ROUTES.Home}
                            component={Home}
                            initialParams={{ category: undefined }}
                            options={({ navigation }) => ({
                                header: () => (
                                    <HeaderWrapper
                                        title="RPZ SoundBox"
                                        leftIconName="apps-outline"
                                        navigation={navigation}
                                        leftRoute={ROUTES.Categories}
                                    />
                                ),
                            })}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PopupProvider>
        </View>
    );
};
