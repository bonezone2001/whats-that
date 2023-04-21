import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TextInput from '@components/shared/text_input';
import React, { useEffect, useState } from 'react';
import { screenOptions, colors } from '@styles';
import Avatar from '@components/shared/avatar';
import Button from '@components/shared/button';
import { Ionicons } from '@expo/vector-icons';

const ProfileStack = createNativeStackNavigator();

const ProfileEntry = ({ icon, label, value, iconSize = 25 }) => (
    <View style={styles.entry}>
        {/* Icon left */}
        {icon ? (
            <View style={styles.entryIcon}>
                <Ionicons name={icon} size={iconSize} color="#000" />
            </View>
        ) : null}

        {/* Content */}
        <View style={styles.entryContent}>
            <Text style={styles.entryLabel}>{label}</Text>
            <Text style={styles.entryValue}>{value}</Text>
        </View>
    </View>
);

const profilePage = ({ navigation, profileData }) => {
    const onEditProfile = () => {
        // Navigate to the nested Edit Profile page
        navigation.navigate('Edit');
    };

    return (
        <View style={styles.container}>
            {/* Hamburger menu */}
            <View style={styles.hamburger}>
                <Button
                    text="Menu"
                    onPress={() => {}}
                    style={styles.hamburgerButton}
                    size="small"
                >
                    <Ionicons name="menu" size={40} color="#fff" />
                </Button>
            </View>

            <ScrollView style={styles.profileView}>
                <View style={styles.profileHeader}>
                    <Avatar
                        size={160}
                        style={styles.avatar}
                        shape="rounded"
                    />
                    <Text style={styles.name}>{`${profileData.firstName} ${profileData.lastName}`}</Text>
                    <Button
                        block={45}
                        shape="rounded"
                        textColor="black"
                        style={styles.button}
                        onPress={onEditProfile}
                    >
                        Edit Profile
                    </Button>
                </View>

                <View style={styles.profileContent}>
                    <ProfileEntry icon="mail" label="Email" value={profileData.email} />
                    <ProfileEntry icon="people" label="Friends" value={profileData.friends} />
                    <ProfileEntry icon="chatbubbles" label="Chats" value={profileData.chats} />
                </View>
            </ScrollView>
        </View>
    );
};

const editProfilePage = ({ navigation, profileData }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    return (
        <View style={styles.container}>
            {/* Back button */}
            <View style={styles.back}>
                <Button
                    text="Back"
                    onPress={() => navigation.navigate('View')}
                    style={styles.backButton}
                    size="small"
                >
                    <Ionicons name="arrow-back" size={40} color="#fff" />
                </Button>
            </View>

            {/* Edit profile header */}
            <ScrollView style={styles.profileView}>
                <View style={styles.profileHeader}>
                    <Avatar
                        size={160}
                        style={styles.avatar}
                        shape="rounded"
                    />
                </View>

                <View style={styles.profileContent}>
                    <TextInput
                        label="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default ({ navigation }) => {
    // Replace this with actual profile data (e.g., fetched from an API)
    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        imageUrl: 'https://example.com/profile_image.jpg',
        friends: 123,
        chats: 456,
    });

    return (
        <ProfileStack.Navigator screenOptions={screenOptions} initialRouteName="Edit">
            <ProfileStack.Screen name="View">
                {() => profilePage({ navigation, profileData })}
            </ProfileStack.Screen>
            <ProfileStack.Screen name="Edit">
                {() => editProfilePage({ navigation, profileData })}
            </ProfileStack.Screen>
        </ProfileStack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.background
    },
    profileView: {
        width: '100%',
        marginTop: 50,
    },
    profileContent: {
        marginTop: 20,
    },
    profileHeader: {
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 10,
    },
    avatar: {
        borderWidth: 3,
        borderColor: '#EEE',
    },
    button: {
        marginTop: 10,
        paddingVertical: 5,
    },
    hamburger: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    hamburgerButton: {
        backgroundColor: 'transparent',
    },
    back: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    backButton: {
        backgroundColor: 'transparent',
    },
    entry: {
        marginVertical: 5,
        marginHorizontal: 20,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#57cc99',
        borderRadius: 10,
    },
    entryIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    entryLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    entryValue: {
        fontSize: 16,
    },
    name: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
});