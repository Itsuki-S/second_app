# frozen_string_literal: true

module Api
  module V1
    class VideoLogsController < ApplicationController
      before_action :authenticate_api_v1_user!

      def index
        video_logs = if params[:date_param].present?
                       date = params[:date_param].in_time_zone
                       current_api_v1_user.video_logs.where(created_at: date.all_day).order(created_at: :desc)
                     else
                       current_api_v1_user.video_logs.where(created_at: (Time.zone.now.beginning_of_day - 6.days)..Time.zone.now).order(created_at: :desc)
                     end
        render json: { status: 'SUCCESS', message: 'Loaded user logs', data: video_logs }
      end

      def recommended_video_logs
        recommended_video_logs = VideoLog.where(is_recommended?: true).limit(20).order(created_at: :desc)
        render json: { status: 'SUCCESS', message: 'Loaded recommended logs', data: recommended_video_logs }
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

      def destroy
        video_log = current_api_v1_user.video_logs.find(params[:id])
        video_log.destroy
        render json: { status: 'SUCCESS', message: 'Log deleted' }
      end

      private

        def video_logs_params
          params.require(:video_logs).map { |u| u.permit(:youtube_url, :youtube_title, :youtube_duration, :is_recommended?, :youtube_id, :note, :user_id) }
        end
    end
  end
end
