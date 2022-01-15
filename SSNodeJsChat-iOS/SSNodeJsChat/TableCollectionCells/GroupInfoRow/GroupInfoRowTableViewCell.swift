//
//  GroupInfoRowTableViewCell.swift
//  SSNodeJsChat
//
//  Created by Emizentech on 15/01/22.
//

import UIKit

class GroupInfoRowTableViewCell: UITableViewCell {
    
    @IBOutlet weak var cellLabel: UILabel!

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    func configData(obj: String) {
        cellLabel.text = obj
    }
}
