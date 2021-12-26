
import { PermissionsAndroid, Platform } from 'react-native';

export const requestReadContactsPermission = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Contacts',
                    message: 'This app would like to view your contacts.',
                    buttonPositive: 'Ok'
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    } catch (e) {
        return false;
    }
};

export const requestWriteStoragePermission = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'External Storage',
                    message: 'This app would like to write files.',
                    buttonPositive: 'Ok'
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    } catch (e) {
        return false;
    }
};

/* export const requestRecordAudioPermission = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: 'Microphone',
                    message:
                        'This app would like to record audio through your microphone.',
                    buttonPositive: 'Ok'
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        return (
            (await check(PERMISSIONS.IOS.MICROPHONE)) === 'granted' ||
            (await request(PERMISSIONS.IOS.MICROPHONE)) === 'granted'
        );
    } catch (e) {
        return false;
    }
};
 */