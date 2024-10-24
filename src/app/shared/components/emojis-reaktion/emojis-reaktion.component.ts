import { Component, inject, Input, OnInit } from '@angular/core';
import { FirebaseMessengerService } from '../../services/firebase-services/firebase-messenger.service';
import { MessengerService } from '../../services/messenger-service/messenger.service';
import { CommonModule } from '@angular/common';
import { MessageInterface } from '../../interfaces/message-interface';
import { ReactionInterface } from '../../interfaces/reaction-interface';
import { AuthserviceService } from '../../../landing-page/services/authservice.service';

@Component({
  selector: 'app-emojis-reaktion',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './emojis-reaktion.component.html',
  styleUrl: './emojis-reaktion.component.scss'
})
export class EmojisReaktionComponent{
  authService = inject(AuthserviceService);
  firebaseMessenger = inject(FirebaseMessengerService);
  messengerService = inject(MessengerService);
  @Input() reaction: ReactionInterface = {
    content: '',
    senderIDs: [],
    senderNames: [],
    messageID: '',
    reactionID: '',
  };
  @Input() index: number;
  userUsedThisReactionAlready: boolean;
  foundID: boolean;

  
  getBorderColor() {
    this.foundID = this.reaction.senderIDs.includes(this.authService.currentUserSig()?.userID ?? '');
    if (this.foundID) {
      return '#444DF2';
    } else {
      return
    }
  }


  getBackgroundColor() {
    this.foundID = this.reaction.senderIDs.includes(this.authService.currentUserSig()?.userID ?? '');
    if (this.foundID) {
      return 'rgba(68, 77, 242, 0.1)';
    } else {
      return
    }
  }


  alreadyExisitingReaktion() {
    if (!this.foundID) {
      this.addUserToReaction();
    } else {
      this.removeUserFromReaction();
    }
  }


  addUserToReaction() {
    this.reaction.senderIDs.push(this.authService.currentUserSig()?.userID || '');
    this.reaction.senderNames.push(this.authService.currentUserSig()?.username || '');
    this.firebaseMessenger.updateReaction(this.reaction, this.reaction.messageID, this.reaction.reactionID);
  }


  removeUserFromReaction() {
    this.reaction.senderIDs.splice(this.reaction.senderIDs.indexOf(this.authService.currentUserSig()?.userID ?? ''), 1);
    this.reaction.senderNames.splice(this.reaction.senderNames.indexOf(this.authService.currentUserSig()?.username ?? ''), 1);
    if (this.reaction.senderIDs.length == 0) {
      this.firebaseMessenger.deleteReaction(this.reaction.messageID, this.reaction.reactionID);
    } else {
      this.firebaseMessenger.updateReaction(this.reaction, this.reaction.messageID, this.reaction.reactionID);
    }
  }


  controllText() {
    this.foundID = this.reaction.senderIDs.includes(this.authService.currentUserSig()?.userID ?? '');
    if (this.foundID) {
      if (this.reaction.senderNames.length > 1) {
        return 'haben reagiert';
      } else {
        return 'hast reagiert';
      }
    } else {
      if (this.reaction.senderNames.length > 1) {
        return 'haben reagiert';
      } else {
        return 'hat reagiert';
      }
    }
  }


  controllNamesArrayLength() {
    this.foundID = this.reaction.senderIDs.includes(this.authService.currentUserSig()?.userID ?? '');
    if (this.foundID) {
      if (this.reaction.senderNames.length > 1) {
        if (this.reaction.senderNames.length > 2) {
          return `Du und ${this.reaction.senderNames.length - 1} weitere`
        } else {
          if (this.reaction.senderNames[0] == this.authService.currentUserSig()?.username) {
            return `Du und ${this.reaction.senderNames[1]}`;
          } else {
            return `Du und ${this.reaction.senderNames[0]}`;
          }
        }
      } else {
        return 'Du';
      }
    } else {
      if (this.reaction.senderNames.length > 1) {
        return `${this.reaction.senderNames[0]} und ${this.reaction.senderNames.length - 1} weitere`
      } else {
        return `${this.reaction.senderNames[0]}`;
      }
    }
  }
}
