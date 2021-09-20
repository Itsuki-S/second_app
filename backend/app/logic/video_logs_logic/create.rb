# frozen_string_literal: true

require 'google/apis/youtube_v3'
require 'active_support/all'

module VideoLogsLogic
  class Create
    GOOGLE_API_KEY = ENV['YOUTUBE_API_KEY']

    def initialize(current_user)
      @current_user = current_user
      @service = Google::Apis::YoutubeV3::YouTubeService.new
      @service.key = GOOGLE_API_KEY
    end

    def run(params)
      video_log = @current_user.video_logs.build(params)
      # youtube動画のid取得
      video_log.setting_youtube_id(params[:youtube_url])
      # video_id = video_log.youtube_url.sub('https://www.youtube.com/watch?v=', '').sub('https://youtu.be/', '').split('&')[0]
      # youtube APIの呼び出しとレスポンスの代入
      response = @service.list_videos('snippet, contentDetails', id: video_log.youtube_id)

      # レスポンスが空である場合はfailureに入れる
      if response.items.empty?
        return { video_log: video_log, errors: { youtube_url: ['Video not found'] } }
      end

      # 動画時間と動画タイトルの代入
      video_log.duration(response.items[0].content_details.duration)
      video_log.youtube_title = response.items[0].snippet.title

      # 保存
      if video_log.save
        { video_log: video_log }
      else
        { video_log: video_log, errors: video_log.errors }
      end
    end
  end
end
