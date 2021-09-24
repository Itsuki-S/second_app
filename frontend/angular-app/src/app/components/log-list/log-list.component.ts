import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { VideoLog } from './models/videoLog';
import { VideoLogsLogic } from './logic/video-logs.logic';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  public videoLogs: VideoLog[];
  public logsDate = new FormControl(new Date());
  public videoTotalTime: number = 0;
  public videoTotalHour: number;
  public videoTotalMin: number;
  public videoTotalSec: number;
  public videoLogsEmpty: boolean = true;
  
  constructor(
    private videoLogsLogic: VideoLogsLogic
  ) {}

  ngOnInit(): void {
    const formSubscription = this.logsDate.valueChanges.subscribe(value => {
      this.videoTotalTime = 0;
      this.videoLogsLogic.get(value.toLocaleString());
      console.log(this.logsDate.value.toLocaleString())
    });
    
    const videoLogsSubscription = this.videoLogsLogic.data$.subscribe((videoLogs: any) => {
      this.videoLogs = videoLogs
      videoLogs.forEach( (log: VideoLog) => {
        this.videoTotalTime += log.youtube_duration
      });
      this.videoLogsEmpty = (videoLogs.length > 0) ? false : true
      this.videoTotalHour = Math.floor(this.videoTotalTime / 3600);
      this.videoTotalMin = Math.floor(this.videoTotalTime / 60) % 60;
      this.videoTotalSec = (this.videoTotalTime % 60) % 60
    });

    this.subscription = [videoLogsSubscription, formSubscription];
    this.videoLogsLogic.get(this.logsDate.value.toLocaleString());
  }

  ngOnDestroy(): void{
    if (this.subscription.length) {
      this.subscription.forEach(sub => sub.unsubscribe());
      this.subscription = [];
    }
  }
}
