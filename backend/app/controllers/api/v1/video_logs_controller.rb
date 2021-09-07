# frozen_string_literal: true

module Api
  module V1
    class VideoLogsController < ApplicationController
      before_action :authenticate_api_user!

      def index
        video_logs = VideoLogs.order(created_at: :desc)
        render json: { status: 'SUCCESS', message: 'Loaded logs', data: video_logs }
      end

      def create
        succeeded_logs = []
        failed_logs = []
        video_logs_params.each do |params|
          video_log = VideoLog.new(params)
          if video_log.save
            succeeded_logs << video_log
          else
            failed_logs << { video_log: video_log, errors: video_log.errors }
          end
        end

        if failed_logs.empty?
          render json: {
            status: 'SUCCESS',
            data: { success: succeeded_logs }
          }
        else
          render json: {
            status: 'ERROR',
            data: {
              success: succeeded_logs,
              failure: failed_logs
            }
          }
        end
      end

      private

        def video_logs_params
          params.require(:video_logs).map { |u| u.permit(:youtube_url, :youtube_title, :youtube_duration, :is_recommended?, :note, :date, :user_id) }
        end
    end
  end
end
