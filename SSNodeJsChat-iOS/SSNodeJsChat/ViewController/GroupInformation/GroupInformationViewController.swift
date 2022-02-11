//
//  GroupInformationViewController.swift
//  SSNodeJsChat
//
//  Created by Shubham Sharma on 13/01/22.
//

import UIKit

enum GroupInfoType {
    case info
    case users
}
class GroupInformationModel {
    var type: GroupInfoType = .info
    var data: [Any] = []
    init(type: GroupInfoType, data: [Any]) {
        self.type = type
        self.data = data
    }
}

class GroupInformationViewController: UIViewController {
    
    @IBOutlet weak var rootView: UIView!
    @IBOutlet weak var tableView: UITableView!
    
    fileprivate var tableItems = [GroupInformationModel]()
    fileprivate let imageView = UIImageView()
    
    var roomInfo: ChatRoomModel?
    
    override func viewWillAppear(_ animated: Bool) {
        
        
        tableItems.append(GroupInformationModel(type: .info, data: [roomInfo!]))
        tableItems.append(GroupInformationModel(type: .users, data: Array<UserDetailsModel>()))
        
        
        
        
        initCollection()
        let json: [String: Any] = ["request":"users", "type": "allUsers"]
        if let jsonString: NSString = JsonOperation.toJsonStringFrom(dictionary: json) {
            SocketManager.shared.sendMessageToSocket(message: jsonString as String)
        }
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let editButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonItem.SystemItem.compose, target: self, action: #selector(onClickedToolBarCreateGroup(sender:)))
        navigationItem.rightBarButtonItems = [editButton]
        title = "Room Info"
        
        SocketManager.shared.registerToScoket(observer: self)
        
        
        //        tableView.estimatedRowHeight = 50
        tableView.contentInset = UIEdgeInsets(top: 100, left: 0, bottom: 0, right: 0)
        
        imageView.frame = CGRect(x: 0, y: 0, width: UIScreen.main.bounds.size.width, height: 300)
        imageView.image = UIImage.init(named: "ic_placeholder_profile")
        imageView.contentMode = .scaleAspectFill
        imageView.clipsToBounds = true
        rootView.addSubview(imageView)
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
    
    @objc func onClickedToolBarCreateGroup(sender: AnyObject) {
//        let vc = AllUserListViewController()
//        vc.isSelectedGroup = true
//        self.navigationController?.pushViewController(vc, animated: true)
        
        
        let alertController = UIAlertController(title: "Action" , message: "", preferredStyle: .actionSheet)
        let editButton = UIAlertAction(title: "Exit Group", style: .default, handler: { (action) -> Void in
             
            
            let json: [String: Any] = ["type": "removeUser",
                                       "userId": LoginUserModel.shared.userId,
                                       "roomId": self.roomInfo?.id,
                                       "request":"room",
                                       "room_type": "group",
                                      
            ]
            if let jsonString: NSString = JsonOperation.toJsonStringFrom(dictionary: json) {
                print(jsonString)
                SocketManager.shared.sendMessageToSocket(message: jsonString as String)
            }
          
        })
        
        //                alertController.addAction(deleteButton)
        alertController.addAction(editButton)
        
        
        let cancelButton = UIAlertAction(title: "Cancel" , style: .cancel, handler: { (action) -> Void in
        })
        
        
        alertController.addAction(cancelButton)
        
        self.present(alertController, animated: true, completion: nil)
    }
    func openNameDialog() {
        alertWithTextField(title: "Group Name", message: "Enter group name", placeholder: "eg: My Group") { result in
            if (result.isEmpty) {
                //                self.openNameDialog()
            } else {
                
                var users = (self.tableItems[1].data as!  [UserDetailsModel]).map { element in
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
extension GroupInformationViewController: UITableViewDelegate, UITableViewDataSource {
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return self.tableItems.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        print("rowwww count", tableItems.count)
        return tableItems[section].data.count
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 83
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let indexItem: GroupInformationModel = tableItems[indexPath.section]
        switch indexItem.type {
        case .info:
            let rowIndexItem = indexItem.data[indexPath.row] as! ChatRoomModel
            let identifier = "GroupInfoRowTableViewCell"
            var cell: GroupInfoRowTableViewCell! = tableView.dequeueReusableCell(withIdentifier: identifier) as? GroupInfoRowTableViewCell
            if cell == nil {
                tableView.register(UINib(nibName: identifier, bundle: nil), forCellReuseIdentifier: identifier)
                cell = tableView.dequeueReusableCell(withIdentifier: identifier) as? GroupInfoRowTableViewCell
            }
            cell.configData(obj: "\(rowIndexItem.groupDetail?.groupName ?? "") \(rowIndexItem.create_time)")
            return cell
        case .users:
            let rowIndexItem = indexItem.data[indexPath.row] as! UserDetailsModel
            let identifier = "UserTableViewCell"
            var cell: UserTableViewCell! = tableView.dequeueReusableCell(withIdentifier: identifier) as? UserTableViewCell
            if cell == nil {
                tableView.register(UINib(nibName: identifier, bundle: nil), forCellReuseIdentifier: identifier)
                cell = tableView.dequeueReusableCell(withIdentifier: identifier) as? UserTableViewCell
            }
            cell.configData(obj: rowIndexItem, isSelectedGroup: false)
            return cell
        }
    }
    
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        
    }
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let y = 300 - (scrollView.contentOffset.y + 300)
        let height = min(max(y, 60), 400)
        imageView.frame = CGRect(x: 0, y: 0, width: UIScreen.main.bounds.size.width, height: height)
    }
}



// MARK: - WebSocketDelegate
extension GroupInformationViewController: SocketObserver {
    func registerFor() -> [ResponseType] {
        return [.allUsers, .createRoom]
    }
    
    func brodcastSocketMessage(to observerWithIdentifire: ResponseType, statusCode: Int, data: [String : Any], message: String) {
        print(data)
        
        if observerWithIdentifire == .allUsers {
            if let data = data["data"] as? [[String: Any]] {
                
                var tempList = UserDetailsModel.giveList(list: data)
                ///Exclude Login user
                tempList = tempList.filter({ (element) -> Bool in
                    return element.userId != LoginUserModel.shared.userId
                })
                tableItems[1].data = tempList
                self.tableView.reloadData()
            }
        }
        
    }
    
    func socketConnection(status: SocketConectionStatus) {
        
    }
    
}
