// Chat bubble component for use in conversations.
// Will display on left or right and with different information based on context.

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { chatUtils } from '@utils';
import { colors } from '@styles';

export default function ChatBubble({
    item,
    isMe,
    isSameAuthorAsNext,
    shouldShowTimestamp,
    onSendPress, // Used for drafts
    onSchedulePress, // Used for drafts
    onDeletePress,
    onEditPress,
    style,
}) {
    // Only state is for showing the timestamp on tap
    const [showSmallTimestamp, setShowSmallTimestamp] = useState(false);

    // Switch between elements and styles depending on if message is current user or not
    const onPress = isMe ? null : () => setShowSmallTimestamp(!showSmallTimestamp);
    const timeColor = isMe ? colors.meTimestamp : colors.otherTimestamp;
    const showAuthorName = !isSameAuthorAsNext && !isMe;
    const alignment = isMe ? 'flex-end' : 'flex-start';
    const Container = isMe ? MenuTrigger : TouchableOpacity;
    const Wrapper = isMe ? Menu : View;

    let bubbleStyle = isMe ? styles.meBubble : styles.otherBubble;
    let textColor = isMe ? colors.meText : colors.otherText;
    if (item.isDraft) {
        textColor = colors.draftText;
        bubbleStyle = styles.draftBubble;
    }

    return (
        <>
            <Wrapper style={[styles.messageBox, { alignSelf: alignment }, style]}>
                {showAuthorName && (
                    <Text
                        style={[styles.authorName,
                            { color: chatUtils.strToColor(item?.author?.email) },
                            { alignSelf: alignment },
                        ]}
                    >
                        {item.author.first_name}
                    </Text>
                )}
                <Container
                    triggerOnLongPress
                    onPress={onPress}
                    activeOpacity={0.8}
                    onAlternativeAction={() => setShowSmallTimestamp(!showSmallTimestamp)}
                    style={[styles.bubble, bubbleStyle]}
                >
                    <Text style={[styles.chatText, { color: textColor }]}>
                        {item.message}
                    </Text>
                    {
                        (showSmallTimestamp && item.timestamp > 0) ? (
                            <Text style={[styles.localTimestamp, {
                                color: timeColor,
                                alignSelf: alignment,
                            }]}
                            >
                                {chatUtils.formatTimestamp(item.timestamp, false, !item.isDraft)}
                            </Text>
                        ) : null
                    }
                </Container>
                {
                    isMe && (
                        <MenuOptions customStyles={menuStyles}>
                            {item.isDraft && (
                                <>
                                    <MenuOption onSelect={() => onSendPress(item)} text="Send" />
                                    <MenuOption onSelect={() => onSchedulePress(item)} text="Schedule" />
                                </>
                            )}
                            <MenuOption onSelect={() => onEditPress(item)} text="Edit" />
                            <MenuOption onSelect={() => onDeletePress(item)} text="Delete" />
                        </MenuOptions>
                    )
                }
            </Wrapper>
            {shouldShowTimestamp && (
                <Text style={styles.timestamp}>
                    {chatUtils.formatTimestamp(item.timestamp, false)}
                </Text>
            )}
        </>
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
    draftBubble: {
        backgroundColor: colors.draftBubble,
        borderBottomRightRadius: 0,
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
    timestamp: {
        alignSelf: 'center',
        color: '#aaa',
        fontSize: 12,
        marginVertical: 20,
    },
    localTimestamp: {
        fontSize: 12,
        marginTop: 4,
    },
});

ChatBubble.propTypes = {
    item: PropTypes.object.isRequired,
    isMe: PropTypes.bool,
    isSameAuthorAsNext: PropTypes.bool,
    shouldShowTimestamp: PropTypes.bool,
    onDeletePress: PropTypes.func,
    onEditPress: PropTypes.func,
    onSendPress: PropTypes.func,
    onSchedulePress: PropTypes.func,
    style: PropTypes.object,
};

ChatBubble.defaultProps = {
    style: {},
    isMe: false,
    isSameAuthorAsNext: false,
    shouldShowTimestamp: false,
    onDeletePress: () => {},
    onEditPress: () => {},
    onSendPress: () => {},
    onSchedulePress: () => {},
};
