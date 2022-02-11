//
//  ProfileViewController.swift
//  SSNodeJsChat
//
//  Created by Shubham Sharma on 17/04/21.
//

import UIKit
import SSViews
import DKImagePickerController
import Photos

class ProfileViewController: AppViewController {
    
    
    @IBOutlet weak var emailField: UITextField!
    @IBOutlet weak var nameField: UITextField!
    @IBOutlet weak var profileImg: SSImageView!
    @IBOutlet weak var uploadMediaProgress: UIStackView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        emailField.text = LoginUserModel.shared.email
        nameField.text = LoginUserModel.shared.name
        
        
        
        profileImg.sd_setImage(with: LoginUserModel.shared.profile_pic.getMediaUrl) { (image, error, cache, url) in
            if error != nil {
                self.profileImg.image = UIImage(named: "ic_placeholder_profile")
            }
        }
        // Do any additional setup after loading the view.
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(self.handleTap(_:)))
        profileImg.addGestureRecognizer(tap)
        profileImg.isUserInteractionEnabled = true
        
        SocketManager.shared.registerToScoket(observer: self )
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        SocketManager.shared.unregisterToSocket(observer: self)
    }
    
    @objc func handleTap(_ sender: UITapGestureRecognizer? = nil) {
        self.photoLibrary(type: UIImagePickerController.SourceType.photoLibrary)
    }
    
    
    
    
    @IBAction func didTapRegister(_ sender: Any) {
        updateProfile()
    }
    
    func updateProfile(profilePic: String? = nil) {
        var messageDictionary = [
            "request": "login",
            "userId": LoginUserModel.shared.userId,
            "type": "updateProfile",
            //            "fcm_token": "qasdfghfds",
            "firstName": nameField.text ?? "",
            //            "password": passwordField.text ?? "",
        ] as [String : Any]
        
        if let tmpProfilePic = profilePic {
            messageDictionary["profile_pic"] = tmpProfilePic
        }
        
        
        let jsonData = try! JSONSerialization.data(withJSONObject: messageDictionary)
        let jsonString = NSString(data: jsonData, encoding: String.Encoding.utf8.rawValue)
        if let message:String = jsonString as String? {
            SocketManager.shared.sendMessageToSocket(message: message)
        }
    }
    
}

//MARK:- image and camera Delegate
extension ProfileViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate{
    func photoLibrary(type:UIImagePickerController.SourceType) {
        
        
        let pickerController = DKImagePickerController()
        pickerController.maxSelectableCount = 5
        pickerController.showsCancelButton = true
        
        pickerController.didSelectAssets = { (assets: [DKAsset]) in
            print("didSelectAssets")
            //            print(assets[0].type == .video)
            
            for asset in assets {
                switch asset.type {
                case .video:
                    if let videoAsset: PHAsset = asset.originalAsset {
                        guard (videoAsset.mediaType == .video) else {
                            print("Not a valid video media type")
                            return
                        }
                        
                        PHCachingImageManager().requestAVAsset(forVideo: videoAsset, options: nil) { (asset, audioMix, args) in
                            let asset = asset as! AVURLAsset
                            
                            DispatchQueue.main.async {
                                print(asset.url)
                                if let image = ThumbNail.getThumbnailFromFile(asset.url.absoluteString) {
                                    let file = SSFiles(url: asset.url, thumbImage: image)
                                    self.uploadMedia(file: file, messageType: .video, fileMeta: [MediaMetaModel.KEY_FILE_TYPE: MediaType.videoMP4.rawValue])
                                }else{
                                    let file = SSFiles(url: asset.url)
                                    self.uploadMedia(file: file, messageType: .video, fileMeta: [MediaMetaModel.KEY_FILE_TYPE: MediaType.videoMP4.rawValue])
                                }
                                
                            }
                        }
                    }
                    
                    break
                case .photo:
                    _ = asset.fileSize
                    
                    asset.fetchImage(with: PHImageManagerMaximumSize) { (image, info) in
                        
                        if let image = image {
                            self.uploadMedia( file: SSFiles(image: image), messageType: .image, fileMeta: [MediaMetaModel.KEY_FILE_TYPE: MediaType.imageJPG.rawValue])
                        }
                    }
                    break
                }
            }
        }
        
        self.present(pickerController, animated: true) {}
        
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        dismiss(animated: true, completion: nil)
        print(info)
        
        if (info[UIImagePickerController.InfoKey.originalImage] as? UIImage) != nil {
            //            waitTextLabel.text = "Please wait file uploading..."
            //            NetworkManager.uploadChatFile( image: pickedImage  ) { (success, res) in
            //                self.waitTextLabel.text = ""
            //                if let response:[String:Any] = res as? [String:Any]{
            //                    let isSuccess:Int = response["code"] as! Int
            //                    if(isSuccess == 200){
            //                        let url = response["url"] as!  String
            //                        self.sendMessage(message: "", type: .image, file: url, command: "upload")
            //                    } else if(isSuccess == 500){
            //                        self.showAlertWithMessage(message: response["message"] as! String)
            //                    }
            //                }else if let response: String  = res as? String {
            //                    self.showAlertWithMessage(message: response)
            //                }
            //            }
        }
    }
    
    func uploadMedia(file: SSFiles, messageType: MessageType, fileMeta: [String: Any]) {
        let parma = ["channel_id": "userProfile"]
        if let statusview: UploadStatusView = UploadStatusView.initialize(with: CGRect(x: 0, y: 0, width: self.uploadMediaProgress.frame.width, height: 50)) {
            
            statusview.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                statusview.heightAnchor.constraint(equalToConstant: 50),
            ])
            
            //    self.uploadMediaProgress.addSubview(statusview)
            self.uploadMediaProgress.insertArrangedSubview(statusview, at: 0)
            statusview.delegate = self
            statusview.uploadChatFile( file: file, parameters: parma, messageType: messageType, fileMeta: fileMeta, date: Date() )
            
        }
    }
}
extension ProfileViewController: UploadStatusDelegate {
    func fileUploaded(response: NetworkResponseState, uploadStatusView: UploadStatusView, messageType: MessageType, fileMeta: [String : Any], date: Date) {
        //                self.viewloader?.removeFromSuperview()
        
        switch response {
        case .failed( _ ):
            //                    self.showToast(message: errorMessage)
            break
        case .success(let response ):
            let isSuccess:Int = response["status_code"] as? Int ?? 500
            if(isSuccess == 200){
                if let dataDict = response["data"] as? [String:Any]{
                    if let url: URL = (dataDict["file"] as? String ?? "").getMediaUrl {
                        updateProfile(profilePic: url.absoluteString)
                    }
                }
                
            } else if(isSuccess == 500) {
                self.showToast(message: response["message"] as? String ?? "Servver Error")
            }
            break
        }
        
        uploadStatusView.removeFromSuperview()
    }
}

extension ProfileViewController: SocketObserver {
    func registerFor() -> [ResponseType] {
        return [.updateProfile]
    }
    
    func brodcastSocketMessage(to observerWithIdentifire: ResponseType, statusCode: Int, data: [String : Any], message: String) {
        print("observer ",{observerWithIdentifire})
        guard let data = data["data"] as? [String : Any] else {
            return
        }
        print("brodcastSocketMessage ",{data})
    }
    
    
    func socketConnection(status: SocketConectionStatus) {
        print(status)
    }
    
    
}
