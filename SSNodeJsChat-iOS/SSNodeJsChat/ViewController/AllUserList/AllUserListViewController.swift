//
//  AllUserListViewController.swift
//  SSNodeJsChat
//
//  Created by Shubham Sharma on 24/01/21.
//

import UIKit
import Starscream

enum GroupType {
    case group
    case individual
    case addMenber
}

class AllUserListViewController: AppViewController{
    
    
    @IBOutlet weak var tableView: UITableView!
    
    fileprivate var tableItems: [UserDetailsModel] = []
    var groupType: GroupType = .individual
    var callback: (([String]) -> Void)?
    
    override func viewWillAppear(_ animated: Bool) {
        initCollection()
        let json: [String: Any] = ["request":"users","type": "allUsers"]
        if let jsonString: NSString = JsonOperation.toJsonStringFrom(dictionary: json) {
            SocketManager.shared.sendMessageToSocket(message: jsonString as String)
        }
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        switch(groupType) {
        case .individual :
            let editButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonItem.SystemItem.compose, target: self, action: #selector(onClickedToolBarCreateGroup(sender:)))
            navigationItem.rightBarButtonItems = [editButton]
            title = "Start Chat With"
            break
            
        case .group :
            let editButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonItem.SystemItem.save, target: self, action: #selector(onClickedToolbeltButton(sender:)))
            navigationItem.rightBarButtonItems = [editButton]
            title = "Create New Room"
            break
            
        case .addMenber:
            let editButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonItem.SystemItem.save, target: self, action: #selector(onClickedToolbeltAddMember(sender:)))
            navigationItem.rightBarButtonItems = [editButton]
            title = "Add New Members"
            break
        }
        
       
        
        SocketManager.shared.registerToScoket(observer: self)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        SocketManager.shared.unregisterToSocket(observer: self)
    }
    
    func initCollection() {
        tableView.delegate = self
        tableView.dataSource = self
    }
    
    deinit {
        print("deinit Called:: AllUserListViewController ")
    }
    
    fileprivate func getChatRoomList() {
        //        NetworkManager.getChatRoomList() { (success, res) in
        //            self.viewloader?.removeFromSuperview()
        //            if let response:[String:Any] = res as? [String:Any]{
        //                let isSuccess:Int = response["code"] as! Int
        //                if(isSuccess == 200){
        //                    let data = response["data"] as! [[String:Any]]
        //                    self.tableItems = ChatRomModel.giveList(list: data )
        //                    self.tableView.reloadData()
        //
        //                } else if(isSuccess == 500){
        //                    self.showAlertWithMessage(message: response["message"] as! String)
        //                }
        //            }else if let response: String  = res as? String {
        //                self.showAlertWithMessage(message: response)
        //            }
        //        }
    }
    @IBAction func notification(_ sender: Any) {
        //        let vc = self.storyboard?.instantiateViewController(withIdentifier: "NotificationViewController") as! NotificationViewController
        //        self.navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc func onClickedToolbeltButton(sender: AnyObject) {
        openNameDialog()
    }
    
    
    @objc func onClickedToolbeltAddMember(sender: AnyObject) {
        if let tmpCallback = callback {
            let users = self.tableItems.filter({ element in
                return element.isSelectedForGroup
            }).map { element in
                return element.userId
            }
            tmpCallback(users)
        }
    }
    
    @objc func onClickedToolBarCreateGroup(sender: AnyObject) {
        let vc = AllUserListViewController()
        vc.groupType = .group
        self.navigationController?.pushViewController(vc, animated: true)
    }
    func openNameDialog() {
        alertWithTextField(title: "Group Name", message: "Enter group name", placeholder: "eg: My Group") { result in
            if (result.isEmpty) {
//                self.openNameDialog()
            } else {
                
                var users = self.tableItems.filter({ element in
                    return element.isSelectedForGroup
                }).map { element in
                    return element.userId
                }
                users.append(LoginUserModel.shared.userId)
                
                let groupDetails: [String: Any] = [
                    "group_name": result,
                    "about_group": "This is Just a Sample Group"
                ]
                
                let json: [String: Any] = ["type": "createRoom",
                                           "userList": users,
                                           "createBy": LoginUserModel.shared.userId,
                                           "request":"room",
                                           "room_type": "group",
                                           "group_details": groupDetails
                ]
                if let jsonString: NSString = JsonOperation.toJsonStringFrom(dictionary: json) {
                    print(jsonString)
                    SocketManager.shared.sendMessageToSocket(message: jsonString as String)
                }
                
            }
        }
    }
    
}
extension AllUserListViewController: UITableViewDelegate, UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        print("rowwww count", tableItems.count)
        return tableItems.count
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 83
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let identifier = "UserTableViewCell"
        var cell: UserTableViewCell! = tableView.dequeueReusableCell(withIdentifier: identifier) as? UserTableViewCell
        if cell == nil {
            tableView.register(UINib(nibName: identifier, bundle: nil), forCellReuseIdentifier: identifier)
            cell = tableView.dequeueReusableCell(withIdentifier: identifier) as? UserTableViewCell
        }
        cell.configData(obj: tableItems[indexPath.row], isSelectedGroup: groupType != .individual)
        return cell
    }
    
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if (groupType == .individual) {
            let json: [String: Any] = ["type": "createRoom",
                                       "userList": [LoginUserModel.shared.userId, tableItems[indexPath.row].userId],
                                       "createBy": LoginUserModel.shared.userId,
                                       "request":"room"]
            if let jsonString: NSString = JsonOperation.toJsonStringFrom(dictionary: json) {
                SocketManager.shared.sendMessageToSocket(message: jsonString as String)
            }
        } else {
            
            tableItems[indexPath.row].isSelectedForGroup = !tableItems[indexPath.row].isSelectedForGroup
            tableView.reloadData()
        }
        
        
        //
        //      let vc:SingleChatViewController = self.storyboard?.instantiateViewController(withIdentifier: "SingleChatViewController") as! SingleChatViewController
        //
        //      vc.roomId = tableItems[indexPath.row].room_number
        //
        //      vc.recName = tableItems[indexPath.row].receiver_detail.username
        //      vc.recImage = tableItems[indexPath.row].receiver_detail.profile_picture
        //
        //
        //    self.navigationController?.pushViewController(vc, animated: true)
        //
        
    }
}



// MARK: - WebSocketDelegate
extension AllUserListViewController:SocketObserver {
    func registerFor() -> [ResponseType] {
        return [.allUsers, .createRoom]
    }
    
    func brodcastSocketMessage(to observerWithIdentifire: ResponseType, statusCode: Int, data: [String : Any], message: String) {
        print(data)
        
        if observerWithIdentifire == .allUsers {
            if let data = data["data"] as? [[String: Any]] {
                
                tableItems = UserDetailsModel.giveList(list: data)
                ///Exclude Login user
                tableItems = tableItems.filter({ (element) -> Bool in
                    return element.userId != LoginUserModel.shared.userId
                })
                self.tableView.reloadData()
            }
        }
        
    }
    
    func socketConnection(status: SocketConectionStatus) {
        
    }
    
}
