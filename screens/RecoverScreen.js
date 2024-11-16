import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const RecoverScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [dogName, setDogName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isPasswordRecovered, setIsPasswordRecovered] = useState(false);

    const handleRecoverPassword = async () => {
        try {
            const response = await fetch('http://localhost:3000/recover-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, dogName }),
            });

            const data = await response.json();

            if (response.ok) {
                setErrorMessage(`Usuário verificado com sucesso!`);
                setIsPasswordRecovered(true);
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage('Ocorreu um erro ao recuperar a senha.');
        }
    };

    const handleChangePassword = async () => {
        try {
            const response = await fetch('http://localhost:3000/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setErrorMessage(`Senha alterada com sucesso!`);
                setUsername('');
                setDogName('');
                setNewPassword('');
                setIsPasswordRecovered(false);
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage('Erro ao mudar a senha.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar Senha</Text>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            {!isPasswordRecovered ? (
                <>
                    <TextInput
                        placeholder="Nome de usuário"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Nome que daria a um cachorro"
                        value={dogName}
                        onChangeText={setDogName}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.roundButton} onPress={handleRecoverPassword}>
                        <Text style={styles.buttonText}>Recuperar Senha</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TextInput
                        placeholder="Nova Senha"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.roundButton} onPress={handleChangePassword}>
                        <Text style={styles.buttonText}>Trocar Senha</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    error: { color: 'red' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
    roundButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25, // Tornando o botão redondo
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default RecoverScreen;
