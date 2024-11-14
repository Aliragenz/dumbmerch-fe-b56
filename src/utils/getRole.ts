import Cookies from 'js-cookie';

export const getUserRole = () =>{
    const token=Cookies.get('authToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.role;
    }
    return null;
  }