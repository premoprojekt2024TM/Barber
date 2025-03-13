import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';

// Function to render avatar for guests
export function renderAvatar(
  params: GridCellParams<{ name: string; color: string }, any, any>,
) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

// Function to render session status
function renderStatus(status: 'Confirmed' | 'Pending' | 'Cancelled') {
  const colors: { [index: string]: 'success' | 'warning' | 'error' } = {
    Confirmed: 'success',
    Pending: 'warning',
    Cancelled: 'error',
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

// Column definitions for the session chart
export const columns: GridColDef[] = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 70 
  },
  { 
    field: 'guestAvatar', 
    headerName: '', 
    width: 60,
    renderCell: renderAvatar,
    sortable: false
  },
  { 
    field: 'guestName', 
    headerName: 'Vendég neve', 
    flex: 1,
    minWidth: 200 
  },
  {
    field: 'appointmentDate',
    headerName: 'Nap',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'appointmentTime',
    headerName: 'Időpont',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'duration',
    headerName: 'Időtartam',
    flex: 0.7,
    minWidth: 100,
  },
  {
    field: 'status',
    headerName: 'Állapot',
    flex: 0.7,
    minWidth: 120,
    renderCell: (params) => renderStatus(params.value as any),
  }
];

// Sample data for the session chart
export const rows: GridRowsProp = [
  {
    id: 1,
    guestAvatar: { name: 'Kovács Anna', color: '#1976d2' },
    guestName: 'Kovács Anna',
    appointmentDate: '2025-03-14',
    appointmentTime: '10:00',
    duration: '60 perc',
    status: 'Confirmed',
  },
  {
    id: 2,
    guestAvatar: { name: 'Nagy Péter', color: '#388e3c' },
    guestName: 'Nagy Péter',
    appointmentDate: '2025-03-14',
    appointmentTime: '11:30',
    duration: '45 perc',
    status: 'Confirmed',
  },
  {
    id: 3,
    guestAvatar: { name: 'Szabó Eszter', color: '#d32f2f' },
    guestName: 'Szabó Eszter',
    appointmentDate: '2025-03-14',
    appointmentTime: '13:00',
    duration: '90 perc',
    status: 'Pending',
  },
  {
    id: 4,
    guestAvatar: { name: 'Tóth Gábor', color: '#7b1fa2' },
    guestName: 'Tóth Gábor',
    appointmentDate: '2025-03-14',
    appointmentTime: '15:00',
    duration: '60 perc',
    status: 'Cancelled',
  },
  {
    id: 5,
    guestAvatar: { name: 'Fekete Zoltán', color: '#0288d1' },
    guestName: 'Fekete Zoltán',
    appointmentDate: '2025-03-15',
    appointmentTime: '09:00',
    duration: '120 perc',
    status: 'Confirmed',
  },
  {
    id: 6,
    guestAvatar: { name: 'Kiss Mária', color: '#ffa000' },
    guestName: 'Kiss Mária',
    appointmentDate: '2025-03-15',
    appointmentTime: '11:30',
    duration: '60 perc',
    status: 'Pending',
  },
  {
    id: 7,
    guestAvatar: { name: 'Horváth János', color: '#455a64' },
    guestName: 'Horváth János',
    appointmentDate: '2025-03-15',
    appointmentTime: '14:00',
    duration: '45 perc',
    status: 'Confirmed',
  },
  {
    id: 8,
    guestAvatar: { name: 'Varga Katalin', color: '#e91e63' },
    guestName: 'Varga Katalin',
    appointmentDate: '2025-03-16',
    appointmentTime: '10:00',
    duration: '60 perc',
    status: 'Confirmed',
  }
];

// Example of how to use this component with the MUI DataGrid
/*
import { DataGrid } from '@mui/x-data-grid';

export default function SessionChart() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
      />
    </div>
  );
}
*/