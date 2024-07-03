const closeForm = ()=>{
    const form = document.getElementById('form-principal');
    const bg = document.getElementById('bg-dark');
    form.style.display = 'none';
    bg.style.display= 'none';
}

export default closeForm;