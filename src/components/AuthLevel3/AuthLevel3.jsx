import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const AuthLevel3 = React.memo(() => {

  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    history.push('/authLevel2');
  }

    return (
      <div>
        <h1>
            Hello
        </h1>
        <Button onClick={handleLogout}>Cancel</Button>
    </div>
  );
});

export default AuthLevel3;
