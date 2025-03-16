require 'rack/jekyll'
require 'rack/rewrite'

use Rack::Rewrite do
  # Strip .html from URLs
  r301 %r{^/(.*)\.html$}, '/$1'
  
  # Handle trailing slashes properly
  r301 %r{^/(.+)/$}, '/$1'
end

run Rack::Jekyll.new