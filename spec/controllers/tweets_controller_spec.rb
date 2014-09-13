require 'rails_helper'

RSpec.describe TweetsController, :type => :controller do
  
  it "connects to the controller" do
    get :search
    expect(response).to be_success
  end

end
