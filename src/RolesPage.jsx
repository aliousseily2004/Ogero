import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import DataTable from './DataTable';
import AddModal from './AddModal'; // Assuming this is for adding users, consider a dedicated AddRoleModal
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditUserModal from './EditModal'; // We'll repurpose this for roles, but ideally you'd have EditRoleModal

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false); // Renamed for clarity (add user/role)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // States for Edit Modal (adapted for roles)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null); // Changed to roleToEdit
const [isAuthenticated, setIsAuthenticated] = useState(true); 
  useEffect(() => {
     const token = localStorage.getItem('jwtToken');
     if (!token) {
       setIsAuthenticated(false);
       return;
     }
     setIsAuthenticated(true);
     fetchRoles();
   }, []);
  // --- Data Fetching ---
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/roles'); // Correct endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      const data = await response.json();
      console.log('Fetched roles:', data);
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles(); // Call fetchRoles on mount
  }, []);

  // --- Add Modal Handlers (currently using AddModal - might need an AddRoleModal) ---
  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    fetchRoles(); // Refresh roles after closing the add modal
  };

  // --- Delete Handlers ---
  const handleClickDelete = (id) => {
    setRoleToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setRoleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (roleToDelete) {
      try {
        const response = await fetch(`http://localhost:8081/roles/${roleToDelete}`, { // Correct DELETE endpoint
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete role: ${response.status} ${response.statusText} - ${errorText}`);
        }

        console.log(`Role with ID ${roleToDelete} deleted successfully.`);
        fetchRoles(); // Refresh the list of roles
      } catch (error) {
        console.error('Error deleting role:', error);
        alert(`Error deleting role: ${error.message}`);
      } finally {
        handleCloseConfirmDialog();
      }
    }
  };

  // --- Edit Modal Handlers ---
  const handleOpenEditModal = (role) => { // Takes 'role' data
    setRoleToEdit(role); // Set the role data to be edited
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRoleToEdit(null); // Clear role data when closing
    fetchRoles(); // Refresh roles after closing the edit modal
  };

  const handleSaveRoleEdit = async (updatedRoleData) => { // Renamed to handleSaveRoleEdit
    console.log('Attempting to save role changes:', updatedRoleData);
    try {
      // Create a payload with ONLY the fields your roles PUT/PATCH endpoint accepts
      // Assuming your role object has 'id', 'name', and 'description'
      const payload = {
        id: updatedRoleData.id,
        role: updatedRoleData.role,
        description: updatedRoleData.description,
        // Do NOT send age or email if your role model doesn't have them
      };

      const response = await fetch(`http://localhost:8081/roles/${payload.id}`, { // Correct PUT endpoint for roles
        method: 'PUT', // or 'PATCH' if your backend supports partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the specific payload
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update role: ${response.status} ${response.statusText} - ${errorText}`);
      }

      console.log('Role updated successfully:', updatedRoleData);
    } catch (error) {
      console.error('Error updating role:', error);
      alert(`Error updating role: ${error.message}`);
    } finally {
      handleCloseEditModal(); // Close the modal regardless of success or failure
    }
  };
  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6" color="error">
          🚫 You should login to view this page.
        </Typography>
      </Box>
    );
  }

  // --- DataTable Columns ---
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'role', headerName: 'Role Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 }, // Assuming roles have a description
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Role">
            <IconButton
              color="primary"
              aria-label="edit"
              onClick={() => handleOpenEditModal(params.row)} // Pass the entire row data (role)
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Role">
            <IconButton
              color="error"
              aria-label="delete"
              onClick={() => handleClickDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Role Overview
        </Typography>
        <Button
          onClick={handleOpenAddModal}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '4px',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          }}
        >
          Add
        </Button>
      </Box>

      {loading ? (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          Loading roles...
        </Typography>
      ) : (
        <DataTable
          data={roles} // Pass roles data
          columns={columns}
          pageSize={5}
        />
      )}

      {/* Add Modal - Consider creating a dedicated AddRoleModal */}
      <AddModal
        open={openAddModal}
        handleClose={handleCloseAddModal}
        onUserAdded={fetchRoles} // This prop name might be misleading if AddModal adds roles
      />

      {/* Edit Role Modal (repurposed EditUserModal) */}
      <EditUserModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        userData={roleToEdit} // Pass role data as userData to the modal
        onSave={handleSaveRoleEdit} // Use the new role save handler
        editMode="role" // Set to "full" to show name, description fields
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete Role"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this role? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}