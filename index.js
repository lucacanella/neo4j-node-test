require('dotenv').config();
const DataAccessLayer = require('./DAL');

//gather env variables
const 
      neo4j_url = process.env.NEO4J_URL
    , neo4j_user = process.env.NEO4J_USER
    , neo4j_pass = process.env.NEO4J_PASS
    ;

// connect to neo4j and create a new session
console.log('Neo4j connect to: ', neo4j_url, neo4j_user);
var dal = new DataAccessLayer(neo4j_url, neo4j_user, neo4j_pass);

// Some consts
const 
      USER_1 = "Luca"
    , USER_2 = "Mina"
    , ADMINS_GROUP = "Admins"
    ;

console.log('Setting up...');
//initial setup
Promise.all([
    //delete all users
    dal.clearAllData(),
    //create user 1
    dal.createUser(USER_1),
    //create user 2
    dal.createUser(USER_2),
    //create group
    dal.createGroup(ADMINS_GROUP),
    //add user 1 to group
    dal.addUserToGroup(USER_1, ADMINS_GROUP),
    //add user 2 to group
    dal.addUserToGroup(USER_2, ADMINS_GROUP),
]).then(() => {

    console.log('Setup ok. Retreiving users.');
    // get all users in group
    dal.getUsersInGroup(ADMINS_GROUP)
        .then(result => {
            console.log("Results: ");
            result.records.forEach((r, k) => {
                console.log("User ", k, r.get(0).properties.name);
            });
            // on application exit:
            dal.close();
        });

});