import '../../assets/theme.css'
import './session_index.css'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import config from '../../../config'
import { ContextMenu, onContextClick } from '../../components/context_menu/context_menu'
import axios from 'axios'

function SessionIndex() {
  //api/session/index

  // const params = new URLSearchParams(window.location.search);
  // const username = params.get('username');

  // const location = useLocation(); 
  
  
  const {username, userToken} = useLocation().state; 
  const [sessions, setSessions] = useState([{ create: true }]);



  useEffect(() => {
    fetch(`${config.backend}/session/index?username=${username}&userToken=${userToken}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSessions([...data.sessions, {create: true}])
      })
  }, [])

  const onCreate = async (id) => {
    const response = await axios.post(`${config.backend}/session/create`, { username: username });
    const newsession = [...sessions];
    newsession[newsession.length - 1] = response.data;
    setSessions([...newsession, { create: true }]);
  }

  const onDelete = async (id) => {
    await axios.post(`${config.backend}/session/delete`, { sessionId: id });
    console.log(sessions.filter(session => session.id != id));
    setSessions(sessions.filter(session => session.id != id));
  }

  // useEffect(() => (sessions[sessions.length - 1].create === undefined)&& setSessions([...sessions, { create: true, onCreate: onCreate }]), []);


  return (
    <div className='session-index m-background'>
      <p className='m-heading pl-4'>Welcome Back!</p>
      {
        Array(Math.ceil(sessions.length / 4)).fill((<></>)).map((_, idx) => {

          return (
            <div className='container-fluid row pl-5 pr-5'>
              <Session session={sessions[4 * idx]} username={username} userToken={userToken} onCreate={onCreate} onDelete={onDelete} />
              {sessions.length > 4 * idx + 1 ? <Session session={sessions[4 * idx + 1]} userToken={userToken} username={username} onCreate={onCreate} onDelete={onDelete} /> : <div className='col-sm-3' ></div>}
              {sessions.length > 4 * idx + 2 ? <Session session={sessions[4 * idx + 2]} userToken={userToken} username={username} onCreate={onCreate} onDelete={onDelete} /> : <div className='col-sm-3' ></div>}
              {sessions.length > 4 * idx + 3 ? <Session session={sessions[4 * idx + 3]} userToken={userToken} username={username} onCreate={onCreate} onDelete={onDelete} /> : <div className='col-sm-3' ></div>}
            </div>
          )
        })
      }

    </div>
  )
}

function Session({ session, username,  userToken, onCreate, onDelete }) {
  const [sessionSelected, setSessionSelected] = useState(false);

  const [showCm, setShowCm] = useState(false);
  const [cmPos, setCmPos] = useState({ x: 0, y: 0 });

  const navigate = useNavigate(); 


  useEffect(() => {
    const handleClickOutsideEditRole = (e) => {
      if (!e.target.closest('.context-menu')) {
        setShowCm(false)
      }
    };
    document.addEventListener('mousedown', handleClickOutsideEditRole);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideEditRole);
    };
  }, []);

  if (session.create)
    return <SessionCreate onCreate={onCreate}></SessionCreate>

  if (sessionSelected)
    // return <Navigate to={`/session?sessionId=${session.id}&username=${username}`} />
    navigate('/session', {state: {sessionId:session.id, username:username, userToken: userToken}}); 

  return (
    <>
      <ContextMenu position={cmPos} show={showCm} options={[{ name: 'delete', onClick: () => { onDelete(session.id); setShowCm(false) } }]} />
      <div className='session-box col' onContextMenu={(e) => { onContextClick(e, setShowCm, setCmPos) }} onClick={(e) => setSessionSelected(true)}>
        <p className='session-label m-primary'>{session.name}</p>
        <div className='session-description m-primary'>
          <p className='mb-3' style={session.description === '' ? { fontStyle: 'italic' } : {}}>
            {session.description != '' ? session.description : 'no description'}

          </p>
        </div>
      </div>
    </>
  )
}


function SessionCreate({ onCreate }) {

  return (
    <div className='session-box session-create col m-secondary d-flex align-items-center' onClick={() => onCreate()}>
      <p className='session-label'>+Create</p>
    </div>
  )
}
export default SessionIndex; 