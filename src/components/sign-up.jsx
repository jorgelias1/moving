import { Amplify } from 'aws-amplify';
import { signUp, signIn, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword } from '@aws-amplify/auth'
import { getCurrentUser } from 'aws-amplify/auth';
import awsconfig from '../../amplify-src/aws-exports';
Amplify.configure(awsconfig);
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {Message} from '../App'

export const SignUpForm=()=>{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [verification, showVerification] = useState(null)
    const [verified, setVerified] = useState(false);
    const [invalidParams, setInvalidParams] = useState(false)
    const [emptyErr, setEmptyErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async(e)=>{
      e.preventDefault();
      if (email==='' || password===''){
        setEmptyErr(true)
        return
      } else if (password.length<8){
        setPasswordErr(true)
        return
      }  
      try{
        await signUp({
          username: email,
          password: password,
          autoSignIn:{
            enabled:true
          }
        })
        setPasswordErr(false);
        setEmptyErr(false);
        setInvalidParams(false);
        showVerification(true);
      } catch(err){
        console.log(err)
        setInvalidParams(true)
      }
    }
  
    return(
    <div className='all'>
      <form onSubmit={handleSignUp} className='form'>
  
        <label>
          Email: <input type='email' value={email} 
          onChange={e=>setEmail(e.target.value)}
          placeholder='example@email.com' 
          autoFocus={true}/>
        </label>
        <label>
          Password: <input type='password' value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder='8 character minimum'/>
          Must include an uppercase letter, lowercase, number, and a special character (8 character minimum).
        </label>
        <button type='submit' style={{background:'white', color:'black'}}>Verify</button>
        {emptyErr && <div className='warning'>Must enter both an email and a password</div>}
        {passwordErr && <div className='warning'>password must be at least 8 characters</div>}
        {invalidParams && <div className='warning'>Please re-enter a valid email or password</div>}
        <div>already have an account? {''}
          <span onClick={()=>navigate('/login')} className='clickMe'>
            sign in
          </span>
        </div>
      </form>
      {<VerificationForm email={email} setVerified={setVerified} password={password}/>}
    </div>
    )
  }
const VerificationForm=({email, setVerified, password})=>{
    const [code, setCode] = useState('')
    const [resent, updateResent] = useState(false)
    const navigate = useNavigate();
    const handleVerification = async(e)=>{
        e.preventDefault();
        try{
            const re=await confirmSignUp({username:email, confirmationCode: code})
            console.log(re)
            await signIn(email, password);
            const user = await getCurrentUser()
            service.addUserToDb(user)
            console.log('success signing up!')
            setVerified(true)
            navigate('/')
        } catch(error){
            console.error(error)
        }
    }
    const handleResend=async(e)=>{
    e.preventDefault();
    resendSignUpCode({username: email})
    .then(() => {updateResent(true)})
    .catch((error) => {console.error(error)});}
    return(
        <div>
            <form onSubmit={handleVerification}>
                <label>
                    Please enter your verification code: <input type="text" value={code} onChange={e=>setCode(e.target.value)}/>
                </label>
                <div>
                <button type='submit'>Verify</button>
                <button onClick={handleResend}>resend code</button>
                </div>
            </form>
        </div>
    )
  }
export const LoginForm=()=>{
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [forgot, setForgot] = useState(false)
    const [change, setChange] = useState(false)
    const [code, setCode] = useState('')
    const navigate = useNavigate();
    const handleLogin=async(e)=>{
        e.preventDefault()
        try{
            const re = await signIn({username, password})
            console.log(re)
            // navigate('/')
            console.log('success!')
        } catch(error){
            console.error(error)
        }
    }
    const handleForgot=async(e)=>{
      e.preventDefault()
      setForgot(true)
    }
    const sendCode=async(e)=>{
      e.preventDefault();
      try {
        const re = await resetPassword(username)
        setChange(true)
      } catch(err){
        console.log(err)
      }
    }
    const verifyChange=async(e)=>{
      e.preventDefault()
      try {
        const re = await confirmResetPassword(username, code, password)
        // this should enable user to login with new password
        setForgot(false); 
      } catch (err){
        console.log(err)
      }
    }
    return(
      <>
        {forgot ? <>
        <Message msg='please enter your email for a reset code' type='success'/>
        <form onSubmit={handleLogin}>
          <label>
              Email: <input type='email' value={username} onChange={e=>setUsername(e.target.value)} autoFocus={true}/>
          </label>
          {!change 
          ? <button type='submit' onClick={sendCode}>send code</button>
          : (
          <div className='flexV'>
            <label>
              Verification code: <input type='text' value={code} onChange={e=>setCode(e.target.value)}/>
            </label>
            <label>
              New password: <input type='password' value={password} onChange={e=>setPassword(e.target.value)}/>
            </label>
            <button type='submit' onClick={verifyChange}>confirm change</button>
          </div>
          )}
        </form>
      </> :
      <form onSubmit={handleLogin}>
          <label>
              Email: <input type='email' value={username} onChange={e=>setUsername(e.target.value)} autoFocus={true}/>
          </label>
          <label>
              Password: <input type='password' value={password} onChange={e=>setPassword(e.target.value)}/>
          </label>
          <button type='submit'>Login</button>
          <div className='clickMe' onClick={handleForgot}>forgot password?</div>
      </form>}
        
      </>
    )
  }