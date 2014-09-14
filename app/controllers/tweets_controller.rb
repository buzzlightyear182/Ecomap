require 'rubygems'
require 'oauth'
require 'json'
class TweetsController < ApplicationController
  
  def search
    consumer_key = OAuth::Consumer.new(
        "nltaV4viO0zaYgNa2GrWsO71p",
        "n0wkjZ2x8N4xoUEu5UI92D2EgYs82Hg1ZEy2BOLY4u1PemBAv4")
    access_token = OAuth::Token.new(
        "481522636-XJVwhxa8ccmPieXXuYzEDfX7esrkRuEN0XtA2QXv",
        "UwQZVR6kJYFULRjYad53FLkaI1D69uX2UWFBhe72MYRze")

    hashtag = 'hack4good'

    address = URI("https://api.twitter.com/1.1/search/tweets.json?q=%23#{hashtag}&result_type=popular")

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
    
    render :json => tweets.to_json
  end

  private

  def choose_data_from response
    tweets = []
    response['statuses'].map do |status|
      tweet = {}
      tweet['retweet_count'] = status['retweet_count'].to_i
      tweet['favourites_count'] =  status['favorite_count'].to_i
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

      tweet['location'] = string_cordinates
      tweet['screen_name'] = status['user']['screen_name']
      tweets << tweet
    end
    tweets
  end

  def choose_tweets_from tweets
    tweets.sort!{|x, y| y['retweet_count'] <=> x['retweet_count'] } 
    tweets.reject!{|tweet| tweet['location']==nil}
    tweets
  end

end
