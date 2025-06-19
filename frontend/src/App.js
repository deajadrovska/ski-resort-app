import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [resorts, setResorts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    slopes: '',
    difficulty: 'Beginner'
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch resorts from API
  useEffect(() => {
    fetchResorts();
  }, []);

  const fetchResorts = async () => {
    try {
      const response = await fetch(`${API_BASE}/resorts`);
      const data = await response.json();
      setResorts(data);
    } catch (error) {
      console.error('Error fetching resorts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/resorts/${editingId}` : `${API_BASE}/resorts`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', location: '', slopes: '', difficulty: 'Beginner' });
        setEditingId(null);
        fetchResorts();
      }
    } catch (error) {
      console.error('Error saving resort:', error);
    }
  };

  const handleEdit = (resort) => {
    setFormData({
      name: resort.name,
      location: resort.location,
      slopes: resort.slopes.toString(),
      difficulty: resort.difficulty
    });
    setEditingId(resort._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resort?')) {
      try {
        await fetch(`${API_BASE}/resorts/${id}`, { method: 'DELETE' });
        fetchResorts();
      } catch (error) {
        console.error('Error deleting resort:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', location: '', slopes: '', difficulty: 'Beginner' });
    setEditingId(null);
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>🎿 Ski Resort Management</h1>
        </header>

        <main className="container">
          <div className="form-section">
            <h2>{editingId ? 'Edit Resort' : 'Add New Resort'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                  type="text"
                  placeholder="Resort Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
              />
              <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
              />
              <input
                  type="number"
                  placeholder="Number of Slopes"
                  value={formData.slopes}
                  onChange={(e) => setFormData({...formData, slopes: e.target.value})}
                  required
              />
              <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <div className="form-buttons">
                <button type="submit">
                  {editingId ? 'Update Resort' : 'Add Resort'}
                </button>
                {editingId && (
                    <button type="button" onClick={handleCancel} className="cancel-btn">
                      Cancel
                    </button>
                )}
              </div>
            </form>
          </div>

          <div className="resorts-section">
            <h2>Ski Resorts ({resorts.length})</h2>
            <div className="resorts-grid">
              {resorts.map((resort) => (
                  <div key={resort._id} className="resort-card">
                    <h3>{resort.name}</h3>
                    <p><strong>📍 Location:</strong> {resort.location}</p>
                    <p><strong>⛷️ Slopes:</strong> {resort.slopes}</p>
                    <p><strong>🏔️ Difficulty:</strong> {resort.difficulty}</p>
                    <div className="card-actions">
                      <button onClick={() => handleEdit(resort)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(resort._id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
              ))}
            </div>
            {resorts.length === 0 && (
                <p className="no-resorts">No ski resorts found. Add your first resort above! 🎿</p>
            )}
          </div>
        </main>
      </div>
  );
}

export default App;