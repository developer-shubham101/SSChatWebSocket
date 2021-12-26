import React, {useEffect, useMemo, useState} from "react";
import {getLinkPreview} from "link-preview-js";
import {
  Image,
  ImageStyle,
  Linking,
  Platform,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const REGEX = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g;

interface RNUrlPreviewProps {
  text: string | undefined | null;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  imageStyle?: StyleProp<ImageStyle> | undefined;
  faviconStyle?: StyleProp<ImageStyle> | undefined;
  textContainerStyle?: StyleProp<ViewStyle> | undefined;
  title?: boolean;
  titleStyle?: StyleProp<TextStyle> | undefined;
  titleNumberOfLines?: number;
  descriptionStyle?: StyleProp<TextStyle> | undefined;
  descriptionNumberOfLines?: number | undefined;

  onLoad?(...args: unknown[]): unknown;

  onError?(...args: unknown[]): unknown;
}

const extractUrls = (str, lower = false) => {
  const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?!&//=]*)/gi;

  if (typeof str !== "string") {
    throw new TypeError(
      `The str argument should be a string, got ${typeof str}`
    );
  }

  if (str) {
    let urls = str.match(regexp);
    if (urls) {
      return lower ? urls.map((item) => item.toLowerCase()) : urls;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

const SSUrlPreview = (props: RNUrlPreviewProps) => {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    if (props.text) {
      const input = props.text;
      const url = extractUrls(input);
      url && setUrls(url);
    }
  }, [props.text]);

  return <>{
    urls.map((item, index) => <SSUrlPreviewTmp key={`${index}`} {...props} text={item}/>)
  }</>
}

const SSUrlPreviewTmp = (props: RNUrlPreviewProps) => {


  const [isUri, setIsUri] = useState(false);
  const [linkTitle, setLinkTitle] = useState<string | undefined>(undefined);
  const [linkDesc, setLinkDesc] = useState<string | undefined>(undefined);
  const [linkFavicon, setLinkFavicon] = useState<string | undefined>(undefined);
  const [linkImg, setLinkImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (props.text) {
      getPreview()
    } else {
      setIsUri(false);
    }
  }, [props.text])


  const getPreview = useMemo(() => () => {
    const {onError, onLoad, text} = props;
    getLinkPreview(text!)
      .then((data: {
        url: string;
        title: string;
        siteName: string | undefined;
        description: string | undefined;
        mediaType: string;
        contentType: string | undefined;
        images: string[];
        videos: {
          url: string | undefined;
          secureUrl: string | null | undefined;
          type: string | null | undefined;
          width: string | undefined;
          height: string | undefined;
        }[];
        favicons: string[];
      } | {
        url: string;
        mediaType: string;
        contentType: string;
        favicons: string[];
      }) => {
        onLoad(data);

        setLinkFavicon(data.favicons && data.favicons.length > 0
          ? data.favicons[data.favicons.length - 1]
          : undefined);
        setLinkImg(data.images && data.images.length > 0
          ? data.images.find(function (element) {
            return (
              element.includes(".png") ||
              element.includes(".jpg") ||
              element.includes(".jpeg")
            );
          })
          : undefined)
        setLinkDesc(data.description ? data.description : undefined)
        setIsUri(true);
        setLinkTitle(data.title ? data.title : undefined);
      })
      .catch(error => {
        onError(error);
        setIsUri(false);
      });
  }, [props.text]);

  // componentDidUpdate(nextProps)
  // {
  //   if (nextProps.text !== props.text) {
  //     getPreview(nextProps.text);
  //   } else if (nextProps.text == null) {
  //     setState({isUri: false});
  //   }
  // }

  const _onLinkPressed = () => {
    Linking.openURL(props.text.match(REGEX)[0]);
  };

  const renderImage = (
    imageLink,
    faviconLink,
    imageStyle,
    faviconStyle,
    imageProps
  ) => {
    return imageLink ? (
      <Image style={imageStyle} source={{uri: imageLink}} {...imageProps} />
    ) : faviconLink ? (
      <Image
        style={faviconStyle}
        source={{uri: faviconLink}}
        {...imageProps}
      />
    ) : null;
  };
  const renderText = (
    showTitle,
    title,
    description,
    textContainerStyle,
    titleStyle,
    descriptionStyle,
    titleNumberOfLines,
    descriptionNumberOfLines
  ) => {
    return (
      <View style={textContainerStyle}>
        {showTitle && (
          <Text numberOfLines={titleNumberOfLines} style={titleStyle}>
            {title}
          </Text>
        )}
        {description && (
          <Text
            numberOfLines={descriptionNumberOfLines}
            style={descriptionStyle}
          >
            {description}
          </Text>
        )}
      </View>
    );
  };
  const renderLinkPreview = (
    containerStyle,
    imageLink,
    faviconLink,
    imageStyle,
    faviconStyle,
    showTitle,
    title,
    description,
    textContainerStyle,
    titleStyle,
    descriptionStyle,
    titleNumberOfLines,
    descriptionNumberOfLines,
    imageProps
  ) => {
    return (
      <TouchableOpacity
        style={[styles.containerStyle, containerStyle]}
        activeOpacity={0.9}
        onPress={() => _onLinkPressed()}
      >
        {renderImage(
          imageLink,
          faviconLink,
          imageStyle,
          faviconStyle,
          imageProps
        )}
        {renderText(
          showTitle,
          title,
          description,
          textContainerStyle,
          titleStyle,
          descriptionStyle,
          titleNumberOfLines,
          descriptionNumberOfLines
        )}
      </TouchableOpacity>
    );
  };


  const {
    text,
    containerStyle,
    imageStyle,
    faviconStyle,
    textContainerStyle,
    title,
    titleStyle,
    titleNumberOfLines,
    descriptionStyle,
    descriptionNumberOfLines,
    imageProps
  } = props;
  return isUri
    ? renderLinkPreview(
      containerStyle,
      linkImg,
      linkFavicon,
      imageStyle,
      faviconStyle,
      title,
      linkTitle,
      linkDesc,
      textContainerStyle,
      titleStyle,
      descriptionStyle,
      titleNumberOfLines,
      descriptionNumberOfLines,
      imageProps
    )
    : null;

}

const styles = {
  containerStyle: {
    flexDirection: "row"
  }
};

SSUrlPreview.defaultProps = {
  onLoad: () => {
  },
  onError: () => {
  },
  text: null,
  containerStyle: {
    backgroundColor: "rgba(239, 239, 244,0.62)",
    alignItems: "center"
  },
  imageStyle: {
    width: Platform.isPad ? 160 : 110,
    height: Platform.isPad ? 160 : 110,
    paddingRight: 10,
    paddingLeft: 10
  },
  faviconStyle: {
    width: 40,
    height: 40,
    paddingRight: 10,
    paddingLeft: 10
  },
  textContainerStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10
  },
  title: true,
  titleStyle: {
    fontSize: 17,
    color: "#000",
    marginRight: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
    fontFamily: "Helvetica"
  },
  titleNumberOfLines: 2,
  descriptionStyle: {
    fontSize: 14,
    color: "#81848A",
    marginRight: 10,
    alignSelf: "flex-start",
    fontFamily: "Helvetica"
  },
  descriptionNumberOfLines: Platform.isPad ? 4 : 3,
  imageProps: {resizeMode: "contain"}
};
export default SSUrlPreview;
