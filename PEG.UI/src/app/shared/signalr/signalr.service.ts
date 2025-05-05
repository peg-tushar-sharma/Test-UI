import * as signalR from '@microsoft/signalr';
import { CoreService } from '../../core/core.service';
import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable()
export class SignalRService {
    messageReceived = new EventEmitter<any>();
    newUserAdded = new EventEmitter<any>();
    editingStarted = new EventEmitter<any>();
    connectionEstablished = new EventEmitter<Boolean>();
    private _hubConnection: HubConnection;
    private token=  sessionStorage.getItem('bearerToken') || '';
    constructor(public coreService: CoreService) {

    }

    // This will create a new connection with signalR service
    public createConnection() {
        if (this.coreService?.appSettings?.PEGSignalRBasePath != '') {
            this._hubConnection = new HubConnectionBuilder()
                .withUrl(this.coreService.appSettings.PEGSignalRBasePath, {
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets,
                    accessTokenFactory: () => this.token,

                })
                .withAutomaticReconnect([0, 2000, 30000, 60000, 6000, 6000, 6000, 6000, 6000, null])
                .build();
        }
    }

    // After the connection we need to start the connection
    public startConnection(): void {
        this._hubConnection
            .start()
            .then(() => {
                console.log('Hub connection started');
                this.connectionEstablished.emit(true);
                this.getActiveConnections();
            })
            .catch((err) => {
                console.log('Error while establishing connection, retrying...', err);
                setTimeout(function () { this.startConnection(); }, 5000);
            });
    }

    // This will register server events means
    // when there is a server push on this method (in this case ReceiveMessage) this function will trigger
    public registerOnServerEvents(): void {
        if (this._hubConnection) {
            this._hubConnection.on('ReceiveMessage', (updatedData: any) => {
                this.messageReceived.emit(updatedData);
            });

            this._hubConnection.on('EditingStarted', (updatedData: any) => {
                this.editingStarted.emit(updatedData);
            });
        }
    }

    // This will call the signalR function which notifies all the users including sender
    notifyAll(loggedinUserName: any, columnId: any, value: any, registrationId: any) {
         this._hubConnection.invoke('NotifyAll', loggedinUserName, columnId, registrationId);
    }
    DisposeAsync()
    {
        this._hubConnection?.invoke('OnDisconnectedAsyncManually');
        
    }

    // This will call the signalR function which notifies all the users except sender
    notifyAllExceptSender(loggedinUserName: any, columnId: any, value: any, registrationId: any) {
            this._hubConnection.invoke('NotifyAllExceptSender', loggedinUserName, columnId, registrationId);
    }

    // This will call the signalR function which notifies only sender
    notifySender(loggedinUserName: any) {
             this._hubConnection.invoke('NotifySender', loggedinUserName, 'test message');
    }

    // This will register server events whenever new user is active    
    public registerOnActiveUsers(): void {
             this._hubConnection.on('NewUserAdded', (newUserData: any) => {
            this.newUserAdded.emit(newUserData);
        });
    }

    // This will call the signalR function to get all current active connections
    getActiveConnections() {
         this._hubConnection.invoke('GetActiveConnections');
    }

    // This will call the signalR function which notifies all the users on a custom event
    notifyAllCustom(loggedinUserName: any, columnId: any, value: any, registrationId: any, receivingEnd: any) {
            this._hubConnection.invoke("NotifyAllCustom", loggedinUserName, columnId, registrationId, receivingEnd);
    }

}   
