let medidacuadricula;

function reiniciarSudoku() {
    for (let fila = 0; fila < medidacuadricula; fila++) {
        for (let col = 0; col < medidacuadricula; col++) {
            const celdaId = `celda-${fila}-${col}`;
            const celda = document.getElementById(celdaId);
            celda.value = "";
            celda.classList.remove("Resolver", "efecto", "entradausuario");
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const btnResolver = document.getElementById("btnresolver");
    btnResolver.addEventListener('click', resolverJuego);
    const btnReiniciar = document.getElementById("btnreiniciar");
    btnReiniciar.addEventListener('click', reiniciarSudoku);

    const tablaSudoku = document.getElementById("tabla-sudoku");
    medidacuadricula = 9;

    for (let fila = 0; fila < medidacuadricula; fila++) {
        const nuevaFila = document.createElement("tr");

        for (let col = 0; col < medidacuadricula; col++) {
            const celda = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "celda";
            input.id = `celda-${fila}-${col}`;

            // Validación en tiempo real 
            input.addEventListener('input', function(event){
                validarEntrada(event, fila, col);
            });

            celda.appendChild(input);
            nuevaFila.appendChild(celda);
        }
        tablaSudoku.appendChild(nuevaFila);
    }
});

async function resolverJuego() {
    const listaSudoku = [];
    // Llenamos los valores del tablero
    for (let fila = 0; fila < medidacuadricula; fila++) {
        listaSudoku[fila] = [];

        for (let col = 0; col < medidacuadricula; col++) {
            const celdaId = `celda-${fila}-${col}`;
            const celdaValor = document.getElementById(celdaId).value;
            listaSudoku[fila][col] = celdaValor !== "" ? parseInt(celdaValor) : 0;
        }
    }

    // Identificamos las celdas que ingresa el usuario
    for (let fila = 0; fila < medidacuadricula; fila++) {
        for (let col = 0; col < medidacuadricula; col++) {
            const celdaId = `celda-${fila}-${col}`;
            const celda = document.getElementById(celdaId);

            if (listaSudoku[fila][col] !== 0) {
                celda.classList.add("entradausuario");
            }
        }
    }

    // Una vez resuelto el juego mostramos la solución del tablero 
    if (sudoku(listaSudoku)) {
        for (let fila = 0; fila < medidacuadricula; fila++) {
            for (let col = 0; col < medidacuadricula; col++) {
                const celdaId = `celda-${fila}-${col}`;
                const celda = document.getElementById(celdaId);

                if (!celda.classList.contains("entradausuario")) {
                    celda.value = listaSudoku[fila][col];
                    celda.classList.add("resolverefecto");
                    await efectoRetraso(20);
                }
            }
        }
    } else {
        alert("No tiene solución el juego");
    }
}

// Función para verificar la solución y evitar errores
function sudoku(tablero) {
    for (let fila = 0; fila < medidacuadricula; fila++) {
        for (let col = 0; col < medidacuadricula; col++) {
            if (tablero[fila][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (verificarConflicto(tablero, fila, col, num)) {
                        tablero[fila][col] = num;

                        // Intentamos resolverlo con recursividad
                        if (sudoku(tablero)) {
                            return true;
                        }

                        tablero[fila][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Función para verificar el conflicto en la solución
function verificarConflicto(tablero, fila, col, num) {
    // Verificamos la fila y la columna 
    for (let i = 0; i < medidacuadricula; i++) {
        if (tablero[fila][i] === num || tablero[i][col] === num) {
            return false;
        }
    }

    // Verificamos la cuadrícula 3x3
    const filaInicio = Math.floor(fila / 3) * 3;
    const colInicio = Math.floor(col / 3) * 3;

    for (let i = filaInicio; i < filaInicio + 3; i++) {
        for (let j = colInicio; j < colInicio + 3; j++) {
            if (tablero[i][j] === num) {
                return false;
            }
        }
    }
    return true;
}

// Función para el efecto de retraso
function efectoRetraso(ms) {
    return new Promise(sudoku => setTimeout(sudoku, ms));
}

// Función para validar la entrada del usuario
function validarEntrada(event, fila, col) {
    const celdaId = `celda-${fila}-${col}`;
    const celda = document.getElementById(celdaId);
    const valor = celda.value;

    if (!/^[1-9]$/.test(valor)) {
        Swal.fire({
            icon: "warning",
            title: "El número [" + valor + "] no es válido. Ingresa un valor del 1 al 9.",
            showConfirmButton: false,
            timer: 2500
        });
        celda.value = "";
        return;
    }

    const numeroIngresado = parseInt(valor);

    for (let i = 0; i < 9; i++) {
        if (i !== col && document.getElementById(`celda-${fila}-${i}`).value == numeroIngresado) {
            Swal.fire({
                icon: "warning",
                title: "El número [" + numeroIngresado + "] ya existe en la fila.",
                showConfirmButton: false,
                timer: 2500
            });
            celda.value = "";
            return;
        }

        if (i !== fila && document.getElementById(`celda-${i}-${col}`).value == numeroIngresado) {
            Swal.fire({
                icon: "warning",
                title: "El número [" + numeroIngresado + "] ya existe en la columna.",
                showConfirmButton: false,
                timer: 2500
            });
            celda.value = "";
            return;
        }
    }

    const subcuadriculaFilaInicio = Math.floor(fila / 3) * 3;
    const subcuadriculaColInicio = Math.floor(col / 3) * 3;

    for (let i = subcuadriculaFilaInicio; i < subcuadriculaFilaInicio + 3; i++) {
        for (let j = subcuadriculaColInicio; j < subcuadriculaColInicio + 3; j++) {
            if (i !== fila && j !== col && document.getElementById(`celda-${i}-${j}`).value == numeroIngresado) {
                Swal.fire({
                    icon: "warning",
                    title: "El número [" + numeroIngresado + "] ya existe en la misma subcuadrícula 3x3.",
                    showConfirmButton: false,
                    timer: 2500
                });
                celda.value = "";
                return;
            }
        }
    }
}


