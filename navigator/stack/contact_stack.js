import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactView from '@components/views/contact_view';
import ContactAdd from '@components/views/contact_add';
import Button from "@components/shared/button";
import { Feather } from "@expo/vector-icons";
import { headerOptions } from '@styles';
import { globalStyle } from '@styles';
import { View } from 'react-native';

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

    return (
        <ContactStack.Navigator initialRouteName="Add">
            <ContactStack.Screen name="View" component={ContactView} options={viewHeaderOptions} />
            <ContactStack.Screen name="Add" component={ContactAdd} options={headerOptions} />
        </ContactStack.Navigator>
    );
}