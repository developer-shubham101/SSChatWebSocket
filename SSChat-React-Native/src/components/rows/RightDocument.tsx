import {Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {locationFake} from "../../type/fake";
import {FileContent, MessageModel} from "../../type";
import {DownloadTask} from "react-native-background-downloader";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import {getDownloadDestination} from "../../utils/files";

const RightDocument = ({
                           item,
                           task,
                           downloadFile
                       }: {
    item: MessageModel,
    task?: DownloadTask,
    downloadFile?: (file: FileContent) => DownloadTask
}) => {

    let documentContent = (item.message_content ?? locationFake) as FileContent;
    const [percentage, setDownloadPercentage] = useState<number>(0);

    // const filename = documentContent.file_url.replace(/^.*[\\\/]/, '');
    useEffect(() => {
        console.log('Shubham:: RightDocument useEffect');
        if (task != null) {
            task.progress((percent) => {
                setDownloadPercentage(percent * 100);
                console.log(`Shubham:: Downloaded: ${(percent * 100).toFixed(2)}%`);
            }).done(() => {
                setDownloadPercentage(100);
                console.log('Shubham:: Download is done!');
            }).error((error) => {
                console.log('Shubham:: Download canceled due to error: ', error);
            })
        }
    }, [task]);


    const getOnPress = async () => {

        const filename = documentContent.file_url.replace(/^.*[\\\/]/, '');
        const destinationPath = getDownloadDestination(filename);//`${RNBackgroundDownloader.directories.documents}/${filename}`;
        const fileExists = await RNFS.exists(destinationPath);
        console.log('destinationPath', destinationPath);
        if (fileExists) {
            const pathx = FileViewer.open(destinationPath) // absolute-path-to-my-local-file.
                .then(() => {
                    console.log('File is opened');

                })
                .catch((error) => {
                    console.log('Error opening file', error);
                });
        } else {
            downloadFile && downloadFile(documentContent);
        }
    }

    return <View
        style={{
            paddingVertical: 5,
            alignItems: "flex-end",
        }}>
        <TouchableOpacity activeOpacity={0.8}
                          onPress={getOnPress}>
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
                <Text>
                    {`${percentage}%`}
                </Text>
            </View>
        </TouchableOpacity>
    </View>
}

export default RightDocument;
