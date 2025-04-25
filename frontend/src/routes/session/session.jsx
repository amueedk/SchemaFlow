import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Sidebar from '../../components/sidebar/sidebar'
import View from './view'
import Welcome from './welcome'
import TableCreate from '../table_create/table_create'
import Members from '../../components/members/Members'
import TableIndex from '../../components/tableIndex/tableIndex'
import Import from '../../components/import/import'
import './session.css'
import config from '../../../config'

const contentCash = {content_typ: 'Welcome', props: {}};
const ContentList = {
  View: (key, props) => <View key={key} propsObject={props} />,
  Welcome: (key, props) => <Welcome key={key} propsObject={props}/>,
  TableCreate: (key, props) => <TableCreate key={key} propsObject={props}/>, 
  TableIndex: (key, props) => (<TableIndex key={key}/>), 
  Members: (key, props) => (<Members key={key}/>), 
  Import: (key, props) => (<Import key={key} propsObject={props}/>), 
  // Schema: (key, props) => (<Schema key={key}/>), 
  // Settings: (key, props) => (<TableCreate key={key}/>), 
};

function Session() {

  // const {search} = useLocation(); 
  // const params = new URLSearchParams(search); 
  // const sessionId = params.get('sessionId'); 

  const {sessionId, username, userToken,  content} = useLocation().state; 

  
  const [currentContent, setCurrentContent] = useState(content ? content : { content_type: 'Welcome', props: {id: sessionId} });
  const Content = ContentList[currentContent.content_type]


  return (
    <>
      <div className='session-wrapper container-fluid'>
        <div className='row'>
          <Sidebar key='list' sessionId={sessionId} username={username} userToken={userToken} selected={currentContent} selectContent={setCurrentContent} />
          <div className='content-wrapper col-sm-10 m-0 p-0'>
            {Content('content', currentContent.props)}
          </div>
        </div>

      </div>
    </>
  )
}

export default Session 
