import { Injectable } from '@angular/core';
import { VideoLog } from '../../../models/videoLog';
import { VideoLogService } from 'src/app/services/video-log.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogChartLogic {
  private _data: Subject<any[]>;
  public data$: Observable<any[]>;

  constructor(private apiService: VideoLogService) {
    this._data = new Subject<any[]>();
    this.data$ = this._data.asObservable();
  }

  public get() {
    let today = new Date()
    let videoLogs: any[] = [];
    for (let i = 6; i >= 0; i--) {
      videoLogs.push(
        {
          name: new Date(today.getFullYear(), today.getMonth(), today.getDate() - i).toLocaleDateString('jp-JP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          value: 0}
        )
    }

    this.apiService.getUserVideoLogs().subscribe(result => {
      let logs = result.body.data
      for (let i = 0; i < logs.length; i++) {
        let day =new Date(logs[i].created_at).toLocaleDateString('jp-JP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        videoLogs.forEach(date => {
          if(date.name == day){date.value += logs[i].youtube_duration/3600}
        })
      }
      this._data.next(videoLogs)
    });
  }
}
