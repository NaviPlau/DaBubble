import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, onSnapshot } from '@angular/fire/firestore';
import { query, where, } from 'firebase/firestore';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  firestore: Firestore = inject(Firestore)
  unsubList;
  content = '';
  messages: Message[] = [];





  constructor() {
    this.unsubList = this.subChatsList();
  }


  ngDestroy() {
    this.unsubList
  }


  /**
   * 
   * @returns Get the path of the messeges of 1 chat
   */
  subChatsList() {
    const messegeRef = collection(this.firestore, 'chats/S7ML2AQqM2cz62qNszcY/messeges')
    return onSnapshot(messegeRef, (list) => {
      this.messages = [];
      list.forEach(element => {
        this.messages.push(this.setMessageObject(element.data()))
      });
      this.messages = this.sortByDate(this.messages);
      console.log(this.messages);
    })
  }


  /**
   * We check if nothing is undefinend.
   * @param element - is the array in the Firebase where the message are saved
   * @returns - return the filled array
   */
  setMessageObject(element: any) {
    return {
      content: element.content || '',
      isRead: element.isRead || false,
      senderId: element.senderId || 0,
      date: new Date(element.date) || 0,
      type: element.type || '',
    }
  }


  /**
   * Sort the array by the dates
   * @param messages - the array
   * @returns - return the sorted array
   */
  sortByDate(messages: Message[]): Message[] {
    return messages.sort((b, a) => {
      return a.date.getTime() - b.date.getTime();
    });
  }


  /**
   * Get the time when message is created and filled the array. 
   */
  createMessage() {
    let date = new Date();
    let timeStamp = date.getTime();
    let message: Message = {
      content: this.content,
      isRead: false,
      senderId: 0,
      date: timeStamp,
      type: 'text'
    }
    this.addMessage(message);
    this.content = '';
  }


  /**
   * We save the message in our firebase.
   * @param message - the sent message
   */
  async addMessage(message: any) {
    await addDoc(collection(this.firestore, 'chats/S7ML2AQqM2cz62qNszcY/messeges'), message).catch(
      (err) => {
        console.error(err);
      }
    ).then(
      (docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      }
    )
  }


  /**
   * get Acces of chats in firebase
   * @returns - returns the path of firebase chats
   */
  getChatsRef() {
    return collection(this.firestore, 'chats');
  }
}