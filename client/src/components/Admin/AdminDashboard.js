import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Line } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ admins: 0, classes: 0, workouts: 0 });
  const [workouts, setWorkouts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchAdminData();
    }
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, workoutsRes, classesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats'),
        axios.get('http://localhost:5000/api/admin/workouts'),
        axios.get('http://localhost:5000/api/admin/classes')
      ]);

      setStats(statsRes.data);
      setWorkouts(workoutsRes.data);
      setClasses(classesRes.data);
    } catch (err) {
      setError('Failed to fetch admin data');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', loginForm);
      localStorage.setItem('adminToken', res.data.token);
      setIsLoggedIn(true);
      fetchAdminData();
      setSuccess('Logged in successfully');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
  };

  if (!isLoggedIn) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Admin Login</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="d-flex justify-content-between align-items-center">
            Admin Dashboard
            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
          </h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Classes</Card.Title>
              <h2>{stats.classes}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Workouts</Card.Title>
              <h2>{stats.workouts}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Admin Users</Card.Title>
              <h2>{stats.admins}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Classes</Card.Title>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Trainer</th>
                    <th>Participants</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.slice(0, 5).map(classItem => (
                    <tr key={classItem._id}>
                      <td>{classItem.name}</td>
                      <td>{classItem.trainer}</td>
                      <td>{classItem.currentParticipants}/{classItem.maxParticipants}</td>
                      <td>{classItem.isActive ? 'Active' : 'Inactive'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Workouts</Card.Title>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Duration</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.slice(0, 5).map(workout => (
                    <tr key={workout._id}>
                      <td>{workout.exerciseName}</td>
                      <td>{workout.duration} min</td>
                      <td>{new Date(workout.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;