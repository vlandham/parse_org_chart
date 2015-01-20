#!/usr/bin/env ruby

require 'json'


FILENAME = "data/pete_nordstrom.json"
RAW_OUTPUT = "data/pete_raw.json"
OUTPUT_FILENAME = "data/pete_network.json"

raw_data = JSON.parse(File.open(FILENAME, 'r').read)

raw_data = raw_data.flatten

puts raw_data.length

File.open(RAW_OUTPUT, 'w') do |file|
  file.puts JSON.pretty_generate(JSON.parse(raw_data.to_json))
end

users = {}

raw_data.each do |user|
  users[user['ProfileId']] = user
end

puts users.length

top = raw_data[0]
puts top

def get_name node
  node['Properties'].each do |props|
    if props[0] == 'DisplayName'
      return props[1]
    end
  end

  "unknown"
end

def find_childs node, all
  if node['Children'].length > 0
    node['children'] = []
  end
  node['name'] = get_name(node)
  node['Children'].each do |child_id|
    child = all[child_id]
    child = find_childs(child, all)
    if !child
      puts "ERROR: no child found for #{node['ProfileId']} : #{child_id}"
    else
      node['children'].push(child)
    end
  end
  node
end

top = find_childs(top, users)

File.open(OUTPUT_FILENAME, 'w') do |file|
  file.puts JSON.pretty_generate(JSON.parse(top.to_json))
end


