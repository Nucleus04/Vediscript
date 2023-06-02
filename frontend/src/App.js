import './App.css';
import store from './redux/store';
import Routers from './routes/route';
import {Provider} from "react-redux";

function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <Routers />
            </Provider>
        </div>
    );
}

export default App;
