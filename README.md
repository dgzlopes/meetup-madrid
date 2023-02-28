# Meetup Madrid

## Set up the demo

Requirements:
- Docker

Run:
```
docker run \
  --rm \
  -p 8080-8083:8080-8083 \
  jaegertracing/example-hotrod:latest \
  all
``` 

Go to http://localhost:6831

## Run examples

Requirements:
- Grafana k6 >= v.43.1

```
k6 run --vus 1 --duration 1s 01.js
echo $?
k6 run 01.js
K6_BROWSER_ENABLED=true k6 run 08-browser.js
```

## Build extension

Requirements:
- Go
- xk6

```
xk6 build --with xk6-internal=.
```