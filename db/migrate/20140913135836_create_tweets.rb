class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.integer :tweet_id
      t.integer :retweet_count
      t.integer :favourite_count
      t.string :role
      t.string :coordinates
      t.string :screen_name
      t.string :text
      t.string :image
      t.string :profile_pic
      t.timestamps
    end
  end
end
