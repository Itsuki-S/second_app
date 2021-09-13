class CreateVideoLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :video_logs do |t|
      t.integer :user_id, null: false
      t.string :youtube_url, null: false
      t.string :youtube_title
      t.integer :youtube_duration
      t.boolean :is_recommended?, default: false, null: false
      t.string :note

      t.timestamps
    end
    add_index :video_logs, :user_id
    add_index :video_logs, :is_recommended?
  end
end
