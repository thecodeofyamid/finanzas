export const Cash =  ({formatPrice,totals,exchangeRate,closeCash})=>{
    return(
        <div id="cash-container" style={{position:'absolute',left:'0', background: '#242424', color: 'white', height: '100vh',width:'30vw',top:'0', textAlign: 'left', padding: '0%', gridRow: '2', gridColumn: '4', display: 'none', flexDirection: 'column'}}>
            <button style={{border:'none', padding:'5%'}} onClick={closeCash}>Cerrar</button>
            <div><h2>Cash</h2></div>
            <div style={{ display: 'grid', width: 'auto', height: '100%', gridTemplateColumns: '1fr', justifyContent: 'start', alignItems: 'start', gap: '2%', overflow: 'auto', padding: '4%' }}>
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', borderBottom: '1px solid black', width: '100%', paddingLeft: '4%' }}>
                        <div>
                            <p style={{ fontSize: '1.1rem', color: 'white' }}>Ingresos :</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p><span style={{ fontSize: '1.05rem', color: 'green' }}> <strong>{formatPrice(totals.Incomes, exchangeRate)[1]}</strong></span></p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', paddingLeft: '4%', borderBottom: '1px solid black', width: '100%' }}>
                        <div>
                            <p style={{ fontSize: '1.1rem', color:'white' }}>Egresos :</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p><span style={{ fontSize: '1.05rem', color: 'red' }}> <strong>{formatPrice(totals.Expenses, exchangeRate)[1]}</strong></span></p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', width: '100%', paddingLeft: '4%' }}>
                        <div><p style={{ fontSize: '1.1rem', color:'white' }}>General :</p></div>
                        <div style={{ textAlign: 'right' }}><p><span style={{ fontSize: '1.05rem', color:'white'}}> <strong>{formatPrice(totals.General, exchangeRate)[1]}</strong></span></p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}