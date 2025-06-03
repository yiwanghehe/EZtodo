import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FeatureIcon = ({
                         name,
                         size = 24,
                         color = '#3498db',
                         label,
                         onPress,
                     }) => {

    return (
        <Pressable
            onPress={onPress}
            style={styles.iconButton}
        >
            <Ionicons name={name} size={size} color={color} />
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    iconButton: {
        alignItems: 'center',
        padding: 6,
        position: 'relative',
    },
    label: {
        marginTop: 4,
        fontSize: 12,
        color: '#333',
    },
    tooltipText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default FeatureIcon;
