import { useState, react, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './table_create.css'
import '../../assets/theme.css'
import Select from '../../components/selectOption/selectOption'
import axios from 'axios'
import { ContextMenu, onContextClick } from '../../components/context_menu/context_menu'
import config from '../../../config'

function TableCreate({ propsObject }) {

  const { tableName = '', sessionId, username, tableId, selectContent } = propsObject;


  const [name, setName] = useState(tableName);
  const [attribs, setAttribs] = useState([
    { id: null, value: '', type: '', options: null },
  ]);

  const navigate = useNavigate(); 

  useEffect(() => {
    const getTableAttribs = async () => {
      await fetch(`${config.backend}/table/attrib?tableId=${tableId}`)
        .then(res => res.json())
        .then(data => {
          setAttribs(data);
          console.log('fetched ', data);
        })
        .catch(error => console.log(error));
    }
    if (![null, undefined].includes(tableId))
      getTableAttribs();
    else
      setAttribs([
        { id: null, value: '', type: '', options: null },
      ])

  }, [tableId])

  const [relations, setRelations] = useState([
    { table: '', name: '', attrib: '', type: '', currentAttrib: null },
    { table: '', name: '', attrib: '', type: '', currentAttrib: '' },
    { table: '', name: '', attrib: '', type: '', currentAttrib: null },
  ]);

  const [relationalAttribs, setRelationalAttribs] = useState([
    { name: '', relation: '', agg: '' },
    { name: '', relation: '', agg: '' },
    { name: '', relation: '', agg: '' },
  ])

  useEffect(() => {
    console.log(relations)
  }, [relations])

  const onCreate = async () => {
    if (tableId != null || tableId != undefined) {
      await axios.post(`${config.backend}/table/update`, { sessionId: sessionId, tableId: tableId, name: name, attribs: attribs, username: username })

      selectContent({content_type: 'View', props: {id: tableId, title: name, edit:true, selectContent: selectContent}});  
      // navigate('/session', {state: {usename: username, sessionId: sessionId, content: {content_type: 'View', props:{id: tableId}}}})
      return;
    }
    const newTableId = await axios.post(`${config.backend}/table/create`, { sessionId: sessionId, name: name, attribs: attribs, username: username })
    
    // const content = {content_type: 'View', props: {id: newTableId, title: name, edit:true, selectContent: null}};  
    // navigate('/session', {state: {username: username, sessionId: sessionId, content: null}})

    selectContent({content_type: 'View', props: {id: newTableId.data.tableId, title: name, edit:true, selectContent: selectContent}});  
  }
  const addAttrib = () => {
    setAttribs([...attribs, { id: null, value: '', type: '', options: null }]);
  };

  const addRelation = () => {
    const newRow = { table: '', name: '', attrib: '', type: '', currentAttrib: null };
    setRelations([...relations, newRow]);
  };

  const addRelationAttrib = () => {
    const newRow = { name: '', relation: '', agg: '' };
    setRelationalAttribs([...relationalAttribs, newRow])
  }

  const changeTwoWay = (e, index) => {
    var tempRelations = [...relations];
    tempRelations[index].currentAttrib = e.target.checked ? '' : null;
    // console.log(tempRelations);
    setRelations(tempRelations);
  }

  return (
    <div className='table-create-wrapper'>
      <div className='container-fluid mt-5 pl-4'>
        <form className='mb-5'>
          <div className='row'>
            <label forHtml='TableName' className='m-primary table-create-label col-sm-2 mb-1'>Table Name</label>
            <div className='col-sm-10'>
              <input type="text" autoComplete='off' className="col-sm-6 table-create-input-sm" defaultValue={name} id="TableName" onBlur={(e) => setName(e.target.value)}></input>
            </div>
          </div>
        </form>

        <p className='m-primary table-create-label' >Attributes</p>

        <form className='mb-3'>
          {
            attribs.map((attrib, idx) => {
              const setAttrib = (target, val) => {
                // if(target === 'value' && attribs.map(attrib => attrib.value).includes(val))
                //   return; 

                var newAttribs = [...attribs];
                newAttribs[idx][target] = val;
                setAttribs(newAttribs);
              }
              const deleteAttrib = () => {
                setAttribs(attribs.filter((_, i) => i != idx))
              }
              return (<Attribs attrib={attrib} attribs={attribs.map(attrib => attrib.value.trimStart().trimEnd()).filter(attrib => attrib != '')} setAttrib={setAttrib} deleteAttrib={deleteAttrib} />);
            })
          }

        </form>
        <p className='table-create col-sm-1 ml-3 mb-5' onClick={() => addAttrib()}>+Add</p>

        <p className='m-primary table-create-label mb-3' >Relations</p>
        <form className=''>
          {
            relations.map((relation, index) => {
              const setRelation = (target, value) => {
                var newRelations = [...relations];
                newRelations[index][target] = value;
                setRelations(newRelations);
                console.log(relations);
              }
              return (<Relations sessionId={sessionId} relation={relation} index={index}
                currentRelations={relations.map(relation => relation.name.trimStart().trimEnd()).filter(relation => relation != '')}
                currentAttribs={attribs.map(attrib => attrib.value.trimEnd().trimStart()).filter(attrib => attrib != '')}
                setRelation={setRelation} changeTwoWay={changeTwoWay} />)
            })
          }

          <p className='table-create col-sm-1 ml-3 mb-5' onClick={() => addRelation()}>+Add</p>
        </form>

        <p className='m-primary table-create-label' >Relatonal Attributes</p>

        <form className='mb-3'>
          {
            relationalAttribs.map((rAttrib, idx) => {
              const setRelationalAttrib = (target, val) => {

                var newAttribs = [...relationalAttribs];
                newAttribs[idx][target] = val;
                setRelationalAttribs(newAttribs);
              }
              return (<RelationalAttrib relationalAttrib={rAttrib} relationAttribs={relationalAttribs.map(attrib => attrib.name.trim()).filter(attrib => attrib != '')}
                currentRelations={relations} setRelationAttrib={setRelationalAttrib} />);
            })
          }

        </form>
        <p className='table-create col-sm-1 ml-3 mb-5' onClick={() => addRelationAttrib()}>+Add</p>

      </div>
      <div className='container-fluid row d-flex justify-content-end'>
        <div className='m-button table-create-button' onClick={() => onCreate()}>{[null, undefined].includes(tableId) ? 'Create' : 'Update'}</div>

      </div>
    </div>
  )


}

function Attribs({ attrib, attribs, setAttrib, deleteAttrib }) {
  const type = [
    'single-value-text', 'single-value-number', 'multi-value-number', 'multi-value-text', 'multi-select-text', 'multi-select-number', 'single-select-text', 'single-select-number'
  ]

  const [select, setSelect] = useState(false);
  const [selectPos, setSelectPos] = useState({ x: 0, y: 0 });
  const [value, setValue] = useState(attrib.value);
  const [options, setOptions] = useState(attrib.options)
  const [selectedItems, setSelectedItems] = useState([])

  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
  const [showContext, setShowContext] = useState(false);

  const [showOptions, setShowOptions] = useState(true);


  const onSelect = (e) => {
    const rect = e.target.getBoundingClientRect();
    setSelectPos({ x: rect.x, y: rect.y + 50 });
    setSelect(true);
  }

  const handleSelectList = (id, ctrlKey, shiftKey) => {
    let newSelectedItems;
    if (ctrlKey) {
      if (selectedItems.includes(id)) {
        newSelectedItems = selectedItems.filter(itemId => itemId !== id);
      } else {
        newSelectedItems = [...selectedItems, id];
      }
    }
    else if (shiftKey) {
      const min = Math.min(...selectedItems);
      newSelectedItems = id <= Math.min(...selectedItems) ?
        Array(min - id + 1).fill().map((_, index) => index + id) :
        Array(id - min + 1).fill().map((_, index) => index + min)
    }
    else {
      newSelectedItems = [id];
    }

    setSelectedItems(newSelectedItems);
  };

  const onBlur = (e) => {
    if (!attribs.includes(e.target.value)) {
      setAttrib('value', e.target.value);
      setValue(e.target.value)
    }
    else
      setValue('');

  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.table-create-select-sm') && !e.target.closest('.select') && !e.target.closest('.select-options') && !e.target.closest('.context-menu')) {
        setSelect(false);
        setSelectedItems([])
        setShowContext(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [])

  useEffect(() => {
    setValue(attrib.value);
  }, [attrib.value]);

  useEffect(() => {
    setOptions(attrib.options);
  }, [attrib.options]);

  return (
    <>
      <div className='row' style={{ marginBottom: '0.75rem' }}>
        <div className='d-flex  justify-content-center' style={{ width: '2rem' }}>
          <i className='fas fa-trash delete-icon' onClick={() => deleteAttrib()}></i>

        </div>
        <div className='col-sm-4 p-0'>
          <input type="text" autoComplete='off' className="table-create-input table-create-input-sm"
            placeholder='Name' value={value} onBlur={(e) => onBlur(e)} onChange={(e) => setValue(e.target.value)}></input>
        </div>
        <div className='col-sm-4 p-0'>
          <div className={`table-create-select-sm ${attrib.type === '' ? 'm-secondary' : 'm-primary'}`} onClick={e => onSelect(e)}>
            {attrib.type === '' ? 'Type' : attrib.type}
          </div>
          {
            select && <Select position={selectPos} list={type} onSelectValue={(val) => setAttrib('type', val)} />
          }
        </div>
        {
          attrib.type.includes('select') &&
          <div className='col-sm-3 p-0'>
            <input type="text" autoComplete='off' className="table-create-input table-create-input-sm" style={{ width: '85%' }}
              placeholder='options' onKeyDown={(e) => {
                if (e.key == 'Enter' && options === null) {
                  setAttrib('options', [e.target.value.trim()]);
                  setOptions([e.target.value.trim()]);
                  e.target.value = '';
                  return;
                }

                if (e.key == 'Enter' && !options.includes(e.target.value.trim())) {
                  if (attrib.type.includes('number') && !/^\d+$/.test(e.target.value.trim()))
                    return;
                  setAttrib('options', [...options, e.target.value.trim()]);
                  setOptions([...options, e.target.value.trim()]);
                  e.target.value = '';
                }

              }}></input>
            <i className={`fas ${showOptions ? 'fa-eye' : 'fa-eye-slash'} select-option-icon `} onClick={() => setShowOptions(!showOptions)} />

            <ContextMenu position={contextPos} show={showContext} options={[{
              name: 'delete', onClick: () => {
                setOptions(options.filter((_, idx) => !selectedItems.includes(idx)));
                setSelectedItems([]);
                setAttrib('options', options.filter((_, idx) => !selectedItems.includes(idx)));
                setShowContext(false);
              }
            }]} />

            {
              options != null && options != undefined && options.length != 0 && showOptions &&
              <div className='select-options col-sm-11' onContextMenu={(e) => onContextClick(e, setShowContext, setContextPos)}>
                {
                  options.map((option, idx) => {
                    return (<div className={`${selectedItems.includes(idx) ? 'm-primary' : 'm-secondary'} select-options-item`} onClick={(e) => handleSelectList(idx, e.ctrlKey, e.shiftKey)}>{option}</div>)
                  })
                }
              </div>

            }
          </div>
        }
      </div>
    </>
  )

}

function RelationalAttrib({ relationalAttrib, relationAttribs, currentRelations, setRelationAttrib }) {

  const [select, setSelect] = useState({
    relation: { view: false, pos: { x: 0, y: 0 } },
    agg: { view: false, pos: { x: 0, y: 0 } },
  });
  const [value, setValue] = useState(relationalAttrib.name);
  const [agg, setAgg] = useState([]);


  const onSelect = (target, e) => {
    const rect = e.target.getBoundingClientRect();
    const newSelect = { ...select };
    newSelect[target].view = true;
    newSelect[target].pos = { x: rect.x, y: rect.y + 50 };
    setSelect(newSelect);
  }

  const onBlur = (e) => {
    if (!relationAttribs.includes(e.target.value)) {
      setRelationAttrib('value', e.target.value);
      setValue(e.target.value)
    }
    else
      setValue('');

  }

  const onRelationSelect = (val) => {
    const currentRelation = currentRelations.find(relation => relation.name === val);
    currentRelation.type.includes('text') ? setAgg(['list']) :
      setAgg(['list', 'sum', 'average', 'min', 'max']);
    currentRelation.type === '' ? setAgg('') : null;
    setRelationAttrib('relation', val);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.table-create-select-sm') && !e.target.closest('.select')) {
        const newSelect = { ...select };
        newSelect.relation.view = false;
        newSelect.agg.view = false;
        setSelect(newSelect);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])

  return (
    <>
      <div className='row' style={{ marginBottom: '0.75rem' }}>
        <div style={{ width: '2rem' }}></div>
        <div className='col-sm-3 p-0'>
          <input type="text" autoComplete='off' className="table-create-input table-create-input-sm"
            placeholder='Name' value={value} onBlur={(e) => onBlur(e)} onChange={(e) => setValue(e.target.value)}></input>
        </div>

        <div className='col-sm-3 p-0'>
          <div className={`table-create-select-sm ${relationalAttrib.relation === '' ? 'm-secondary' : 'm-primary'}`} onClick={e => onSelect('relation', e)}>
            {relationalAttrib.relation === '' ? 'relation' : relationalAttrib.relation}
          </div>
          {
            select.relation.view && <Select position={select.relation.pos} list={currentRelations.map(relation => relation.name)}
              onSelectValue={(val) => onRelationSelect(val)} />
          }
        </div>

        <div className='col-sm-3 p-0'>
          <div className={`table-create-select-sm ${relationalAttrib.relation === '' ? 'disabled' : ''} ${relationalAttrib.agg === '' || relationalAttrib.relation === '' ? 'm-secondary' : 'm-primary'}`}
            onClick={e => onSelect('agg', e)}>
            {relationalAttrib.agg === '' || relationalAttrib.relation === '' ? 'function' : relationalAttrib.agg}
          </div>
          {
            select.agg.view && <Select position={select.agg.pos} list={agg} onSelectValue={(val) => setRelationAttrib('agg', val)} />
          }
        </div>
      </div>
    </>
  )


}
function Relations({ relation, setRelation, currentAttribs, currentRelations, index, changeTwoWay }) {

  //api/Table/index?session_id=id
  const Tables = [
    'Table 1',
    'Table 2',
    'Table 3'
  ]

  //api/Attrib/?table_id=id

  const aAttribs = [
    { id: 0, name: 'Id', type: 'number', position: 0 },
    { id: 1, name: 'Name', type: 'text', position: 1 },
    { id: 2, name: 'Numbers', type: 'multi-value-number', position: 2 },
    { id: 3, name: 'Hostels', type: 'multi-select-text', position: 3, options: ['Hostel 1', 'Hostel 2', 'Hostel 3'] },
    { id: 4, name: 'Email Type', type: 'single-select-text', position: 4, options: ['Official Mail', 'Personal Mail'] },
  ];


  const [select, setSelect] = useState({
    table: { show: false, pos: { x: 0, y: 0 } },
    attrib: { show: false, pos: { x: 0, y: 0 } },
    currentAttrib: { show: false, pos: { x: 0, y: 0 } },
  })

  const [name, setName] = useState(relation.name);
  const updateName = (e) => {
    console.log(currentRelations);
    if (!currentRelations.includes(e.target.value)) {
      setRelation('name', e.target.value);
      setName(e.target.value)
    }
    else
      setName('');
  }
  
  const onSelect = (target, e) => {
    const rect = e.target.getBoundingClientRect();
    var newSelect = { ...select };
    newSelect[target].show = true;
    newSelect[target].pos = { x: rect.x, y: rect.y + 50 };
    setSelect(newSelect);
  }

  const onAttribUpdate = (val) => {
    const attrib = aAttribs.find(attrib => attrib.name.trim() === val.trim());
    setRelation('attrib', val);
    setRelation('type', attrib.type);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.table-create-select-sm') && !e.target.closest('.select')) {
        var newSelect = { ...select };
        newSelect.table.show = false;
        newSelect.attrib.show = false;
        newSelect.currentAttrib.show = false;
        setSelect(newSelect);

      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])

  return (
    <>
      <div className='row' style={{ marginBottom: '0.75rem' }}>

        <div style={{ width: '2rem' }}></div>
        <div className='col-sm-4 pl-0'>
          <input type="text" autoComplete='off' className="table-create-input-sm" style={{ width: '100%' }} placeholder='Name'
            value={name} onBlur={(e) => updateName(e)} onChange={(e) => setName(e.target.value)}></input>
        </div>

        <div className='col-sm-2 p-0'>
          <div className={`table-create-select-sm ${relation.table === '' ? 'm-secondary' : 'm-primary'}`} onClick={(e) => onSelect('table', e)} >
            {relation.table === '' ? 'Table' : relation.table}
          </div>
          {
            select.table.show &&
            <Select position={select.table.pos} list={Tables} onSelectValue={(val) => setRelation(val)} />
          }
        </div>

        <div className='col-sm-2 p-0'>
          <div className={`table-create-select-sm ${relation.attrib === '' ? 'm-secondary' : 'm-primary'}`}
            onClick={(e) => onSelect('attrib', e)}>
            {relation.attrib === '' ? 'on' : relation.attrib}
          </div>
          {
            select.attrib.show &&
            <Select position={select.attrib.pos} list={aAttribs.map(attrib => attrib.name)} onSelectValue={(val) => onAttribUpdate(val)} />
          }
        </div>
        <div className='col-sm-2 p-0'>
          <div className={`table-create-select-sm ${relation.currentAttrib === null ? 'disabled' : ''} ${relation.currentAttrib === '' || relation.currentAttrib === null ? 'm-secondary' : 'm-primary'}`}
            onClick={(e) => relation.currentAttrib != null && onSelect('currentAttrib', e)}>
            {relation.currentAttrib === '' || relation.currentAttrib === null ? 'ref attrib' : relation.currentAttrib}
          </div>
          {
            select.currentAttrib.show &&
            <Select position={select.currentAttrib.pos} list={currentAttribs} onSelectValue={(val) => setRelation('currentAttrib', val)} />
          }
        </div>


        <div className='p-0 center-vertically'>
          <label className='m-primary table-checkbox-container'>
            <input type="checkbox" defaultChecked={relation.currentAttrib != null} onChange={(e) => changeTwoWay(e, index)} />
            <span className='table-checkbox-checkmark'></span>
            {/* <div className='info-box'>Two way relation</div> */}

          </label>
        </div>

      </div>

      {
        // relation.currentAttrib ===  ? <></> :
        true ? <></> :
          <div className='row mb-3'>
            <div style={{ width: '3rem' }}></div>
            <div className='col-sm-6 p-0'></div>
            <div className='col-sm-3 p-0'>
              <input type="text" autoComplete='off' className="table-create-input-sm" placeholder='on' defaultValue={relation.currentAttrib} ></input>
            </div>
          </div>
      }
    </>
  )
}

export default TableCreate;