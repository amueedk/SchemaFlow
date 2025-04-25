import './session.css'
import Login from '../../components/login/login'
import config from '../../../config';
import { useState, useEffect } from 'react';

function Welcome(props) {

  const { title, id } = props.propsObject;

  const [heading, setHeading] = useState('Welcome');

  useEffect(() => {
    const fetchName = async () => {

      if (![null, undefined].includes(title)) {
        setHeading(`Welcome to ${title}`)
        return;
      }

      if ([null, undefined].includes(id)) 
        return; 
      
      await fetch(`${config.backend}/session/name?sessionId=${id}`)
        .then(res => res.json())
        .then(data => {
          setHeading(`Welcome to ${data.name}`); 
        });
    }
    fetchName();
  }, [])


  return (
    <>
      <div className='align-items-center'>
        <p className='view-title text-center'>{heading}</p>
      </div>
    </>
  )
}
export default Welcome