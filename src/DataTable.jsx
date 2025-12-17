import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import './DataTable.css'; // Assuming you still have some base styling

export default function DataTable({ data, columns, pageSize = 5 }) {
  const paginationModel = {
    page: 0,
    pageSize: pageSize,
  };

  // No actionColumn, handleAdd, handleEdit, handleDelete functions needed

  // combinedColumns will just be the passed-in columns
  const combinedColumns = columns; 

  return (
    <Paper className="data-table-container" sx={{ padding: 2 }}>
      {/* Removed the Stack and Add button */}

      <DataGrid
        rows={data}
        columns={combinedColumns}
        initialState={{
          pagination: { paginationModel },
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        className="data-grid"
        autoHeight
      />
    </Paper>
  );
}