# Neo4j / node test

A simple Neo4j / node test application.

## Installation

Start by installing node modules, and creating an empty .env file:

```bash
npm install
touch .env
```

Then add configuration parameters to your .env file:
```
NEO4J_URL="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASS="neo4j"
```

### Docker

Set the NEO4J_DATA_HOME directory, that will be used to persist neo4j data, then pull and run the official Neo4j docker image as shown in the official site: https://neo4j.com/developer/docker/

```bash
export NEO4J_DATA_HOME=/home/user/neo4j/data
docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$NEO4J_DATA_HOME/data:/data \
    --volume=$NEO4J_DATA_HOME/logs:/logs \
    neo4j:3.0
```

When Neo4j container has been started, visit http://localhost:7474/ and you can change database password (defaults are neo4j/neo4j).

Remember to update the NEO4J_PASS parameter, in your .env file, to match the newly inserted password.

## Run

Just run and see if this works.
