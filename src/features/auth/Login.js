import { useRef, useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"

const Login = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const navigate = useNavigate()

  const [login, {
    isLoading
  }] = useLoginMutation()

  const dispatch = useDispatch()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const userData = await login({ user, password }).unwrap()
      dispatch(setCredentials({ ...userData, user }))
      setUser('')
      setPassword('')
      navigate('/')
    } catch(err) {
      if (!err?.originalStatus) {
        setErrMsg('No server response')
      } else if (err.originalStatus === 400) {
        setErrMsg('Missing username or password')
      } else if (err.originalStatus === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg('Login Failed')
      }
      errRef.current.focus()
    }
  }

  const handleUserInput = (e) => setUser(e.target.value)

  const handlePasswordInput = (e) => setPassword(e.target.value)

  const content = isLoading ? <h1>Loading...</h1> : (
    <section className="login">
      <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

      <h1>Employee Login</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          value={user}
          onChange={handleUserInput}
          autoComplete="off"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordInput}
          required
        />

        <button>Sign In</button>
      </form>
    </section>
  )

  return content
}

export default Login