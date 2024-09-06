add_formatter :nyan
checksum_path '/var/chef/checksums'
cookbook_path [
               '../cookbooks'
              ]
data_bag_path './data_bags'
environment 'production'
environment_path './tmp/chef/environments'
file_backup_path './tmp/chef/backup'
file_cache_path './tmp/chef/cache'
json_attribs nil
lockfile nil
log_level :info
log_location STDOUT
node_name 'mynode.example.com'
recipe_url 'http://stormsoftware/cookbook'
rest_timeout 300
role_path '/var/chef/roles'
sandbox_path 'path_to_folder'
solo true
syntax_check_cache_path
umask 0022
verbose_logging nil
