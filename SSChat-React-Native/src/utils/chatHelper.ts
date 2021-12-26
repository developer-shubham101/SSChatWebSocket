import {MessageModel} from "../type";
import moment from "moment";


export const groupArrayOfObjectsOld = (list: [MessageModel] | null | undefined): { data: [MessageModel], title: string }[] => {
  if (list != null) {
    let sortList = list.sort((obj1: MessageModel, obj2: MessageModel) => {
      return moment(obj2.time, "YYYY-MM-DD").diff(moment(obj2.time, "YYYY-MM-DD"));
    }).reverse();
    console.log('sortList', {sortList});
    let newList: { [key: string]: [MessageModel] } = {};
    for (let i = 0; i < sortList.length; i++) { //list[i].time.toString(); //
      const date = moment(sortList[i].time).format("YYYY-MM-DD");

      if (!newList[date]) {
        newList[date] = [];
      }
      newList[date].push(sortList[i]);
    }
    return Object.keys(newList).sort((obj1: string, obj2: string) => {
      return moment(obj1, "YYYY-MM-DD").diff(moment(obj2, "YYYY-MM-DD"));
    }).map((date) => {
      return {title: date, data: newList[date]};
    });
  }
  return [];
};


export const groupArrayOfObjects = (list: [MessageModel] | null | undefined): MessageModel[] => {
  if (list != null) {
    let sortList = list.sort((obj1: MessageModel, obj2: MessageModel) => {
      return moment(obj1.time).diff(moment(obj2.time));
    })/*.reverse()*/;
    console.log('sortList', {sortList});

    return sortList;
  }
  return [];
};
