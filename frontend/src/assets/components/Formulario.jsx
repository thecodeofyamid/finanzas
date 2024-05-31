import React, {useState} from 'react'

export default function Formulario({onSelectChange}){

    const [selectedOption,setSelectedOption] = useState('')

    const handleSelectChange = (event => {
        setSelectedOption(event.target.value)
        setSelectedOption(event.target.value)
        onSelectChange(event.target.value)
    })

    const placeholders = {
        ingresos : {
            descripcion: "Descripción de ingreso",
            tipo: "Tipo de ingreso",
            precio: "Precio de ingreso"
        },
        egresos : {
            descripcion: "Descripción de egreso",
            tipo: "Tipo de egreso",
            precio: "Precio de egreso"
        },
        deudas : {
            descripcion: "Descripción de deuda",
            tipo: "Tipo de deuda",
            precio: "Precio de deuda"
        },
        compras : {
            descripcion: "Descripción de compra",
            tipo: "Tipo de compra",
            precio: "Precio de compra"
        },
        default: {
            descripcion: "Descripción",
            tipo: "Tipo",
            precio: 'Precio'
        }
    }

    const currentPlaceholders = placeholders[selectedOption] || placeholders.default;

    return(
        <div style={{width:'100%',height:'100%', display:'flex', justifyContent: 'center', alignItems:'center'}}>
            <form>
            <div style={{marginBottom: '5%'}}>
                <select value={selectedOption} onChange={handleSelectChange}>
                    <option value="">Elige una opción:</option>
                    <option value="ingresos">Ingresos</option>
                    <option value="egresos">Egresos</option>
                    <option value="deudas">Deudas</option>
                    <option value="compras">Compras</option>
                </select>
                </div>
                <div>
                    <div><label>Descripción:</label></div>
                    <input type="text" placeholder={currentPlaceholders.descripcion}></input>
                </div>
                <div>
                    <div><label>Tipo:</label></div>
                    <input type="menu" placeholder={currentPlaceholders.tipo}></input>
                </div>
                <div>
                    <div><label>Precio:</label></div>
                    <input type="number" placeholder={currentPlaceholders.precio}></input>
                </div>
                <div>
                    <input type="submit" value="Enviar"></input>
                </div>
            </form>
        </div>
    )
}