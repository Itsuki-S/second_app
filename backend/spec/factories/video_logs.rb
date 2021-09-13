FactoryBot.define do
  factory :video_log do
    youtube_url { 'https://www.youtube.com/watch?v=YCeSavxThfo' }
    youtube_title { 'はなお確率漸化式集！名大の呪い...【はなおでんがん 切り抜き】' }
    youtube_duration { 162 }
    is_recommended? { true }
    note { '面白い！' }
    association :user
  end
end
