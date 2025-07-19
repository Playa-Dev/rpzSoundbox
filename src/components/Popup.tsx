import React from "react";
import Dialog from "react-native-dialog";
import { Linking, Text } from "react-native";

type Props = {
    visible: boolean;
    close: () => void;
    url: string;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
};

const Popup = ({
                   visible,
                   close,
                   url,
                   title,
                   description,
                   confirmLabel = "Continuer",
                   cancelLabel = "Rester ici",
               }: Props) => {
    return (
        <Dialog.Container visible={visible}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>
                <Text>{description}</Text>
            </Dialog.Description>
            <Dialog.Button color="#961689" label={cancelLabel} onPress={close} />
            <Dialog.Button
                color="#169689"
                label={confirmLabel}
                onPress={() => {
                    Linking.openURL(url);
                    close();
                }}
            />
        </Dialog.Container>
    );
};

export default Popup;
