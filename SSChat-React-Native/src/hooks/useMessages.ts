import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {wsGetAllMessages} from "../modules/websocket";
import {REQUEST_ALL_MESSAGES, REQUEST_MESSAGE} from "../components/const";
import {MessageModel, ReducerRoot, RoomList} from "../type";
import {groupArrayOfObjects} from "../utils/chatHelper";
import * as t from "../redux/types";

export const useMessages = () => {
  const LIMIT_OF_ITEMS = 20;

  const sendersMessages = useSelector<ReducerRoot, [MessageModel] | null | undefined>(state => state.reducer.messages);
  const roomData = useSelector<ReducerRoot, RoomList | null | undefined>(state => state.reducer.roomData);
  const loading = useSelector<ReducerRoot, Boolean>(state => state.reducer.allChatLoading);

  const [sectionData, setSectionData] = useState<MessageModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch({type: t.ALL_MESSAGES_LOADING, payload: true});
    roomData ? dispatch(wsGetAllMessages(
      {
        "request": REQUEST_MESSAGE,
        "type": REQUEST_ALL_MESSAGES,
        "room": roomData._id,
        "limit": LIMIT_OF_ITEMS,
        "page": currentPage
      })) : null;

  }, [roomData, currentPage]);


  useEffect(() => {
    setSectionData(groupArrayOfObjects(sendersMessages));
  }, [sendersMessages]);


  // const sectionData = useMemo(() => groupArrayOfObjects(sendersMessages), [sendersMessages]);

  const loadNext = () => {
    console.log('Max::: loadNext');
    setCurrentPage(currentPage + 1);
  };

  return {messagesList: sectionData, loadNext, loading};
};
