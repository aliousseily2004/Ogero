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
import AddModal from './AddModal'; // Assuming this is for adding users/permissions
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditUserModal from './EditModal'; // This is the versatile modal we modified

export default function RolesPage() { // Consider renaming this file and component to PermissionsPage for clarity
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false); // Renamed for clarity (add user/permission)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);

  // States for Edit Modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [permissionToEdit, setPermissionToEdit] = useState(null); // State to store the permission data for editing
 const [isAuthenticated, setIsAuthenticated] = useState(true); 
  useEffect(() => {
     const token = localStorage.getItem('jwtToken');
     if (!token) {
       setIsAuthenticated(false);
       return;
     }
     setIsAuthenticated(true);
     fetchPermissions();
   }, []);
  // --- Data Fetching ---
  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/permissions');
      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }
      const data = await response.json();
      console.log('Fetched permissions:', data);
      setPermissions(data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions(); // Call fetchPermissions on mount
  }, []);

  // --- Add Modal Handlers ---
  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    fetchPermissions(); // Refresh permissions after closing the add modal
  };

  // --- Delete Handlers ---
  const handleClickDelete = (id) => {
    setPermissionToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setPermissionToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (permissionToDelete) {
      try {
        const response = await fetch(`http://localhost:8081/permissions/${permissionToDelete}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete permission: ${response.status} ${response.statusText} - ${errorText}`);
        }

        console.log(`Permission with ID ${permissionToDelete} deleted successfully.`);
        fetchPermissions(); // Refresh the list of permissions after successful deletion
      } catch (error) {
        console.error('Error deleting permission:', error);
        alert(`Error deleting permission: ${error.message}`);
      } finally {
        handleCloseConfirmDialog();
      }
    }
  };
  // --- End Delete Handlers ---

  // --- Edit Handlers ---
  const handleOpenEditModal = (permission) => { // Takes 'permission' data
    setPermissionToEdit(permission); // Set the permission data to be edited
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setPermissionToEdit(null); // Clear permission data when closing
    fetchPermissions(); // Refresh permissions after closing the edit modal
  };

  const handleSavePermissionEdit = async (updatedPermissionData) => {
    console.log('Attempting to save permission changes:', updatedPermissionData);
    try {
      // Assuming your permission object has 'id', 'name', 'role', and 'description'
      // The EditUserModal is sending `formData` directly.
      // If your backend's PUT/PATCH for permissions expects 'name' for the username
      // and 'role' for the associated role, this should work directly.
      const payload = {
        id: updatedPermissionData.id,
        name: updatedPermissionData.name,         // Username
        role: updatedPermissionData.role,         // Associated Role
        description: updatedPermissionData.description, // Description
      };

      const response = await fetch(`http://localhost:8081/permissions/${payload.id}`, {
        method: 'PUT', // or 'PATCH' if your backend supports partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the specific payload
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update permission: ${response.status} ${response.statusText} - ${errorText}`);
      }

      console.log('Permission updated successfully:', updatedPermissionData);
    } catch (error) {
      console.error('Error updating permission:', error);
      alert(`Error updating permission: ${error.message}`);
    } finally {
      handleCloseEditModal(); // Close the modal regardless of success or failure
    }
  };
  // --- End Edit Handlers ---

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'User Name', flex: 1 }, // Displaying the user's name associated with permission
    { field: 'role', headerName: 'Associated Role', flex: 1 }, // Displaying the role associated with the permission
    { field: 'description', headerName: 'Description', flex: 1 },
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
          <Tooltip title="Edit Permission">
            <IconButton
              color="primary"
              aria-label="edit"
              onClick={() => handleOpenEditModal(params.row)} // Pass the entire row data (permission)
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Permission">
            <IconButton
              color="error"
              aria-label="delete"
              onClick={() => handleClickDelete(params.row.id)} // Pass the permission ID
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];
   if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6" color="error">
          🚫 You should login to view this page.
        </Typography>
      </Box>
    );
  }

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
          Permission Overview
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
          Loading permissions...
        </Typography>
      ) : (
        <DataTable
          data={permissions} // Pass permissions data
          columns={columns}
          pageSize={5}
        />
      )}

      <AddModal
        open={openAddModal}
        handleClose={handleCloseAddModal}
        onUserAdded={fetchPermissions} // This prop name might be misleading if AddModal adds permissions
      />

      {/* Edit Permission Modal (repurposed EditUserModal) */}
      <EditUserModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        userData={permissionToEdit} // Pass permission data as userData to the modal
        onSave={handleSavePermissionEdit} // Use the new permission save handler
        editMode="user-full" // Use 'user-full' to display name, role, and description
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete Permission"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this permission? This action cannot be undone.
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