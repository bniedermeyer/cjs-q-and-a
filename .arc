@app
begin-app

@aws
region us-west-2

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
