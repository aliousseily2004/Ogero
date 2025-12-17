import { Link, useNavigate } from 'react-router-dom';
import './SideBar.css';
import {
  People as UsersIcon,
  Lock as PermissionsIcon,
  AssignmentInd as RolesIcon,
  AccountTree as HierarchyIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

import Button from '@mui/material/Button';

export default function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  return (
    <ul className="sidebar">
      <li className="sidebar-item">
        <Link to="/users" className="sidebar-link">
          <UsersIcon className="sidebar-icon" />
          Users
        </Link>
      </li>
      <li className="sidebar-item">
        <Link to="/permissions" className="sidebar-link">
          <PermissionsIcon className="sidebar-icon" />
          Permissions
        </Link>
      </li>
      <li className="sidebar-item">
        <Link to="/roles" className="sidebar-link">
          <RolesIcon className="sidebar-icon" />
          Roles
        </Link>
      </li>
      <li className="sidebar-item">
        <Link to="/hierarchy" className="sidebar-link">
          <HierarchyIcon className="sidebar-icon" />
          Hierarchy
        </Link>
      </li>

      {/* Logout button */}
      <li className="sidebar-item logout-button">
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogoutIcon />}
          sx={{
            mt: 2,
            justifyContent: 'flex-start',
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Logout
        </Button>
      </li>
    </ul>
  );
}
