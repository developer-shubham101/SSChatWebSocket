//
//  LeftLocationTableViewCell.swift
//  SSNodeJsChat
//
//  Created by Shubham Sharma on 01/03/19.
//  Copyright © 2019 Shubham Sharma. All rights reserved.
//

import UIKit

class LeftLocationTableViewCell: UITableViewCell {
	@IBOutlet weak var locationName: UILabel!
	@IBOutlet weak var time: UILabel!
	@IBOutlet weak var location: UILabel!
	override func awakeFromNib() {
		super.awakeFromNib()
		// Initialization code
	}
	
	override func setSelected(_ selected: Bool, animated: Bool) {
		super.setSelected(selected, animated: animated)
		
		// Configure the view for the selected state
	}
    func configData(obj: ChatModel, isGroup: Bool){
        if isGroup {
            time.text = "By: \(obj.sender_detail.firstName) (\(obj.message_on))"
        } else {
            time.text = obj.message_on
        }
		
		if let locationModel: LocationModel = obj.message_content as? LocationModel {
			locationName.text = locationModel.name
			location.text = locationModel.address
		}
	}
}
