#!/usr/bin/env ruby

require 'json'
require 'csv'

NETWORK_FILE = ARGV[0]

TABLE_FILE = File.join(File.dirname(NETWORK_FILE), "table.tsv")

raw_data = JSON.parse(File.open(NETWORK_FILE, 'r').read)
puts raw_data.length


def get_title node
  title = "unknown"
  if node['Properties']
    node['Properties'].each do |props|
      if props[0] == 'Title'
        title = props[1]
        if !title
          title = "unknown"
        end
      end
    end
  end
  if title == "unknown"
    if node["name"]
      if node['name'] =~ /(\(.+\))/
        title = $1.gsub("(","").gsub(")","")
        # node["name"] = node["name"].gsub("(#{title})","") if node["name"]
      end
    end
  end
  if !title
    title = "unknown"
  end
  title.downcase()
end

def get_id node
  my_id = node["ProfileId"]
  if my_id
    my_id = my_id.split("\\")[1].upcase()
  else
    my_id = 'unknown'
  end
  my_id
end

def get_department node
    value = "unknown"
  if node['Properties']
    node['Properties'].each do |props|
      if props[0] == 'Department'
        value = props[1]
        if !value
          value = "unknown"
        else
          value = value.downcase()
        end
      end
    end
  end
  value.downcase()
end

def get_name node
  name = ""
  if node["name"]
    name = node["name"]
    name = name.gsub(/(\(.+\))/,"").strip().downcase()
  end
  name.downcase()
end

def get_sibs_count node
  count = 0
  if node['Siblings']
    count = node['Siblings'].length
  end
  count
end

def find_childs node, pos, table, chain
  if !node['children']
    # puts "no kids on #{name}"
    node['children'] = []
  end

  name = get_name(node)
  title = get_title(node)
  my_id = get_id(node)
  department = get_department(node)
  child_count = node['children'].length
  sibling_count = get_sibs_count(node)

  table << [name, title, pos, my_id, department, child_count, sibling_count, chain]

  node['children'].each do |child|
    find_childs(child, pos + 1, table, chain + " | " + name)
  end
  node
end

table = []
find_childs(raw_data, 1, table, "")

puts table.length

CSV.open(TABLE_FILE, "wb", :col_sep => "\t") do |csv|
  csv << ["name", "title", "tree_pos", "id", "department", "child_count", "sibling_count", "chain"]
  table.each do |row|
    csv << row
  end
end
