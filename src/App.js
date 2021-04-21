import './App.scss';
import { BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterComponent from './component/register';
import LoginComponent from './component/login';
import TaskComponent from './component/task';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="container">
          <Route path="/" exact component={RegisterComponent} />
          <Route path="/login" component={LoginComponent} />
          <Route path="/task" component={TaskComponent} />
        </div>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
