import { StyleSheet } from 'react-native';

export const profileStyle = StyleSheet.create({
    name: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    avatar: {
        borderWidth: 2,
        borderColor: '#eee',
    },
    avatarButton: {
        paddingVertical: 0,
    },
    button: {
        marginTop: 10,
        paddingVertical: 4,
        backgroundColor: '#aaa',
    },
    infoCard: {
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
    },
    profileContent: {
        marginTop: 20,
    },
    avatarSubtext: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
    formElement: {
        marginBottom: 10,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalButtonContainer: {
        backgroundColor: '#000000',
    },
    modalText: {
        fontSize: 20,
        color: '#ffffff',
        marginBottom: 20,
        textDecorationLine: 'underline',
    },
    cameraButton: {
        backgroundColor: '#000000',
        marginBottom: 20,
    },
});
