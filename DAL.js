const neo4j = require('neo4j-driver').v1;

// Graph queries
const 
      CREATE_USER_QUERY = "CREATE (n:User { name: $username }) return n"
    , CREATE_GROUP_QUERY = "CREATE (n:Group { name: $groupname }) return n"
    , CREATE_USER_GROUP_REL_QUERY = "MATCH (a:User { name: $username }), (g:Group { name: $groupname }) CREATE (a)-[:IS_IN]->(g)-[:USERS]->(a)"
    , GET_USERS_IN_ADMINS_QUERY = "MATCH (a:User)-[:IS_IN]->(b:Group { name:$groupname }) return a, b"
    , CLEAR_DATA_QUERY = "MATCH (a:User)-[:IS_IN]->(g:Group) DETACH DELETE a, g"
    ;

class DataAccessLayer {
    constructor(url, username, password) {
        this.driver = neo4j.driver(url, neo4j.auth.basic(username, password));
        this.session = this.driver.session();
    }

    closeSession() {
        this.session.close();
    }

    closeDriver() {
        this.driver.close();
    }

    close() {
        this.closeSession();
        this.closeDriver();
    }

    clearAllData() {
        return this.session.run(CLEAR_DATA_QUERY);
    }

    createUser(username) {
        return this.session.run(
            CREATE_USER_QUERY,
            { username: username }
        )
    }

    createGroup(groupName) {
        return this.session.run(
            CREATE_GROUP_QUERY,
            { groupname: groupName }
        )
    }

    addUserToGroup(username, groupName) {
        return this.session.run(
            CREATE_USER_GROUP_REL_QUERY,
            { username: username, groupname: groupName }
        )
    }

    getUsersInGroup(groupName) {
        return this.session.run(
            GET_USERS_IN_ADMINS_QUERY,
            { groupname: groupName }
        )
    }

}

module.exports = DataAccessLayer;