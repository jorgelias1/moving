import {useState} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const Nav = ({sidebar, showSidebar})=>{
    const [hover, setHover] = useState(false)
    return(
        <div className='navContainer' onClick={()=>{showSidebar(!sidebar); setHover(!hover)}}>
          <svg className='navSvg' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill='white' transform='scale(-1, 1)'>
            <rect className={`${hover &&  'morphTop'}`} x="4" y="4" width="18" height="3" rx='1' ry='1'/>
            <rect className={`${hover &&  'morphMiddle'}`} x="4" y="10.5" width="18" height="3"rx='1' ry='1'/>
            <rect className={`${hover &&  'morphBottom'}`} x="4" y="17" width="18" height="3"rx='1' ry='1'/>
          </svg>
        </div>
    )
}
export const Arrow=()=>{
    return(
      <div style={{display:'flex'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" viewBox="0 0 20 50">
          <line x1="5" y1="16" x2="15" y2="25" stroke="white" strokeWidth="4" strokeLinecap='round'/>
          <line x1="5" y1="34" x2="15" y2="25" stroke="white" strokeWidth="4" strokeLinecap='round'/>
        </svg>
      </div>
    )
  }