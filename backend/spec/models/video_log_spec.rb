# frozen_string_literal: true

require 'rails_helper'

RSpec.describe VideoLog, type: :model do

  let(:video_log) { FactoryBot.create(:video_log) }

  describe 'video_log' do
    it '有効なビデオログであること' do
      expect(video_log).to be_valid
    end

    it 'youtube_titleが存在していること' do
      video_log.youtube_title = ''
      expect(video_log).to be_invalid
    end

    it 'youtube_durationが存在していること' do
      video_log.youtube_duration = nil
      expect(video_log).to be_invalid
    end

    it 'youtube_urlが存在していること' do
      video_log.youtube_url = ''
      expect(video_log).to be_invalid
    end

    it 'user_idが存在していること' do
      video_log.user_id = nil
      expect(video_log).to be_invalid
    end
  end

  describe 'duration()' do
    it 'PT--H--M--Sをint(秒)に変換し、youtube_durationに代入すること' do
      video_log.youtube_duration = nil
      duration_str = 'PT1H51M47S'
      video_log.duration(duration_str)
      expect(video_log).to be_valid
      expect(video_log.youtube_duration).to eq 6707
    end
  end
end
