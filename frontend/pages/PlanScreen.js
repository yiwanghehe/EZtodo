import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PlanScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>计划内</Text>
            <Button
                title="计划"
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

export default PlanScreen;
