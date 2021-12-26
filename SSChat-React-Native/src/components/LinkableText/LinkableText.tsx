import React, {useCallback, useEffect, useState} from 'react';
import {Linking, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View} from 'react-native';
import ParsedText from 'react-native-parsed-text';


import {containsLinks} from '../../utils/general';
import SSUrlPreview from "./SSPreview";


interface LinkableTextProps {
  text: string | undefined | null;
  numberOfLines?: number;
  readMoreOption?: boolean;
  style?: StyleProp<TextStyle>;
  onPressTag?: (user: string) => void;
}

const defaultTextStyle = {};

const styles = StyleSheet.create({
  text: {
    ...defaultTextStyle
  },
  url: {
    ...defaultTextStyle,
    color: 'blue',
    textDecorationLine: 'underline'
  },
  email: {
    ...defaultTextStyle,
    color: 'blue',
    textDecorationLine: 'underline'
  },
  phone: {
    ...defaultTextStyle,
    color: 'blue',
    textDecorationLine: 'underline'
  },
  hashTag: {
    ...defaultTextStyle,
    color: 'blue',
    fontStyle: 'italic'
  },
  tagTag: {
    ...defaultTextStyle,
    color: 'blue',
  },
  linkImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    backgroundColor: '#000000'
  },
  linkContainer: {width: '80%'}
});


export enum LinkType {
  url = 'URL',
  phone = 'PHONE',
  email = 'EMAIL',
  hashtag = 'HASHTAG',
  tagTag = 'TAGTAG'
}

export const LinkableText = ({
                               text,
                               numberOfLines,
                               readMoreOption = false,
                               style = {},
                               onPressTag = (user: string) => {
                               }
                             }: LinkableTextProps) => {
  const [displayPreview, setDisplayPreview] = useState<boolean>(false);
  const [showFullText, setShowFullText] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  const onTextLayout = useCallback((e) => {
    setVisibleLines(e.nativeEvent.lines.length);
  }, []);

  useEffect(() => {
    if (text && containsLinks(text)) {
      setDisplayPreview(true);
    }
  }, [text]);

  const onLinkPressed = async (type: LinkType, data: string) => {
    console.log('Shubham::::: onLinkPressed', data);
    try {
      switch (type) {
        case LinkType.url:
          if (!data.match(/^[a-zA-Z]+:\/\//)) {
            await Linking.openURL(`https://${data}`);
            break;
          }

          await Linking.openURL(data);
          break;
        case LinkType.phone:
          await Linking.openURL(`tel:${data}`);
          break;
        case LinkType.email:
          await Linking.openURL(`mailto:${data}`);
          break;
        case LinkType.hashtag:
          // navigate(Routes.Dashboard, { hashtag: data });
          break;
        case LinkType.tagTag:

          onPressTag(data);
          break;
      }
    } catch (e) {
      console.log('Error:::', e);
      alert(e.toString());
    }
  };
  return (
    <>
      <View style={{paddingBottom: 10}}>
        <ParsedText
          style={[styles.text, style]}
          numberOfLines={showFullText ? visibleLines : numberOfLines}
          onTextLayout={onTextLayout}
          parse={[
            {
              type: 'url',
              style: styles.url,
              onPress: (data: string) =>
                onLinkPressed(LinkType.url, data)
            },
            {
              type: 'phone',
              style: styles.phone,
              onPress: (data: string) =>
                onLinkPressed(LinkType.phone, data)
            },
            {
              type: 'email',
              style: styles.email,
              onPress: (data: string) =>
                onLinkPressed(LinkType.email, data)
            },
            {
              pattern: /#(\w+)/,
              onPress: (data: string) =>
                onLinkPressed(LinkType.hashtag, data),
              style: styles.hashTag
            },
            {
              pattern: /@(\w+)/,
              onPress: (data: string) =>
                onLinkPressed(LinkType.tagTag, data),
              style: styles.tagTag
            }
          ]}
        >
          {text}
        </ParsedText>
        {readMoreOption &&
          numberOfLines &&
          visibleLines > numberOfLines && (
            <TouchableOpacity
              onPress={() => setShowFullText(!showFullText)}
            >
              <Text style={{...styles.text, color: 'blue'}}>
                {showFullText ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          )}
      </View>
      {displayPreview && (
        <SSUrlPreview
          titleStyle={styles.text}
          titleNumberOfLines={1}
          descriptionNumberOfLines={2}
          imageStyle={styles.linkImage}
          containerStyle={styles.linkContainer}
          text={text}
        />
      )}
    </>
  );
};
