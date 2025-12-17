import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DataTable from './DataTable';
import AddModal from './AddModal';
import EditUserModal from './EditModal'; // renamed import to avoid name conflict

export default function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // 👈 NEW state

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    setIsAuthenticated(true);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    fetchUsers();
  };

  const handleClickDelete = (id) => {
    setUserToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(`http://localhost:8081/users/${userToDelete}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete user: ${response.status} ${response.statusText} - ${errorText}`);
        }

        console.log(`User with ID ${userToDelete} deleted successfully.`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(`Error deleting user: ${error.message}`);
      } finally {
        handleCloseConfirmDialog();
      }
    }
  };

  const handleOpenEditModal = (user) => {
    setUserToEdit(user);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setUserToEdit(null);
    fetchUsers();
  };

  const handleSaveEdit = async (updatedUserData) => {
    try {
      const response = await fetch(`http://localhost:8081/users/${updatedUserData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user: ${response.status} ${response.statusText} - ${errorText}`);
      }

      console.log('User updated successfully:', updatedUserData);
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Error updating user: ${error.message}`);
    } finally {
      handleCloseEditModal();
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'User Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'age', headerName: 'Age', flex: 1 },
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
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              aria-label="edit"
              onClick={() => handleOpenEditModal(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
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

  // ✅ If not logged in, show message instead of users table
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
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
        >
          Add
        </Button>
      </Box>

      {loading ? (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          Loading users...
        </Typography>
      ) : (
        <DataTable data={users} columns={columns} pageSize={5} />
      )}

      <AddModal
        open={openAddModal}
        handleClose={handleCloseAddModal}
        onUserAdded={fetchUsers}
      />

      <EditUserModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        userData={userToEdit}
        onSave={handleSaveEdit}
        editMode="user"
      />
    


      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
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
