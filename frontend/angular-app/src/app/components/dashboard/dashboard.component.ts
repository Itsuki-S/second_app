import { Component, OnInit, OnDestroy } from '@angular/core';
import { VideoLog } from '../../models/videoLog';
import { LogChartLogic } from './logic/log-chart.logic';
import { VideoLogService } from 'src/app/services/video-log.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public videoLogs: VideoLog[];
  public chartData: any[]
  public playerHeight: number = 270;
  public playerWidth: number = 420;
  view: [number, number] = [window.innerWidth-250, 550];

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
  timeline: boolean = true;
  colorScheme   = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(
    private videoLogService: VideoLogService,
    private logChartLogic: LogChartLogic
  ) {}
  
  ngOnInit(): void {
    this.logChartLogic.data$.subscribe(
      result => {
        this.chartData = [
          {name: "視聴時間(H)", series: result.reverse()}
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

  ngOnDestroy(): void{

  }
}
