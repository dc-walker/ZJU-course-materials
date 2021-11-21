import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Login from './pages/login'
import Home from "./pages/home";

const router = () => {
    return (
        <BrowserRouter>
            <Route path={'/'} exact={true} component={Home} />
            <Route path={'/home'} component={Home} />
            <Route path={'/sign'} component={Login} />
        </BrowserRouter>
    )
}

export default router;