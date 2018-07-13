# Neo4j / node test

A Neo4j / node sample application.

This application creates the following graph on a Neo4j database:

![Graph model](/images/graph.png)

**NB:** This app has been created for test/study purposes.

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
NEO4J_PASS="<your_password>"
```

Watch out for neo4j requires you to change the default password before you can run this application (see Docker paragraph).

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

```bash
node index.js
```

Then you can visit http://localhost:7474/ and run this query to see if it matches our graph model:

```Cypher
MATCH (u:User), (g:Group), (p:Permission)
OPTIONAL MATCH (u)-[:IS_IN]->(g)
OPTIONAL MATCH (g)-[:CAN]->(p) 
OPTIONAL MATCH (u)-[:CAN]->(p)
return u, g, p
```
