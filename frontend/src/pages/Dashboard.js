import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { api } from '../utils/api';

function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.dashboard.getMetrics()
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch status metrics.');
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '4rem auto' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Operational Dashboard</Typography>
      <Grid container spacing={3}>
        {metrics.map((metric, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card sx={{ borderLeft: `6px solid ${metric.color || '#1976d2'}`, boxShadow: 3 }}>
              <CardContent>
                <Typography color="text.secondary" variant="subtitle2" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {metric.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {metric.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard;