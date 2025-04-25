const knexConfig = require('../knexConfig');
const knex = require('knex');
const Knex = knex(knexConfig);
const { v4: uuidv4 } = require('uuid');
const { createTable } = require('./tableController');
const { authorize } = require('../authorize');

const index = async (req, res) => {
  const username = req.query.username;
  const sessionId = req.query.sessionId;
  const userToken = req.query.userToken;

  if (!authorize(userToken, username)) {
    res.sendStatus(404);
    return;
  }

  const data = {
    editPermission: true,
    roles: [
      {
        id: 1,
        name: 'Admin',
        color: 'green',

        membersPermission: { view: true, edit: true },
        createTable: true,
        tablesPermission: { view: [1, 2], edit: [1, 2] },
        members: ['name 1', 'name 2', 'name 3', 'name 4', 'name 5']
      },
    ],
    members: [
      'member 2',
      'member 3',
    ]
  }

  const roleQuery = await Knex.raw(`Select * from roles where session_id = :session_id`, { session_id: sessionId });

  const userQuery = await Knex.raw(`Select username from users`);
  const permissionQuery = await Knex.raw(
    `Select r.role_edit from roles r, roles_members rm 
    where rm.role_id = r.role_id and r.session_id = :session_id and rm.username = :username`,
    {
      session_id: sessionId,
      username: username
    });

  const queryData = {
    editPermission: permissionQuery.rows[0].role_edit,
    roles: await Promise.all(roleQuery.rows.map(async (role) => {
      const viewQuery = await Knex.raw('Select t_id from roles_table_view where role_id = :role_id group by t_id',
        { role_id: role.role_id });

      const editQuery = await Knex.raw('Select t_id from roles_table_edit where role_id = :role_id group by t_id',
        { role_id: role.role_id });

      const roleMemberQuery = await Knex.raw('Select username from roles_members where role_id = :role_id group by username',
        { role_id: role.role_id });

      return {
        id: role.role_id,
        name: role.role_name,
        color: role.color,
        membersPermission: { view: role.role_view, edit: role.role_edit },
        createTable: role.table_create,
        tablesPermission: {
          view: viewQuery.rows.map(row => row.t_id),
          edit: editQuery.rows.map(row => row.t_id),
        },
        members: roleMemberQuery.rows.map(row => row.username)
      }
    })),
    members: userQuery.rows.map(row => row.username),

  }

  console.log('fetch request for roles');
  res.json(queryData);
};



const deleteRole = async (req, res) => {

  const { roleId, username, userToken } = req.body;

  if (!authorize(userToken, username)) {
    res.sendStatus(404);
    return;
  }
  // const userCheck = await Knex.raw('Select username from roles_members where role_id = ? and username = ? ', [roleId, username])
  const userCheck = await Knex('roles_members').where('username', username).andWhere('role_id', roleId).select('username');

  if (!userCheck.map(user => user.username).includes(username)) {
    // await Knex.raw('Delete from roles where role_id = ?', [roleId])
    await Knex('roles').where('role_id', roleId).del();
    res.json({ canDelete: true });
    return;
  }

  res.json({ canDelete: false });

}

const updateRole = async (req, res) => {
  // const roleId = req.params.role_id;
  const { roleId, role } = req.body;

  console.log(role);
  await Knex.raw(
    `Update roles 
    set role_name = :role_name, color = :color, table_create = :table_create, role_view= :role_view , role_edit = :role_edit 
    where role_id = :role_id`,
    {
      role_id: roleId,
      role_name: role.name,
      color: role.color,
      table_create: role.createTable,
      role_view: role.membersPermission.view,
      role_edit: role.membersPermission.edit
    }
  )

  if (role.tablesPermission.view.length != 0) {
    // await Knex.raw('Delete from roles_table_view where role_id = :role_id', { role_id: roleId });
    // await Knex('roles_table_view').insert(role.tablesPermission.view.map(table => ({ role_id: roleId, t_id: table })))
  }

  if (role.tablesPermission.edit.length != 0) {
    // await Knex.raw('Delete from roles_table_edit where role_id = :role_id', { role_id: roleId });
    // await Knex('roles_table_edit').insert(role.tablesPermission.edit.map(table => ({ role_id: roleId, t_id: table })))
  }


  if (role.members != 0) {
    // await Knex.raw('Delete from roles_members where role_id = :role_id', { role_id: roleId });
    // await Knex('roles_members').insert(role.members.map(username => ({ role_id: roleId, username: username })))
  }

  console.log('role ', roleId, ' changed to ', role);
  res.sendStatus(200)

};

const createRole = async (req, res) => {

  const { sessionId } = req.body;

  console.log('Create role request');
  const newRole = {
    id: uuidv4(),
    name: 'role',
    color: 'green',

    membersPermission: { view: false, edit: false },
    createTable: false,
    tablesPermission: { view: [], edit: [] },
    members: []
  };

  console.log(newRole.id, newRole.name);
  await Knex.raw(
    `INSERT INTO roles (role_id, role_name, session_id, color, table_create, role_view, role_edit) 
      VALUES (:id, :name, :session_id, :color, false, false, false)`,
    {
      id: newRole.id,
      name: newRole.name,
      session_id: sessionId,
      color: newRole.color,
    }
  );

  res.json(newRole);

};

const deleteMember = async (req, res) => {

  const { sessionId, roleId, usernames } = req.body;

  if (sessionId == null && roleId != null) {
    await Knex('roles_members').whereIn('username', usernames).andWhere('role_id', roleId).del()
      .catch(error => {
        console.log(error)
        res.sendStatus(500);
      })
    res.sendStatus(200);
    return;
  }

  const roles = await Knex('roles').where('session_id', sessionId).select('role_id');
  await Knex('roles_members').whereIn('role_id', roles.map(role => role.role_id)).where('username', usernames[0]).del();

}

const insertMember = async (req, res) => {
  const { sessionId, roleId, username } = req.body;
  const roles = await Knex('roles').where('session_id', sessionId).andWhereNot('role_id', roleId).select('role_id');

  await Knex('roles_members').whereIn('role_id', roles.map(role => role.role_id)).andWhere('username', username).del();

  await Knex('roles_members').insert({ role_id: roleId, username: username })

  res.sendStatus(200);

}

const deleteRoleTable = async (req, res) => {
  const { mode, roleId, tables } = req.body;
  console.log(mode, roleId, tables)

  if (mode === 'view') {
    await Knex('roles_table_view').whereIn('t_id', tables).andWhere('role_id', roleId).del()
      .catch(error => console.log(error));
    await Knex('roles_table_edit').whereIn('t_id', tables).andWhere('role_id', roleId).del()
      .catch(error => console.log(error));
    res.sendStatus(200);
    return
  }

  await Knex('roles_table_edit').whereIn('t_id', tables).andWhere('role_id', roleId).del()
    .catch(error => console.log(error));
  
  res.sendStatus(200);

}

const insertRoleTable = async (req, res) => {
  const { mode, roleId, tableId } = req.body;

  console.log(mode, roleId, tableId);
  if (mode === 'view') {
    await Knex('roles_table_view').insert({ role_id: roleId, t_id: tableId });
    res.sendStatus(200);
    return
  }

  await Knex('roles_table_edit').insert({ role_id: roleId, t_id: tableId });
  res.sendStatus(200);

}
module.exports = {
  createRole,
  updateRole,
  deleteRole,
  deleteMember,
  insertRoleTable,
  deleteRoleTable,
  insertMember,
  index
};