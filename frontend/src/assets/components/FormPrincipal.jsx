export const FormPrincipal = ({handleSubmit, inputData, handleChange, closeForm}) =>{
    return(
        <form id="form-principal" style={{ display:'none',gridColumn: '1', gridRow: '1/-1',position:'absolute',width:'30%',top:'0',left:'0',overflow:'auto', padding: '2%', gap:'2%'}} onSubmit={handleSubmit}>
            <h2 style={{ color: '#fff', paddingTop: '10%' }}>Transaction</h2>
            <div id="form-home">
                <button style={{border:'none',background: 'red',width:'100%', padding: '2%',marginBottom:'5%'}} onClick={closeForm}>Cerrar</button>
                <label style={{color:'white'}}>Descripción</label>
                <input type="text" name="description" value={inputData.description} onChange={handleChange} placeholder="Escribe aquí el producto/servicio..." />
                <label style={{color: 'white'}}>Precio</label>
                <input type="text" name="price" value={inputData.price} onChange={handleChange} placeholder="Escribe aquí la transacción" />
                <label style={{color: 'white'}}>Fecha</label>
                <input type="date" name="date" value={inputData.date} onChange={handleChange} />
                <label style={{color:'white'}}>Tipo</label>
                <select>
                    <option value="">Selecciona una opción</option>
                    <option value="Incomes">Ingresos</option>
                    <option value="Expenses">Egresos</option>
                    <option value="Buys">Compras</option>
                    <option value="Debts">Deudas</option>
                </select>
                <label style={{color:'white'}}>Importancia</label>
                <select>
                    <option value="">Selecciona una opción:</option>
                    <option value="Incomes">Ingresos</option>
                    <option value="Expenses">Egresos</option>
                    <option value="Buys">Compras</option>
                    <option value="Debts">Deudas</option>
                </select>
                <label style={{color:'white'}}>Categoría</label>
                <select>
                    <option value="Ninguna">Selecciona una opción:</option>
                    <option value="Alimentaciòn">Alimentación</option>
                    <option value="Ropa">Ropa</option>
                    <option value="Tech">Tech</option>
                    <option value="Prestamos">Prestamos</option>
                    <option value="Vicio/Ocios">Vicio / Ocio</option>
                    <option value="Regalo">Regalo</option>
                    <option value="Programaciòn">Programación</option>
                    <option value="Consultas">Consulta de Tarot</option>
                    <option value="Aseo personal">Aseo personal</option>
                    <option value="Recibos">Recibos</option>
                     
                </select>
                <label style={{color:'white'}}>Estado</label>
                <select>
                    <option>Selecciona una opción:</option>
                    <option>Listo</option>
                    <option>Pendiente</option>
                </select>
                <label style={{color:'white'}}>Fecha Límite</label>
                <input type="date" name="deadline" value={inputData.deadline} onChange={handleChange}/>
                <div id="button-submit" style={{ width: '100%', border:'none', marginTop: '3%'}}><button type="submit">Insert Transaction</button></div>
            </div>
        </form>
    )
}