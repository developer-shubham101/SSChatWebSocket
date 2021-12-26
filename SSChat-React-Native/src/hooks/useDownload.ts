import {useEffect, useState} from "react";
import produce from 'immer';

import RNBackgroundDownloader, {DownloadTask} from 'react-native-background-downloader';
import {FileContent} from "../type";
import {getDownloadDestination} from "../utils/files";

export const useDownload = () => {

    const [tasks, setTasks] = useState<{ [key: string]: DownloadTask }>({});

    const downloadFile = (file: FileContent): DownloadTask => {
        console.log(file.file_url);

        const filename = file.file_url.replace(/^.*[\\\/]/, '');
        const destinationPath = getDownloadDestination(filename);//`${RNBackgroundDownloader.directories.documents}/${filename}`;
        console.log('filename', filename, destinationPath);


        let task: DownloadTask = RNBackgroundDownloader.download({
            id: filename,
            url: file.file_url,
            destination: destinationPath
        }).begin((expectedBytes) => {
            console.log(`Shubham:: Going to download ${expectedBytes} bytes!`);
        }).progress((percent) => {
            console.log(`Downloaded: ${percent * 100}%`);
        }).done(() => {
            console.log('Download is done!', destinationPath);
        }).error((error) => {
            console.log('Download canceled due to error: ', error);
        }) ;


        setTasks(produce(draft => {
            // draft.downloadsData[id].status = newStatus;
            draft[filename] = task;
        }));

        // Pause the task
        // task.pause();

        // // Resume after pause
        // task.resume();

        // // Cancel the task
        // task.stop();

        return task;

    };
    useEffect(() => {

    }, []);

    return {downloadFile, tasks};
};
