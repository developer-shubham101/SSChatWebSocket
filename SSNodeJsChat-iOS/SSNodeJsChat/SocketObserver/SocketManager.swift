//
//  SocketManager.swift
//  SSNodeJsChat
//
//  Created by Shubham Sharma on 25/02/21.
//

import Foundation
import Starscream

enum SocketConectionStatus : Int {
    case disconnected = 0
    case connected
    case conencting
}

struct Observers {
    var identidfire: [ResponseType]
    var socketObserver: SocketObserver
}


class SocketManager: SocketMessage {
    
    
    static let shared  = SocketManager()
    
    
    fileprivate var observersList = Array<SocketObserver>()
    fileprivate var isNotify : Bool = false
    
    var socket = WebSocket(url: URL(string: "ws://172.16.16.153:1337/V1")!, protocols: ["chat"])
    
    func connectSocket(notify: Bool) {
        self.isNotify =  notify
        socket.delegate = self
        socket.connect()
    }
    
    func registerToScoket(observer: SocketObserver) {
        observersList.append(observer)
    }
    
    func unregisterToSocket(observer: SocketObserver) {
        if let observerIndex: Int = (observersList.firstIndex { (element) -> Bool in
            return element === observer
        }){
            self.observersList.remove(at: observerIndex)
        }else{
            print("Observer Already Unregistred")
        }
       
    }
    
    func sendMessageToSocket(message: String) {
        print("SocketManager:: SendMessage", message)
        socket.write(string: message)
    }
    
    func notifyWebSocketConnectionStatus(status:Bool) {
        for obs in observersList {
            obs.socketConnection(status: status ? SocketConectionStatus.connected :  SocketConectionStatus.disconnected)
        }
    }
    
    func notifyObserver(message: [String: Any]){
        print(message)
        guard let type: ResponseType = ResponseType(rawValue: message["type"] as? String ?? "") else {
            return
        }
        guard let statusCode: Int = message["statusCode"] as? Int  else {
            return
        }
        let responseMessage: String = message["message"] as? String ?? "Unknown Error"
        for obs in observersList {
            if obs.registerFor().contains(type)  {
                obs.brodcastSocketMessage(to: type, statusCode: statusCode, data: message, message: responseMessage)
               
            }
        }
        
    }
    
    
}

//  MARK: - WebSocket Delegate
extension SocketManager:WebSocketDelegate {
    fileprivate func connectUserId() {
        let messageDictionary = [
            "request": "create_connection",
            "user_id": LoginUserModel.shared.userId,
            "type": "create",
            
        ] as [String : Any]
        
        let jsonData = try! JSONSerialization.data(withJSONObject: messageDictionary)
        let jsonString = NSString(data: jsonData, encoding: String.Encoding.utf8.rawValue)
        if let message:String = jsonString as String? {
            SocketManager.shared.sendMessageToSocket(message: message)
        }
    }
    
    func websocketDidConnect(socket: WebSocketClient) {
        print("SocketManager:: Web socket connected");
        if isNotify {
            notifyWebSocketConnectionStatus(status: true)
        }
        connectUserId()
    }
    
    func websocketDidDisconnect(socket: WebSocketClient, error: Error?) {
       // socket.connect()
        print("SocketManager:: Web socket disconnected");
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            self.socket.connect()
        }
        
        if isNotify {
            notifyWebSocketConnectionStatus(status: false)
        }
    }
    
    func websocketDidReceiveMessage(socket: WebSocketClient, text: String) {
        print("SocketManager:: websocketDidReceiveMessage => \(text)")
        guard let data = text.data(using: .utf8), let jsonData = try? JSONSerialization.jsonObject(with: data), let jsonDict = jsonData as? [String: Any] else { return }
        notifyObserver(message: jsonDict)
    }
    
    func websocketDidReceiveData(socket: WebSocketClient, data: Data) {
        
    }
    
    
}
