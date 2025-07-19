import React, { useRef, useEffect, useState } from "react";
import {
    Animated,
    PanResponder,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "button_position";
const { width, height } = Dimensions.get("window");
const BUTTON_SIZE = 80;
const SNAP_OFFSET = 20;

const defaultPosition = {
    x: width - BUTTON_SIZE - SNAP_OFFSET,
    y: height - BUTTON_SIZE - SNAP_OFFSET - 100,
};

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export const DraggableWrapper = ({
                                     onPress,
                                     children,
                                 }: {
    onPress?: () => void;
    children: React.ReactNode;
}) => {
    const [loaded, setLoaded] = useState(false);
    const pan = useRef(new Animated.ValueXY(defaultPosition)).current;
    const isDragging = useRef(false);

    useEffect(() => {
        const loadPosition = async () => {
            try {
                const posString = await AsyncStorage.getItem(STORAGE_KEY);
                if (posString) {
                    const { x, y } = JSON.parse(posString);
                    pan.setValue({ x, y });
                }
            } catch (err) {
                console.error("Erreur chargement position:", err);
            } finally {
                setLoaded(true);
            }
        };
        loadPosition();
    }, []);

    const savePosition = async (x: number, y: number) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
        } catch (err) {
            console.error("Erreur sauvegarde position:", err);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) =>
                Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5,
            onPanResponderGrant: () => {
                isDragging.current = true;
                pan.setOffset({ x: pan.x._value, y: pan.y._value });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (_, gestureState) => {
                pan.flattenOffset();

                let newX = clamp(
                    pan.x._value,
                    SNAP_OFFSET,
                    width - BUTTON_SIZE - SNAP_OFFSET
                );
                let newY = clamp(
                    pan.y._value,
                    SNAP_OFFSET,
                    height - BUTTON_SIZE - SNAP_OFFSET
                );

                const velocityThreshold = 0.3;
                let snapX: number;

                if (gestureState.vx > velocityThreshold) {
                    // vitesse rapide vers droite
                    snapX = width - BUTTON_SIZE - SNAP_OFFSET;
                } else if (gestureState.vx < -velocityThreshold) {
                    // vitesse rapide vers gauche
                    snapX = SNAP_OFFSET;
                } else {
                    // sinon selon la position actuelle
                    snapX =
                        newX + pan.x._offset < width / 2
                            ? SNAP_OFFSET
                            : width - BUTTON_SIZE - SNAP_OFFSET;
                }

                Animated.spring(pan, {
                    toValue: { x: snapX, y: newY },
                    useNativeDriver: false,
                    speed: 20,
                    bounciness: 15,
                }).start(() => {
                    savePosition(snapX, newY);
                    pan.setValue({ x: snapX, y: newY });
                });

                setTimeout(() => {
                    isDragging.current = false;
                }, 50);
            },
        })
    ).current;

    if (!loaded) return null;

    return (
        <Animated.View
            style={[styles.draggable, { transform: pan.getTranslateTransform() }]}
            {...panResponder.panHandlers}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.floatingButton}
                onPress={() => {
                    if (!isDragging.current && onPress) onPress();
                }}
            >
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: "rgba(75, 186, 49, 0.9)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    draggable: {
        position: "absolute",
    },
});
