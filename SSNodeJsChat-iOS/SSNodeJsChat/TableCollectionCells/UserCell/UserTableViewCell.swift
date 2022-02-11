//
//  UserTableViewCell.swift
//  SSNodeJsChat
//
//  Created by Shubham Sharma on 24/01/21.
//

import UIKit

class UserTableViewCell: UITableViewCell {
    
    @IBOutlet weak var profilePic: UIImageView!
    @IBOutlet weak var username: UILabel!
    @IBOutlet weak var otherData: UILabel!
    @IBOutlet weak var selectedUser: UIImageView!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
    func configData(obj: UserDetailsModel, isSelectedGroup: Bool) {
        
        selectedUser.isHidden = !isSelectedGroup
        
        username.text = "\(obj.firstName) (\(obj.userName))"
        
        profilePic.sd_setImage(with: URL(string: obj.profile_pic), completed: { (image, error, cache, url) in
            if ((error) != nil) {
                self.profilePic.image = UIImage(named: "ic_placeholder_profile")
            }
        })
        
        
        selectedUser.image = obj.isSelectedForGroup ? UIImage(named: "ic_check") : UIImage(named: "ic_uncheck")
    }
    
}
