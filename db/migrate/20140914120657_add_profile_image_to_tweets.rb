class AddProfileImageToTweets < ActiveRecord::Migration
  def change
  	add_column :ourtweets, :user_image, :string
  end
end
