import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ServerProvider } from './serverRoute'
import Login from '../pages/allRoutes/autentication/login';
import Development from '../pages/allRoutes/utility/development';
import NotFound from '../pages/allRoutes/utility/notfound';
import NotPermission from '../pages/allRoutes/utility/notpermission';
import RoutesAdmin from './acessRoute/routesAdmin';

export default function AppRoutes() {

    return (
        <Router>
            <ServerProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/em-desenvolvimento" element={<Development />} />
                    <Route path="/pagina-inexistente" element={<NotFound />} />
                    <Route path="/acesso-negado" element={<NotPermission />} />
                </Routes>
                <RoutesAdmin />
            </ServerProvider>
        </Router>
    );
}
