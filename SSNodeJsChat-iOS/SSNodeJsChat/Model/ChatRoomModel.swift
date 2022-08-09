//
//  ChatRoomModel.swift
//  SSNodeJsChat
//
//  Created by Shubham Sharma on 05/02/19.
//  Copyright © 2019 Shubham Sharma. All rights reserved.
//

import Foundation

class ChatRoomModel {
    
    var id: String = ""
    var isGroup: Bool = false
    
    var last_message: String = ""
    var last_message_time: String = ""
    var create_time: String = ""
    
    var groupDetail: GroupModel?
//    var individualDetail: UserDetailsModel?
    var individualUserId: String = ""
    var usersList: [String] = []
    
    
    static func giveList(list: [[String:Any]]) -> [ChatRoomModel] {
        var couponsArray = [ChatRoomModel]()
        for cdic in list {
            couponsArray.append(ChatRoomModel(disc: cdic))
        }
        return couponsArray
    }
    init(disc: [String: Any]) {
        id = disc["_id"] as? String ?? ""
        
        let tmpUsers = disc["users"] as? [String: Bool] ?? [:]
        
        last_message = disc["last_message"] as? String ?? ""
        last_message_time = disc["last_message_time"] as? String ?? ""
        create_time = disc["create_time"] as? String ?? ""
        isGroup = (disc["type"] as? String ?? "individual") == "group"
        
        if isGroup {
            groupDetail = GroupModel(disc: disc["group_details"]  as? [String : Any] ?? [:])
        }
        
        
        
        
        let users: [String] = Array(tmpUsers.keys)
        usersList = users
        
//        individualDetail = IndividualModel(disc: [:])
//        let user: [String] = users.filter({ (element) -> Bool in
//            return element != userId
//        })
        if let user: String = (users.first { (element) -> Bool in
            return element != LoginUserModel.shared.userId
        }) {
//            let userModel: UserDetailsModel? = RoomListViewController.userDetailsList.first { (element) -> Bool in
//                return user == element.userId
//            }
            
//            if let userDetails = RoomListViewController.userDetailsList[user]{
//                individualDetail = userDetails
//            }
//
            individualUserId = user
           
        }
        
       
    }
    
    
}
@objcMembers
class GroupModel: NSObject {
    
    var groupName: String = "Sample"
    var groupDesciprion: String = "Sample"
    var groupIcon: String = "Sample"
    
    
    init(disc: [String: Any]) {
        groupName = disc["group_name"] as? String ?? ""
        groupDesciprion = disc["about_group"] as? String ?? ""
        groupIcon = disc["about_pic"] as? String ?? ""
    }
}

@objcMembers
class IndividualModel: NSObject {
    
    var userData: UserDetailsModel?
    
    
    
    init(disc: [String:Any]) {
        
    }
}

@objcMembers
class ReceiverDetail: NSObject {
    var gender:String = ""
    var id:NSNumber = 0
    var location:String = ""
    var profile_picture:String = ""
    var role:String = ""
    var title:String = ""
    var username:String = "asdasd"
    
    static func giveList(list:[[String:Any]]) -> [ReceiverDetail] {
        var couponsArray = [ReceiverDetail]()
        for cdic in list {
            couponsArray.append(giveObj(cdic: cdic))
        }
        return couponsArray
    }
    static func giveObj(cdic:[String:Any]) -> ReceiverDetail{
        let resObj = ReceiverDetail()
        resObj.id = cdic["id"]! as! NSNumber
        
        resObj.profile_picture = cdic["profile_picture"]! as! String
        resObj.title = cdic["title"]! as! String
        resObj.username = cdic["username"]! as! String
        resObj.location = cdic["location"]! as! String
        resObj.role = cdic["role"]! as! String
        resObj.gender = cdic["gender"]! as! String
        return resObj
    }
}





@objcMembers
public class UserDetailsModel: NSObject {
    var userName: String = ""
    var id: String = ""
    var userId: String = ""
    var firstName: String = ""
    var email: String = ""
    var profile_pic: String = ""
    var last_seen: String = ""
    var is_online: Bool = false
    
    var isSelectedForGroup: Bool = false
    
     
    static func giveList(list: [[String:Any]]) -> [UserDetailsModel] {
        var couponsArray = [UserDetailsModel]()
        for cdic in list {
            couponsArray.append(giveObj(cdic: cdic))
        }
        return couponsArray
    }
    static func giveObj(cdic:[String:Any]) -> UserDetailsModel {
        let resObj = UserDetailsModel()
        
        resObj.userName = cdic["userName"] as? String ?? ""
        
        resObj.id = cdic["_id"] as? String ?? ""
        resObj.userId = "\(cdic["userId"] as? Int ?? 0)"
        resObj.firstName = cdic["firstName"] as? String ?? ""
        resObj.email = cdic["email"] as? String ?? ""
        resObj.profile_pic = cdic["profile_pic"] as? String ?? ""
        resObj.last_seen = cdic["last_seen"] as? String ?? ""
        
        resObj.is_online = cdic["is_online"] as? Bool ?? false
        
        
        
        return resObj
    }
}
