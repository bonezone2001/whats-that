import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { appUtils } from '@utils';
import React from 'react';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

export default function ChatBubble({
    item,
    isMe,
    isSameAuthorAsNext,
    onDeletePress,
    onEditPress,
}) {
    const Container = isMe ? MenuTrigger : View;
    const Wrapper = isMe ? Menu : View;

    return (
        <Wrapper
            style={[
                styles.messageBox,
                isMe ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
            ]}
        >
            {!isSameAuthorAsNext && !isMe && (
                <Text
                    style={[
                        styles.authorName,
                        { color: appUtils.strToColor(item.author.email) },
                        { alignSelf: isMe ? 'flex-end' : 'flex-start' },
                    ]}
                >
                    {item.author.first_name}
                    {' '}
                </Text>
            )}
            <Container
                triggerOnLongPress
                style={[
                    styles.bubble,
                    isMe ? styles.meBubble : styles.otherBubble,
                ]}
            >
                <Text
                    style={[
                        styles.chatText,
                        { color: isMe ? '#000' : '#fff' },
                    ]}
                >
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

const menuStyles = {
    optionsContainer: {
        backgroundColor: '#372d2b',
        borderRadius: 8,
    },
    optionText: {
        color: '#fff',
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
        backgroundColor: '#c8a48c',
        borderBottomRightRadius: 0,
    },
    otherBubble: {
        backgroundColor: '#372d2b',
        borderBottomLeftRadius: 0,
    },
    chatText: {
        fontSize: 16,
        lineHeight: 20,
        color: '#333',
    },
    authorName: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});
