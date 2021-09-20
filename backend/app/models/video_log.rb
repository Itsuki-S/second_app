# frozen_string_literal: true

class VideoLog < ApplicationRecord
  belongs_to :user
  validates :youtube_title, :youtube_duration, :youtube_url, :youtube_title, :user_id, presence: true
  validates :is_recommended?, inclusion: [true, false]

  # iso8601形式の動画時間をintegerに変換してyoutube_durationに代入
  def duration(duration_str)
    duration_allay = duration_str.sub('PT', '').split(/([A-Z])/)
    duration = 0
    (duration_allay.size / 2).times do
      value = duration_allay.pop
      case value
      when 'S'
        duration += duration_allay.pop.to_i
      when 'M'
        duration += duration_allay.pop.to_i * 60
      when 'H'
        duration += duration_allay.pop.to_i * 60 * 60
      end
    end
    self.youtube_duration = duration
  end

  def setting_youtube_id(youtube_url)
    self.youtube_id = youtube_url.sub('https://www.youtube.com/watch?v=', '').sub('https://youtu.be/', '').split('&')[0]
  end
end
