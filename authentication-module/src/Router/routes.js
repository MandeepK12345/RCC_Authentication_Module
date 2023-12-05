import ROUTES from '../helper/constants'
import HomeScreen from '../Component/Homescreen';
import Login from '../Component/Login';
import ForgotPassword from '../Component/ForgotPassword';
import Signup from '../Component/Signup';

export const pageRoutes = [
    {
        name: 'Login',
        path: ROUTES.LOGIN,
        Component: Login,
    },
    {
        name: 'Homescreen',
        path: ROUTES.HOMESCREEN,
        Component: HomeScreen,
    },
    {
        name: 'ForgotPassword',
        path: ROUTES.FORGOTPASSWORD,
        Component: ForgotPassword,
    },
    {
        name: 'Signup',
        path: ROUTES.SIGNUP,
        Component: Signup,
    }  
]