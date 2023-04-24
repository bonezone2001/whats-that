import {
    View,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
    Platform,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { colors } from "@styles";
import { appUtils } from "@utils";

// Properties:
// - size: small, medium, large - Size of the input
// - shape: rounded - Shape of the input
// - loading: boolean - Set to true to show a loading indicator
// - icon: string - Icon to show on the input
// - iconLibrary: string - Icon library to use
// - disabled: boolean - Set to true to disable the input
// - type: default, password, email-address, numeric, phone-pad - Type of input
// - ghost: boolean - Set to true to make the input transparent with a border
// - block: number - Set to a number between 0 and 100 to make the input fill the screens width by that percentage
// - value: string - The value of the input
// - onValidate: function - Called when the input is blurred, should return an error message if the input is invalid
// - onChangeText: function - Called when the input value changes
// - onFocus: function - Called when the input is focused
// - onBlur: function - Called when the input is blurred
// - placeholder: string - Placeholder text to show when the input is empty
// - readonly: boolean - Set to true to make the input uneditable
// - required: boolean - Set to true to show a red asterisk next to the input
// - triggerValidate: boolean - Set to true to force the input to validate
// - inputStyle: object - Style to apply to the input
// - style: object - Style to apply to the container

export default ({
    size = "medium",
    disabled = false,
    block = 0,
    shape,
    readonly = false,
    required = false,
    type,
    value,
    icon,
    iconLibrary = "Ionicons",
    onValidate = () => "",
    onChangeText = () => {},
    onFocus = () => {},
    onBlur = () => {},
    loading = false,
    placeholder = "",
    ghost = false,
    textColor = colors.text,
    placeholderTextColor = colors.inputPlaceholder,
    triggerValidate = false,
    inputStyle,
    style,
    prefixStyle,
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  // Switches all the different input styles and combines them
  const getContainerStyles = () => {
    const cStyle = {
        base: [styles.container],
        size: {
            small: styles.small,
            medium: styles.medium,
            large: styles.large,
        },
        shape: {
            rounded: styles.rounded,
        },
        ghost: ghost ? styles.ghost : null,
        disabled: disabled && styles.disabled,
        error: error?.length > 0 && styles.error,
    };

    return [
        ...cStyle.base,
        cStyle["size"][size],
        cStyle["shape"][shape],
        cStyle["ghost"],
        cStyle["disabled"],
        cStyle["error"],
        cStyle["block"],
        style,
    ];
  };

    const getViewStyles = () => {
        const vStyle = {
            base: [styles.view],
            block: block > 0 && { width: `${block}%` },
        };

        return [...vStyle.base, vStyle["block"]];
    };

    // Here for scalability and expandability (currently useless)
    function getInputStyles() {
        style = { };
        if (textColor) style.color = textColor;
        return [styles.input, style, inputStyle]
    }

    function focusInput() {
        inputRef.current.focus();
    }

    function performValidation() {
        if (!onValidate) return;
        const error = onValidate();
        setError(error);
    }

    function internalOnBlur() {
        performValidation();
        onBlur();
    }

    useEffect(() => {
        if (triggerValidate) performValidation();
    }, [triggerValidate]);
    
    const IconLibrary = appUtils.getIconLibrary(iconLibrary);
    return (
        <View style={getViewStyles()}>
            {error?.length > 0 && <Text style={styles.errorText}>{error}</Text>}
            <TouchableWithoutFeedback onPressIn={focusInput} onFocus={focusInput} disabled={disabled}>
                <View style={getContainerStyles()}>
                    {
                        loading ? <ActivityIndicator style={[styles.indicator, prefixStyle]} size={24} color="#FFF" />
                        : icon && <IconLibrary style={[styles.icon, prefixStyle]} name={icon} size={24} color="#fff" />
                    }
                    <TextInput
                        ref={inputRef}
                        style={getInputStyles()}
                        onChangeText={onChangeText}
                        onFocus={onFocus}
                        onBlur={internalOnBlur}
                        value={value}
                        placeholder={placeholder}
                        placeholderTextColor={placeholderTextColor}
                        secureTextEntry={type === "password"}
                        editable={!readonly}
                        required={required}
                        keyboardType={type === "password" ? "default" : type}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#fff",
        backgroundColor: colors.inputBackground,
        paddingHorizontal: 16,
        width: "100%",
    },
    view: {
        
    },
    small: {
        paddingVertical: 8,
    },
    medium: {
        paddingVertical: 12,
    },
    large: {
        paddingVertical: 16,
    },
    rounded: {
        borderRadius: 10,
    },
    ghost: {
        borderWidth: 1,
        backgroundColor: "transparent",
    },
    disabled: {
        opacity: 0.5,
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
        ...Platform.select({
            web: {
                outlineStyle: 'none'
            }
        })
    },
    errorText: {
        color: colors.danger,
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 8,
        marginBottom: 4,
    },
    error: {
        borderWidth: 1,
        borderColor: colors.danger,
        color: colors.danger,
    },
    ghost: {
        backgroundColor: "transparent",
        borderWidth: 1,
    },
    indicator: {
        marginRight: 8,
    },
    icon: {
        marginRight: 8,
    },
});
