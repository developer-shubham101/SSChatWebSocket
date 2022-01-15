export interface ReducerRoot {
    reducer: ReducerMain;
}

export interface ReducerMain {
    allRoomsData: RoomList[] | null | undefined;
    loggedInUser: UserList | null | undefined;
    roomData: RoomList | null | undefined;
    messages: [MessageModel] | null | undefined;
    userList: [UserList] | null | undefined;
    lastMessage: MessageModel | null | undefined;

    allChatLoading: Boolean
}

export interface AllRoomsData {
    roomList: RoomList[];
    userList: UserList[];
}

export interface RoomList {
    userList: string[];
    _id: string;
    users: { [key: string]: boolean };
    group_details: {
        group_name: string;
        group_image: string;
        about_group: string;
    } | undefined;
    type: string;
    last_message_time: Date;
    createBy: string;
    __v: number;
    last_message: string;
    unread: { [key: string]: number };
}

export interface UserList {
    _id: string;
    userName: string;
    password: string;
    userId: string;
    fcm_token: string;
    device_id: string;
    is_online: boolean;
    last_seen: Date;
    firstName: string;
    profile_pic: string;
    __v: number;
}

export interface MessageModel {
    _id: string;
    roomId: string;
    message: string;
    message_type: string;
    media: string;
    receiver_id: string;
    time: Date;
    sender_id: string;
    __v: number;
    timestamp: number;
    message_content?: MessageContent;
}


export interface MessageContent {
}

export interface FileContent extends MessageContent {
    file_url: string;
    file_meta: FileMeta;
}

export interface FileMeta {
    mime_type: string;
    file_type: string;
    file_size: number;
}


export interface LocationContent extends MessageContent {
    latitude: string;
    name: string;
    longitude: string;
    address: string;
}


export interface ContactContent extends MessageContent {
    mobile: string;
    first_name: string;
    middle_name: string;
    last_name: string;
}

export class FileMetaKey {
    static KEY_FILE_MIME = "mime_type"
    static KEY_FILE_TYPE = "file_type"
    static KEY_FILE_NAME = "file_name"
    static KEY_FILE_SIZE = "file_size"
    static KEY_FILE_THUMB = "thumbnail"
}

export class MediaType {
    static imageJPG = "jpg";
    static imagePNG = "png";
    static audioM4A = "m4a";
    static videoMP4 = "mp4";
    static filePDF = "pdf";
    static fileFile = "file";
    static none = ""
}


export class RoomType {
    static individual = "individual";
    static group = "group";

}
