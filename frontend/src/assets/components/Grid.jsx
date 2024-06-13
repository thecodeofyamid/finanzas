import React, {useState} from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Formulario from './Formulario';
import Datos from './Datos';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicGrid() {
  const [selectedOption, setSelectedOption] = useState('Ingresos')

  const handleOptionChange = (option) =>{
    setSelectedOption(option)
  }
  function verifyEmpty(selectedOption){
    if (selectedOption === "ingresos" || selectedOption === "egresos" || selectedOption === "deudas" || selectedOption === "compras"){
      return (
      [<h1 id="title">{window.toUpperCamelCase(selectedOption)}</h1>,
      <Datos selectedOption = {selectedOption}/>]
      )
    }else{
      return(
        <div style={{width:'100%', height:'100%', display:'flex', flexDirection:"column", justifyContent:'center', alignItems:'center'}}>
          <h1>Mis finanzas personales</h1>
        </div>)
    }
  }
  return (
    <Box sx={{ flexGrow: 2 ,height:'100vh'}}>
      <Grid container spacing={4} sx={{padding:'3%', width:'100%',height:'100vh'}}>
        <Grid item xs={4}>
          <Item id="formus" sx={{ height: '100%', borderRadius: '10px'}}>
            <Formulario onSelectChange={handleOptionChange}/>
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item id="results" sx={{height:'100%',width:'100%',borderRadius:'10px'}}>
            <div>
              <div id="cielo"></div>
              <div id="tierra"></div>
            </div>
            {verifyEmpty(selectedOption)}
            </Item>
        </Grid>
      </Grid>
    </Box>
  )
}