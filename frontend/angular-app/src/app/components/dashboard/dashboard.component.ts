import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { VideoLog } from '../../models/videoLog';
import { LogChartLogic } from './logic/log-chart.logic';
import { VideoLogService } from 'src/app/services/video-log.service';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public videoLogs: VideoLog[];
  public chartData: any[]
  public playerHeight: number = 270;
  public playerWidth: number = 420;
  private playingId: number

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  roundDomains: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = '視聴時間(H)';
  yScaleMin: number = 0;
  yScaleMax: number = 24;
  timeline: boolean = true;

  @ViewChildren(YouTubePlayer) viewChildren!: QueryList<YouTubePlayer>;

  constructor(
    private videoLogService: VideoLogService,
    private logChartLogic: LogChartLogic
  ) {}
  
  ngOnInit(): void {
    this.logChartLogic.data$.subscribe(
      result => {
        this.chartData = [
          {name: "視聴時間(H)", series: result}
        ]
      }
    )
    this.logChartLogic.get()
    this.videoLogService.getRecommendedVideoLogs().subscribe(
      result => {
        this.videoLogs = result.body.data.map((jsonVideoLog: any) => 
          VideoLog.fromJson(jsonVideoLog)
        )
      }
    );
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }

  videoStateChange(event: YT.OnStateChangeEvent, i: number) {
    if (event.data == 1) {
      if (this.playingId != undefined) {
        this.viewChildren.get(this.playingId)?.pauseVideo()
      }
      this.playingId = i
    }
  }
}
