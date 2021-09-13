FactoryBot.define do
  factory :user do
    name { 'test' }
    email { 'user@email.com' }
    password { 'password' }
    password_confirmation { 'password' }
    confirmed_at { Time.zone.now }
  end
end
