class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.integer :tweet_id
      t.integer :retweet_count
      t.string :coordinates
      t.string :screen_name
      t.string :text
      t.timestamps
    end
  end
end
