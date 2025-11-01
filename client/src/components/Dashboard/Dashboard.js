// client/src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [quote] = useState("The only bad workout is the one that didn't happen. — Unknown");
  const [loading] = useState(false);  // Add loading state

  // Sample workout data
  const recentWorkouts = [
    { id: 1, exerciseName: 'Morning Run', duration: 30, caloriesBurned: 300 },
    { id: 2, exerciseName: 'Weight Training', duration: 45, caloriesBurned: 200 },
    { id: 3, exerciseName: 'Yoga', duration: 60, caloriesBurned: 150 },
  ];

  // Sample statistics
  const stats = {
    totalWorkouts: 24,
    totalCalories: 5600,
    totalDuration: 720,
  };

  const chartData = [
    { day: 'Mon', calories: 400, workouts: 2 },
    { day: 'Tue', calories: 300, workouts: 1 },
    { day: 'Wed', calories: 500, workouts: 3 },
    { day: 'Thu', calories: 200, workouts: 1 },
    { day: 'Fri', calories: 600, workouts: 4 },
    { day: 'Sat', calories: 450, workouts: 2 },
    { day: 'Sun', calories: 350, workouts: 2 },
  ];

  return (
    <div className="dashboard">
      <Row className="mb-4">
        <Col>
          <h2>Welcome to ActivePulse! 💪</h2>
          <Card className="bg-light">
            <Card.Body>
              <blockquote className="blockquote mb-0">
                <p>{quote}</p>
              </blockquote>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Workouts</Card.Title>
              <h3 className="text-primary">{stats.totalWorkouts || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Calories Burned</Card.Title>
              <h3 className="text-success">{stats.totalCalories || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Duration</Card.Title>
              <h3 className="text-info">{stats.totalDuration || 0} min</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Current Streak</Card.Title>
              <h3 className="text-warning">5 days</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Weekly Progress</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">Loading weekly progress...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      wrapperStyle={{ zIndex: 1000 }}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                              <p style={{ margin: '0 0 5px 0' }}><strong>{label}</strong></p>
                              <p style={{ margin: '0 0 5px 0' }}>Calories: {payload[0].value}</p>
                              <p style={{ margin: '0' }}>Workouts: {payload[1].value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }}
                      name="Calories Burned"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="workouts" 
                      stroke="#82ca9d" 
                      activeDot={{ r: 8 }}
                      name="Number of Workouts"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Workouts</h5>
              <Button as={Link} to="/workouts" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {recentWorkouts.length > 0 ? (
                recentWorkouts.map(workout => (
                  <div key={workout.id} className="border-bottom pb-2 mb-2">
                    <strong>{workout.exerciseName}</strong>
                    <div className="text-muted small">
                      {workout.duration}min • {workout.caloriesBurned} cal
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No workouts yet. Start logging your progress!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;