# Next.js Teslo Shop app

To run the app you need to set up the DB

```
docker-compose up -d 
```

* -d will run the container on __detached__ mode

- Mongo DB URL local:
```
mongodb://localhost:27017/tesloShop
```

## Configure ENV's
Rename the file __.env.template__ to __.env__

## Run seed to fill the DB entries
```
run http://localhost:3000/api/seed
```