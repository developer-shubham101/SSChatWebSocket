//
//  NetworkManager.swift
//  Currency Converter
//
//  Created by Shubham Sharma on 22/12/17.
//  Copyright © 2017 Shubham Sharma. All rights reserved.
//

import Foundation
import Alamofire

let isDebug = true



public class ImageModel {
     
    public var image_video : String = ""
    public var thumbnail : String = ""
    
    public class func modelsFromDictionaryArray(array: [[String: Any]]) -> [ImageModel] {
        var models:[ImageModel] = []
        for item in array {
            models.append(ImageModel(dictionary: item))
        }
        return models
    }
    
    required public init() {
        
    }
    required public init(dictionary: [String: Any]) {
        image_video = dictionary["image_video"] as? String ?? ""
        thumbnail = dictionary["thumbnail"] as? String ?? ""
    }
}





class SSFiles {
	var url: URL?
	var image: UIImage?
	var name: String = "File"
	var oldMedia: ImageModel? 
	var isVideo = false
	var thumbImage: UIImage?
	
	init(url: URL, thumbImage: UIImage) {
		self.url = url
		name = (url.absoluteString as NSString).lastPathComponent
		isVideo = true
		self.thumbImage = thumbImage
	}
	
	init(url: URL) {
		self.url = url
		name = (url.absoluteString as NSString).lastPathComponent
	}
	
	init(image: UIImage) {
		self.image = image
		name = "image"
	}
	
	
	init(image: UIImage, thumbImage: UIImage) {
		self.image = image
		name = "image"
		isVideo = false
		self.thumbImage = thumbImage
	}
	
	init(oldMedia: ImageModel) {
		self.oldMedia = oldMedia
	}
	
}

class MultipartImage {
	 
	var image:UIImage!
	var keyName: String = "File"
	var fileName: String = "File"
	 
	init(image: UIImage, keyName: String, fileName: String) {
		self.image = image
		self.keyName = keyName
		self.fileName = fileName
	}
}

class NetworkManager {
	 
	static let PROTOCOL:String = "http://";
	static let SUB_DOMAIN:String =  "testapi.";
	
	static let DOMAIN:String = "newdevpoint.in/";
 
	static let API_DIR:String = "api/";
	
	static let SITE_URL = PROTOCOL + SUB_DOMAIN + DOMAIN;
	static let API_URL = SITE_URL + API_DIR;
	
//	static let STORAGE_URL = SITE_URL + "storage/";
    static let STORAGE_URL = "http://127.0.0.1:8000/";
	
	
	
	 
	static let PRIVACY_POLICY_URL = "\(DOMAIN)"
	static let TERMS_AND_CONDITIONS = "\(DOMAIN)"
	
	
	
	
	
	
	//-------------
//    static let URL_FILE_UPLOAD = "\(SITE_URL)upload"
    static let URL_FILE_UPLOAD = "http://127.0.0.1:8000/?url=upload"
    
//    static let URL_WEB_SOCKET = "ws://sschat-react.herokuapp.com/V1"
    static let URL_WEB_SOCKET = "ws://172.16.16.231:1337/V1"
    
    
    
	
	static func callService(url:String, parameters:Parameters, httpMethod:HTTPMethod = .post, completion:@escaping (NetworkResponseState) -> Void){
		
		var  tokenDict:HTTPHeaders = [:]
		//        if LoginUserModel.shared.isLogin {
		if LoginUserModel.shared.token != "" {
			tokenDict = ["Content-Type": "application/json","Authorization": "Bearer \(LoginUserModel.shared.token)" ]
		}else{
			tokenDict = ["Content-Type": "application/json" ]
		}
		        print("Bearer \(LoginUserModel.shared.token)")
		//		print("parms \(parameters)")
		Alamofire.request(url, method:httpMethod, parameters:parameters, encoding: JSONEncoding.default,headers: tokenDict).responseJSON { response in
			print("Request: \(String(describing: response.request))")   // original url request
			print("Response: \(String(describing: response.response))") // http url response
			print("Result: \(String(describing: response.result.value))")                   // response serialization result
			
			
			guard response.result.isSuccess else {
				completion(.failed("Something went wrong!!"))
				print("Error while fetching json: \(String(describing: response.result.error))")
				return
			}
			guard let responseJSON = response.result.value as? [String: Any] else {
				completion(.failed("Something went wrong!!"))
				print("invalid json recieved from server: \(String(describing: response.result.error))")
				return
			}
			
			if response.response?.statusCode == 200 {
				completion(.success(responseJSON) )
			}else{
				completion(.failed("Something went wrong!!"))
			}
		}
	}
	static func callServiceLogin(url:String, parameters:Parameters, completion: @escaping (NetworkResponseState) -> Void){
		
		let TokenDict = ["Content-Type": "application/json", "Device-Registration": LoginUserModel.shared.fCMToken ]
		
		Alamofire.request(url, method:.post, parameters:parameters, encoding: JSONEncoding.default, headers: TokenDict).responseJSON { response in
			print("Request: \(String(describing: response.request))")   // original url request
			print("Response: \(String(describing: response.response))") // http url response
			print("Result: \(String(describing: response.result.value))")                         // response serialization result
			
			
			guard response.result.isSuccess else {
				completion(.failed("Something went wrong!!"))
				print("Error while fetching json: \(String(describing: response.result.error))")
				return
			}
			guard let responseJSON = response.result.value as? [String: Any] else {
				completion(.failed("Something went wrong!!"))
				print("invalid json recieved from server: \(String(describing: response.result.error))")
				return
			}
			
			if response.response?.statusCode == 200 {
				completion(.success(responseJSON) )
			}else{
				completion(.failed("Something went wrong!!"))
			}
		}
	}
	
	static func callServiceMultipalFiles(url:String, files:[SSFiles], parameters:Parameters, completion: @escaping (NetworkResponseState) -> Void){
		
		var  tokenDict:HTTPHeaders = [:]
		//        if LoginUserModel.shared.isLogin {
		if LoginUserModel.shared.token != "" {
			tokenDict = ["Content-Type": "application/json","Authorization": "Bearer \(LoginUserModel.shared.token)" ]
		}else{
			tokenDict = ["Content-Type": "application/json" ]
		}
		print("Bearer \(LoginUserModel.shared.token)")
		Alamofire.upload(
			multipartFormData: { multipartFormData in
				var count = 0
				for item in files {
					if let fileUrl: URL = item.url, let thumb: UIImage = item.thumbImage {
						do {
							let data = try Data(contentsOf: fileUrl )
							multipartFormData.append(data, withName: "post_picture[\(count)]", fileName: (fileUrl.absoluteString as NSString).lastPathComponent, mimeType: "application/octet-stream")
							
							var fileName: String = (fileUrl.absoluteString as NSString).lastPathComponent
							fileName = fileName.replacingOccurrences(of: ".\(fileUrl.pathExtension)", with: ".jpg")
							multipartFormData.append(thumb.jpegData(compressionQuality: 1.0)!, withName: "video_thumbnail[\(count)]", fileName: fileName, mimeType: "image/jpg")
							
							count = count + 1
						} catch let error{
							print(error)
						}
					} else if let image = item.image, let thumb: UIImage = item.thumbImage {
						guard let imageData = image.jpegData(compressionQuality: 1.0) else {
							print("Could not get JPEG representation of UIImage")
							return
						}
						
						let fileName: String = "\(Date().timeIntervalSince1970).jpg"
						
						multipartFormData.append(imageData, withName: "post_picture[\(count)]",fileName: fileName, mimeType: "image/jpg")
						 
						multipartFormData.append(thumb.jpegData(compressionQuality: 1.0)!, withName: "video_thumbnail[\(count)]", fileName: fileName, mimeType: "image/jpg")
						
						
						count = count + 1
					} else if let oldMedia = item.oldMedia {
						multipartFormData.append((oldMedia.image_video as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: "post_picture[\(count)]")
						
						multipartFormData.append((oldMedia.thumbnail as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: "video_thumbnail[\(count)]")
						
						count = count + 1
					}
				}
				
				for (key, value) in parameters {
					multipartFormData.append((value as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: key)
				}
		}, to:  url, headers: tokenDict) { (encodingResult) in
			switch encodingResult {
			case .success(let upload, _, _):
				upload.responseJSON { response in
					print("Request: \(String(describing: response.request))")   // original url request
					print("Response: \(String(describing: response.response))") // http url response
					print("Result: \(String(describing: response.result.value))")                         // response serialization result
					
					
					guard response.result.isSuccess else {
						completion(.failed("Something went wrong!!"))
						print("Error while fetching json: \(String(describing: response.result.error))")
						return
					}
					guard let responseJSON = response.result.value as? [String: Any] else {
						completion(.failed("Something went wrong!!"))
						print("invalid json recieved from server: \(String(describing: response.result.error))")
						return
					}
					
					if response.response?.statusCode == 200 {
						completion(.success(responseJSON) )
					}else{
						completion(.failed("Something went wrong!!"))
					}
				}
            case .failure( _):
				completion(.failed("Something went wrong!!"))
			}
		}
	}
	static func callService(url:String, item: SSFiles, parameters:Parameters, completion:@escaping (NetworkResponseState) -> Void){
		
		var  tokenDict:HTTPHeaders = [:]
		//        if LoginUserModel.shared.isLogin {
		if LoginUserModel.shared.token != "" {
			tokenDict = ["Content-Type": "application/json","Authorization": "Bearer \(LoginUserModel.shared.token)" ]
		}else{
			tokenDict = ["Content-Type": "application/json" ]
		}
		Alamofire.upload(
			multipartFormData: { multipartFormData in
					if let fileUrl: URL = item.url {
						do {
							let data = try Data(contentsOf: fileUrl )
							multipartFormData.append(data, withName: "file", fileName: (fileUrl.absoluteString as NSString).lastPathComponent, mimeType: "application/octet-stream")
							
							var fileName: String = (fileUrl.absoluteString as NSString).lastPathComponent
							fileName = fileName.replacingOccurrences(of: ".\(fileUrl.pathExtension)", with: ".jpg")
							if let thumb: UIImage = item.thumbImage {
								multipartFormData.append(thumb.jpegData(compressionQuality: 1.0)!, withName: "thumbnail", fileName: fileName, mimeType: "image/jpg")
							}
							 
						} catch let error{
							print(error)
						}
					} else if let image = item.image {
						guard let imageData = image.jpegData(compressionQuality: 1.0) else {
							print("Could not get JPEG representation of UIImage")
							return
						}
						
						let fileName: String = "\(Date().timeIntervalSince1970).jpg"
						
						multipartFormData.append(imageData, withName: "file",fileName: fileName, mimeType: "image/jpg")
						
						if let thumb: UIImage = item.thumbImage {
							multipartFormData.append(thumb.jpegData(compressionQuality: 1.0)!, withName: "thumbnail", fileName: fileName, mimeType: "image/jpg")
						}
					}
//					else if let oldMedia = item.oldMedia {
//						multipartFormData.append((oldMedia.image_video as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: "file")
//
//						multipartFormData.append((oldMedia.thumbnail as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: "thumbnail")
//
//
//					}
				 
				for (key, value) in parameters {
					multipartFormData.append((value as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: key)
				}
				
		}, to:  url, headers: tokenDict) { (encodingResult) in
			switch encodingResult {
			case .success(let upload, _, _):
				upload.uploadProgress { (progress) in
					print(progress)
				}
				upload.responseJSON { response in
					print("Request: \(String(describing: response.request))")   // original url request
					print("Response: \(String(describing: response.response))") // http url response
					print("Result: \(String(describing: response.result.value))") // response serialization result
					
					
					guard response.result.isSuccess else {
						completion(.failed("Something went wrong!!"))
						print("Error while fetching json: \(String(describing: response.result.error))")
						return
					}
					guard let responseJSON = response.result.value as? [String: Any] else {
						completion(.failed("Something went wrong!!"))
						print("invalid json recieved from server: \(String(describing: response.result.error))")
						return
					}
					
					if response.response?.statusCode == 200 {
						completion(.success(responseJSON) )
					}else{
						completion(.failed("Something went wrong!!"))
					}
				}
            case .failure( _):
				completion(.failed("Something went wrong!!"))
			}
		}
	}
	
	static func callServiceMultipart(url:String, parameters:Parameters, file:MultipartImage? = nil, method:HTTPMethod = .post, completion:@escaping (NetworkResponseState) -> Void){
		
		let TokenDict:HTTPHeaders  = ["Content-Type": "application/json", "Authorization": "Bearer \(LoginUserModel.shared.token)" ]
		
		Alamofire.upload(
			multipartFormData: { multipartFormData in
				
				if let item: MultipartImage = file {
					
					guard let imageData = item.image.jpegData(compressionQuality: 1.0) else {
						print("Could not get JPEG representation of UIImage")
						return
						
					}
					multipartFormData.append(imageData, withName: item.keyName, fileName: item.fileName, mimeType: "image/jpg")
				}
				
				for (key, value) in parameters {
					multipartFormData.append((value as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: key)
				}
		}, to:  url, method: method, headers:TokenDict) { (encodingResult) in
			switch encodingResult {
			case .success(let upload, _, _):
				upload.responseJSON { response in
					print("Request: \(String(describing: response.request))")   // original url request
					print("Response: \(String(describing: response.response))") // http url response
					print("Result: \(String(describing: response.result.value))")                         // response serialization result
					
					
					guard response.result.isSuccess else {
						completion(.failed("Something went wrong!!"))
						print("Error while fetching json: \(String(describing: response.result.error))")
						return
					}
					guard let responseJSON = response.result.value as? [String: Any] else {
						completion(.failed("Something went wrong!!"))
						print("invalid json recieved from server: \(String(describing: response.result.error))")
						return
					}
					
					if response.response?.statusCode == 200 {
						completion(.success(responseJSON) )
					}else{
						completion(.failed("Something went wrong!!"))
					}
				}
            case .failure( _):
				completion(.failed("Something went wrong!!"))
			}
		}
	}
	
	
	static func callService(url:String, completion:@escaping (NetworkResponseState) -> Void){
		var tokenDict:HTTPHeaders = [:]
		if LoginUserModel.shared.isLogin {
			tokenDict = ["Content-Type": "application/json", "Authorization": "Bearer \(LoginUserModel.shared.token)" ]
		}else{
			tokenDict = ["Content-Type": "application/json" ]
		}
		Alamofire.request(url, method:.get, headers:tokenDict).responseJSON { response in
			print("Request: \(String(describing: response.request))")   // original url request
			print("Response: \(String(describing: response.response))") // http url response
			print("Result: \(String(describing: response.result.value))")                   // response serialization result
			
			
			guard response.result.isSuccess else {
				completion(.failed("Something went wrong!!"))
				print("Error while fetching json: \(String(describing: response.result.error))")
				return
			}
			guard let responseJSON = response.result.value as? [String: Any] else {
				completion(.failed("Something went wrong!!"))
				print("invalid json recieved from server: \(String(describing: response.result.error))")
				return
			}
			
			if response.response?.statusCode == 200 {
				completion(.success(responseJSON) )
			}else if response.response?.statusCode == 401 {
				LoginUserModel.shared.logout()
				
				
				//                let storyBoard : UIStoryboard = UIStoryboard(name: "Main", bundle:nil)
				//                let newViewController = storyBoard.instantiateViewController(withIdentifier: "SignInUpController") as! SignInUpController
				//                let navigationController = UINavigationController(rootViewController: newViewController)
				//                let appdelegate = UIApplication.shared.delegate as! AppDelegate
				//                appdelegate.window!.rootViewController = navigationController
			}else{
				completion(.failed("Something went wrong!!"))
			}
		}
	}
}
enum NetworkResponseState {
	case success([String:Any])
	case failed(String)
}
