import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { api } from '../utils/api';

function Transfers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.transfers.getAll()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to pull node records.');
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '4rem auto' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Active Asset Data Transfers</Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Origin Node</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Target Destination</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Volume Payload Capacity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Pipeline Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{row.from}</TableCell>
                <TableCell>{row.to}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={row.status} 
                    color={row.status === 'Completed' ? 'success' : 'info'} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Transfers;