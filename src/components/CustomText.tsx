import React from 'react';
import {
  Text as RNText,
  TextProps,
  StyleProp,
  TextStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomTextProps extends TextProps {
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  italic?: boolean;
  style?: StyleProp<TextStyle>;
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  style,
  weight = 'regular',
  italic = false,
  ...props
}): JSX.Element => {
  const { colors } = useTheme();

  const getFontFamily = (): string => {
    if (italic) return 'Poppins-Italic';
    switch (weight) {
      case 'medium':
        return 'Poppins-Medium';
      case 'semiBold':
        return 'Poppins-SemiBold';
      case 'bold':
        return 'Poppins-Bold';
      default:
        return 'Poppins-Regular';
    }
  };

  return (
    <RNText
      style={[{ fontFamily: getFontFamily(), color: colors.text }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default CustomText;
