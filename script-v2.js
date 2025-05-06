let usuarioAutenticado = false;

function inicializarPagina() {
    const portada = document.getElementById('portada');
    const buscador = document.getElementById('buscador');

    if (portada) portada.style.display = 'block';

    if (buscador) buscador.style.display = 'block';

    console.log('Portada y buscador inicializados correctamente.');
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarPagina(); 
});

document.addEventListener('DOMContentLoaded', () => {
    const redirigirA = localStorage.getItem('redirigirA');
    const usuario = JSON.parse(localStorage.getItem('userData'));

    if (redirigirA === 'catalogo') {
        mostrarSeccion('catalogo'); 
        inicializarPagina(); 
        localStorage.removeItem('redirigirA');
    } else if (usuario) {
        mostrarSeccion('cuenta'); 
        Swal.fire(`¡Bienvenido de nuevo, ${usuario.nombre || 'Usuario'}!`);
    } else {
        mostrarSeccion('inicio-sesion'); 
    }
});

function toggleAuth() {
  const title = document.getElementById('auth-title');
  const btn = document.getElementById('auth-button');
  const toggle = document.getElementById('toggle-auth');
  const nameBox = document.getElementById('nombre-usuario-container');
  if (title.textContent === 'Iniciar Sesión') {
    title.textContent = 'Registrarse';
    btn.textContent = 'Registrarse';
    nameBox.style.display = 'block';
    toggle.innerHTML = '¿Ya tienes cuenta? <a href="#" onclick="toggleAuth()">Inicia sesión</a>';
  } else {
    title.textContent = 'Iniciar Sesión';
    btn.textContent = 'Iniciar Sesión';
    nameBox.style.display = 'none';
    toggle.innerHTML = '¿No tienes cuenta? <a href="#" onclick="toggleAuth()">Regístrate aquí</a>';
  }
}

function handleAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();
  const nombre = document.getElementById('auth-nombre')?.value.trim();
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  if (document.getElementById('auth-title').textContent === 'Registrarse') {
    if (!nombre) return Swal.fire('Falta tu nombre');
    if (usuarios.some(u => u.email === email)) return Swal.fire('Ya registrado');
    usuarios.push({ email, password, nombre });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('userData', JSON.stringify({ email, nombre }));
    Swal.fire('Registrado exitosamente');
    toggleAuth();
  } else {
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (!usuario) return Swal.fire('Datos incorrectos');
    usuarioAutenticado = true;
    localStorage.setItem('userData', JSON.stringify(usuario));
    document.getElementById('auth-section').style.display = 'none';
    mostrarSeccion('cuenta');
    Swal.fire(`¡Bienvenido!`);
  }
}

function confirmarCompra() {
  const dir = document.getElementById('direccion').value.trim();
  const pago = document.getElementById('metodo-pago').value;
  if (!dir) return Swal.fire('Falta dirección');
  Swal.fire('Compra confirmada', `Dirección: ${dir}, Pago: ${pago}`, 'success')
    carrito = [];
    mostrarCarrito();
}

function buscarFlores() {
  const query = document.getElementById('search').value.toLowerCase();
  const flores = document.querySelectorAll('.flor');
  flores.forEach(flor => {
    const nombre = flor.textContent.toLowerCase();
    flor.style.display = nombre.includes(query) ? 'block' : 'none';
  });
}

let carrito = [];

function agregarAlCarrito(nombre, precio, event) {
    event.preventDefault();
    console.log(`Añadiendo ${nombre} con precio ${precio}`);
    
    const florElemento = document.querySelector(`.flor[data-nombre="${nombre}"] img`);
    const imagenSrc = florElemento ? florElemento.src : `imagenes/${nombre.toLowerCase()}.jpg`;
    const productoExistente = carrito.find(item => item.nombre === nombre);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1, imagen: imagenSrc });
    }

    alert(`${nombre} añadido al carrito`);
    mostrarCarrito();

    agregarPedido(nombre, 1); 
}

function mostrarCarrito() {
    const carritoDiv = document.getElementById('contenido-carrito');
    console.log('Contenido del carrito:', carrito);
    carritoDiv.innerHTML = ''; 

    let total = 0;

    if (carrito.length === 0) {
        carritoDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        carrito.forEach((item, index) => {
             total += item.precio * item.cantidad;
 
             carritoDiv.innerHTML += `
                <div class="producto-carrito">
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; border-radius: 5px; margin-right: 10px;">
                    <p>${item.nombre} - $${item.precio} MXN - Cantidad: ${item.cantidad}</p>
                    <button onclick="incrementarCantidad(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
</svg></button>
                    <button onclick="disminuirCantidad(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
</svg></button>
                    <button onclick="eliminarDelCarrito(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg></button>
                </div>
            `;
        });
        
        document.getElementById('total-pagar').textContent = `$${total} MXN`;
    }
}

function incrementarCantidad(index) {
    carrito[index].cantidad++;
    mostrarCarrito(); 
}

function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        
        carrito.splice(index, 1);
    }
    mostrarCarrito(); 
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1); 
    mostrarCarrito(); 
}

function copiarEnlace() {
    const enlace = document.getElementById('enlacePagina');
    enlace.select();
    document.execCommand('copy');
    alert('Enlace copiado al portapapeles');
}

function actualizarFooter(seccionActual) {
    const footer = document.querySelector('footer');
    const seccionesConFooter = ['catalogo']; 

    if (seccionesConFooter.includes(seccionActual)) {
        footer.style.display = 'block'; 
    } else {
        footer.style.display = 'none'; 
    }
}

function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
    const seccion = document.getElementById(id);
    if (seccion) seccion.style.display = 'block';

    document.getElementById('search-section').style.display = id === 'catalogo' ? 'flex' : 'none';
    document.getElementById('portada').style.display = id === 'catalogo' ? 'block' : 'none';
    document.getElementById('checkout').style.display = id === 'carrito' ? 'block' : 'none';

    const cuenta = document.getElementById('cuenta');
    const auth = document.getElementById('auth-section');
    if (cuenta && auth) {
        if (id === 'cuenta') {
            cuenta.style.display = usuarioAutenticado ? 'block' : 'none';
            auth.style.display = usuarioAutenticado ? 'none' : 'block';
        } else {
            auth.style.display = 'none';
        }
    }

    actualizarFooter(id);
}

function actualizarFooter(seccionActual) {
    const footer = document.querySelector('footer');
    footer.style.display = seccionActual === 'catalogo' ? 'block' : 'none';
}

function comentarPedido(index) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos[index];

    const comentario = prompt(`Escribe un comentario para tu pedido de ${pedido.producto}:`);
    if (comentario) {
        pedido.comentario = comentario;
        pedidos[index] = pedido;
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        alert('¡Comentario agregado exitosamente!');
    }

    cargarPedidos(); 
}

function mostrarComentarios(nombreFlor) {
    const comentariosDiv = document.getElementById('comments');
    if (!comentariosDiv) {
        console.error("Error: El contenedor 'comments' no existe en el DOM.");
        return; 
    }

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const comentarios = pedidos.filter(pedido => pedido.producto === nombreFlor && pedido.comentario);

    comentariosDiv.innerHTML = ''; 

    if (comentarios.length === 0) {
        comentariosDiv.innerHTML = '<p>No hay comentarios para esta flor.</p>';
    } else {
        comentarios.forEach(pedido => {
            comentariosDiv.innerHTML += `
                <div class="comentario" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                    <img src="usuario-anonimo.jpg" alt="Usuario Anónimo" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
                    <div>
                        <p><strong>${pedido.fecha || "Usuario"}:</strong></p>
                        <p>${pedido.comentario}</p>
                    </div>
                </div>
            `;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const nombreFlor = document.querySelector('h2').textContent.trim(); 
    mostrarComentarios(nombreFlor);
});

function mostrarPedidos() {
    const pedidosEnCurso = document.getElementById('pedidos-en-curso');
    if (!pedidosEnCurso) {
        console.error("Error: El contenedor #pedidos-en-curso no existe.");
        return;
    }

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidosEnCurso.innerHTML = ''; 

    if (pedidos.length === 0) {
        pedidosEnCurso.innerHTML = '<li>No tienes pedidos registrados.</li>';
    } else {
        pedidos.forEach((pedido, index) => {
            pedidosEnCurso.innerHTML += `
                <li>
                    <p><strong>Producto:</strong> ${pedido.producto}</p>
                    <p><strong>Cantidad:</strong> ${pedido.cantidad}</p>
                    <p><strong>Estado:</strong> ${pedido.estado}</p>
                    <button onclick="actualizarPedido(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
</svg></button>
                    <button onclick="enviarComentario('${pedido.producto}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
</svg> Enviar Comentario</button>
                    <button onclick="eliminarPedido(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
</svg></button>
                </li>
            `;
        });
    }
}

function enviarComentario(nombreProducto) {
    const comentario = prompt(`Escribe tu comentario para ${nombreProducto}:`);
    if (comentario) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedidoIndex = pedidos.findIndex(pedido => pedido.producto === nombreProducto);

        if (pedidoIndex !== -1) {
            pedidos[pedidoIndex].comentario = comentario;
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            alert('¡Comentario enviado con éxito!');
            mostrarComentarios(nombreProducto); 
        }
    }
}

function actualizarPedido(index) {
    console.log(`Intentando actualizar el pedido en el índice: ${index}`);
    
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos[index];

    if (!pedido) {
        console.error(`Error: No se encontró un pedido en el índice: ${index}`);
        alert("Error: No se encontró el pedido.");
        return;
    }

        if (pedido.estado === "Procesando") {
        pedido.estado = "Enviado";
        alert(`El estado del pedido de ${pedido.producto} ha cambiado a: Enviado.`);
    } else if (pedido.estado === "Enviado") {
        pedido.estado = "Entregado";
        alert(`El estado del pedido de ${pedido.producto} ha cambiado a: Entregado.`);
    } else if (pedido.estado === "Entregado") {
        alert("El pedido ya está entregado y no se puede actualizar más.");
        return;
    } else {
        console.error(`Estado inválido detectado: ${pedido.estado}`);
        alert("Error: Estado inválido. Por favor, verifica los datos del pedido.");
        return;
    }

    pedidos[index] = pedido;
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    mostrarPedidos();
}

function eliminarPedido(index) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.splice(index, 1); 
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    mostrarPedidos();
}

function cerrarSesion() {
    localStorage.removeItem('userData'); 
    usuarioAutenticado = false; 
    console.log('Sesión cerrada, usuario autenticado:', usuarioAutenticado);
    Swal.fire('Has cerrado sesión.');
    mostrarSeccion('inicio-sesion'); 
}

function agregarPedido(producto, cantidad = 1) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || []; 
    const nuevoPedido = {
        producto,
        cantidad,
        estado: "Procesando", 
        comentario: "" 
    };

    pedidos.push(nuevoPedido); 
    localStorage.setItem('pedidos', JSON.stringify(pedidos)); 
    mostrarPedidos(); 
    alert(`¡Pedido de ${producto} añadido correctamente!`);
}

function mostrarTodosLosProductos() {
    const productos = document.querySelectorAll('.flor');
    productos.forEach(producto => {
        producto.style.display = 'block'; 
    });
}

function eliminarPedido(index) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.splice(index, 1); 
    localStorage.setItem('pedidos', JSON.stringify(pedidos)); 
    mostrarPedidos(); 
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarPedidos(); 
});

document.addEventListener('DOMContentLoaded', () => {
   if (!localStorage.getItem('pedidos')) {
       const pedidosIniciales = []; 
       localStorage.setItem('pedidos', JSON.stringify(pedidosIniciales));
   }
   mostrarPedidos(); 
});

document.addEventListener('DOMContentLoaded', () => {
    
    const botonesPedidos = document.querySelectorAll('#pedidos-en-curso button');

    botonesPedidos.forEach(boton => {
        
        boton.style.padding = "8px 12px";
        boton.style.backgroundColor = "#a0aec0"; 
        boton.style.color = "white";
        boton.style.border = "none";
        boton.style.borderRadius = "5px";
        boton.style.cursor = "pointer";
        boton.style.transition = "background-color 0.3s, transform 0.2s";

        boton.addEventListener('mouseenter', () => {
            boton.style.backgroundColor = "#888ea6"; 
        });

        boton.addEventListener('mouseleave', () => {
            boton.style.backgroundColor = "#a0aec0"; 
        });

        boton.addEventListener('mousedown', () => {
            boton.style.backgroundColor = "#101828"; 
            boton.style.transform = "scale(0.95)"; 
        });

        boton.addEventListener('mouseup', () => {
            boton.style.transform = "scale(1)";
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const regresarCatalogoBtn = document.getElementById('regresarCatalogoBtn');
    if (regresarCatalogoBtn) {
        regresarCatalogoBtn.addEventListener('click', () => {
            
            localStorage.setItem('redirigirA', 'catalogo');
            window.location.href = 'index.html'; 
        });
    }
});

console.log(localStorage.getItem('redirigirA'));

function iniciarSesion(correo, contraseña) {
    const usuario = autenticarUsuario(correo, contraseña);

    if (usuario) {
        guardarDatosDeSesion(usuario);
        Swal.fire(`¡Inicio de sesión exitoso, bienvenido ${usuario.nombre}!`);
        mostrarSeccion('cuenta');
    } else {
        Swal.fire('Correo o contraseña incorrectos.');
    }
}

function obtenerUsuarioAutenticado() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

function mostrarMiCuenta() {
    actualizarEstadoAutenticacion(); 
    if (usuarioAutenticado) {
        mostrarSeccion('cuenta'); 
        const usuario = JSON.parse(localStorage.getItem('userData'));
        Swal.fire(`¡Bienvenido de nuevo, ${usuario.nombre || 'Usuario'}!`);
    } else {
        mostrarSeccion('inicio-sesion'); 
        Swal.fire('Por favor, inicia sesión para continuar.');
    }
}

function autenticarUsuario(correo, contraseña) {
    const usuarios = [
        { correo: 'ejemplo1@correo.com', contraseña: '12345', nombre: 'Yuzmey' },
        { correo: 'ejemplo2@correo.com', contraseña: 'abcde', nombre: 'Juan' }
    ];

    return usuarios.find(usuario => 
        usuario.correo === correo && usuario.contraseña === contraseña
    ) || null;
}

function guardarDatosDeSesion(usuario) {
    if (!usuario || !usuario.correo || !usuario.nombre) {
        console.error('Datos inválidos para guardar la sesión.');
        return;
    }
    localStorage.setItem('userData', JSON.stringify(usuario));
    console.log('Sesión guardada correctamente:', usuario);
}

function manejarAccesoMiCuenta() {
    const usuario = validarSesion();

    console.log('Usuario validado al acceder a Mi Cuenta:', usuario);

    if (usuario) {
        mostrarSeccion('cuenta');
        Swal.fire(`¡Bienvenido de nuevo, ${usuario.nombre}!`);
    } else {
        mostrarSeccion('inicio-sesion');
        Swal.fire('Por favor, inicia sesión para continuar.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('userData'));
    console.log('Usuario recuperado al cargar la página:', usuario);
});

function validarSesion() {
    const usuario = JSON.parse(localStorage.getItem('userData'));
    return usuario ? usuario : null; 
}

function actualizarEstadoAutenticacion() {
    const usuario = JSON.parse(localStorage.getItem('userData')); 
    usuarioAutenticado = usuario ? true : false; 
    console.log('Estado de autenticación actualizado:', usuarioAutenticado);
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarEstadoAutenticacion();
});
