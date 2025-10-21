import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface NavigationButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
}

export const NavigationButton = ({
  title,
  onPress,
  variant = "primary",
  style,
}: NavigationButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[styles.text, variant === "secondary" && styles.textSecondary]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  primary: {
    backgroundColor: "#3498db",
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#3498db",
  },
  danger: {
    backgroundColor: "#e74c3c",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  textSecondary: {
    color: "#3498db",
  },
});
