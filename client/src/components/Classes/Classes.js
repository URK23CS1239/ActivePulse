import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import api from '../../services/api';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trainer: '',
    type: 'yoga',
    schedule: {
      day: 'Monday',
      time: '',
      duration: 60
    },
    maxParticipants: 20,
    price: 0
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First, fetch all classes
      const classesResponse = await api.get('/classes');
      
      // Extract classes data from response, handling different response formats
      const classesData = Array.isArray(classesResponse.data) 
        ? classesResponse.data 
        : (classesResponse.data && classesResponse.data.classes) 
          ? classesResponse.data.classes 
          : [];
      
      let registeredClassIds = [];
      try {
        // Try to fetch registered classes if user is logged in
        const registeredResponse = await api.get('/classes/registered/me');
        registeredClassIds = registeredResponse.data.map(c => c._id);
      } catch (regError) {
        // Silently handle registration check errors - user might not be logged in
      }
      
      // Merge the registration status into the classes data
      const classesWithRegistration = classesData.map(classItem => ({
        ...classItem,
        isRegistered: registeredClassIds.includes(classItem._id)
      }));
      
      setClasses(classesWithRegistration);
    } catch (err) {
      console.error('Error fetching classes:', err);
      // Include more diagnostic info in error message
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      setError(`Failed to fetch classes${status ? ` (${status})` : ''}: ${message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('schedule.')) {
      const scheduleField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [scheduleField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form data
    if (!formData.name.trim() || !formData.trainer.trim() || !formData.schedule.time || 
        formData.schedule.duration <= 0 || formData.maxParticipants <= 0 || formData.price < 0) {
      setError('Please fill in all required fields with valid values');
      return;
    }

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        trainer: formData.trainer.trim(),
        schedule: {
          ...formData.schedule,
          duration: Math.max(1, parseInt(formData.schedule.duration)),
        },
        maxParticipants: Math.max(1, parseInt(formData.maxParticipants)),
        price: Math.max(0, parseFloat(formData.price))
      };

      await api.post('/classes', payload);
      setSuccess('Class created successfully');
      setShowForm(false);
      fetchClasses();
      setFormData({
        name: '',
        description: '',
        trainer: '',
        type: 'yoga',
        schedule: {
          day: 'Monday',
          time: '',
          duration: 60
        },
        maxParticipants: 20,
        price: 0
      });
    } catch (err) {
      console.error('Error creating class:', err);
      setError(err.response?.data?.message || 'Failed to create class. Please try again.');
    }
  };

  const handleRegister = async (classId) => {
    try {
      setError('');
      setSuccess('');
      setRegistering(classId);
      
      await api.post(`/classes/${classId}/register`);
      setSuccess('Successfully registered for class');
      
      // Update the local state to reflect the registration
      setClasses(prevClasses => 
        prevClasses.map(c => 
          c._id === classId
            ? {
                ...c,
                isRegistered: true,
                currentParticipants: (c.currentParticipants || 0) + 1
              }
            : c
        )
      );
    } catch (err) {
      console.error('Error registering for class:', err);
      if (err.response?.status === 401) {
        setError('Please log in to register for classes');
      } else {
        setError(err.response?.data?.message || 'Failed to register for class. Please try again.');
      }
    } finally {
      setRegistering(null);
    }
  };

  const classTypes = ['yoga', 'pilates', 'cycling', 'hiit', 'zumba', 'boxing'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Container className="py-4">
      <h2 className="mb-4">Fitness Classes</h2>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
          <div className="mt-2">
            <Button variant="outline-light" onClick={fetchClasses}>
              Retry Loading Classes
            </Button>
          </div>
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}

      <Button 
        variant="primary" 
        className="mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Hide Form' : 'Schedule New Class'}
      </Button>

      {showForm && (
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Class Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Trainer</Form.Label>
                    <Form.Control
                      type="text"
                      name="trainer"
                      value={formData.trainer}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      {classTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Day</Form.Label>
                    <Form.Select
                      name="schedule.day"
                      value={formData.schedule.day}
                      onChange={handleInputChange}
                    >
                      {weekDays.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="schedule.time"
                      value={formData.schedule.time}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      name="schedule.duration"
                      value={formData.schedule.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Participants</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit">
                Create Class
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Loading classes...</div>
        </div>
      ) : (
        <Row>
          {classes.length === 0 ? (
            <Col>
              <div className="text-center text-muted py-4">
                No classes available at the moment.
              </div>
            </Col>
          ) : (
            classes.map(classItem => (
              <Col key={classItem._id} md={6} lg={4} className="mb-4">
                <Card className={classItem.isRegistered ? 'border-success' : ''}>
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-start">
                      {classItem.name}
                      <Badge 
                        bg={classItem.currentParticipants >= classItem.maxParticipants ? 'danger' : 'primary'}
                        pill
                      >
                        {classItem.currentParticipants}/{classItem.maxParticipants}
                      </Badge>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {classItem.type.charAt(0).toUpperCase() + classItem.type.slice(1)}
                    </Card.Subtitle>
                    <Card.Text>
                      <p className="mb-2">{classItem.description}</p>
                      <div className="mb-1">
                        <i className="bi bi-person-circle me-2"></i>
                        <strong>Trainer:</strong> {classItem.trainer}
                      </div>
                      <div className="mb-1">
                        <i className="bi bi-calendar-event me-2"></i>
                        <strong>Schedule:</strong> {classItem.schedule.day} at {classItem.schedule.time}
                      </div>
                      <div className="mb-1">
                        <i className="bi bi-clock me-2"></i>
                        <strong>Duration:</strong> {classItem.schedule.duration} minutes
                      </div>
                      <div className="mb-1">
                        <i className="bi bi-currency-dollar me-2"></i>
                        <strong>Price:</strong> ${classItem.price}
                      </div>
                    </Card.Text>
                    {classItem.isRegistered ? (
                      <Button 
                        variant="success"
                        disabled
                        className="w-100"
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Registered
                      </Button>
                    ) : (
                      <Button 
                        variant={classItem.currentParticipants >= classItem.maxParticipants ? "secondary" : "primary"}
                        onClick={() => handleRegister(classItem._id)}
                        disabled={classItem.currentParticipants >= classItem.maxParticipants || registering === classItem._id}
                        className="w-100"
                      >
                        {registering === classItem._id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Registering...
                          </>
                        ) : classItem.currentParticipants >= classItem.maxParticipants ? (
                          'Class Full'
                        ) : (
                          'Register'
                        )}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default Classes;