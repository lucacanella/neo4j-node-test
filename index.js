require('dotenv').config();
const neo4j = require('neo4j-driver').v1;

//gather env variables
const 
      neo4j_url = process.env.NEO4J_URL
    , neo4j_user = process.env.NEO4J_USER
    , neo4j_pass = process.env.NEO4J_PASS
    ;

// connect to neo4j and create a new session
console.log('Neo4j connect to: ', neo4j_url, neo4j_user);
const driver = neo4j.driver(neo4j_url, neo4j.auth.basic(neo4j_user, neo4j_pass));
const session = driver.session();

// Some consts
const 
      user_1 = "Luca"
    , user_2 = "Mina"
    , admins_group = "Admins"
    ;

// Graph queries
const 
      create_user_query = "CREATE (n:User { name: $username }) return n"
    , create_group_query = "CREATE (n:Group { name: $groupname }) return n"
    , create_user_group_rel_query = "MATCH (a:User { name: $username }), (g:Group { name: $groupname }) CREATE (a)-[:IS_IN]->(g)-[:USERS]->(a)"
    , get_users_in_admins_query = "MATCH (a:User)-[:IS_IN]->(b:Group { name:$groupname }) return a, b"
    , delete_all = "MATCH (a:User)-[:IS_IN]->(g:Group) DETACH DELETE a, g"
    ;

Promise.all([
    //delete all users
    session.run(delete_all),
    //create user 1
    session.run(
        create_user_query,
        { username: user_1 }
    ),
    //create user 2
    session.run(
        create_user_query,
        { username: user_2 }
    ),
    //create group
    session.run(
        create_group_query,
        { groupname: admins_group }
    ),
    //add user 1 to group
    session.run(
        create_user_group_rel_query,
        { username: user_1, groupname: admins_group }
    ),
    //add user 2 to group
    session.run(
        create_user_group_rel_query,
        { username: user_2, groupname: admins_group }
    )
]).then(() => {

    // get all users in group
    const resultPromise = session.run(
        get_users_in_admins_query,
        { groupname: admins_group }
    );

    resultPromise.then(result => {
        session.close();

        console.log("Results: ");
        result.records.forEach((r) => {
            console.log(r.get(0));
        });

        // on application exit:
        driver.close();
    });

});