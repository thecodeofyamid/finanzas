export const Cash =  ({formatPrice,totals,exchangeRate,closeCash})=>{
    return(
        <div id="cash-container" style={{position:'absolute',left:'0', background: '#242424', color: 'white', height: '100vh',width:'30vw',top:'0', textAlign: 'left', padding: '0%', gridRow: '2', gridColumn: '4', display: 'none', flexDirection: 'column'}}>
            <div><h2>Cash</h2></div>
            <div style={{ display: 'flex', flexDirection:'center',width: '100&', height: '100%', gridTemplateColumns: '1fr', justifyContent: 'center', alignItems: 'start', gap: '2%', overflow: 'auto', padding: '4%' }}>
                <div style={{width:'100%'}}>
                    <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <button style={{border:'none',background: 'red',width:'50%', padding: '2%',marginBottom:'5%'}} onClick={closeCash}>Cerrar</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', borderBottom: '1px solid black', width: '100%',padding:'0 2%'}}>
                        <div>
                            <p style={{ fontSize: '1.1rem', color: 'white' }}>Ingresos :</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p><span style={{ fontSize: '1.05rem', color: 'green' }}> <strong>{formatPrice(totals.Incomes, exchangeRate)[1]}</strong></span></p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%',  borderBottom: '1px solid black', width: '100%',padding:'0 2%'}}>
                        <div>
                            <p style={{ fontSize: '1.1rem', color:'white' }}>Egresos :</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p><span style={{ fontSize: '1.05rem', color: 'red' }}> <strong>{formatPrice(totals.Expenses, exchangeRate)[1]}</strong></span></p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', width: '100%',  borderBottom: '1px solid black', padding:'0 2%'}}>
                        <div><p style={{ fontSize: '1.1rem', color:'white' }}>Deudas :</p></div>
                        <div style={{ textAlign: 'right' }}><p><span style={{ fontSize: '1.05rem', color:'orange'}}> <strong>{formatPrice(totals.Debts, exchangeRate)[1]}</strong></span></p></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', width: '100%',  borderBottom: '1px solid black', padding:'0 2%'}}>
                        <div><p style={{ fontSize: '1.1rem', color:'white'}}>Compras :</p></div>
                        <div style={{ textAlign: 'right' }}><p><span style={{ fontSize: '1.05rem', color:'#0487D9'}}> <strong>{formatPrice(totals.Buys, exchangeRate)[1]}</strong></span></p></div>
                    </div>
                    <div style={{ background:"#181818", display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'end', justifyContent: 'center', width: '100%', padding:'0 2%'}}>
                        <div><p style={{ fontSize: '1.1rem', color:'white' }}>General :</p></div>
                        <div style={{ textAlign: 'right' }}><p><span style={{ fontSize: '1.05rem', color:'white'}}> <strong>{formatPrice((totals.General), exchangeRate)[1]}</strong></span></p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}