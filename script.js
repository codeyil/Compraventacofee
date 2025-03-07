function obtenerFechaHora() { return new Date().toLocaleString(); }

function mostrarNotificacion(mensaje) { let notificacion = document.getElementById("notificacion"); notificacion.innerText = mensaje; notificacion.style.display = "block";

setTimeout(() => {
    notificacion.style.display = "none";
}, 2000);

}

function registrarVenta() { let vendedor = document.getElementById("vendedor").value.trim(); let precioCarga = parseFloat(document.getElementById("precioCarga").value); let cantidadKilos = parseFloat(document.getElementById("cantidadKilos").value); let estadoPago = document.getElementById("estadoPago").value;

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
    totalPagar: totalPagar.toFixed(2),
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

function eliminarVenta(index) { let ventas = JSON.parse(localStorage.getItem("ventas")) || []; ventas.splice(index, 1); localStorage.setItem("ventas", JSON.stringify(ventas));

mostrarVentas();
mostrarNotificacion("🗑️ Venta eliminada.");

}

function mostrarVentas() { let lista = document.getElementById("listaVentas"); lista.innerHTML = ""; let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

let totalKilos = 0;
let totalDinero = 0;
let totalPagado = 0;
let totalDebe = 0;

ventas.forEach((v, index) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${v.fechaHora}</td>
        <td>${v.vendedor}</td>
        <td>${v.cantidadKilos} kg</td>
        <td>$${v.totalPagar}</td>
        <td class="${v.estadoPago === 'Debe' ? 'deuda' : 'pagado'}">${v.estadoPago}</td>
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

document.getElementById("totalKilos").innerText = `${totalKilos.toFixed(2)} kg`;
document.getElementById("totalDinero").innerText = `$${totalDinero.toFixed(2)}`;
document.getElementById("totalPagado").innerText = `$${totalPagado.toFixed(2)}`;
document.getElementById("totalDebe").innerText = `$${totalDebe.toFixed(2)}`;

}

function limpiarCampos() { document.getElementById("vendedor").value = ""; document.getElementById("precioCarga").value = ""; document.getElementById("cantidadKilos").value = ""; }

document.getElementById("modoOscuroBtn").addEventListener("click", () => { document.body.classList.toggle("dark-mode"); });

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
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    ventas[index].estadoPago = "Pagado";
    ventas[index].totalPagar = "0.00";

    localStorage.setItem("ventas", JSON.stringify(ventas));
    mostrarVentas();
    mostrarNotificacion("✅ Venta marcada como pagada.");
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
            <td>${v.cantidadKilos} kg</td>
            <td>$${v.totalPagar}</td>
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

    document.getElementById("totalKilos").innerText = `${totalKilos.toFixed(2)} kg`;
    document.getElementById("totalDinero").innerText = `$${totalDinero.toFixed(2)}`;
    document.getElementById("totalPagado").innerText = `$${totalPagado.toFixed(2)}`;
    document.getElementById("totalDebe").innerText = `$${totalDebe.toFixed(2)}`;
}



function eliminarVenta(index) {
    let confirmar = confirm("⚠️ ¿Estás seguro de que quieres eliminar esta venta? Esta acción no se puede deshacer.");

    if (confirmar) {
        let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
        ventas.splice(index, 1);
        localStorage.setItem("ventas", JSON.stringify(ventas));

        mostrarVentas();
        mostrarNotificacion("🗑️ Venta eliminada.");
    } else {
        mostrarNotificacion("✅ Eliminación cancelada.");
    }
}





