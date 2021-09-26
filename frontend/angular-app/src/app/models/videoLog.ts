export class VideoLog {
  constructor(
    public id: number,
    public user_id: number,
    public youtube_url: string,
    public youtube_id: string,
    public youtube_title: string,
    public youtube_duration: number,
    public youtube_duration_str: string,
    public note: string,
    public is_recommended: boolean,
    public created_at: Date
  ) {}

  public static fromJson(jsonObject: any): VideoLog {
    let video_sec = jsonObject.youtube_duration
    let duration_str
    if (video_sec >= 3600) {
      let sec = (video_sec % 60) % 60;
      let min = Math.floor(video_sec / 60) % 60;
      let hour = Math.floor(video_sec / 3600);
      duration_str = `${hour}時間${min}分${sec}秒`
    } else if(video_sec >= 60) {
      var min = Math.floor(video_sec / 60);
      var sec = video_sec % 60;
      duration_str = `${min}分${sec}秒`
    } else {
      duration_str = `${video_sec}秒`
    }

    return new VideoLog(
      jsonObject.id,
      jsonObject.user_id,
      jsonObject.youtube_url,
      jsonObject.youtube_id,
      jsonObject.youtube_title,
      jsonObject.youtube_duration,
      duration_str,
      jsonObject.note,
      jsonObject["is_recommended?"],
      jsonObject.created_at
    );
  }
}