const { error } = require('console');
const knexConfig = require('../knexConfig');
const knex = require('knex');
const Knex = knex(knexConfig);
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')

const index = async (req, res) => {
  const { sessionId } = req.query;

  const tables = [

    { id: 1, name: 'Table 1' },
    { id: 2, name: 'Table 2' },
    { id: 3, name: 'Table 3' },
  ]

  const tableQuery = await Knex.raw('Select t_id, t_name from tables_ where session_id = ?', [sessionId]);


  res.json(tableQuery.rows.map(table => ({
    id: table.t_id,
    name: table.t_name,
  })));

}

const getAttribs = async (req, res) => {
  const { tableId } = req.query;
  const attribQuery = await Knex('attributes_').where('t_id', tableId).select();

  const options = {};

  await Promise.all(attribQuery.map(async attrib => {
    if (!attrib.a_type.includes('multi'))
      return null;
    const result = await Knex('options').select('option').where('a_id', attrib.a_id);
    options[attrib.a_id] = result.map(res => res.option);
    return null;
  }))

  const attribs = attribQuery.sort((a, b) => a.a_positions - b.b_positions).map(attrib => {
    return {
      id: attrib.a_id,
      value: attrib.a_name,
      type: attrib.a_type,
      options: attrib.a_type.includes('select') ? options[attrib.a_id] : null
    }
  })

  console.log(attribs);
  res.json(attribs);
}

const getData = async (req, res) => {
  const tableId = req.query.tableId;

  const tempData =
  {
    name: ` `,
    editPermission: true,
    configuration: {
      filter: { attrib: '', val: '' },
      sort: { attrib: '', asc: true },
      expanded: false,
      enlarge: true 
    },
    attribs: [
      { id: 0, name: 'Id', type: 'number', position: 0 },
      { id: 1, name: 'Name', type: 'text', position: 1 },
      { id: 2, name: 'Numbers', type: 'multi-value-number', position: 2 },
      { id: 3, name: 'Hostels', type: 'multi-select-text', position: 3, options: ['Hostel 1', 'Hostel 2', 'Hostel 3'] },
      { id: 4, name: 'Email Type', type: 'single-select-text', position: 4, options: ['Official Mail', 'Personal Mail'] },
    ],
    data: [
      {
        tupleId: 0,
        vals: [
          { attrib_id: 0, value: '1' },
          { attrib_id: 1, value: 'Xyz' },
          { attrib_id: 2, value: ['123'] },
          { attrib_id: 3, value: ['Hostel 1'] },
          { attrib_id: 4, value: 'Personal Mail' },
        ]
      },
    ]
  };


  const attribsQuery = await Knex.raw("Select * from attributes_ where t_id = ?", [tableId]);
  // const relationQuery = await Knex('relation').where('t_id', tableId)
  
  const attribs = attribsQuery.rows.map(attrib => ({
    id: attrib.a_id,
    name: attrib.a_name,
    type: attrib.a_type,
    position: attrib.a_positions
  })) 
  // + relationQuery.map(relation => {


  //   return { 
  //     id: relation.r_id, 
  //     name: r_name, 
  //     type: 'relation', 
  //     position: r_position,   
  //   }
  // })

  const attribMV = await Promise.all(attribs.map(async (attrib) => {
    if (!attrib.type.includes('select'))
      return attrib;

    const optionsQuery = await Knex.raw('Select option from options where a_id = ?', [attrib.id]);
    return { ...attrib, options: optionsQuery.rows.map(opt => opt.option) };
  }))

  const tuplesQuery =
    await Knex.raw('Select tu_id from tuple where t_id = ? group by tu_id', [tableId])
      .then((result) => result)
      .catch((error) => console.log(error));


  const tuplesData = await Promise.all(tuplesQuery.rows.map(async (tuple) => {

    return {
      tupleId: tuple.tu_id,
      vals: await Promise.all(attribMV.map(async (attrib) => {

        const valsQuery = await Knex('data').where('a_id', attrib.id).andWhere('tu_id', tuple.tu_id).select('val')
          .catch(error => console.log(error));

        var value = attrib.type.includes('multi') ? valsQuery.map(val => val.val) : valsQuery.length == 0 || valsQuery[0].val === null ? '' : valsQuery[0].val;

        return {
          attrib_id: attrib.id,
          value: value
        }

      }))
    }
  }))

  const data =
  {
    name: 'Table A',
    configuration: {
      filter: { attrib: '', val: '' },
      sort: { attrib: '', asc: true },
      expanded: false,
    },
    attribs: attribMV,
    data: tuplesData
  };

  // console.log(require('util').inspect(data, { depth: null }));
  res.json(data);
};


const addTuplePost = async (req, res) => {

  const { attribs, tableId } = req.body;
  const newTuple = {
    tupleId: uuidv4(), //generating uuid
    vals: [],
  }

  await Knex.raw('insert into tuple (tu_id, t_id) values (?, ?)', [newTuple.tupleId, tableId]);

  await Promise.all(attribs.sort((a, b) => a.position - b.position).map(async (attrib) => {
    if (!attrib.type.includes('multi')) {
      await Knex.raw('INSERT INTO data (tu_id, a_id) VALUES (?, ?)', [newTuple.tupleId, attrib.id]);
    }

    newTuple.vals.push({
      attrib_id: attrib.id,
      value: attrib.type.includes('multi') ? [] : ''
    });
  }));

  console.log('new tuple generated', newTuple);
  res.send(newTuple);

};

const configUpdate = async (req, res) => {
  const { newConfiguration } = req.body;
  //update query to update the configuration of the table
}

const updateData = async (req, res) => {
  const { type, attribId, tupleId, value } = req.body;
  console.log('update data reqest', type, attribId, tupleId, value);

  //different cases for a) single-value b) multi-value c) relations. 
  if (type.includes('single')) {
    await Knex('data').where('tu_id', tupleId).andWhere('a_id', attribId).update({ val: value }).catch(error => {
      console.log('upate error : ', error);
      res.sendStatus(500);
    })
    res.sendStatus(202);

  }

  if (type.includes('multi')) {
    await Knex('data').insert({ a_id: attribId, tu_id: tupleId, val: value }).catch(error => {
      console.log('upate error : ', error);
      res.sendStatus(500);
    })
    res.sendStatus(202);

  }

};

const deleteData = async (req, res) => {
  const { attribId, tupleId, type, value } = req.body;
  console.log('delete data for' , attribId, tupleId, type, value);

  await Knex('data').whereIn('val', value).andWhere('tu_id', tupleId).andWhere('a_id', attribId).del(); 
  res.sendStatus(200);
}


const deleteTuple = async (req, res) => {
  const { tupleId } = req.body;
  // await Knex.raw('Delete from tuple where tu_id = ?', [tupleId]); 

  const result = await Knex('tuple').where('tu_id', tupleId).del().catch(error => {
    console.log(`cannot delete tuple: ${error}`)
    res.sendStatus(404)
  })

  res.sendStatus(200);

}


const createTable = async (req, res) => {
  const { name, attribs, sessionId, username } = req.body;
  var errorBool = false;

  if (name == '' || name == null) {
    res.sendStatus(500);
    return
  }
  console.log(`creating table ${name} with attribs`, attribs);

  const tableId = uuidv4();

  var filteredOptions = []

  const filteredAttribs = attribs.filter(attrib => !['', null].includes(attrib.name) && !['', null].includes(attrib.type))
    .map((attrib, i) => {
      const id = uuidv4();

      Array.isArray(attrib.options) && attrib.options.forEach(element => {
        filteredOptions = [...filteredOptions, { a_id: id, option: element }];
      });

      return { t_id: tableId, a_id: id, a_name: attrib.value, a_type: attrib.type, a_positions: i };

    })

  await Knex('Tables_'.toLowerCase()).insert({ t_id: tableId, session_id: sessionId, t_name: name })
    .catch(error => {
      console.error(error)
      errorBool = true;
    });

  if (errorBool) {
    res.sendStatus(500);
    return;
  }

  await Knex('Attributes_'.toLowerCase()).insert(filteredAttribs)
    .catch(error => {
      console.error(error)
      error = true;
    });


  if (errorBool) {
    await Knex('tables_'.toLowerCase()).where(t_id, tableId).del().catch(error => console.error(error));
    res.sendStatus(500);
    return;
  }

  if (filteredOptions.length)
    await Knex('options'.toLowerCase()).insert(filteredOptions)
      .catch(error => {
        console.error(error)
        errorBool = true;
      });


  if (errorBool) {
    await Knex('tables_'.toLowerCase()).where(t_id, tableId).del().catch(error => console.error(error));
    res.sendStatus(500);
    return;
  }


  //changing role permissions
  console.log(sessionId, username);
  const roleId = await Knex('roles_members').where('username', username).select('role_id')
    .catch(error => {

      console.error(error);
      errorBool = true;
    });

  if (errorBool) {
    res.sendStatus(500);
    return;
  }

  await Knex('roles_table_view').insert({ role_id: roleId[0].role_id, t_id: tableId })
    .catch(error => {
      console.error(error);
      errorBool = true;
    });

  if (errorBool) {
    res.sendStatus(500);
    return;
  }

  await Knex('roles_table_edit').insert({ role_id: roleId[0].role_id, t_id: tableId })
    .catch(error => {
      console.error(error);
      errorBool = true;
    })


  if (errorBool) {
    res.sendStatus(500);
    return;
  }

  // res.sendStatus(202);
  res.json({tableId: tableId}); 

};

const updateTable = async (req, res) => {
  const { tableId, name, attribs, sessionId, username } = req.body;
  var errorBool = false;

  if (name == '' || name == null) {
    res.sendStatus(500);
    return
  }
  console.log(`updating table ${name} with attribs`, attribs);


  var filteredOptions = []

  const createdAttribs = attribs.filter(attrib => !['', null].includes(attrib.name) && !['', null].includes(attrib.type) && ['', null, undefined].includes(attrib.id))
    .map((attrib, i) => {
      const id = uuidv4();

      Array.isArray(attrib.options) && attrib.options.forEach(element => {
        filteredOptions = [...filteredOptions, { a_id: id, option: element }];
      });

      return { t_id: tableId, a_id: id, a_name: attrib.value, a_type: attrib.type, a_positions: i };

    })

  createdAttribs.length && 
  await Knex('Attributes_'.toLowerCase()).insert(createdAttribs)
    .catch(error => {
      console.error(error)
      errorBool = true;
    });


  if (filteredOptions.length)
    await Knex('options'.toLowerCase()).insert(filteredOptions)
      .catch(error => {
        console.error(error)
        errorBool = true;
      });

  var addOptions = [], deleteOptions = [];


   await Promise.all(attribs.filter(attrib => !['', null].includes(attrib.name) && !['', null].includes(attrib.type) && !['', null, undefined].includes(attrib.id))
    .map(async (attrib, i) => {

      if (!attrib.type.includes('select')) {
        await Knex('options').where('a_id', attrib.id).del();
        await Knex('attributes_').where('a_id', attrib.id).update({ a_name: attrib.value, a_type: attrib.type, a_positions: i });
        return;
      }

      await Knex('options').where('a_id', attrib.id).del();
      attrib.options && attrib.options.forEach(option => {
        addOptions = [...addOptions, {a_id: attrib.id, option: option}]
      })

    }))

  
  await Knex('options').insert(addOptions); 

  res.sendStatus(202);
};

const deleteTable = async (req, res) => {
  const { tableId } = req.body;
  console.log(`Delete table route accessed for table ID: ${tableId}`);
  await Knex('Tables_'.toLowerCase()).where('t_id', tableId).del().catch(error => { console.log(error); res.sendStatus(404) });
  res.sendStatus(200);
};


module.exports = {
  index,
  configUpdate,
  getData,
  getAttribs,
  updateData,
  updateTable,
  createTable,
  deleteTable,
  addTuplePost,
  deleteData,
  deleteTuple
};
