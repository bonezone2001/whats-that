import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactBlock from '@components/views/contact_blocked';
import ContactView from '@components/views/contact_view';
import ContactAdd from '@components/views/contact_add';
import Button from "@components/shared/button";
import { Feather } from "@expo/vector-icons";
import { apiUtils, appUtils } from '@utils';
import { headerOptions } from '@styles';
import { globalStyle } from '@styles';
import { View } from 'react-native';
import { useEffect } from 'react';

const ContactStack = createNativeStackNavigator();

export default ({ navigation }) => {
    const onAddContact = () => {
        navigation.navigate("Add");
    };

    const onBlockedContacts = () => {
        navigation.navigate("Blocked");
    };
    
    const viewHeaderOptions = {
        ...headerOptions,
        headerRight: () => (
            // Button for adding a new contact and seeing blocked contacts next to each other
            <View style={{ flexDirection: "row" }}>
                <Button
                    onPress={onBlockedContacts}
                    style={globalStyle.transparent}
                    size="small"
                >
                    <Feather name="x-circle" size={28} color="#fff" />
                </Button>
                <Button
                    onPress={onAddContact}
                    style={globalStyle.transparent}
                    size="small"
                >
                    <Feather name="user-plus" size={28} color="#fff" />
                </Button>
            </View>
        ),
    };

    // This is a hack but it works (abuse of debounce since react-navigation doesn't have a listener for when the stacks are changed for some reason)
    // debounce is needed because the listener is called multiple times when the stack is changed
    useEffect(() => {
        const updateFunc = appUtils.debounceLeading(apiUtils.updateContactsAndBlocked, 100);
        navigation.addListener("state", () => updateFunc());
    }, []);

    return (
        <ContactStack.Navigator initialRouteName="View">
            <ContactStack.Screen name="View" component={ContactView} options={viewHeaderOptions} />
            <ContactStack.Screen name="Blocked" component={ContactBlock} options={headerOptions} />
            <ContactStack.Screen name="Add" component={ContactAdd} options={headerOptions} />
        </ContactStack.Navigator>
    );
}