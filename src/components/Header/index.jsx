import React, { useEffect } from 'react';
import './styles.css';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import userSvg from '../../assets/user.svg';

function Header() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const logoutFunc = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out!');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='navbar'>
      <p className='logo'>Billsy</p>
      {user ? (
        <div className="navbar-link" onClick={logoutFunc}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={user.photoURL ? user.photoURL : userSvg}
              alt="User Avatar"
              width={user.photoURL ? '32' : '24'}
              style={{ borderRadius: '50%', height: '2rem', width: '2rem' }}
            />
          </span>
          <span style={{ marginLeft: '0.5rem' }}>Logout</span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Header;
