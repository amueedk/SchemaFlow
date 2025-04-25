const knexConfig = require("../knexConfig");
const { v4: uuidv4 } = require('uuid');
const knex = require('knex');
const { authorize } = require("../authorize");
const Knex = knex(knexConfig);

const index = async (req, res) => {
  const username = req.query.username;
  const userToken = req.query.userToken;


  const knexQuery = `Select * from sessions 
  where sessions.session_id in (
      Select r.session_id from roles r, users u, roles_members rm 
      where rm.role_id = r.role_id and rm.username = :username 
      group by r.session_id 
  ); `

  const query = await Knex.raw(knexQuery, {
    username: username
  })
  const sessions = query.rows.map((row) => {
    return {
      id: row.session_id,
      name: row.session_name,
      description: row.description
    }
  })
  res.json({ sessions: sessions });

};

const getName = async (req, res) => {
  const { sessionId } = req.query;
  const sessionName = await Knex('sessions').select('session_name').where('session_id', sessionId);

  res.json({ name: sessionName[0].session_name })

}

const sidebar = async (req, res) => {
  const sessionId = req.query.sessionId;
  const username = req.query.username;
  const userToken = req.query.userToken;

  if (!authorize(userToken, username)) {
    res.sendStatus(404);
    return;
  }

  const data = {
    name: '',
    Members: { view: true, edit: true },
    CreateTable: true,
    tables: [
      { id: 1, title: 'Table 1', view: true, edit: true },
      { id: 2, title: 'Table 2', view: true, edit: true },
      { id: 3, title: 'Table 3', view: true, edit: true },
    ]
  };

  // console.log(username, sessionId);

  const permissionQuery = await Knex.raw(
    `Select * from roles r, roles_members rm
    where rm.role_id = r.role_id and rm.username= :username and r.session_id = :session_id`, {
    username: username,
    session_id: sessionId
  });

  const viewTablesQuery = await Knex.raw(
    `Select t_id from roles_table_view rt, roles r, roles_members rm 
    where rt.role_id = r.role_id and r.role_id = rm.role_id and rm.username= :username and r.session_id = :session_id
    group by t_id`, {
    username: username,
    session_id: sessionId
  });

  const editTablesQuery = await Knex.raw(
    `Select t_id from roles_table_edit rt, roles r, roles_members rm 
    where rt.role_id = r.role_id and r.role_id = rm.role_id and rm.username= :username and r.session_id = :session_id
    group by t_id`, {
    username: username,
    session_id: sessionId
  });

  const nameQuery = await Knex.raw('Select session_name from sessions where session_id = :session_id', {
    session_id: sessionId
  });

  const tableQuery = await Knex.raw(`Select t_name, t_id from tables_ where session_id= :session_id`, {
    session_id: sessionId,
  });

  const queryData = {
    name: nameQuery.rows[0].session_name,
    Members: { view: permissionQuery.rows[0].role_view, edit: permissionQuery.rows[0].role_edit },
    CreateTable: permissionQuery.rows[0].table_create,
    tables: tableQuery.rows.map(table => {

      return {
        id: table.t_id,
        title: table.t_name,
        view: viewTablesQuery.rows.map(row => row.t_id).includes(table.t_id),
        edit: editTablesQuery.rows.map(row => row.t_id).includes(table.t_id),
      }
    })
  }

  // console.log(queryData);

  res.json(queryData);
};

const sessionCreate = async (req, res) => {
  const username = req.body.username;
  const newSession = { id: uuidv4(), name: '(new session)', description: '' };

  await Knex.raw('Insert into sessions (session_id, session_name, description) values (:session_id, :session_name, :description) ', {
    session_id: newSession.id,
    session_name: newSession.name,
    description: newSession.description,
  })

  const newRole = uuidv4();
  await Knex.raw(`
    Insert into roles (role_name, color, role_id, session_id, table_create, role_view, role_edit) 
    values (:name, :color, :role_id, :session_id, true, true, true)`, {
    color: 'cyan',
    name: 'default',
    role_id: newRole,
    session_id: newSession.id
  })


  await Knex.raw('Insert into roles_members (role_id, username) values (:role_id, :username )', {
    role_id: newRole,
    username: username
  })

  console.log('queries ran successfully');
  res.json(newSession);
}

const sessionDelete = async (req, res) => {
  const { sessionId } = req.body;
  console.log('delete request for ', sessionId);

  await Knex.raw('Delete from sessions where session_id = :sessionId', {
    sessionId: sessionId,
  })

  console.log("Delete session query ran successfully");
  res.sendStatus(200);
}

const detail = async (req, res) => {
  const sessionId = req.query.sessionId;
  // const detail = {name: 'Session', description: 'hello'}; 

  const query = await Knex.raw('Select * from sessions where session_id = :sessionId', {
    sessionId: sessionId
  });

  const detail = {
    name: query.rows[0].session_name,
    description: query.rows[0].description
  }
  console.log(detail);


  res.json(detail);
}

const detailUpdate = async (req, res) => {
  const { sessionId, detail } = req.body;
  console.log(sessionId, detail);

  const query = await Knex.raw('Update sessions set session_name = :name, description = :description where session_id = :sessionId', {
    sessionId: sessionId,
    name: detail.name,
    description: detail.description
  });

  console.log('Detail update query ran successfully');
  res.sendStatus(200);
}



module.exports = {
  index,
  sidebar,
  getName,
  sessionCreate,
  sessionDelete,
  detail,
  detailUpdate
};
