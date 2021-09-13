# frozen_string_literal: true

module Api
  module V1
    class VideoLogsController < ApplicationController
      before_action :authenticate_api_v1_user!

      def index
        video_logs = VideoLog.order(created_at: :desc)
        render json: { status: 'SUCCESS', message: 'Loaded logs', data: video_logs }
      end

      def create
        succeeded_logs = []
        failed_logs = []
        video_logs_params.each do |params|
          logic = VideoLogsLogic::Create.new(current_api_v1_user)
          result = logic.run(params)
          if result[:errors].nil?
            succeeded_logs << result
          else
            failed_logs << result
          end
        end

        if failed_logs.empty?
          render status: :ok, json: {
            status: 200,
            data: { success: succeeded_logs }
          }
        else
          render status: :bad_request, json: {
            status: 400,
            data: {
              success: succeeded_logs,
              failure: failed_logs
            }
          }
        end
      end

      private

        def video_logs_params
          params.require(:video_logs).map { |u| u.permit(:youtube_url, :youtube_title, :youtube_duration, :is_recommended?, :note, :user_id) }
        end
    end
  end
end
