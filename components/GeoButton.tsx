import { PropsWithChildren } from "react";
import {
    StyleSheet,
    Text,
    TouchableHighlight
} from "react-native";

export function GeoButton({children, name, onPress, style, textStyle, isActive, theme='default'}: PropsWithChildren & {children?: any, name?: string, onPress?: any, style?: any, theme?: string, textStyle?: any, isActive?: boolean}) {
    const getBackgroundStyle = () => {
        if (theme == 'default') {
            return styles.background
        } else if (theme == 'light') {
            return styles.background_light
        } else if (theme == 'plain') {
            return styles.background_plain
        } else if (theme == 'light-bordered') {
            return styles.background_light_bordered
        } else if (theme == 'transparent') {
            return null
        }
    }

    const getTextStyle = () => {
        if (theme == 'default') {
            return [
                textStyle ? textStyle : {},
                styles.text
            ];
        } else if (theme == 'light') {
            return [
                textStyle ? textStyle : {},
                styles.text_light
            ];
        } else if (theme == 'light-bordered') {
            return [
                textStyle ? textStyle : {},
                styles.text_light_bordered
            ];
        }
    }
    
    return (
        <TouchableHighlight
            onPress={onPress}
            style={[
                styles.container,
                getBackgroundStyle(),
                style,
                isActive ? styles.active : {}
            ]}>
            {
                children
                    ? children
                    :
                    <Text style={[
                        styles.font,
                        styles.text,
                        getTextStyle(),
                        isActive ? styles.active_text : {},
                        ]}>
                            {name}
                    </Text>
            }

        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        backgroundColor: '#008000'
    },
    font: {
        fontSize: 15,
        fontFamily: 'Roboto_500Medium'
    },
    active_text: {
        color: '#ffffff'
    },
    text: {
        color: '#9e9e9e'
    },
    text_light: {
        color: '#008000'
    },
    text_light_bordered: {
        color: '#9e9e9e'
    },
    background_light: {
        backgroundColor: '#ffffff'
    },
    background_plain: {
        backgroundColor: '#e0e0e0'
    },
    background_light_bordered: {
        borderColor: '#9e9e9e',
        borderWidth: 2,
        borderStyle: 'solid'
    },
    active: {
        backgroundColor: '#4caf50'
    }
});