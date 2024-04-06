import { useContext } from 'react';
import {
	createBrowserRouter,
	RouterProvider,
	Routes,
	Navigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from './layout/Layout';
import Home from './pages/Home';
import route from './configs/route';
import { AuthToken } from './authToken';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import Chat from './pages/Chat';
import RegisterOtpConfirm from './pages/RegisterOtpConfirm';
import CallList from './components/CallList';
const PrivateRoute = ({ children, requiredRole }) => {
	const { role } = useContext(AuthToken);
	if (
		(requiredRole === undefined && role !== null) ||
		requiredRole === role
	) {
		return children;
	} else {
		return <Navigate to={route.login} />;
	}
};
const router = createBrowserRouter([
  {
    path: route.callList,
    element: (
      <Layout>
        <CallList />
      </Layout>
    ),
  },
  {
    path: route.home,
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: route.registerConfirm,
    element: (
      <Layout>
        <RegisterOtpConfirm />
      </Layout>
    ),
  },
  {
    path: route.forgotPassword,
    element: (
      <Layout>
        <ForgotPassword />
      </Layout>
    ),
  },
  {
    path: route.resetPasswordConfirm,
    element: (
      <Layout>
        <ResetPasswordConfirm />
      </Layout>
    ),
  },
  {
    path: route.resetPassword,
    element: (
      <Layout>
        <ResetPassword />
      </Layout>
    ),
  },
  {
    path: route.register,
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
  },
  {
    path: route.chat,
    element: <Chat />,
  },
  {
    path: route.forgotPassword,
    element: <ForgotPassword />,
  },
  {
    path: route.resetPassword,
    element: <ResetPassword />,
  },
]);
function App() {
	return (
		<>
			<RouterProvider router={router}>
				<Routes />
			</RouterProvider>
		</>
	);
}

export default App;
