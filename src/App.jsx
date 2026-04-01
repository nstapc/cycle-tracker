import WorkoutLog from './components/WorkoutLog';
import PRTracker from './components/PRTracker';
import ProgressChart from './components/ProgressChart';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Cycle Tracker</h1>
      <WorkoutLog />
      <PRTracker />
      <ProgressChart />
    </div>
  );
}

export default App;
