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

    def run(video_logs_params)
      succeeded_logs = []
      failed_logs = []
      video_logs = []
      video_ids = []
      video_logs_params.each do |params|
        video_log = @current_user.video_logs.build(params)
        # youtube動画のid取得
        video_log.setting_youtube_id(params[:youtube_url])
        video_ids << video_log.youtube_id
        video_logs << video_log
      end
      # 投稿されたyoutube_idを1つにまとめてリクエストする
      response = @service.list_videos('snippet, contentDetails', id: video_ids)

      i = 0
      video_logs.each do |video_log|
        item = response.items[i]
        if item.nil? || video_log.youtube_id != item.id
          failed_logs << { video_log: video_log, errors: { youtube_url: ['Video not found'] } }
        else
          video_log.duration(item.content_details.duration)
          video_log.youtube_title = item.snippet.title
          if video_log.save
            succeeded_logs << { video_log: video_log }
          else
            failed_logs << { video_log: video_log, errors: video_log.errors }
          end
          i += 1
        end
      end

      { succeeded_logs: succeeded_logs, failed_logs: failed_logs }
    end
  end
end
