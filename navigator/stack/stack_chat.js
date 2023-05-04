// Stack of screens when user has chat tab selected.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatIndividual from '@components/views/chat/chat_individual';
import ChatMembers from '@components/views/chat/chat_members';
import ChatCreate from '@components/views/chat/chat_create';
import ChatModify from '@components/views/chat/chat_modify';
import ChatView from '@components/views/chat/chat_view';
import { headerOptions } from '@styles';
import React from 'react';

const ChatStack = createNativeStackNavigator();

export default function ChatNav() {
    return (
        <ChatStack.Navigator screenOptions={{ headerBackVisible: false }}>
            <ChatStack.Screen name="View" component={ChatView} options={headerOptions} />
            <ChatStack.Screen name="Create" component={ChatCreate} options={headerOptions} />
            <ChatStack.Screen name="ViewChat" component={ChatIndividual} options={headerOptions} />
            <ChatStack.Screen name="Modify" component={ChatModify} options={headerOptions} />
            <ChatStack.Screen name="Members" component={ChatMembers} options={headerOptions} />
        </ChatStack.Navigator>
    );
}
