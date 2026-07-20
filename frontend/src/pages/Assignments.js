import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { api } from '../utils/api';
import Modal from '../components/Modal';

function Assignments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.assignments.getAll()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to parse tasks.');
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '4rem auto' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>System Task Assignments</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)} sx={{ textTransform: 'none' }}>
          + New Task
        </Button>
      </Box>

      <Stack spacing={2}>
        {items.map((item) => (
          <Card key={item.id} variant="outlined" sx={{ '&:hover': { boxShadow: 2 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>{item.title}</Typography>
                <Chip label={`Due: ${item.due}`} color="warning" size="small" variant="outlined" />
              </Box>
              <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Interactive Modal Incorporation Demo */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New Project Task" onSubmit={() => setModalOpen(false)} submitText="Create Task">
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField fullWidth label="Task Assignment Name" variant="outlined" />
          <TextField fullWidth label="Deadline Date" placeholder="e.g., Aug 12" variant="outlined" />
          <TextField fullWidth multiline rows={3} label="Technical Objective Summary Description" variant="outlined" />
        </Stack>
      </Modal>
    </Container>
  );
}

export default Assignments;