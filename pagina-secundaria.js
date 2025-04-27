document.addEventListener('DOMContentLoaded', () => {
    const regresarCatalogoBtn = document.getElementById('regresarCatalogoBtn');
    if (regresarCatalogoBtn) {
        regresarCatalogoBtn.addEventListener('click', () => {
            // Guarda manualmente el estado en localStorage
            localStorage.setItem('redirigirA', 'catalogo');
            window.location.href = 'index.html'; // Redirige a la página principal
        });
    }
});
