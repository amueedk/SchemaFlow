import React from 'react'
import { useState } from 'react'
// import Table from '../../components/table_layout/table_layout';
import './view.css'
import Table from '../../components/table_layout/table';

function View(props) {

  const { title, id, edit, selectContent } = props.propsObject;

  return (

    <>
      <div className='view-wrapper' >
        <div className='view-title'>
          {title}
        </div>
        <Table id={id} edit={edit} title={title} selectContent={selectContent} />
      </div>
    </>
  )
}

export default View 
