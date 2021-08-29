# frozen_string_literal: true

# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

ActionMailer::Base.smtp_settings = {
  address: 'smtp.gmail.com',
  enable_starttls_auto: true,
  port: 587,
  authentication: :plain,
  domain: 'gmail.com',
  user_name: ENV['MAIL_USERNAME'],
  password: ENV['MAIL_PASSWORD'],
  openssl_verify_mode: 'none'
}
