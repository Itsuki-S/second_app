import { Injectable } from '@angular/core';
import { VideoLog } from '../../../models/videoLog';
import { VideoLogService } from 'src/app/services/video-log.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoLogsLogic {
  private _data: Subject<VideoLog[]>;
  public data$: Observable<VideoLog[]>;

  constructor(private apiService: VideoLogService) {
    this._data = new Subject<VideoLog[]>();
    this.data$ = this._data.asObservable();
  }

  public get(date_str: string) {
    let videoLogs: VideoLog[] = [];
    this.apiService.getUserVideoLogs(date_str).subscribe(result => {
      result.body.data.forEach((jsonVideoLog: any) =>
        videoLogs.push(VideoLog.fromJson(jsonVideoLog))
      );
      this._data.next(videoLogs)
    });
  }
}
