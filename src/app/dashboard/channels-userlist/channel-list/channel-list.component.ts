import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FirestoreService } from '../../../shared/services/firebase-services/firestore.service';
import { Channel } from '../../../shared/interfaces/channel';
import { Subscription } from 'rxjs';
import { UserInterface } from '../../../landing-page/interfaces/userinterface';
import { MatDialog } from '@angular/material/dialog';
import { DialogChannelComponent } from '../dialog-channel/dialog-channel.component';
import { AnimationChannelService } from './animation.service.service';
import { MessengerService } from '../../../shared/services/messenger-service/messenger.service';
import { ThreadService } from '../../../shared/services/thread-service/thread.service';
import { FirebaseMessengerService } from '../../../shared/services/firebase-services/firebase-messenger.service';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DialogChannelComponent
  ],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent {

  firestoreService: FirestoreService = inject(FirestoreService);
  firebaseMessenger = inject(FirebaseMessengerService);
  messengerService = inject(MessengerService);
  threadService = inject(ThreadService);

  channelList: Channel[] = [];
  channelListSubscription!: Subscription;

  userList: UserInterface[] = [];
  userListSubscription!: Subscription;

  dialog = inject(MatDialog);
  channelAnimationService: AnimationChannelService = inject(AnimationChannelService);


  constructor() {
    this.channelAnimationService.isChannelOpen = false;
  }


  showChannel(channel: any) {
    this.messengerService.showMessenger = false;
    this.threadService.showThread = false;
    this.messengerService.channel = channel;
    console.log(this.messengerService.channel); 
    this.messengerService.openChannel = true;
    this.messengerService.openChart = false;
    setTimeout(() => {
      this.messengerService.showMessenger = true;
      
    }, 100);
  }


  ngOnInit(): void {
    this.firestoreService.startSnapshot('channels');

    this.channelListSubscription = this.firestoreService.channelList$.subscribe(channel => {
      this.channelList = channel;
      this.channelAnimationService.channelList = channel;
    });

    this.userListSubscription = this.firestoreService.userList$.subscribe(user => {
      this.userList = user;
    });
  }

  ngOnDestroy(): void {
    this.firestoreService.stopSnapshot();
  }

  ngAfterViewInit() {
    setTimeout(() => this.channelAnimationService.toggleChannels(), 1000);
  }

  getAnimationDelayChannel(index: number): number {
    if (this.channelAnimationService.isChannelOpen) {
      return index * 0.10;
    } else {
      let totalButtons = this.channelList.length;
      return (totalButtons - index - 1) * 0.10;
    }
  }

  getAnimationDelayAddChannel() {
    let totalButtons = this.channelList.length;

    if (this.channelAnimationService.isChannelOpen) {
      return totalButtons * 0.10;
    } else {
      return (totalButtons - totalButtons - 1) * 0.10;
    }
  }

  getChannelsMaxHeight(): number {
    return this.channelList.length * 50 + 50;
  }

  getChannelsTransitionDuration(): string {
    let duration = this.channelList.length * 0.12;
    return `max-height ${duration}s ease-in-out`;
  }

  focusChannel(channel: Channel) {
    this.resetUserFocus();
    this.channelList.forEach(c => c.isFocus = false);
    this.firestoreService.setAndGetCurrentlyFocusedChat(channel);
    channel.isFocus = true;
  }

  resetUserFocus(): void {
    this.userList.forEach(user => user.isFocus = false);
  }

  openDialog() {
    this.dialog.open(DialogChannelComponent);
  }
}
