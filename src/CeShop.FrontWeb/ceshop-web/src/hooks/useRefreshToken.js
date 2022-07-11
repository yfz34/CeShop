import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/api/accounts/refreshtoken', {
            withCredentials: true
        });
        setAuth(prev => {
            // console.log(JSON.stringify(prev));
            // console.log(response.data.accessToken);

            const roles = response?.data?.roles?.map((role) => role.name);
            return { 
                ...prev,
                roles: roles,
                accessToken: response.data.tokenData.accessToken
            }
        });
        return response.data.tokenData.accessToken;
    }
    return refresh;
};

export default useRefreshToken;