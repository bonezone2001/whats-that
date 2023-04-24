import { colors, contactStyle, globalStyle } from "@styles";
import { View, Text, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "@components/shared/button";
import Avatar from "@components/shared/avatar";
import { useEffect, useState } from "react";
import { apiUtils } from "@utils";
import { useStore } from "@store";
import api from "@api";

import noResultsImage from '@assets/images/no_results.png';

export default () => {
    const [blocked, setBlocked] = useState([]);
    const navigation = useNavigation();
    const store = useStore();

    const unblockContact = async (user) => {
        try {
            await api.unblockUser(user.user_id);
            await apiUtils.updateBlocked();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => navigation.navigate("View")}
                    style={globalStyle.transparent}
                    size="small"
                    icon="x"
                    iconLibrary="Feather"
                    iconSize={40}
                    textColor="#fff"
                />
            ),
        });
    }, []);

    useEffect(() => {
        Promise.all(store.blocked?.map(async (blocked) => {
            const avatarData = await api.getUserPhoto(blocked.user_id);
            blocked.avatar = avatarData;
            return blocked;
        })).then((blocked) => {
            setBlocked(blocked);
        });
    }, [store.blocked]);
    
    return (
        <View style={contactStyle.container}>
            {blocked.length > 0 ? (
                <FlatList
                    style={contactStyle.contactList}
                    data={blocked}
                    renderItem={({ item }) => (
                        <View style={contactStyle.contact}>
                            <View style={contactStyle.avatarContainer}>
                                <Avatar
                                    size={60}
                                    shape="circle"
                                    source={{ uri: item.avatar }}
                                />
                            </View>
                            <View style={contactStyle.infoContainer}>
                                <Text numberOfLines={1} style={contactStyle.name}>{`${item.first_name} ${item.last_name}`}</Text>
                                <Text numberOfLines={1} style={contactStyle.email}>{item.email}</Text>
                            </View>
                            <View style={contactStyle.actionsContainer}>
                                <Button
                                    style={contactStyle.actionButton}
                                    onPress={() => unblockContact(item)}
                                    size="small"
                                    icon="unlock"
                                    iconSize={28}
                                    iconLibrary="feather"
                                    textColor={colors.danger}
                                />
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.user_id.toString()}
                />
            ) : (
                <View style={[contactStyle.placeholderContainer, { alignItems: 'center' }]}>
                    <Image source={noResultsImage} style={contactStyle.placeholderImage} />
                    <Text style={contactStyle.placeholderText}>No results found</Text>
                </View>
            )}
        </View>
    );
}