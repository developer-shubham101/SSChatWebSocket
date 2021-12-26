import { combineReducers } from "redux";
import { mainReducer } from "../redux/reducer";

const rootReducer = combineReducers({
  reducer: mainReducer,
});

export default rootReducer;
