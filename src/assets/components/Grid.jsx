import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Formulario from './Formulario';
import BasicExample from './Form';
import Datos from './Datos';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicGrid() {
  return (
    <Box sx={{ flexGrow: 1 ,height:'100vh'}}>
      <Grid container spacing={4} sx={{padding:'3%', width:'100%',height:'100vh'}}>
        <Grid item xs={4}>
          <Item id="formus" sx={{ height: '100%', borderRadius: '10px'}}>
            <Formulario />
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item id="results" sx={{height:'100%', borderRadius:'10px'}}>
            <h1>Ingresos</h1>
            <Datos />
            </Item>
        </Grid>
      </Grid>
    </Box>
  )
}