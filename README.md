# Japan Go Web

Japan Go Web is a Nodejs express

## Installation

Use the package manager [Nodejs](https://nodejs.org/en/download/) to install Japan Go Webr.

```bash
nmp install   
```
Download the Cloud SQL Auth proxy [cloud_sql_proxy](https://cloud.google.com/sql/docs/mysql/connect-admin-proxy#install) and select Save Link As to the Cloud SQL Auth proxy. Rename the file to cloud_sql_proxy.exe

```cmd
cloud_sql_proxy.exe -instances=[INSTANCE_CONNECTION_NAME]=tcp:3306
```
example 
```cmd 
cloud_sql_proxy.exe -instances=japan-go-explore-348416:asia-southeast1:cloud-group-4=tcp:3306
2022/05/03 09:07:50 Listening on 127.0.0.1:3306 for japan-go-explore-348416:asia-southeast1:cloud-group-4
2022/05/03 09:07:50 Ready for new connections
2022/05/03 09:07:50 Generated RSA key in 128.0479ms
```

## Run

```python
node app.js
or
node .
# start port 8080
Server listening on 8080
```

## License
[ISC](https://www.isc.org/licenses/)