export type Sound = {
    name: string;
    image: any;          // Garde `any` ou précise `ImageSourcePropType` de 'react-native'
    sounds: AudioName[];
}

export type AudioName = {
    name: string;
    audio: any;          // Ici c’est un `require()` direct, donc un type comme ImageSourcePropType marche aussi
    image: any;
}
