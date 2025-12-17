import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

// Basic styling for the modal content
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function EditUserModal({
  open,
  handleClose,
  userData, // This prop will now receive EITHER user data or role data
  onSave,
  editMode = 'user' // Default to 'user' mode, not 'full'
}) {
  // Initialize formData based on the expected fields for user or role
  const [formData, setFormData] = useState({
    id: '', // Crucial for updates
    name: '', // This will hold the user's name OR the role's name
    age: '',
    email: '',
    role: '', // 'role' field within User object (e.g., "Admin", "Editor")
    description: '', // Description can be for user or for actual role entity
  });

  useEffect(() => {
    if (userData) {
      // When userData changes (i.e., modal opens with new data),
      // update formData. This handles both user and role objects.
      setFormData((prevData) => ({
        ...prevData, // Keep previous state for unmanaged fields if any
        ...userData, // Spread userData to overwrite matching fields
        // Specifically for roles, map 'role' property from API to 'name' for the input field
        // And map 'name' for users to 'name' for the input field
        name: editMode === 'role' ? userData.role : userData.name,
      }));
    } else {
      // Clear form data when modal closes or userData is null
      setFormData({
        id: '',
        name: '',
        age: '',
        email: '',
        role: '',
        description: '',
      });
    }
  }, [userData, editMode]); // Add editMode to dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the relevant updated data to the parent component based on editMode
    if (editMode === 'role') { // Only send 'role' and 'description' for role edits
      onSave({
        id: formData.id,
        role: formData.name, // Send the 'name' field's value as 'role' for the backend
        description: formData.description,
      });
    } else { // 'user' or 'user-full' mode will send the entire formData
      onSave(formData);
    }
    handleClose(); // Close the modal after saving
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-entity-modal-title" // More generic title
      aria-describedby="edit-entity-modal-description"
    >
      <Box sx={style}>
        <Typography id="edit-entity-modal-title" variant="h6" component="h2" gutterBottom>
          Edit {editMode === 'role' ? 'Role' : 'User'} {/* Dynamic Title */}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            '& .MuiTextField-root, & .MuiFormControl-root': { mb: 2, width: '100%' },
          }}
        >
          {/* Name Input - Always shown for both User and Role */}
          <TextField
            label={editMode === 'role' ? 'Role' : 'Name'} // Dynamic label based on editMode
            name="name" // The internal name for the formData state remains 'name'
            value={formData.name || ''}
            onChange={handleChange}
            fullWidth
          />

          {/* Description Input - Shown for Role editMode, and 'user-full' user editMode */}
          {(editMode === 'role' || editMode === 'user-full') && (
            <TextField
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          )}

          {/* User-specific fields: Age, Email, and User Role (as a select) */}
          {/* IMPORTANT CHANGE BELOW:
              Now this block renders when editMode is 'user' (for age, email)
              OR when editMode is 'user-full' (for role select).
              Age/Email should *only* show if editMode is 'user'
          */}
          {/* User Age and Email fields - only for 'user' mode */}
          {editMode === 'user' && ( // <--- EDITED: This now specifically targets 'user' mode
            <>
              <TextField
                label="Age"
                name="age"
                type="number"
                value={formData.age || ''}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                fullWidth
              />
            </>
          )}

          {/* User Role Select - only for 'user-full' mode (or if you combine with 'user' if needed) */}
          {editMode === 'user-full' && ( // <--- EDITED: This targets 'user-full' for the role dropdown
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role || ''}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Editor">Editor</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
                <MenuItem value="Moderator">Moderator</MenuItem>
                <MenuItem value="Analyst">Analyst</MenuItem>
                <MenuItem value="Support">Support</MenuItem>
                <MenuItem value="Developer">Developer</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Guest">Guest</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
              </Select>
            </FormControl>
          )}


          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditUserModal;