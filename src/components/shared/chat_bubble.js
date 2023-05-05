// Chat bubble component for use in conversations.
// Will display on left or right and with different information based on context.

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { appUtils } from '@utils';
import { colors } from '@styles';
import React from 'react';

export default function ChatBubble({
    item,
    isMe,
    isSameAuthorAsNext,
    onDeletePress,
    onEditPress,
}) {
    // Switch between elements and styles depending on if message is current user or not
    const bubbleStyle = isMe ? styles.meBubble : styles.otherBubble;
    const textColor = isMe ? colors.meText : colors.otherText;
    const showAuthorName = !isSameAuthorAsNext && !isMe;
    const alignment = isMe ? 'flex-end' : 'flex-start';
    const Container = isMe ? MenuTrigger : View;
    const Wrapper = isMe ? Menu : View;

    return (
        <Wrapper style={[styles.messageBox, { alignSelf: alignment }]}>
            {showAuthorName && (
                <Text
                    style={[styles.authorName,
                        { color: appUtils.strToColor(item.author.email) },
                        { alignSelf: alignment },
                    ]}
                >
                    {item.author.first_name}
                </Text>
            )}
            <Container
                triggerOnLongPress
                style={[styles.bubble, bubbleStyle]}
            >
                <Text style={[styles.chatText, { color: textColor }]}>
                    {item.message}
                </Text>
            </Container>
            {
                isMe && (
                    <MenuOptions customStyles={menuStyles}>
                        <MenuOption onSelect={() => onEditPress(item)} text="Edit" />
                        <MenuOption onSelect={() => onDeletePress(item)} text="Delete" />
                    </MenuOptions>
                )
            }
        </Wrapper>
    );
}

const menuStyles = {
    optionsContainer: {
        backgroundColor: colors.holdMenuBackground,
        borderRadius: 8,
    },
    optionText: {
        color: colors.holdMenuText,
        fontSize: 16,
        padding: 8,
    },
};

const styles = StyleSheet.create({
    messageBox: {
        maxWidth: '80%',
        marginBottom: 8,
    },
    bubble: {
        borderRadius: 20,
        padding: 15,
    },
    meBubble: {
        backgroundColor: colors.meBubble,
        borderBottomRightRadius: 0,
    },
    otherBubble: {
        backgroundColor: colors.otherBubble,
        borderBottomLeftRadius: 0,
    },
    chatText: {
        fontSize: 16,
        lineHeight: 20,
    },
    authorName: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});

ChatBubble.propTypes = {
    item: PropTypes.object.isRequired,
    isMe: PropTypes.bool.isRequired,
    isSameAuthorAsNext: PropTypes.bool.isRequired,
    onDeletePress: PropTypes.func,
    onEditPress: PropTypes.func,
};

ChatBubble.defaultProps = {
    onDeletePress: () => {},
    onEditPress: () => {},
};
