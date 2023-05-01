import { StyleSheet } from 'react-native';
import { globalStyle } from './global_style';

export const contactStyle = StyleSheet.create({
    container: {
        ...globalStyle.container,
        alignItems: 'flex-start',
    },
    contactList: {
        width: '100%',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    searchBarText: {
        color: '#fff',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    contact: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    avatarContainer: {
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: 'transparent',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    placeholderImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    placeholderText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    name: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#888',
    },
});
