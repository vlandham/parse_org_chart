#!/usr/bin/env ruby

require 'json'


# START_DIR = "data/raw"
# NETWORK_DIR = "data/network"

START_DIR = ARGV[0]
FLAT_DIR = START_DIR + "/flat"
NETWORK_DIR = START_DIR + "/network"

system "mkdir -p #{FLAT_DIR}"
system "mkdir -p #{NETWORK_DIR}"

def get_name node
  node['Properties'].each do |props|
    if props[0] == 'DisplayName'
      return props[1]
    end
  end

  "unknown"
end

def get_properties node
  properties = {}
  node['Properties'].each do |props|
    properties[props[0]] = props[1]
  end
  properties
end

def find_childs node, all
  if node['Children'].length > 0
    node['children'] = []
  end
  node['properties'] = get_properties(node)
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

def get_file filename
  raw_data = JSON.parse(File.open(filename, 'r').read)

  raw_data = raw_data.flatten

  puts raw_data.length
  raw_data
end

def parse_file raw_data
  users = {}

  raw_data.each do |user|
    users[user['ProfileId']] = user
  end

  puts users.length

  top = raw_data[0]
  puts top

  top = find_childs(top, users)
  top
end


raw_files = Dir.glob(File.join(START_DIR, "*.json"))

top_node = {"name" => "Nordstrom, Blake", "children" => [], 'properties' => {"Title" => "President"}}
raw_files.each do |raw_filename|

  raw_data = get_file(raw_filename)
  flat_filename = File.join(FLAT_DIR, File.basename(raw_filename, File.extname(raw_filename)) + "_flat.json")
  File.open(flat_filename, 'w') do |file|
    file.puts JSON.pretty_generate(JSON.parse(raw_data.to_json))
  end

  top = parse_file(raw_data)
  network_filename = File.join(NETWORK_DIR, File.basename(raw_filename, File.extname(raw_filename)) + "_network.json")
  File.open(network_filename, 'w') do |file|
    file.puts JSON.pretty_generate(JSON.parse(top.to_json))
  end

  top_node['children'].push(top)

end


network_filename = File.join(NETWORK_DIR,  "all_network.json")
File.open(network_filename, 'w') do |file|
  file.puts JSON.pretty_generate(JSON.parse(top_node.to_json))
end
