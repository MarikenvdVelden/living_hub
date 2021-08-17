Living Hub GUI + Server
===========

This is the repository for the OPTED WP6 Living Hub, containing the R code, Server, and the web client

Installing
----------

There should not be much to install, all components come with their virtual environment, you just need to download the code and follow the setup.

Aside from the components, we use Elasticsearch for storing the records. We suggest you use docker to get an elastic image and run it. You can find the guide on installing docker here: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

After installing docker, you need to following commands to get an image for elastic:

```
# creates a docker network (skip if you dont want kibana)
docker network create elastic
# pulls the docker image for elastic
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.14.0
# runs the elastic image, effectively preparing your database
docker run --name es01-test --net elastic -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.14.0
# pulls kibana image. Kibana is used to keep tabs on the elastic database, skip if not developing
docker pull docker.elastic.co/kibana/kibana:7.14.0
# runs kibana
docker run --name kib01-test --net elastic -p 5601:5601 -e "ELASTICSEARCH_HOSTS=http://es01-test:9200" docker.elastic.co/kibana/kibana:7.14.0
```

Setup
----------
After making sure that your elasticsearch db is running without any issues, you need to run the server and the web client.

To run the server, open a terminal window, navigate to the server home directory, and run the following command:
```
# run this if it is the first time running the server
venv/bin/python -m livingHub --create-test-index
# run this if you have created the database before
venv/bin/python -m livingHub
```

To run the web client, open a terminal window, navigate to the webClient directory and run the following command:
```
npm start
```

Usage
====

By default, the webClient is available on port 3000. Open a browser and go to `localhost:3000`
