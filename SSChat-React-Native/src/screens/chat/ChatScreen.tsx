import React, {useEffect, useRef, useState} from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {wsSendMessage} from "../../modules/websocket";
import FastImage from 'react-native-fast-image';
import {
  MESSAGE_TYPE_CONTACT,
  MESSAGE_TYPE_DOCUMENT,
  MESSAGE_TYPE_IMAGE,
  MESSAGE_TYPE_LOCATION,
  MESSAGE_TYPE_TEXT,
  REQUEST_MESSAGE,
  TYPE_ADD_MESSAGE
} from "../../components/const";
import store from "../../modules/store";
import * as t from "../../redux/types";
import ImagePicker, {PossibleArray} from "react-native-image-crop-picker";
import AppConfirmDialog from "../../components/AppConfirmDialog";
import {
  ContactContent,
  FileContent,
  FileMetaKey,
  LocationContent,
  MediaType,
  MessageModel,
  ReducerRoot,
  RoomList,
  RoomType,
  UserList
} from "../../type";
import {contactFake, locationFake, mediaFake} from "../../type/fake";
import openMap from 'react-native-open-maps';
import Contacts from 'react-native-contacts';
import {appOperation} from "../../webService";
import DocumentPicker from 'react-native-document-picker'
import {useDownload} from "../../hooks/useDownload";
import RightDocument from "../../components/rows/RightDocument";
import GetLocation from "react-native-get-location";
import {LinkableText} from "../../components/LinkableText";
import {useRoom} from "../../hooks/useRoom";
import moment from "moment";
import {useMessages} from "../../hooks/useMessages";

// export const useSelector: TypedUseSelectorHook<ReducerRoot> = useReduxSelector

let hasScrolled = false;
const scrollToBottomOffset = 200;
let messageSent = false;
const ChatScreen = ({
                      navigation,
                    }) => {


  // const LIMIT_OF_ITEMS = 20;

  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [timeStamp, setTimeStamp] = useState<number>();
  const {downloadFile, tasks} = useDownload();
  const {usersList} = useRoom();
  // const [currentPage, setCurrentPage] = useState(1);

  console.log('Task', tasks);
  const roomData = useSelector<ReducerRoot, RoomList | null | undefined>(state => state.reducer.roomData);
  // const sendersMessages = useSelector<ReducerRoot, [MessageModel] | null | undefined>(state => state.reducer.messages);
  const loggedInUser = useSelector<ReducerRoot, UserList | null | undefined>(state => state.reducer.loggedInUser);
  const lastMessage = useSelector<ReducerRoot, MessageModel | null | undefined>(state => state.reducer.lastMessage);

  const chatWithUser = useSelector<ReducerRoot>(state => state.reducer.chatWithUser);
  const receiversMessages = useSelector<ReducerRoot>(state => state.reducer.receiversMessages);

  const {messagesList, loadNext, loading: messagesLoading} = useMessages();


  let listRef = useRef<FlatList<MessageModel> | null>();

  const [chatUserDetail, setChatUserDetail] = useState<UserList | undefined>();


  // useEffect(() => {

  // console.log("chatWithUser-------------", chatWithUser);

  // }, [roomData,sendersMessages]);


  // const sectionData = groupArrayOfObjects(sendersMessages);
  // console.log('Max::::::', {sendersMessages, sectionData});
  console.log('Max:::::: messagesList', messagesList);
  useEffect(() => {
    console.log('Shubham::: roomData', roomData);

    if (roomData?.type == RoomType.individual) {
      let otherUserID = roomData?.userList.find((e) => e != `${loggedInUser?.userId}`);

      const otherUser: UserList | undefined = usersList?.find((e) => {
        return e.userId.toString() == otherUserID;
      });
      setChatUserDetail(otherUser);
      console.log('Shubham::: otherUser', otherUser);
    }
  }, [roomData, usersList]);


  useEffect(() => {
    if (messagesList.length > 0 && !hasScrolled) {
      hasScrolled = true;
      setTimeout(() => {
        listRef?.current?.scrollToEnd({animated: false});
      }, 100);
    } else if (messagesList.length > 0 && hasScrolled) {


      let scrollToIndex = messagesList.length - currentVisibleIndex;
      if (scrollToIndex >= 0) {
        setTimeout(() => {
          listRef?.current?.scrollToIndex({animated: false, index: scrollToIndex})
        }, 1000);
      }

    }
  }, [messagesList]);

  useEffect(() => {
    if (lastMessage && lastMessage.sender_id == loggedInUser?.userId && messageSent) {
      messageSent = false;
      setTimeout(() => {
        listRef?.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [lastMessage]);

  const sendContMessage = (i) => {
    store.dispatch(wsSendMessage(
      {
        "message_content": {},
        "request": REQUEST_MESSAGE,
        "receiver_id": roomData.userList[0],
        "message_type": MESSAGE_TYPE_TEXT,
        "type": TYPE_ADD_MESSAGE,
        "message": `Message No: ${i + 1}`, //`Hi, ${faker.lorem.sentence()}}`,
        "roomId": roomData._id,
        "room": roomData._id,
        "sender_id": loggedInUser.userId.toString(),
      },
    ));
    setTimeout(() => {
      sendContMessage(i + 1);
    }, 1100)
  }

  useEffect(() => {
    // setTimeout(() => {
    //   sendContMessage(0);
    // }, 1100)

    /* setTimeout(() => {
       for (let i = 0; i < 100; i++) {
         store.dispatch(wsSendMessage(
           {
             "message_content": {},
             "request": REQUEST_MESSAGE,
             "receiver_id": roomData.userList[0],
             "message_type": MESSAGE_TYPE_TEXT,
             "type": TYPE_ADD_MESSAGE,
             "message": `Message No: ${i + 1}`, //`Hi, ${faker.lorem.sentence()}}`,
             "roomId": roomData._id,
             "room": roomData._id,
             "sender_id": loggedInUser.userId.toString(),
           },
         ));
       }
     }, 1000);*/

  }, []);


  useEffect(() => { // Update List
    console.log('useEffect task');
    setTimeStamp(new Date().getMilliseconds());
  }, [tasks]);


  useEffect(() => {
    return () => {
      dispatch({type: t.CLEAR_ALL_MESSAGE_IN_ROOM, payload: []});
      dispatch({type: t.CREATE_ROOM_SUCCESS, payload: undefined});
    };
  }, []);


  // if (!roomData){
  //     return null;
  // }

  const onSubmit = () => {
    if (roomData != null && loggedInUser != null) {
      messageSent = true;
      store.dispatch(wsSendMessage(
        {
          "message_content": {},
          "request": REQUEST_MESSAGE,
          "receiver_id": roomData.userList[0],
          "message_type": MESSAGE_TYPE_TEXT,
          "type": TYPE_ADD_MESSAGE,
          "message": message,
          "roomId": roomData._id,
          "room": roomData._id,
          "sender_id": loggedInUser.userId.toString(),
        },
      ));
      setMessage("");
    }


    // dispatch(wsGetAllMessages(
    // {
    //     "request": REQUEST_MESSAGE,
    //     "type": REQUEST_ALL_MESSAGES,
    //     "room": roomData._id,
    // }))


    // navigation.navigate('Home')
  };

  async function uploadImage(image: PossibleArray<{ cropping: boolean; width: number; multiple: boolean; includeBase64: boolean; mediaType: string; height: number },
    MediaType<{ cropping: boolean; width: number; multiple: boolean; includeBase64: boolean; mediaType: string; height: number }>>) {
    console.log("path", image);

    console.log("Image Mine <><><><<>", image);
    // updateProfilePic(image.path);


    const photo = {
      uri: image.path,
      type: image.mime,
      name: image.filename ?? 'file.jpg',
    };


    let formData = new FormData();
    formData.append("file", photo);

    console.log(formData);

    const response = await appOperation.customer.updatePhotoPass(formData);
    console.log('Response:::::', response?.data?.file)
    if (response?.data?.file && roomData != null && loggedInUser != null) {
      store.dispatch(wsSendMessage({
        "request": REQUEST_MESSAGE,
        "type": TYPE_ADD_MESSAGE,
        "roomId": roomData._id,
        "room": roomData._id,
        "message": "",
        "message_type": MESSAGE_TYPE_IMAGE,
        "media": "",
        "receiver_id": roomData.userList[0],

        "sender_id": loggedInUser.userId.toString(),
        "message_content": {
          "file_url": appOperation.getMediaUrl(response?.data?.file),
          "file_meta": {
            [FileMetaKey.KEY_FILE_TYPE]: MediaType.imageJPG,
            [FileMetaKey.KEY_FILE_SIZE]: image.size,
          }
        }
      }));
    }
  }

  const sendCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      })

  };
  //changeWeight
  const openGallery = () => {
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      includeBase64: false,
      cropping: false,
      multiple: false,
      mediaType: "photo",
    }).then(async (image) => {
        await uploadImage(image);
      }
    ).catch((error) => {
      console.log(error);
    });
  };
  const openCamera = () => {
    ImagePicker.openCamera({
      // width: 300,
      // height: 400,
      includeBase64: false,
      cropping: false,
      multiple: false,
      mediaType: "photo",
    }).then(async (image) => {
      await uploadImage(image);
    }).catch((error) => {
      console.log(error);
    });
  };
  const openFile = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      })
      console.log(res);
      if (res.length > 0) {
        const responseFile = res[0];


        const photo = {
          uri: responseFile.uri,
          type: responseFile.type,
          name: responseFile.name,
        };
        let formData = new FormData();
        formData.append("file", photo);

        console.log(formData);

        const response = await appOperation.customer.updatePhotoPass(formData);
        console.log('Response:::::', response?.data?.file)
        if (response?.data?.file && roomData != null && loggedInUser != null) {
          store.dispatch(wsSendMessage({
            "request": REQUEST_MESSAGE,
            "type": TYPE_ADD_MESSAGE,
            "roomId": roomData._id,
            "room": roomData._id,
            "message": "",
            "message_type": MESSAGE_TYPE_DOCUMENT,
            "media": "",
            "receiver_id": roomData.userList[0],

            "sender_id": loggedInUser.userId.toString(),
            "message_content": {
              "file_url": appOperation.getMediaUrl(response?.data?.file),
              "file_meta": {
                [FileMetaKey.KEY_FILE_MIME]: responseFile.type,
                [FileMetaKey.KEY_FILE_TYPE]: MediaType.fileFile,
                [FileMetaKey.KEY_FILE_SIZE]: responseFile.size,
              }
            }
          }));
        }

      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "SuperMe App Camera Permission",
          message:
            "SuperMe App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openCamera();
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };


  console.log("roomData===============", roomData);


  const handleContact = (contact: ContactContent) => {
    const newPerson = {
      familyName: contact.last_name,
      givenName: contact.first_name,
      middleName: contact.middle_name,

      phoneNumbers: [{
        label: 'mobile',
        number: contact.mobile,
      }],
    };

    Contacts.openContactForm(newPerson).then(contact => {
      // contact has been saved
    })
  }

  const openContactList = () => {
    // navigation.navigate("ContactsScreen");

    if (roomData != null && loggedInUser != null) {
      const contactData = {
        "request": REQUEST_MESSAGE,
        "type": TYPE_ADD_MESSAGE,
        "roomId": roomData._id,
        "room": roomData._id,
        "message": "",
        "message_type": MESSAGE_TYPE_CONTACT,
        "media": "",
        "receiver_id": roomData.userList[0],

        "sender_id": loggedInUser.userId.toString(),
        "message_content": {
          "mobile": "(555) 564-8583",
          "first_name": "Kate",
          "middle_name": "",
          "last_name": "Bell"
        }
      }
      store.dispatch(wsSendMessage(
        contactData
      ));
    }
  }


  /*const downloadFile = async (file: FileContent) => {
    console.log(file.file_url);

    var filename = file.file_url.replace(/^.*[\\\/]/, '');
    var destinationPath = `${RNBackgroundDownloader.directories.documents}/${filename}`;
    console.log('filename', filename);


    let task = RNBackgroundDownloader.download({
      id: filename,
      url: file.file_url,
      destination: destinationPath
    }).begin((expectedBytes) => {
      console.log(`Going to download ${expectedBytes} bytes!`);
    }).progress((percent) => {
      console.log(`Downloaded: ${percent * 100}%`);
    }).done(() => {
      console.log('Download is done!', destinationPath);
    }).error((error) => {
      console.log('Download canceled due to error: ', error);
    });

    // Pause the task
    // task.pause();

    // // Resume after pause
    // task.resume();

    // // Cancel the task
    // task.stop();

  }*/

  const renderMessage = ({item}: { item: MessageModel }) => {

    if (loggedInUser && item.sender_id.toString() == loggedInUser.userId.toString()) { // send my me
      switch (item.message_type) {
        case MESSAGE_TYPE_IMAGE:
          let messageContent = (item.message_content ?? mediaFake) as FileContent;
          return (

            <View
              style={{paddingVertical: 5, alignItems: "flex-end"}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{}}>
                <View style={{
                  height: 100, width: 100,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: 'lightgreen',
                  overflow: 'hidden',
                }}>
                  <Image
                    source={{uri: messageContent.file_url}}
                    style={{flex: 1}}/>
                </View>

              </TouchableOpacity>
            </View>

          )

        case MESSAGE_TYPE_CONTACT:
          let contactContent = (item.message_content ?? contactFake) as ContactContent;

          return (
            <View
              style={{
                paddingVertical: 5,
                alignItems: "flex-end",
              }}>
              <TouchableOpacity activeOpacity={0.8}
                                onPress={() => handleContact(contactContent)}>
                <View
                  style={{
                    borderRadius: 4,
                    backgroundColor: 'lightgreen',
                  }}>
                  <Text style={{
                    color: "black",

                    padding: 5,
                  }}>
                    {`${contactContent.first_name} ${contactContent.middle_name} ${contactContent.last_name}`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )

        case MESSAGE_TYPE_LOCATION:
          let locationContent = (item.message_content ?? locationFake) as LocationContent;
          return (
            <View
              style={{
                paddingVertical: 5,
                alignItems: "flex-end",
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  openMap({
                    latitude: parseFloat(locationContent.latitude),
                    longitude: parseFloat(locationContent.longitude)
                  });
                }}>
                <View
                  style={{
                    borderRadius: 4,
                    backgroundColor: 'lightgreen',
                  }}>
                  <Text style={{
                    color: "black",
                    padding: 5,
                  }}>
                    {locationContent.name}
                    {'\n'}
                    {locationContent.address}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )

        /*case MESSAGE_TYPE_DOCUMENT:
          let documentContent = (item.message_content ?? locationFake) as FileContent;
          const filename = documentContent.file_url.replace(/^.*[\\\/]/, '');
          if(tasks[filename] != null){
            var task = tasks[filename];
            task.progress((percent) => {
              console.log(`Downloaded: ${percent * 100}%`);
            }).done(() => {
              console.log('Download is done!');
            }).error((error) => {
              console.log('Download canceled due to error: ', error);
            })
          }
          return (
            <View
              style={{
                paddingVertical: 5,
                alignItems: "flex-end",
              }}>
              <TouchableOpacity activeOpacity={0.8}
                onPress={() => {
                  downloadFile(documentContent);
                  /!* const pathx = FileViewer.open(documentContent.file_url) // absolute-path-to-my-local-file.
                    .then(() => {
                      console.log('File is opened');

                    })
                    .catch((error) => {
                      console.log('Error opening file', error);
                    }); *!/
                }}>
                <View
                  style={{
                    borderRadius: 4,
                    backgroundColor: 'lightgreen',
                  }}>
                  <Text style={{
                    color: "black",

                    padding: 5,
                  }}>

                    {'File \n'}
                    {documentContent.file_meta.file_type}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )*/

        case MESSAGE_TYPE_DOCUMENT:
          console.log('MESSAGE_TYPE_DOCUMENT')
          let documentContent = (item.message_content ?? locationFake) as FileContent;
          const filename = documentContent.file_url.replace(/^.*[\\\/]/, '');

          return (
            <RightDocument
              task={tasks[filename]}
              item={item}
              downloadFile={downloadFile}
            />
          )
        default:
          return (
            <View
              style={{
                paddingVertical: 5,
                alignItems: "flex-end",
              }}>

              <View
                style={{
                  borderRadius: 4,
                  backgroundColor: 'lightgreen',
                }}>
                {/* <Text style={{color: "black", padding: 5,}}>
                  {item.message}
                </Text>*/}

                <LinkableText
                  readMoreOption={false}
                  text={item.message}
                />
                <Text>{moment(item.time).format('HH:mm:ss')}</Text>
              </View>
            </View>
          )
      }
    } else {
      switch (item.message_type) {
        case MESSAGE_TYPE_IMAGE:
          let messageContent = (item.message_content ?? mediaFake) as FileContent;
          return (

            <View
              style={{paddingVertical: 5}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{}}>
                <View style={{
                  height: 100, width: 100,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: 'skyblue',
                  overflow: 'hidden',
                }}>
                  <Image
                    source={{uri: messageContent.file_url}}
                    style={{flex: 1}}/>
                </View>

              </TouchableOpacity>
            </View>

          )

        case MESSAGE_TYPE_CONTACT:
          let contactContent = (item.message_content ?? contactFake) as ContactContent;
          return (
            <TouchableOpacity
              style={{paddingVertical: 5}}
              onPress={() => handleContact(contactContent)}>
              <Text style={{
                color: "black",
                backgroundColor: "lightgreen",
                padding: 5,
                textAlign: "right",
              }}>
                {contactContent.first_name}
                {contactContent.mobile}
              </Text>
            </TouchableOpacity>
          )


        case MESSAGE_TYPE_LOCATION:
          let locationContent = (item.message_content ?? locationFake) as LocationContent;
          return (
            <View
              style={{paddingVertical: 5}}>
              <TouchableOpacity activeOpacity={0.8}
                                onPress={() => {
                                  openMap({
                                    latitude: parseFloat(locationContent.latitude),
                                    longitude: parseFloat(locationContent.longitude)
                                  });
                                }}>
                <View
                  style={{
                    borderRadius: 4,
                    backgroundColor: 'lightgreen',
                  }}>
                  <Text style={{
                    color: "black",

                    padding: 5,
                  }}>
                    {locationContent.name}
                    {'\n'}
                    {locationContent.address}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        case MESSAGE_TYPE_DOCUMENT:
          let documentContent = (item.message_content ?? locationFake) as FileContent;
          return (
            <View
              style={{
                paddingVertical: 5,
                alignItems: "flex-start",
              }}>
              <TouchableOpacity activeOpacity={0.8}
                                onPress={() => {

                                }}>
                <View
                  style={{
                    borderRadius: 4,
                    backgroundColor: 'skyblue',
                  }}>
                  <Text style={{
                    color: "black",

                    padding: 5,
                  }}>

                    {'File \n'}
                    {documentContent.file_meta.file_type}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        default:
          return (
            <View
              style={{
                paddingVertical: 5,
                alignItems: "flex-start",
              }}>

              <View
                style={{
                  borderRadius: 4,
                  backgroundColor: 'skyblue',
                }}>
                {/*<Text style={{color: "black", padding: 5,}}>
                  {item.message}
                </Text>*/}
                <LinkableText
                  readMoreOption
                  text={item.message}
                  numberOfLines={4}
                />
                <Text>{moment(item.time).format('HH:mm:ss')}</Text>
              </View>

            </View>
          )
      }
    }

  }

  function chatDetailsView(chatUserDetail: UserList) {
    return <View>
      <FastImage
        source={{uri: chatUserDetail.profile_pic}}
        resizeMode={FastImage.resizeMode.contain}
        style={{height: 20, width: 20, borderRadius: 4}}/>
      <Text style={{color: "black", fontWeight: "bold"}}>
        {`${chatUserDetail.firstName}`}
      </Text>
      <Text style={{color: "black"}}>
        {chatUserDetail.is_online ? 'Online' : `Last Seen: ${chatUserDetail.last_seen}`}
      </Text>
    </View>;
  }

  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const onContentOffsetChanged = (distanceFromTop: number) => {
    if (distanceFromTop === 0 && !messagesLoading) {
      console.log('onContentOffsetChanged', {distanceFromTop});
      setCurrentVisibleIndex(messagesList.length);
      loadNext();
    }
  }
  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onContentOffsetChanged(event.nativeEvent.contentOffset.y)
    const {
      nativeEvent: {
        contentOffset: {y: contentOffsetY},
        contentSize: {height: contentSizeHeight},
        layoutMeasurement: {height: layoutMeasurementHeight},
      },
    } = event;

    if (contentOffsetY < scrollToBottomOffset &&
      contentSizeHeight - layoutMeasurementHeight > scrollToBottomOffset) {
      setShowScrollBottom(true);
    } else {
      setShowScrollBottom(false);
    }

  };
  const onEndReached = ({distanceFromEnd}: { distanceFromEnd: number; }) => {
    // if (distanceFromEnd > 0 &&
    //   distanceFromEnd <= 100) {
    //   loadNext();
    // }
  };
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {
          navigation.goBack();
        }}><Text style={{color: "black", fontWeight: "bold", marginVertical: 10}}>
          BACK
        </Text></TouchableOpacity>
        <View style={styles.flatListContainer}>
          {(chatUserDetail != null) && chatDetailsView(chatUserDetail)}

          <FlatList
            ref={(r2Ref: FlatList<MessageModel> | null) => listRef.current = r2Ref}
            keyExtractor={(item, index) => item._id}
            // initialNumToRender={20000}
            initialNumToRender={20}
            extraData={`${messagesList?.length}-${timeStamp}`}
            renderItem={renderMessage}

            // onEndReached={() => {
            //   loadNext();
            // }}

            onEndReached={onEndReached}
            // onEndReachedThreshold={0.1}
            data={messagesList}
            onScroll={handleOnScroll}
            scrollEventThrottle={100}

          />
        </View>


        <View style={styles.subContainer}>

          <View style={[styles.inputBox, {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }]}>
            <TextInput
              value={message}
              placeholder={"Type your message here"}
              onChangeText={(text) => {
                setMessage(text);
              }}
              style={{flex: 1}}

            />


            <TouchableOpacity onPress={() => {
              sendCurrentLocation();
            }} style={{marginLeft: 10}}>
              <Text style={styles.buttonTitle}>
                📍
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setShowDialog(true);
            }} style={{marginLeft: 10}}>
              <Text style={styles.buttonTitle}>
                📷
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              openContactList();
            }} style={{marginLeft: 10}}>
              <Text style={styles.buttonTitle}>
                📱
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              openFile();
            }} style={{marginLeft: 10}}>
              <Text style={styles.buttonTitle}>
                📁
              </Text>
            </TouchableOpacity>
          </View>


          <TouchableOpacity disabled={!roomData} onPress={() => message != "" && onSubmit()}
                            style={[styles.inputBox, {backgroundColor: "#00000080", marginTop: 10}]}>
            <Text style={styles.buttonTitle}>
              Send
            </Text>
          </TouchableOpacity>
        </View>


      </View>


      <AppConfirmDialog
        title="Add Image"
        message="Please select picture."
        visible={showDialog}
        onTouchOutside={() => {
          setShowDialog(false);
        }}
        positiveButton={{
          title: "Open Gallery",
          onPress: () => {
            setShowDialog(false);
            setTimeout(() => {
              if (Platform.OS === "android") {
                openGallery();
              } else {
                openGallery();
              }
            }, 500);
          },
        }}
        negativeButton={{
          title: "Open Camera",
          onPress: () => {
            setShowDialog(false);
            setTimeout(() => {
              if (Platform.OS === "android") {
                requestCameraPermission();
              } else {
                openCamera();
              }
            }, 500);
          },
        }}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: "column", padding: 15},
  flatListContainer: {flex: 1, flexDirection: "column", padding: 15},

  subContainer: {marginTop: 10, marginEnd: 15, marginStart: 15},
  label: {marginTop: 10},
  inputBox: {
    height: 50,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitle: {color: "#ffffff", fontSize: 20},
  header: {}
});


export default (ChatScreen);
