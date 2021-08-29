FactoryBot.define do
  factory :video_log do
    uid { 1 }
    youtube_ulr { "MyString" }
    youtube_title { "MyString" }
    youtube_duration { "MyString" }
    is_recommended? { false }
    note { "MyString" }
    date { "" }
  end
end
