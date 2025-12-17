import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function AddModal({ open, handleClose, onUserAdded }) {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    age: '',
    role: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8081/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add user');
    }

    const newUser = await response.json();
    console.log('User added:', newUser);
    
    // Optional: Clear form
    setFormData({
      name: '',
      email: '',
      age: '',
      role: '',
      description: ''
    });

    handleClose();
if (onUserAdded) onUserAdded();
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropProps={{
        style: {
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }
      }}
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Add New User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="User Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            margin="normal"
            inputProps={{ min: 1 }}
          />
          <FormControl fullWidth margin="normal">
            <TextField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </FormControl>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}