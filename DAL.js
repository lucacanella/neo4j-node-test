const neo4j = require('neo4j-driver').v1;

// Graph queries
const 
      CREATE_USER_QUERY = "CREATE (u:User { name: $username }) return u"
    , CREATE_GROUP_QUERY = "CREATE (g:Group { name: $groupname }) return g"
    , CREATE_PERMISSION_QUERY = "CREATE (p:Permission { name: $permission }) return p"
    , CREATE_USER_INDEX = "CREATE INDEX ON :User(name)"
    , CREATE_GROUP_INDEX = "CREATE INDEX ON :Group(name)"
    , CREATE_PERMISSION_INDEX = "CREATE INDEX ON :Permission(name)"
    , CREATE_USER_GROUP_REL_QUERY = "MATCH (a:User { name: $username }), (g:Group { name: $groupname }) CREATE (a)-[:IS_IN]->(g)-[:USERS]->(a)"
    , ADD_USER_PERMISSION_QUERY  = "MATCH (u:User), (p:Permission { name: $permission }) WHERE u.name IN $usernames CREATE (u)-[uc:CAN]->(p) return uc"
    , ADD_GROUP_PERMISSION_QUERY = "MATCH (g:Group), (p:Permission { name: $permission }) WHERE g.name IN $groupnames CREATE (g)-[gc:CAN]->(p) return gc"
    , GET_USERS_IN_ADMINS_QUERY = "MATCH (a:User)-[:IS_IN]->(b:Group { name:$groupname }) return a, b"
    , CLEAR_DATA_QUERY = "OPTIONAL MATCH (u:User), (g:Group), (p:Permission) DETACH DELETE u, g, p"
    , LOAD_USER_GROUP_PERMISSIONS = 
        "MATCH (u:User), (g:Group), (p:Permission) \
        OPTIONAL MATCH (u)-[:IS_IN]->(g) \
        OPTIONAL MATCH (g)-[:CAN]->(p)  \
        OPTIONAL MATCH (u)-[:CAN]->(p) \
        return u, g, p"
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

    createIndexes() {
        return Promise.all([
            this.session.run(CREATE_USER_INDEX),
            this.session.run(CREATE_GROUP_INDEX),
            this.session.run(CREATE_PERMISSION_INDEX)
        ]);
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

    addPermission(permission, username, group) {
        var prom = [];
        prom.push(this.session.run(CREATE_PERMISSION_QUERY, { permission: permission }));
        if(username) {
            let usernames = username instanceof Array ? username : [ username ];
            prom.push(this.session.run(ADD_USER_PERMISSION_QUERY, { usernames: usernames, permission: permission }));
        }
        if(group) {
            let groups = username instanceof Array ? group : [ group ];
            prom.push(this.session.run(ADD_GROUP_PERMISSION_QUERY, { groupnames: groups, permission: permission }));
        }
        return Promise.all(prom);
    }

}

module.exports = DataAccessLayer;