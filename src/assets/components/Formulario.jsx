export default function Formulario(){
    return(
        <div style={{width:'100%',height:'100%', display:'flex', justifyContent: 'center', alignItems:'center'}}>
            <form>
                <h3>Ingresos</h3>
                <div>
                    <div><label>Descripción:</label></div>
                    <input type="text" placeholder="Descripción de ingreso"></input>
                </div>
                <div>
                    <div><label>Tipo:</label></div>
                    <input type="menu" placeholder="Tipo de ingreso"></input>
                </div>
                <div>
                    <div><label>Precio:</label></div>
                    <input type="number" placeholder="Precio de ingreso"></input>
                </div>
                <div>
                    <input type="submit" value="Enviar"></input>
                </div>
            </form>
        </div>
    )
}