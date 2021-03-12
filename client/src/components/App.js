import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import './App.css';
import * as Pages from './index'
import * as auth from '../services/auth'



// Dynamically load other components in and around
// this App component
class App extends Component {
    state = {
        loggedin: 'Login',
        current_page: <Pages.Splash />
    }

    loginlogout() {
        if (this.state.loggedin === 'Login') {
            const login = auth.login();
            if (login) {
                this.setState({ current_page: <Pages.Main /> });
                this.setState({ loggedin: 'Logout' });
            } else {
                alert('Error logging in')
            }
            return null
        } else {
            const logout = auth.logout();
            if (logout) {
                this.setState({ current_page: <Pages.Splash /> });
                this.setState({ loggedin: 'Login' });
            } else {
                alert('Error logging out')
            }
            return null
        }
    }

    render() {
        return (
            <main>
                <header id='header'>
                    <Typography id='title' variant='h2'>
                        IGP-2020-Group1 Traffic Surveillance Application
                    </Typography>
                    <Button id='login-button' variant='contained' color='primary' onClick={() => { this.loginlogout() }}>
                        {this.state.loggedin}
                    </Button>
                </header>
                {this.state.current_page}
            </main>
        )
    }
}

export default App;