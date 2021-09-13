# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::VideoLogs', type: :request do
  let!(:user) { create(:user) }
  let(:video_contents) {
    {
      youtube_url: 'https://www.youtube.com/watch?v=testtesttest',
      is_recommended?: true,
      note: 'This is nice one'
    }
  }

  def auth_headers
    post '/api/v1/auth/sign_in', params: { email: user['email'], password: 'password' }
    { 'uid' => response.header['uid'], 'client' => response.header['client'], 'access-token' => response.header['access-token'] }
  end

  describe 'POST /api/v1/video_logs' do
    context 'ログインしていない場合' do
      it 'status 401が返されること' do
        logic_mock = instance_double(VideoLogsLogic::Create)
        allow(VideoLogsLogic::Create).to receive(:new).and_return(logic_mock)
        allow(logic_mock).to receive(:run).and_return({})

        post '/api/v1/video_logs', params: {
          video_logs: [
            video_contents
          ]
        }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context '全てのログが作成できた場合' do
      it 'status 200が返されること' do
        logic_mock = instance_double(VideoLogsLogic::Create)
        allow(VideoLogsLogic::Create).to receive(:new).and_return(logic_mock)
        allow(logic_mock).to receive(:run).and_return({})

        post '/api/v1/video_logs', headers: auth_headers, params: {
          video_logs: [
            video_contents
          ]
        }
        expect(response).to have_http_status(:ok)
      end
    end

    context '1つでも作成に失敗した場合' do
      it 'status 400が返されること' do
        logic_mock = instance_double(VideoLogsLogic::Create)
        allow(VideoLogsLogic::Create).to receive(:new).and_return(logic_mock)
        allow(logic_mock).to receive(:run).and_return({ errors: {} })

        post '/api/v1/video_logs', headers: auth_headers, params: {
          video_logs: [
            video_contents
          ]
        }
        expect(response).to have_http_status(:bad_request)
      end
    end
  end
end
