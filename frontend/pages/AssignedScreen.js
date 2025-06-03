import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AssignedScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>已分配给我</Text>
            <Button
                title="已分配"
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

export default AssignedScreen;
