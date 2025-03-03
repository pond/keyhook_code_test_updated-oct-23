# This is "require"'d by "app.rb" after all other dependencies but before any
# code thereafter is run.

# Default items-per-page.
#
DEFAULT_PAGE_SIZE = 10

# Maximum items-per-page. Note that the underlying Graphiti API engine in use
# has a hard-limit of 1000, so setting max size higher than that will not work.
#
MAX_PAGE_SIZE = 100

# Default sort order.
#
DEFAULT_SORT_ORDER = 'created_at' # I.e. "ORDER BY created_at ASC

# Combined defaults as an overridable params bundle for the controller to use.
# Keys must be strings, as parameter bundles from inbound requests are merged
# on top of this and Sinatra does not use HashWithIndifferentAccess for that.
#
# See also:
#
#   https://www.graphiti.dev/guides/concepts/resources#query-interface
#
DEFAULT_PARAMS = {
  'page'  => { 'size' => DEFAULT_PAGE_SIZE, 'number' => 1 },
  'order' => DEFAULT_SORT_ORDER
}
