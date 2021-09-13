# frozen_string_literal: true

require 'rails_helper'
require 'google/apis/youtube_v3'

RSpec.describe 'VideoLogsLogic::Create' do
  let!(:user) { create(:user) }
  let(:logic) { VideoLogsLogic::Create.new(user) }
  let(:vaild_youtube_response) {
    Google::Apis::YoutubeV3::ListVideosResponse.new(
      items: [
        Google::Apis::YoutubeV3::Video.new(
          content_details: Google::Apis::YoutubeV3::VideoContentDetails.new(
            duration: 'PT2M42S'
          ),
          snippet: Google::Apis::YoutubeV3::VideoSnippet.new(
            title: 'はなお確率漸化式集！名大の呪い'
          )
        )
      ]
    )
  }
  let(:invaild_youtube_response) {
    Google::Apis::YoutubeV3::ListVideosResponse.new(items: [])
  }
  let(:params) {
    {
      youtube_url: 'https://www.youtube.com/watch?v=testtesttest',
      is_recommended?: true,
      note: 'This is nice one'
    }
  }

  describe '#run' do
    context '保存に成功した場合' do
      before do
        service_mock = instance_double(Google::Apis::YoutubeV3::YouTubeService)
        allow(Google::Apis::YoutubeV3::YouTubeService).to receive(:new).and_return(service_mock)
        allow(service_mock).to receive(:key=).and_return('test')
        allow(service_mock).to receive(:list_videos).and_return(vaild_youtube_response)
      end

      it 'VideoLogの数が1つ増えること' do
        expect { logic.run(params) }.to change(VideoLog, :count).by(1)
      end

      it '返り値にエラーが含まれないこと' do
        result = logic.run(params)
        expect(result[:errors]).to eq nil
      end
    end

    context '保存に失敗した場合' do
      before do
        service_mock = instance_double(Google::Apis::YoutubeV3::YouTubeService)
        allow(Google::Apis::YoutubeV3::YouTubeService).to receive(:new).and_return(service_mock)
        allow(service_mock).to receive(:key=).and_return('test')
        allow(service_mock).to receive(:list_videos).and_return(invaild_youtube_response)
      end

      it 'VideoLogの数が増えないこと' do
        expect { logic.run(params) }.to change(VideoLog, :count).by(0)
      end

      it '返り値にエラーが含まれること' do
        result = logic.run(params)
        expect(result[:errors]).to eq({ youtube_url: ['Video not found'] })
      end
    end
  end
end
