export const FormPrincipal = ({handleSubmit, inputData, handleChange, closeForm}) =>{
    return(
        <form id="form-principal" style={{ display:'none',gridColumn: '1', gridRow: '1/-1',position:'absolute',width:'30%',top:'0',left:'0',overflow:'auto'}} onSubmit={handleSubmit}>
            <button style={{border:'none',width:'100%'}} onClick={closeForm}>Cerrar</button>
            <h2 style={{ color: '#fff' }}>Transaction</h2>
            <div id="form-home">
                <input type="text" name="description" value={inputData.description} onChange={handleChange} placeholder="Description" />
                <input type="text" name="price" value={inputData.price} onChange={handleChange} placeholder="Price" />
                <input type="text" name="date" value={inputData.date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" />
                <input type="text" name="importance" value={inputData.importance} onChange={handleChange} placeholder="Importance (Alta/Media/Baja)" />
                <input type="text" name="type" value={inputData.type} onChange={handleChange} placeholder="Type" />
                <input type="text" name="category" value={inputData.category} onChange={handleChange} placeholder="Category" />
                <input type="number" name="ready" value={inputData.ready} onChange={handleChange} placeholder="Ready (true/false)" />
                <input type="text" name="deadline" value={inputData.deadline} onChange={handleChange} placeholder="Deadline (YYYY-MM-DD)" />
                <div id="button-submit" style={{ width: '100%', border:'none' }}><button type="submit">Insert Transaction</button></div>
            </div>
        </form>
    )
}