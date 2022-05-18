import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import UserDashBoard from './components/Dashboard/UserDashBoard'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={SignUp} />
          <Route exact path="/SignIn" component={SignIn} />
          <Route exact path="/AdminDashboard" component={AdminDashboard} />
          <Route exact path="/UserDashBoard" component={UserDashBoard} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
