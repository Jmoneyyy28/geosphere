import { PropsWithChildren } from "react";
import {
    StyleSheet,
    Text,
    TouchableHighlight
} from "react-native";

export function GeoButton({children, name, onPress, style, textStyle, theme='default'}: PropsWithChildren & {children?: any, name?: string, onPress?: any, style?: any, theme?: string, textStyle?: any}) {
    const getBackgroundStyle = () => {
        if (theme == 'default') {
            return styles.background
        } else if (theme == 'light') {
            return styles.background_light
        } else if (theme == 'plain') {
            return styles.background_plain
        }
    }

    const getTextStyle = () => {
        if (theme == 'default') {
            return [
                textStyle ? textStyle : styles.font,
                styles.text
            ];
        } else if (theme == 'light') {
            return [
                textStyle ? textStyle : styles.font,
                styles.text_light
            ];
        }
    }
    
    return (
        <TouchableHighlight
            onPress={onPress}
            style={[
                styles.container,
                style,
                getBackgroundStyle()
            ]}>
            {
                children
                    ? children
                    : <Text style={getTextStyle()}>{name}</Text>
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
        fontSize: 15
    },
    text: {
        color: '#ffffff',
    },
    text_light: {
        color: '#008000'
    },
    background_light: {
        backgroundColor: '#e0e0e0'
    },
    background_plain: {
        
    }
});