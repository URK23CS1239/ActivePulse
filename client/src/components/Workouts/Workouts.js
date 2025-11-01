import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import api from '../../services/api';

const initialForm = {
  exerciseName: '',
  category: 'cardio',
  duration: '',
  caloriesBurned: ''
};

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/workouts');
      // API may return { workouts: [...], total, ... } or an array directly
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data && res.data.workouts) ? res.data.workouts : (res.data || []);
      setWorkouts(data);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      // Include more diagnostic info when available
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message || 'Failed to load workouts. Please try again.';
      setError(message + (status ? ` (status ${status})` : ''));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate inputs
    if (!form.exerciseName.trim()) {
      setError('Please provide an exercise name');
      return;
    }

    const duration = Number(form.duration);
    if (!duration || duration <= 0) {
      setError('Please provide a valid duration (greater than 0)');
      return;
    }

    const calories = Number(form.caloriesBurned);
    if (calories < 0) {
      setError('Calories burned cannot be negative');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        exerciseName: form.exerciseName.trim(),
        category: form.category,
        duration: duration,
        caloriesBurned: calories || 0,
        date: new Date()
      };
      const res = await api.post('/workouts', payload);
      setWorkouts(prev => [res.data, ...prev]);
      setForm(initialForm);
      setSuccess('Workout added successfully!');
    } catch (err) {
      console.error('Error creating workout:', err);
      setError(err.response?.data?.message || 'Failed to create workout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      setError('');
      await api.delete(`/workouts/${id}`);
      setWorkouts(prev => prev.filter(w => w._id !== id));
      setSuccess('Workout deleted successfully!');
    } catch (err) {
      console.error('Error deleting workout:', err);
      setError(err.response?.data?.message || 'Failed to delete workout. Please try again.');
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Workouts</h1>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error} <div className="mt-2"><Button variant="outline-light" onClick={fetchWorkouts}>Retry</Button></div>
        </Alert>
      ) }
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Add Workout</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Exercise Name *</Form.Label>
                  <Form.Control 
                    name="exerciseName"
                    value={form.exerciseName}
                    onChange={handleChange}
                    disabled={submitting}
                    required
                    placeholder="Enter exercise name"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Category</Form.Label>
                  <Form.Select 
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="balance">Balance</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Duration (minutes) *</Form.Label>
                  <Form.Control 
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    disabled={submitting}
                    required
                    placeholder="Enter duration in minutes"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Calories Burned</Form.Label>
                  <Form.Control 
                    name="caloriesBurned"
                    value={form.caloriesBurned}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    disabled={submitting}
                    placeholder="Enter calories burned (optional)"
                  />
                </Form.Group>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-100"
                >
                  {submitting ? 'Adding...' : 'Add Workout'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Workouts</Card.Title>
              {loading ? (
                <div className="text-center py-3">Loading workouts...</div>
              ) : (
                <ListGroup variant="flush">
                  {workouts.length === 0 && (
                    <ListGroup.Item className="text-center text-muted">
                      No workouts yet. Add your first workout!
                    </ListGroup.Item>
                  )}
                  {workouts.map(workout => (
                    <ListGroup.Item 
                      key={workout._id} 
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="d-flex align-items-center">
                          <strong>{workout.exerciseName}</strong>
                          <span className="badge bg-secondary ms-2">
                            {workout.category}
                          </span>
                        </div>
                        <div className="small text-muted">
                          {workout.duration} min • {workout.caloriesBurned || 0} cal • 
                          {new Date(workout.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDelete(workout._id)}
                      >
                        Delete
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Workouts;