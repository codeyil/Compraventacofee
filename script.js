function obtenerFechaHora() {
  return new Date().toLocaleString();
}

function mostrarNotificacion(mensaje) {
  let notificacion = document.getElementById("notificacion");
  notificacion.innerText = mensaje;
  notificacion.style.display = "block";

  setTimeout(() => {
    notificacion.style.display = "none";
  }, 2000);
}

// Función para formatear los números con separadores de miles
function formatearNumero(numero) {
  return numero.toLocaleString('es-CO'); // Usamos 'es-CO' para formato colombiano
}

// Establecer un valor predeterminado para el precio por carga al cargar la página
document.getElementById("precioCarga").value = 0; // Establece 0 como valor por defecto

function registrarVenta() {
  let vendedor = document.getElementById("vendedor").value.trim();
  let precioCarga = parseFloat(document.getElementById("precioCarga").value);
  let cantidadKilos = parseFloat(document.getElementById("cantidadKilos").value);
  let estadoPago = document.getElementById("estadoPago").value;

  if (!vendedor || isNaN(precioCarga) || isNaN(cantidadKilos) || precioCarga <= 0 || cantidadKilos <= 0) {
    mostrarNotificacion("⚠️ Ingrese valores válidos.");
    return;
  }function registrarVenta() {
  let vendedor = document.getElementById("vendedor").value.trim();
  let precioCarga = parseFloat(document.getElementById("precioCarga").value);
  let cantidadKilos = parseFloat(document.getElementById("cantidadKilos").value);
  let estadoPago = document.getElementById("estadoPago").value;

  if (!vendedor || isNaN(precioCarga) || isNaN(cantidadKilos) || precioCarga <= 0 || cantidadKilos <= 0) {
    mostrarNotificacion("⚠️ Ingrese valores válidos.");
    return;
  }

  let precioPorKilo = precioCarga / 125;
  let totalPagar = precioPorKilo * cantidadKilos;
  let fechaHora = obtenerFechaHora();

  let venta = {
    vendedor,
    cantidadKilos,
    totalPagar: totalPagar.toFixed(2), // Mantenemos 2 decimales
    estadoPago,
    fechaHora
  };

  let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
  ventas.push(venta);
  localStorage.setItem("ventas", JSON.stringify(ventas));

  mostrarVentas();
  mostrarNotificacion("✅ Venta registrada con éxito.");
  limpiarCampos();

  // Descargar automáticamente el archivo JSON al guardar la venta
  exportarVentas();
}

  let precioPorKilo = precioCarga / 125;
  let totalPagar = precioPorKilo * cantidadKilos;
  let fechaHora = obtenerFechaHora();

  let venta = {
    vendedor,
    cantidadKilos,
    totalPagar: totalPagar.toFixed(2), // Mantenemos 2 decimales
    estadoPago,
    fechaHora
  };

  let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
  ventas.push(venta);
  localStorage.setItem("ventas", JSON.stringify(ventas));

  mostrarVentas();
  mostrarNotificacion("✅ Venta registrada con éxito.");
  limpiarCampos();
  
  
  
  
  
}

function eliminarVenta(index) {
  // Mostrar ventana de confirmación antes de eliminar
  let confirmar = confirm("⚠️ ¿Estás seguro de que quieres eliminar esta venta? Esta acción no se puede deshacer.");

  if (confirmar) {
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    ventas.splice(index, 1); // Eliminar la venta seleccionada
    localStorage.setItem("ventas", JSON.stringify(ventas)); // Guardar los cambios en el localStorage

    mostrarVentas(); // Actualizar la tabla de ventas después de la eliminación
    mostrarNotificacion("🗑️ Venta eliminada.");
  } else {
    mostrarNotificacion("✅ Eliminación cancelada.");
  }
}

function actualizarTablaVentas(ventas) {
  let lista = document.getElementById("listaVentas");
  lista.innerHTML = "";

  let totalKilos = 0;
  let totalDinero = 0;
  let totalPagado = 0;
  let totalDebe = 0;

  ventas.forEach((v, index) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.fechaHora}</td>
      <td>${v.vendedor}</td>
      <td>${formatearNumero(v.cantidadKilos)} kg</td>
      <td>$${formatearNumero(v.totalPagar)}</td>
      <td class="${v.estadoPago === 'Debe' ? 'deuda' : 'pagado'}">${v.estadoPago}</td>
      <td>
        ${v.estadoPago === 'Debe' 
          ? `<button class="pagar-btn" onclick="registrarPago(${index})">💰 Pagar</button>
             <button class="marcar-btn" onclick="marcarComoPagado(${index})">✔️ Marcar Pagado</button>`
          : "✅"}
      </td>
      <td><button class="eliminar-btn" onclick="eliminarVenta(${index})">🗑️</button></td>
    `;
    lista.appendChild(tr);

    totalKilos += parseFloat(v.cantidadKilos);
    totalDinero += parseFloat(v.totalPagar);

    if (v.estadoPago === 'Pagado') {
      totalPagado += parseFloat(v.totalPagar);
    } else {
      totalDebe += parseFloat(v.totalPagar);
    }
  });

  // Usamos la función formatearNumero para mostrar los totales con separadores de miles
  document.getElementById("totalKilos").innerText = `${formatearNumero(totalKilos)} kg`;
  document.getElementById("totalDinero").innerText = `$${formatearNumero(totalDinero)}`;
  document.getElementById("totalPagado").innerText = `$${formatearNumero(totalPagado)}`;
  document.getElementById("totalDebe").innerText = `$${formatearNumero(totalDebe)}`;

  // Llamamos a la función que actualizará el gráfico
  actualizarGraficoVentas(ventas);
}

function limpiarCampos() {
  document.getElementById("vendedor").value = "";
  // No limpiamos el campo de precioCarga para que quede el valor predeterminado de 125
  document.getElementById("cantidadKilos").value = "";
}

document.getElementById("modoOscuroBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

window.onload = mostrarVentas;

function registrarPago(index) {
  let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
  let venta = ventas[index];

  let pago = parseFloat(prompt(`Ingrese el monto a pagar de $${venta.totalPagar}:`));

  if (isNaN(pago) || pago <= 0) {
    mostrarNotificacion("⚠️ Ingrese un valor válido.");
    return;
  }

  if (pago >= venta.totalPagar) {
    venta.totalPagar = "0.00";
    venta.estadoPago = "Pagado";
    mostrarNotificacion("✅ Pago completado.");
  } else {
    venta.totalPagar = (venta.totalPagar - pago).toFixed(2);
    mostrarNotificacion(`✅ Se pagó $${pago}, saldo restante: $${venta.totalPagar}.`);
  }

  ventas[index] = venta;
  localStorage.setItem("ventas", JSON.stringify(ventas));
  mostrarVentas();
}

function marcarComoPagado(index) {
  let confirmar = confirm("⚠️ ¿Estás seguro de que quieres marcar esta venta como pagada? Esta acción no se puede deshacer.");

  if (confirmar) {
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    let venta = ventas[index];

    // Actualizar el estado de la venta a "Pagado" y poner el total a "0.00"
    venta.estadoPago = "Pagado";
    venta.totalPagar = "0.00";

    // Guardar los cambios en localStorage
    ventas[index] = venta;
    localStorage.setItem("ventas", JSON.stringify(ventas));

    // Actualizar la interfaz de usuario
    mostrarVentas();

    // Mostrar notificación de éxito
    mostrarNotificacion("✅ Venta marcada como pagada.");
  } else {
    // Mostrar notificación si la acción fue cancelada
    mostrarNotificacion("✅ Marcado como pagado cancelado.");
  }
}

function mostrarVentas() {
  let lista = document.getElementById("listaVentas");
  lista.innerHTML = "";
  let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

  let totalKilos = 0;
  let totalDinero = 0;
  let totalPagado = 0;
  let totalDebe = 0;

  ventas.forEach((v, index) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.fechaHora}</td>
      <td>${v.vendedor}</td>
      <td>${formatearNumero(v.cantidadKilos)} kg</td>
      <td>$${formatearNumero(v.totalPagar)}</td>
      <td class="${v.estadoPago === 'Debe' ? 'deuda' : 'pagado'}">${v.estadoPago}</td>
      <td>
        ${v.estadoPago === 'Debe' 
          ? `<button class="pagar-btn" onclick="registrarPago(${index})">💰 Pagar</button>
             <button class="marcar-btn" onclick="marcarComoPagado(${index})">✔️ Marcar Pagado</button>`
          : "✅"}
      </td>
      <td><button class="eliminar-btn" onclick="eliminarVenta(${index})">🗑️</button></td>
    `;
    lista.appendChild(tr);

    totalKilos += parseFloat(v.cantidadKilos);
    totalDinero += parseFloat(v.totalPagar);

    if (v.estadoPago === 'Pagado') {
      totalPagado += parseFloat(v.totalPagar);
    } else {
      totalDebe += parseFloat(v.totalPagar);
    }
  });

  document.getElementById("totalKilos").innerText = `${formatearNumero(totalKilos)} kg`;
  document.getElementById("totalDinero").innerText = `$${formatearNumero(totalDinero)}`;
  document.getElementById("totalPagado").innerText = `$${formatearNumero(totalPagado)}`;
  document.getElementById("totalDebe").innerText = `$${formatearNumero(totalDebe)}`;

  // Llamamos a la función que actualizará el gráfico
  actualizarGraficoVentas(ventas);
}

// Función para actualizar la gráfica
function actualizarGraficoVentas(ventas) {
  let ctx = document.getElementById("ventasChart").getContext("2d");

  // Agrupar ventas por vendedor  
  let ventasPorVendedor = {};
  ventas.forEach(v => {
    ventasPorVendedor[v.vendedor] = (ventasPorVendedor[v.vendedor] || 0) + parseFloat(v.cantidadKilos);
  });

  let vendedores = Object.keys(ventasPorVendedor);
  let kilosVendidos = Object.values(ventasPorVendedor);

  if (window.miGrafico) {
    window.miGrafico.destroy(); // Eliminar el gráfico anterior antes de crear uno nuevo
  }

  window.miGrafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: vendedores,
      datasets: [{
        label: "Kilos Vendidos",
        data: kilosVendidos,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}



function exportarVentas() {
  let ventas = localStorage.getItem("ventas");
  let blob = new Blob([ventas], { type: "application/json" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ventas.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}









function importarVentas() {
    let inputFile = document.getElementById("importarVentasInput");
    
    if (!inputFile.files.length) {
        mostrarNotificacion("⚠️ Seleccione un archivo antes de importar.");
        return;
    }

    let file = inputFile.files[0];
    let reader = new FileReader();

    reader.onload = function(event) {
        try {
            let ventasImportadas = JSON.parse(event.target.result);

            // Validar que el archivo tiene datos correctos
            if (!Array.isArray(ventasImportadas)) {
                throw new Error("Formato inválido");
            }

            localStorage.setItem("ventas", JSON.stringify(ventasImportadas));
            mostrarVentas();
            mostrarNotificacion("✅ Ventas importadas correctamente.");
        } catch (error) {
            mostrarNotificacion("⚠️ Archivo inválido.");
        }
    };

    reader.readAsText(file);
}





function mostrarNotificacion(mensaje) {
    let notificacion = document.getElementById("notificacion");
    notificacion.innerText = mensaje;
    notificacion.classList.add("mostrar");
    notificacion.style.display = "block";

    setTimeout(() => {
        notificacion.classList.remove("mostrar");
        setTimeout(() => {
            notificacion.style.display = "none";
        }, 500);
    }, 3000);
}