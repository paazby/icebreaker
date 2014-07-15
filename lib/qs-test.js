var test = function(){
  querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' })
  // returns 'foo=bar&baz=qux&baz=quux&corge='


}