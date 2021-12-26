import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {wsGetAllRooms} from "../modules/websocket";
import {REQUEST_ALL_ROOMS, REQUEST_ROOM} from "../components/const";
import {ReducerRoot, RoomList, UserList} from "../type";

export const useRoom = () => {
  const loggedInUser = useSelector<ReducerRoot, UserList | null | undefined>(state => state.reducer.loggedInUser);
  const allRoomsData: RoomList[] | null | undefined = useSelector<ReducerRoot, RoomList[] | null | undefined>(state =>
    state.reducer?.allRoomsData
  );
  const usersList: UserList[] | null | undefined = useSelector<ReducerRoot, UserList[] | null | undefined>(state =>
    state.reducer?.userList
  );

  console.log('SHubham::: allRoomsData', allRoomsData);
  // const allUserList = useSelector(state =>
  //   state.reducer.userList ? state.reducer.userList : []
  // );


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      wsGetAllRooms({
        request: REQUEST_ROOM,
        type: REQUEST_ALL_ROOMS,
        userList: [loggedInUser?.userId]
      })
    );
    console.log("loggedInUser-------------", loggedInUser);
  }, [loggedInUser]);

  return {roomsList: allRoomsData, usersList: usersList};
};
