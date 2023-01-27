import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const Chatloading =()=> {
  return (
    <Stack spacing={1}>
      <div style={{ margin:'10px 15px',display: 'inline-flex',alignItems: 'center' }}>
      <Skeleton sx={{mr:'5px'}} variant="circular" width={40} height={40} />
      <Skeleton variant="rounded" width={310} height={60} />
      </div>
      <div style={{ margin:'10px 15px',display: 'inline-flex',alignItems: 'center' }}>
      <Skeleton sx={{mr:'5px'}} variant="circular" width={40} height={40} />
      <Skeleton variant="rounded" width={310} height={60} />
      </div>
      <div style={{ margin:'10px 15px',display: 'inline-flex',alignItems: 'center' }}>
      <Skeleton sx={{mr:'5px'}} variant="circular" width={40} height={40} />
      <Skeleton variant="rounded" width={310} height={60} />
      </div>
      <div style={{ margin:'10px 15px',display: 'inline-flex',alignItems: 'center' }}>
      <Skeleton sx={{mr:'5px'}} variant="circular" width={40} height={40} />
      <Skeleton variant="rounded" width={310} height={60} />
      </div>
      <div style={{ margin:'10px 15px',display: 'inline-flex',alignItems: 'center' }}>
      <Skeleton sx={{mr:'5px'}} variant="circular" width={40} height={40} />
      <Skeleton variant="rounded" width={310} height={60} />
      </div>
      <div style={{ margin:'10px 15px',display: 'inline-flex',alignItems: 'center' }}>
      <Skeleton sx={{mr:'5px'}} variant="circular" width={40} height={40} />
      <Skeleton variant="rounded" width={310} height={60} />
      </div>
    </Stack>
  );
}


export default Chatloading