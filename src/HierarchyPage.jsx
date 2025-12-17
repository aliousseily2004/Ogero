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
import AddModal from './AddModal';
import Dialog from '@mui/material/Dialog'; // Import Dialog for confirmation
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function HierarchyPage() {
  const [hierarchyData, setHierarchyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // State for confirmation dialog
  const [itemToDelete, setItemToDelete] = useState(null); // State to store the ID (role name) of the item to delete
const [isAuthenticated, setIsAuthenticated] = useState(true); 
  useEffect(() => {
     const token = localStorage.getItem('jwtToken');
     if (!token) {
       setIsAuthenticated(false);
       return;
     }
     setIsAuthenticated(true);
     fetchHierarchyData();
   }, []);
  // Helper function to transform data
  const groupByRole = (data) => {
    const roleMap = {};

    data.forEach((user) => {
      const roleKey = user.role;

      if (!roleMap[roleKey]) {
        roleMap[roleKey] = {
          id: roleKey, // The ID for the Data Grid row is the role name
          role: user.role,
          description: user.description,
          users: [user.name],
          count: 1,
        };
      } else {
        roleMap[roleKey].users.push(user.name);
        roleMap[roleKey].count += 1;
      }
    });

    return Object.values(roleMap).map((roleEntry) => ({
      ...roleEntry,
      users: roleEntry.users.join(', '),
    }));
  };

  const fetchHierarchyData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/hierarchy');
      if (!response.ok) {
        throw new Error('Failed to fetch hierarchy');
      }
      const rawData = await response.json();
      console.log('Fetched raw hierarchy:', rawData);

      const processedData = groupByRole(rawData);
      console.log('Processed hierarchy for table:', processedData);

      setHierarchyData(processedData);
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    fetchHierarchyData(); // Re-fetch data after modal is closed (assuming add/edit might happen)
  };

  // --- Delete Handlers ---
  const handleClickDelete = (id) => {
    setItemToDelete(id); // 'id' here is the role name from the grouped data
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        // IMPORTANT: The backend endpoint for deleting a hierarchy item by role name
        // This assumes your backend has an endpoint like /hierarchy/role/{roleName}
        // or simply /hierarchy/{roleName} if the ID of the hierarchy item is the role name.
        const response = await fetch(`http://localhost:8081/hierarchy/${itemToDelete}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete hierarchy item: ${response.status} ${response.statusText} - ${errorText}`);
        }

        console.log(`Hierarchy item for role "${itemToDelete}" deleted successfully.`);
        fetchHierarchyData(); // Refresh the list after successful deletion
      } catch (error) {
        console.error('Error deleting hierarchy item:', error);
        alert(`Error deleting hierarchy item: ${error.message}`);
      } finally {
        handleCloseConfirmDialog();
      }
    }
  };
  // --- End Delete Handlers ---
 if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6" color="error">
          🚫 You should login to view this page.
        </Typography>
      </Box>
    );
  }
  const columns = [
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'users', headerName: 'Users', flex: 2 },
    {
      field: 'count',
      headerName: 'User Count',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
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
           
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              aria-label="delete"
              onClick={() => handleClickDelete(params.row.id)} // Pass the role name (which is the row's ID)
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
          Hierarchy Overview
        </Typography>
        <Button
          onClick={handleOpenModal}
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
      <DataTable
        data={hierarchyData}
        columns={columns}
        pageSize={5}
        loading={loading}
      />
      <AddModal
        open={openModal}
        handleClose={handleCloseModal}
        onUserAdded={fetchHierarchyData} // Ensure AddModal calls this to refresh
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete Hierarchy Entry"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this hierarchy entry? This action cannot be undone.
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