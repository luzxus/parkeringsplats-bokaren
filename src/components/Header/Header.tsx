import React from 'react'
import './Header.css'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const Header: React.FC<{
  isLoggedIn: Boolean
  handleLogout: () => void
}> = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate()
  return (
    <header className="header">
      <h1>FFCG</h1>
      <nav className="nav">
        {isLoggedIn ? (
          <Button
            color="primary"
            variant="text"
            onClick={handleLogout}
            className="nav-link"
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              color="primary"
              variant="text"
              onClick={() => navigate('/')}
              className="nav-link"
            >
              Login
            </Button>
            <Button
              color="primary"
              variant="text"
              onClick={() => navigate('/signup')}
              className="nav-link"
            >
              Sign Up
            </Button>
          </>
        )}
      </nav>
    </header>
  )
}
