import { View, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@styles';

// Properties:
// - size: small, medium, large - Size of the input
// - shape: rounded - Shape of the input
// - loading: boolean - Set to true to show a loading indicator
// - icon: string - Icon to show on the input (currently unimplemented)
// - disabled: boolean - Set to true to disable the input
// - type: default, password, email-address, numeric, phone-pad - Type of input
// - ghost: boolean - Set to true to make the input transparent with a border
// - block: number - Set to a number between 0 and 100 to make the input fill the screens width by that percentage
// - value: string - The value of the input
// - onChangeText: function - Called when the input value changes
// - placeholder: string - Placeholder text to show when the input is empty
// - readonly: boolean - Set to true to make the input uneditable

export default function TextInputComponent({
  size = 'medium',
  disabled = false,
  block = 0,
  shape,
  readonly = false,
  required = false,
  type,
  value,
  onChangeText = () => {},
  loading = false,
  placeholder = '',
  ghost = false,
  style
}) {
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
      block: block > 0 ? { width: `${block}%` } : null,
      ghost: ghost ? styles.ghost : null,
      disabled: disabled && styles.disabled,
    };

    return [
      ...cStyle.base,
      cStyle['size'][size],
      cStyle['shape'][shape],
      cStyle['block'],
      cStyle['ghost'],
      cStyle['disabled'],
      style
    ];
  };

  // Here for scalability and expandability (currently useless)
  const getInputStyles = () => {
    return [styles.input];
  };

  return (
    <View style={getContainerStyles()}>
      {loading && <ActivityIndicator color="#FFF" />}
      <TextInput
        style={getInputStyles()}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.inputPlaceholder}
        secureTextEntry={type === 'password'}
        editable={!readonly}
        required={required}
        keyboardType={type === 'password' ? 'default' : type}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 16,
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
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});