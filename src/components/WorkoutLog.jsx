import { useState, useEffect } from 'react';
import { fetchWorkouts, addWorkout } from '../api/nocodb';

export default function WorkoutLog() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ exercise: '', sets: '', reps: '', weight: '' });

  useEffect(() => {
    fetchWorkouts().then(setWorkouts).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newWorkout = await addWorkout({
      ...form,
      sets: Number(form.sets),
      reps: Number(form.reps),
      weight: Number(form.weight),
      date: new Date().toISOString(),
    });
    setWorkouts((prev) => [...prev, newWorkout]);
    setForm({ exercise: '', sets: '', reps: '', weight: '' });
  };

  return (
    <section className="workout-log">
      <h2>Workout Log</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Exercise"
          value={form.exercise}
          onChange={(e) => setForm({ ...form, exercise: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Sets"
          value={form.sets}
          onChange={(e) => setForm({ ...form, sets: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Reps"
          value={form.reps}
          onChange={(e) => setForm({ ...form, reps: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Weight (lbs)"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
          required
        />
        <button type="submit">Log Workout</button>
      </form>
      <ul>
        {workouts.map((w) => (
          <li key={w.Id}>
            {w.exercise}: {w.sets}×{w.reps} @ {w.weight}lbs
          </li>
        ))}
      </ul>
    </section>
  );
}
