import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ImportantScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>重要</Text>
            <Button
                title="重要"
                // onPress={() => navigation.goBack()}
                onPress={() => navigation.goBack()}
                color="#841584"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default ImportantScreen;
