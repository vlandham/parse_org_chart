#!/usr/bin/env ruby

require 'uri'
require 'net/http'
require 'net/https'
require 'json'


body_text = '{"AccountNames":["NORD\\ZBWN"]}'
data = {"AccountNames" => ["NORD\\ZBWN"]}.to_json

URL = "https://mysite/_vti_bin/SilverlightProfileService.json/GetUserSLProfileData"

uri = URI(URL)
https = Net::HTTP.new(uri.host, uri.port)
https.use_ssl = true

# request = Net::HTTP::Post.new(uri.path)
req = Net::HTTP::Post.new(uri.path, initheader = {'Content-Type' =>'application/json'})
# request["Content-Type"] = 'application/json'

req.body = "[ #{data} ]"
# request.body = body_text

# response = https.request(request)
response = https.request(req)

puts response



