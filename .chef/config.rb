current_dir = File.dirname(__FILE__)
cookbook_path ["#{current_dir}/../cookbooks"]
data_bag_path "#{current_dir}/../data_bags"

node_name 'mynode.example.com'
recipe_url 'https://chef.storm-cdn.com/cookbooks'
rest_timeout 300
role_path '"#{current_dir}/../roles'
sandbox_path 'path_to_folder'
