@app
begin-app

@static
folder build

@http
get /clear-questions
get /questions
post /ask

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
