import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError('Please log in to view your profile');
      return;
    }
    fetchUserClasses();
  }, [user]);

  const fetchUserClasses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/classes/registered/me');
      setClasses(res.data || []);
    } catch (err) {
      setError('Failed to fetch registered classes');
    }
  };

  const formatTime = (time) => {
    // Convert 24h format to 12h format
    const [hours, minutes] = time.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <Container>
      <h1 className="mb-4">My Profile</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Profile Information</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {user?.name || 'Not available'}<br />
                <strong>Email:</strong> {user?.email || 'Not available'}<br />
                <strong>Membership:</strong> {user?.membershipType || 'Basic'}<br />
                <strong>Join Date:</strong> {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Not available'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mb-3">My Registered Classes</h2>
      <Row>
        {classes.length === 0 ? (
          <Col>
            <Card>
              <Card.Body>
                <Card.Text className="text-center">
                  You haven't registered for any classes yet.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          classes.map(classItem => (
            <Col md={4} key={classItem._id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{classItem.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    <Badge bg="info" className="me-2">
                      {classItem.type.charAt(0).toUpperCase() + classItem.type.slice(1)}
                    </Badge>
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Instructor:</strong> {classItem.trainer}<br />
                    <strong>Schedule:</strong> {classItem.schedule.day} at {formatTime(classItem.schedule.time)}<br />
                    <strong>Duration:</strong> {classItem.schedule.duration} minutes<br />
                    <strong>Participants:</strong> {classItem.currentParticipants}/{classItem.maxParticipants}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Profile;