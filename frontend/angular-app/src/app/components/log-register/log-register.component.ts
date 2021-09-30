import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { VideoLogService } from 'src/app/services/video-log.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-log-register',
  templateUrl: './log-register.component.html',
  styleUrls: ['./log-register.component.scss']
})
export class LogRegisterComponent implements OnInit {
  public videoLogsForm: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private videoLogService: VideoLogService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.videoLogsForm = this.formBuilder.group({
      video_logs: this.formBuilder.array([
        this.formBuilder.group({
          "youtube_url": '',
          "note": '',
          "is_recommended?": false
        })
      ])
    });
    this.cdr.detectChanges();
  }
  
  get videoLogs(): FormArray {
    return this.videoLogsForm.get('video_logs') as FormArray;
  }

  addVideoLogForm() {
    this.videoLogs.push(this.formBuilder.group({
      "youtube_url": '',
      "note": '',
      "is_recommended?": false
    }));
    console.log(this.videoLogsForm.value)
    console.log(this.videoLogsForm.value['video_logs'].filter((log :any) => log.youtube_url != ''))
    this.cdr.detectChanges();
  }

  deleteVideoLogForm(index: number) {
    this.videoLogs.removeAt(index);
  }

  onSubmit(): void {
    let video_logs :Array<any> = this.videoLogsForm.value['video_logs'].filter((log :any) =>
      log.youtube_url != ''
    )
    if (video_logs.length == 0) {
      this.errorSnackBar('Youtube URLを入力してください');
    } else {
      this.videoLogService.createNewVideoLogs({video_logs: video_logs}).subscribe(
        success => {
          this.videoLogsForm = this.formBuilder.group({
            video_logs: this.formBuilder.array([])
          });
          this.addVideoLogForm();
          this.openSnackBar('全てのログが登録されました')
        },
        error => {
          this.videoLogsForm = this.formBuilder.group({
            video_logs: this.formBuilder.array([])
          });
          error.error.data.failure.forEach((element: any) => {
            this.videoLogs.push(this.formBuilder.group({
              "youtube_url": element.video_log.youtube_url,
              "note": element.video_log.note,
              "is_recommended?": element.video_log['is_recommended?']
            }));
          });
          this.errorSnackBar('登録に失敗したログがあります、URLを見直してください');
        }
      )
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "close", {
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

  errorSnackBar(message: string) {
    this.snackBar.open(message, "close", {
      panelClass: ['mat-toolbar', 'mat-secondary']
    });
  }
}