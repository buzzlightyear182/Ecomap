require 'rubygems'
require 'oauth'
require 'json'
class TweetsController < ApplicationController
  
  def search
    consumer_key = OAuth::Consumer.new(
        "ib3vpCDC4AWcijwBIHbXbp6Wd",
        "NBDzLE1BQ2kn3kvmILvql8jVtME3ItYRTPCFBjCj6qFjkmKjIj")
    access_token = OAuth::Token.new(
        "481522636-XJVwhxa8ccmPieXXuYzEDfX7esrkRuEN0XtA2QXv",
        "UwQZVR6kJYFULRjYad53FLkaI1D69uX2UWFBhe72MYRze")
    tweets =[]
    hashtags = ['climatechange', 'savetheworld', 'hack4good']
    hashtags.each do |hashtag|
      address = URI("https://api.twitter.com/1.1/search/tweets.json?q=%23#{hashtag}&count=100")

      address = URI("https://api.twitter.com/1.1/search/tweets.json?q=%23#{hashtag}&result_type=popular") if hashtag == 'hack4good'

      http = Net::HTTP.new address.host, address.port
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_PEER

      request = Net::HTTP::Get.new address.request_uri
      request.oauth! http, consumer_key, access_token

      http.start
      response = http.request request

      response = JSON.parse(response.body)

      tweets = choose_data_from response

      tweets = choose_tweets_from tweets
           

      tweets.each do |tweet|
        db_tweet = Tweet.find_by(tweet_id: tweet['tweet_id'])
        if db_tweet && db_tweet.tweet_id == tweet['tweet_id']
          puts 'not creating tweets'
          db_tweet.update(tweet)
        else
          puts 'creating tweets'
          hashtag == 'hack4good' ? Ourtweet.create(tweet) : Tweet.create(tweet);
        end
      end
    end
    render :json => tweets.to_json 
  end

  def good_points
    tweets = Ourtweet.all
    render :json => tweets.to_json
  end

  def bad_points
    tweets = Tweet.all
    render :json => tweets.to_json
  end

  private

  def choose_data_from response
    tweets = []
    response['statuses'].map do |status|
      tweet = {}
      tweet['retweet_count'] = status['retweet_count'].to_i
      tweet['favourite_count'] =  status['favorite_count'].to_i
      tweet['tweet_id'] = status['id'].to_i
      tweet['text'] =  status['text']
      tweet['image'] =  status['entities']['media'][0]['media_url'] if status['entities']['media']


      uri = "http://maps.googleapis.com/maps/api/geocode/json?address=#{status['user']['location']}"
      encoded_uri = URI::encode(uri)
      address = URI.parse(encoded_uri)

      http = Net::HTTP.new address.host, address.port
      request = Net::HTTP::Get.new address.request_uri
      http.start
      response = http.request request
      locations = JSON.parse(response.body)
      coordinates = locations['results'][0]['geometry']['location'] if locations['results'][0]
      string_cordinates = "#{coordinates['lat']}, #{coordinates['lng']}" if coordinates

      tweet['coordinates'] = string_cordinates
      tweet['screen_name'] = status['user']['screen_name']
      tweet['profile_pic'] = status['user']['profile_image_url']
      tweets << tweet
    end
    tweets
  end

  def choose_tweets_from tweets
    puts tweets.size
    tweets.sort!{|x, y| y['retweet_count'] <=> x['retweet_count'] } 
    tweets.reject!{|tweet| tweet['coordinates']==nil}
    tweets
  end

end
 