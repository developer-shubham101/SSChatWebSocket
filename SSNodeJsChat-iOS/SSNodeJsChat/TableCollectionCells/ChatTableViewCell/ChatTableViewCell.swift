//
//  ChatTableViewCell.swift
//  SSNodeJsChat
//
//  Created by Shubham Sharma on 27/12/18.
//  Copyright © 2018 Shubham Sharma. All rights reserved.
//

import UIKit
import SDWebImage

class ChatTableViewCell: UITableViewCell {
    
    @IBOutlet weak var profilePic: UIImageView!
    @IBOutlet weak var username: UILabel!
    @IBOutlet weak var lastMessage: UILabel!
    @IBOutlet weak var messageTime: UILabel!
    @IBOutlet weak var rootVIew: UIView!

    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    func configData(obj: ChatRoomModel) {
        if obj.isGroup {
            if let groupDetail: GroupModel =  obj.groupDetail {
                username.text = groupDetail.groupName
//                rootVIew.backgroundColor = individualDetail.is_online ? .systemGreen : .systemRed
                
                profilePic.sd_setImage(with: URL(string: groupDetail.groupIcon), completed: { (image, error, cache, url) in
                    if ((error) != nil) {
                        self.profilePic.image = UIImage(named: "ic_placeholder_profile")
                    }
                })
            }
        }else{
            if let individualDetail: UserDetailsModel = RoomListViewController.userDetailsList[obj.individualUserId] {
                username.text = "\(individualDetail.firstName)\n\(individualDetail.userName)"
                rootVIew.backgroundColor = individualDetail.is_online ? .systemGreen : .systemRed
                
                profilePic.sd_setImage(with: URL(string: individualDetail.profile_pic), completed: { (image, error, cache, url) in
                    if ((error) != nil) {
                        self.profilePic.image = UIImage(named: "ic_placeholder_profile")
                    }
                })
            }
        }
        
        
        //2021-04-25T18:05:05.080Z
        print("ChatTableViewCell:: \(obj.last_message_time)")
        
        lastMessage.text = obj.last_message
        
        if let date = obj.last_message_time.toDate(format: "yyyy-MM-dd'T'HH:mm:ss.SSSX") {
            messageTime.text = date.elapsedInterval
        }
       
       
    }
}
