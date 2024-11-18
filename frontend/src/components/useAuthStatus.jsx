import { useEffect, useState } from 'react';
import axios from 'axios';

function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuthStatus() {
        axios.get('/api/auth/status')
          .then(res => {
            console.log(res);
            setIsAuthenticated(res.data.authenticated);
          })
          .catch(err => {
            console.error(err);
          });

    } 

    checkAuthStatus();
  }, []);

  return { isAuthenticated };
}

export default useAuthStatus;
