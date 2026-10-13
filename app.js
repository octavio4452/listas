class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null; // For doubly linked list
    }
}

class LinkedListVisualizer {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
        this.type = 'singly'; // singly, doubly, circular
        
        // DOM Elements
        this.canvas = document.getElementById('canvas');
        this.infoPanel = document.getElementById('structure-info');
        this.logList = document.getElementById('action-log');
        
        this.setupEventListeners();
        this.updateInfoPanel();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('data-structure-select').addEventListener('change', (e) => {
            this.type = e.target.value;
            this.clear();
            this.updateInfoPanel();
        });

        document.getElementById('btn-add-tail').addEventListener('click', () => this.addTail());
        document.getElementById('btn-add-head').addEventListener('click', () => this.addHead());
        document.getElementById('btn-insert-at').addEventListener('click', () => this.insertAt());
        document.getElementById('btn-remove-tail').addEventListener('click', () => this.removeTail());
        document.getElementById('btn-remove-head').addEventListener('click', () => this.removeHead());
        document.getElementById('btn-clear').addEventListener('click', () => this.clear());
        document.getElementById('btn-clear-log').addEventListener('click', () => this.clearLog());
        document.getElementById('btn-search').addEventListener('click', () => this.search());
        document.getElementById('btn-sort').addEventListener('click', () => this.sort());
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getInputValue() {
        const input = document.getElementById('node-value');
        const val = input.value.trim() || Math.floor(Math.random() * 100).toString();
        input.value = '';
        return val;
    }

    addLog(message, type = '') {
        const li = document.createElement('li');
        li.className = `log-entry ${type}`;
        li.textContent = message;
        this.logList.appendChild(li);
        this.logList.scrollTop = this.logList.scrollHeight;
    }

    clearLog() {
        this.logList.innerHTML = '<li class="log-entry system">Registro de acciones limpiado.</li>';
    }

    addTail() {
        const value = this.getInputValue();
        this.addLog(`[Insertar al Final] Creando nuevo nodo con valor: ${value}`, 'highlight');
        const newNode = new Node(value);
        
        if (!this.head) {
            this.addLog('Lista vacía: Asignando el nuevo nodo como Head y Tail.');
            this.head = newNode;
            this.tail = newNode;
            if (this.type.startsWith('circular')) {
                this.addLog('Circular: tail.next apunta a head.');
                newNode.next = this.head;
                if (this.type === 'circular-doubly') {
                    this.addLog('Circular Doble: head.prev apunta a tail.');
                    newNode.prev = this.tail;
                }
            }
        } else {
            this.addLog('Enlazando tail actual al nuevo nodo (tail.next = newNode).');
            this.tail.next = newNode;
            if (this.type.includes('doubly')) {
                this.addLog('Doble: Enlazando nuevo nodo al antiguo tail (newNode.prev = tail).');
                newNode.prev = this.tail;
            }
            this.addLog('Actualizando la referencia Tail al nuevo nodo.');
            this.tail = newNode;
            if (this.type.startsWith('circular')) {
                this.addLog('Circular: Actualizando el enlace de Tail hacia Head.');
                this.tail.next = this.head;
                if (this.type === 'circular-doubly') {
                    this.addLog('Circular Doble: Actualizando Head.prev hacia Tail.');
                    this.head.prev = this.tail;
                }
            }
        }
        this.length++;
        this.render();
    }

    addHead() {
        const value = this.getInputValue();
        this.addLog(`[Insertar al Inicio] Creando nuevo nodo con valor: ${value}`, 'highlight');
        const newNode = new Node(value);

        if (!this.head) {
            this.addLog('Lista vacía: Asignando el nuevo nodo como Head y Tail.');
            this.head = newNode;
            this.tail = newNode;
            if (this.type.startsWith('circular')) {
                this.addLog('Circular: tail.next apunta a head.');
                newNode.next = this.head;
                if (this.type === 'circular-doubly') {
                    this.addLog('Circular Doble: head.prev apunta a tail.');
                    newNode.prev = this.tail;
                }
            }
        } else {
            this.addLog('Enlazando nuevo nodo al head actual (newNode.next = head).');
            newNode.next = this.head;
            if (this.type.includes('doubly')) {
                this.addLog('Doble: Enlazando head actual al nuevo nodo (head.prev = newNode).');
                this.head.prev = newNode;
            }
            this.addLog('Actualizando la referencia Head al nuevo nodo.');
            this.head = newNode;
            if (this.type.startsWith('circular')) {
                this.addLog('Circular: Actualizando el enlace de Tail hacia el nuevo Head.');
                this.tail.next = this.head;
                if (this.type === 'circular-doubly') {
                    this.addLog('Circular Doble: Actualizando Head.prev hacia Tail.');
                    this.head.prev = this.tail;
                }
            }
        }
        this.length++;
        this.render();
    }

    insertAt() {
        const posInput = document.getElementById('insert-position');
        const posText = posInput.value.trim();
        posInput.value = '';

        if (posText === '') {
            this.addLog('Error: Por favor ingresa una posición en la casilla "Pos.".', 'system');
            return;
        }

        const pos = parseInt(posText, 10);
        if (isNaN(pos) || pos < 0) {
            this.addLog('Error: La posición debe ser un número entero mayor o igual a 0.', 'system');
            return;
        }

        if (pos === 0 || !this.head) {
            this.addLog(`Insertando en posición ${pos}. Redirigiendo a "Insertar al Inicio"...`);
            this.addHead();
            return;
        }

        if (pos >= this.length) {
            this.addLog(`La posición ${pos} es mayor o igual a la longitud actual (${this.length}). Redirigiendo a "Insertar al Final"...`);
            this.addTail();
            return;
        }

        const value = this.getInputValue();
        this.addLog(`[Insertar en Posición ${pos}] Creando nuevo nodo con valor: ${value}`, 'highlight');
        const newNode = new Node(value);

        let current = this.head;
        let index = 0;
        this.addLog(`Recorriendo la lista para llegar a la posición ${pos - 1} (nodo anterior)...`);
        
        while (index < pos - 1) {
            current = current.next;
            index++;
        }

        this.addLog(`Nodo anterior encontrado (Valor: ${current.value}). Enlazando newNode.next al siguiente nodo.`);
        
        newNode.next = current.next;
        current.next = newNode;

        if (this.type.includes('doubly')) {
            this.addLog(`Doble: Actualizando enlaces previos (prev) del nuevo nodo y su sucesor.`);
            newNode.prev = current;
            newNode.next.prev = newNode;
        }

        this.length++;
        this.render();
    }

    removeTail() {
        if (!this.head) {
            this.addLog('Operación cancelada: La lista ya está vacía.', 'system');
            return;
        }

        this.addLog(`[Eliminar Final] Iniciando eliminación...`, 'highlight');

        if (this.length === 1) {
            this.addLog('Único nodo en la lista. Head y Tail ahora son nulos.');
            this.head = null;
            this.tail = null;
        } else {
            if (this.type.includes('doubly')) {
                this.addLog('Doble: Retrocediendo Tail al nodo anterior (tail = tail.prev).');
                this.tail = this.tail.prev;
                this.addLog('Doble: Desvinculando último nodo (tail.next = null).');
                this.tail.next = null;
            } else {
                this.addLog('Simple: Recorriendo la lista desde el inicio para encontrar el penúltimo nodo...');
                let current = this.head;
                while (current.next !== this.tail) {
                    current = current.next;
                }
                this.addLog('Penúltimo nodo encontrado. Actualizando Tail a este nodo.');
                this.tail = current;
                this.addLog('Desvinculando el último nodo (tail.next = null).');
                this.tail.next = null;
            }
            
            if (this.type.startsWith('circular')) {
                this.addLog('Circular: Restaurando enlace circular (tail.next = head).');
                this.tail.next = this.head;
                if (this.type === 'circular-doubly') {
                    this.addLog('Circular Doble: Restaurando enlace (head.prev = tail).');
                    this.head.prev = this.tail;
                }
            }
        }
        this.length--;
        this.render();
    }

    removeHead() {
        if (!this.head) {
            this.addLog('Operación cancelada: La lista ya está vacía.', 'system');
            return;
        }

        this.addLog(`[Eliminar Inicio] Iniciando eliminación...`, 'highlight');

        if (this.length === 1) {
            this.addLog('Único nodo en la lista. Head y Tail ahora son nulos.');
            this.head = null;
            this.tail = null;
        } else {
            this.addLog('Avanzando Head al siguiente nodo (head = head.next).');
            this.head = this.head.next;
            if (this.type.includes('doubly')) {
                this.addLog('Doble: Desvinculando el nodo anterior del nuevo Head (head.prev = null).');
                this.head.prev = null;
            }
            if (this.type.startsWith('circular')) {
                this.addLog('Circular: Restaurando enlace circular (tail.next = head).');
                this.tail.next = this.head;
                if (this.type === 'circular-doubly') {
                    this.addLog('Circular Doble: Restaurando enlace (head.prev = tail).');
                    this.head.prev = this.tail;
                }
            }
        }
        this.length--;
        this.render();
    }

    clear() {
        if(this.length > 0) this.addLog('[Vaciar Lista] Se han eliminado todos los nodos.', 'system');
        this.head = null;
        this.tail = null;
        this.length = 0;
        this.render();
    }

    async search() {
        const type = document.getElementById('search-type').value;
        const input = document.getElementById('search-value');
        const targetValue = input.value.trim();
        input.value = '';

        if (!targetValue) {
            this.addLog('Por favor ingresa un valor a buscar.', 'system');
            return;
        }
        if (!this.head) {
            this.addLog('Operación cancelada: La lista está vacía.', 'system');
            return;
        }

        if (type === 'linear') {
            await this.linearSearch(targetValue);
        } else if (type === 'binary') {
            await this.binarySearch(targetValue);
        }
    }

    async sort() {
        const type = document.getElementById('sort-type').value;

        if (!this.head || this.head === this.tail) {
            this.addLog('Operación cancelada: La lista tiene 0 o 1 nodos, ya está ordenada.', 'system');
            return;
        }

        if (type === 'bubble') {
            await this.bubbleSort();
        } else if (type === 'selection') {
            await this.selectionSort();
        } else if (type === 'insertion') {
            await this.insertionSort();
        }
    }

    async linearSearch(targetValue) {
        this.addLog(`[Búsqueda Lineal] Iniciando búsqueda del valor: ${targetValue}`, 'highlight');
        
        let current = this.head;
        let index = 0;
        let found = false;

        do {
            const nodeEl = document.getElementById(`node-${index}`);
            if (nodeEl) {
                nodeEl.classList.add('highlight-search');
                this.addLog(`Visitando nodo en índice ${index} (Valor: ${current.value}). Comparando con ${targetValue}...`);
                await this.sleep(800); // Visual delay

                if (current.value === targetValue) {
                    this.addLog(`¡Valor encontrado en el índice ${index}!`, 'highlight');
                    found = true;
                    // Keep the highlight for a bit
                    await this.sleep(1500);
                    nodeEl.classList.remove('highlight-search');
                    break;
                }
                
                nodeEl.classList.remove('highlight-search');
            }
            
            current = current.next;
            index++;
        } while (current && current !== this.head);

        if (!found) {
            this.addLog(`Búsqueda finalizada. El valor ${targetValue} no se encuentra en la lista.`, 'system');
        }
    }

    async bubbleSort() {
        this.addLog('[Ordenamiento Burbuja] Iniciando ordenamiento de la lista...', 'highlight');

        let swapped;
        let iteration = 0;

        do {
            swapped = false;
            let current = this.head;
            let index = 0;

            // Stop condition for circular list during iteration
            while (current.next && current.next !== this.head) {
                const nodeEl1 = document.getElementById(`node-${index}`);
                const nodeEl2 = document.getElementById(`node-${index + 1}`);

                if (nodeEl1) nodeEl1.classList.add('highlight-search');
                if (nodeEl2) nodeEl2.classList.add('highlight-search');
                
                const val1 = parseFloat(current.value);
                const val2 = parseFloat(current.next.value);
                
                // Compare as numbers if possible, else as strings
                const shouldSwap = (!isNaN(val1) && !isNaN(val2)) ? val1 > val2 : current.value > current.next.value;

                this.addLog(`Iteración ${iteration + 1}: Comparando ${current.value} con ${current.next.value}...`);
                await this.sleep(800);

                if (shouldSwap) {
                    this.addLog(`  -> ${current.value} es mayor que ${current.next.value}. Intercambiando valores...`, 'highlight');
                    if (nodeEl1) { nodeEl1.classList.remove('highlight-search'); nodeEl1.classList.add('highlight-swap'); }
                    if (nodeEl2) { nodeEl2.classList.remove('highlight-search'); nodeEl2.classList.add('highlight-swap'); }
                    
                    await this.sleep(500);
                    
                    // Swap values in structure
                    let temp = current.value;
                    current.value = current.next.value;
                    current.next.value = temp;

                    // Update DOM instantly
                    if (nodeEl1) nodeEl1.textContent = current.value;
                    if (nodeEl2) nodeEl2.textContent = current.next.value;

                    // Re-append labels if we overwrote them with textContent
                    this.render(); // Let's re-render to ensure labels are kept safely
                    await this.sleep(100);

                    // Re-add swap class to the new nodes after render
                    const newNodeEl1 = document.getElementById(`node-${index}`);
                    const newNodeEl2 = document.getElementById(`node-${index + 1}`);
                    if (newNodeEl1) newNodeEl1.classList.add('highlight-swap');
                    if (newNodeEl2) newNodeEl2.classList.add('highlight-swap');

                    await this.sleep(600);

                    if (newNodeEl1) newNodeEl1.classList.remove('highlight-swap');
                    if (newNodeEl2) newNodeEl2.classList.remove('highlight-swap');
                    
                    swapped = true;
                } else {
                    if (nodeEl1) nodeEl1.classList.remove('highlight-search');
                    if (nodeEl2) nodeEl2.classList.remove('highlight-search');
                }

                current = current.next;
                index++;
            }
            iteration++;
            if(swapped) this.addLog(`Fin de la pasada ${iteration}. Hubo intercambios, repitiendo...`);
            else this.addLog(`Fin de la pasada ${iteration}. No hubo intercambios, lista ordenada.`, 'system');

        } while (swapped);

        this.addLog('[Ordenamiento] Lista completamente ordenada.', 'highlight');
    }

    async binarySearch(targetValue) {
        this.addLog(`[Búsqueda Binaria] Buscando el valor: ${targetValue}`, 'highlight');
        
        let isSorted = true;
        let curr = this.head;
        let idx = 0;
        const nodes = [];
        do {
            nodes.push(curr);
            if (curr.next && curr.next !== this.head) {
                const val1 = parseFloat(curr.value);
                const val2 = parseFloat(curr.next.value);
                const isGreater = (!isNaN(val1) && !isNaN(val2)) ? val1 > val2 : curr.value > curr.next.value;
                if (isGreater) {
                    isSorted = false;
                }
            }
            curr = curr.next;
        } while (curr && curr !== this.head);

        if (!isSorted) {
            this.addLog('Error: La Búsqueda Binaria requiere que la lista esté ordenada previamente.', 'system');
            return;
        }

        let left = 0;
        let right = nodes.length - 1;
        let found = false;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            
            const leftEl = document.getElementById(`node-${left}`);
            const rightEl = document.getElementById(`node-${right}`);
            if (leftEl) leftEl.classList.add('highlight-boundary');
            if (rightEl) rightEl.classList.add('highlight-boundary');
            
            this.addLog(`Rango actual: [Índice ${left} a ${right}]. Nodo central es el índice ${mid}.`);
            await this.sleep(800);

            const midEl = document.getElementById(`node-${mid}`);
            if (midEl) midEl.classList.add('highlight-search');
            
            this.addLog(`Evaluando nodo central (Valor: ${nodes[mid].value}).`);
            await this.sleep(1000);

            if (nodes[mid].value === targetValue) {
                this.addLog(`¡Valor encontrado en el índice ${mid}!`, 'highlight');
                found = true;
                await this.sleep(1500);
                if (midEl) midEl.classList.remove('highlight-search');
                if (leftEl) leftEl.classList.remove('highlight-boundary');
                if (rightEl) rightEl.classList.remove('highlight-boundary');
                break;
            }

            const val1 = parseFloat(nodes[mid].value);
            const val2 = parseFloat(targetValue);
            const isLess = (!isNaN(val1) && !isNaN(val2)) ? val1 < val2 : nodes[mid].value < targetValue;

            if (isLess) {
                this.addLog(`El valor ${nodes[mid].value} es menor que ${targetValue}. Buscando en mitad derecha.`);
                left = mid + 1;
            } else {
                this.addLog(`El valor ${nodes[mid].value} es mayor que ${targetValue}. Buscando en mitad izquierda.`);
                right = mid - 1;
            }

            if (midEl) midEl.classList.remove('highlight-search');
            if (leftEl) leftEl.classList.remove('highlight-boundary');
            if (rightEl) rightEl.classList.remove('highlight-boundary');
        }

        if (!found) {
            this.addLog(`Búsqueda finalizada. El valor ${targetValue} no se encuentra.`, 'system');
        }
    }

    async selectionSort() {
        this.addLog('[Ordenamiento por Selección] Iniciando...', 'highlight');

        let current = this.head;
        let i = 0;

        while (current && current.next !== this.head) {
            let minNode = current;
            let minIndex = i;
            let iter = current.next;
            let j = i + 1;

            const currentEl = document.getElementById(`node-${i}`);
            if (currentEl) currentEl.classList.add('highlight-boundary');
            this.addLog(`Pasada ${i+1}: Buscando el mínimo desde el índice ${i} (${current.value})`);
            await this.sleep(600);

            while (iter && iter !== this.head) {
                const iterEl = document.getElementById(`node-${j}`);
                if (iterEl) iterEl.classList.add('highlight-search');
                await this.sleep(400);

                const val1 = parseFloat(iter.value);
                const val2 = parseFloat(minNode.value);
                const isLess = (!isNaN(val1) && !isNaN(val2)) ? val1 < val2 : iter.value < minNode.value;

                if (isLess) {
                    const oldMinEl = document.getElementById(`node-${minIndex}`);
                    if (oldMinEl && minIndex !== i) oldMinEl.classList.remove('highlight-min');
                    
                    minNode = iter;
                    minIndex = j;
                    this.addLog(`  -> Nuevo mínimo encontrado en índice ${j}: ${minNode.value}`);
                    if (iterEl) iterEl.classList.add('highlight-min');
                }
                
                if (iterEl) iterEl.classList.remove('highlight-search');
                iter = iter.next;
                j++;
            }

            if (minNode !== current) {
                this.addLog(`Intercambiando elemento inicial (${current.value}) con mínimo (${minNode.value})`, 'highlight');
                const minEl = document.getElementById(`node-${minIndex}`);
                
                if (currentEl) currentEl.classList.add('highlight-swap');
                if (minEl) minEl.classList.add('highlight-swap');
                await this.sleep(600);

                let temp = current.value;
                current.value = minNode.value;
                minNode.value = temp;

                this.render();
                await this.sleep(100);

                const newCurrentEl = document.getElementById(`node-${i}`);
                const newMinEl = document.getElementById(`node-${minIndex}`);
                if (newCurrentEl) newCurrentEl.classList.add('highlight-swap');
                if (newMinEl) newMinEl.classList.add('highlight-swap');
                await this.sleep(600);
                if (newCurrentEl) newCurrentEl.classList.remove('highlight-swap');
                if (newMinEl) newMinEl.classList.remove('highlight-swap');
            } else {
                this.addLog(`El elemento en el índice ${i} ya era el mínimo.`);
            }

            if (currentEl) currentEl.classList.remove('highlight-boundary');
            const oldMinEl = document.getElementById(`node-${minIndex}`);
            if (oldMinEl) oldMinEl.classList.remove('highlight-min');

            current = current.next;
            i++;
        }
        this.addLog('[Ordenamiento] Lista completamente ordenada.', 'highlight');
    }

    async insertionSort() {
        this.addLog('[Ordenamiento por Inserción] Iniciando...', 'highlight');

        const nodes = [];
        let curr = this.head;
        do {
            nodes.push(curr);
            curr = curr.next;
        } while (curr && curr !== this.head);

        for (let i = 1; i < nodes.length; i++) {
            let keyNode = nodes[i];
            let j = i - 1;
            
            const keyEl = document.getElementById(`node-${i}`);
            if (keyEl) keyEl.classList.add('highlight-min');
            this.addLog(`Insertando el elemento en índice ${i} (${keyNode.value}) en la porción ordenada.`);
            await this.sleep(800);

            let currentBubblingIdx = i;
            
            while (j >= 0) {
                const compareNode = nodes[j];
                const compareEl = document.getElementById(`node-${j}`);
                if (compareEl) compareEl.classList.add('highlight-search');
                await this.sleep(400);

                const valBubble = parseFloat(nodes[currentBubblingIdx].value);
                const valCompare = parseFloat(compareNode.value);
                const isLess = (!isNaN(valBubble) && !isNaN(valCompare)) ? valBubble < valCompare : nodes[currentBubblingIdx].value < compareNode.value;

                if (isLess) {
                    this.addLog(`  -> ${nodes[currentBubblingIdx].value} es menor que ${compareNode.value}. Intercambiando hacia la izquierda.`);
                    if (compareEl) compareEl.classList.add('highlight-swap');
                    const bubEl = document.getElementById(`node-${currentBubblingIdx}`);
                    if (bubEl) bubEl.classList.add('highlight-swap');
                    await this.sleep(400);
                    
                    let temp = compareNode.value;
                    compareNode.value = nodes[currentBubblingIdx].value;
                    nodes[currentBubblingIdx].value = temp;
                    
                    this.render();
                    await this.sleep(100);

                    const newCompareEl = document.getElementById(`node-${j}`);
                    const newBubEl = document.getElementById(`node-${currentBubblingIdx}`);
                    if (newCompareEl) newCompareEl.classList.remove('highlight-swap', 'highlight-search');
                    if (newBubEl) newBubEl.classList.remove('highlight-swap', 'highlight-min');

                    currentBubblingIdx = j;
                    const nextBubEl = document.getElementById(`node-${currentBubblingIdx}`);
                    if (nextBubEl) nextBubEl.classList.add('highlight-min');
                } else {
                    this.addLog(`  -> Posición correcta encontrada.`);
                    if (compareEl) compareEl.classList.remove('highlight-search');
                    break;
                }
                j--;
            }
            const finalEl = document.getElementById(`node-${currentBubblingIdx}`);
            if (finalEl) finalEl.classList.remove('highlight-min');
        }
        this.addLog('[Ordenamiento] Lista completamente ordenada.', 'highlight');
    }

    updateInfoPanel() {
        let desc = '';
        let methods = '';
        
        switch(this.type) {
            case 'singly':
                desc = 'Una <strong>Lista Enlazada Simple</strong> es una colección lineal de nodos donde cada nodo apunta al siguiente.';
                methods = 'Métodos principales: <code>insertarInicio()</code>, <code>insertarFinal()</code>, <code>eliminarInicio()</code>, <code>eliminarFinal()</code>. La búsqueda y acceso tienen complejidad O(n).';
                break;
            case 'doubly':
                desc = 'Una <strong>Lista Enlazada Doble</strong> permite navegar en ambas direcciones. Cada nodo apunta a su predecesor y a su sucesor.';
                methods = 'Ventaja: La eliminación desde el final es O(1) ya que tenemos acceso directo al nodo anterior vía <code>prev</code>.';
                break;
            case 'circular':
                desc = 'Una <strong>Lista Enlazada Circular Simple</strong> es aquella donde el último nodo apunta de vuelta al primer nodo, formando un bucle continuo en una dirección.';
                methods = 'Útil para procesos que necesitan iterar continuamente (como la gestión de turnos en un procesador).';
                break;
            case 'circular-doubly':
                desc = 'Una <strong>Lista Enlazada Circular Doblemente Enlazada</strong> combina las ventajas de ambas: se puede recorrer en ambas direcciones y el final se conecta con el principio y viceversa.';
                methods = 'Complejidad mejorada: eliminar al final u obtener el último elemento desde el principio es instantáneo O(1).';
                break;
        }

        this.infoPanel.innerHTML = `
            <p>${desc}</p>
            <p class="mt-2">${methods}</p>
            <p class="mt-2"><strong>Longitud Actual:</strong> ${this.length}</p>
        `;
    }

    render() {
        // Clear canvas
        this.canvas.innerHTML = '';
        this.updateInfoPanel();

        if (this.length === 0) {
            this.canvas.innerHTML = '<div class="empty-state">La lista está vacía. Añade un nodo para comenzar.</div>';
            return;
        }

        let current = this.head;
        let index = 0;
        const nodesData = [];

        // Gather data
        do {
            nodesData.push({
                value: current.value,
                isHead: index === 0,
                isTail: index === this.length - 1
            });
            current = current.next;
            index++;
        } while (current && current !== this.head);

        // Render DOM elements
        nodesData.forEach((data, i) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'node-container';

            // Node itself
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'node';
            nodeDiv.id = `node-${i}`;
            nodeDiv.textContent = data.value;

            // Labels (Head/Tail)
            if (data.isHead) {
                const label = document.createElement('div');
                label.className = 'node-label';
                label.innerHTML = '<strong>HEAD</strong>' + (this.type.startsWith('circular') && data.isTail ? ' / <strong>TAIL</strong>' : '');
                nodeDiv.appendChild(label);
            } else if (data.isTail) {
                const label = document.createElement('div');
                label.className = 'node-label';
                label.innerHTML = '<strong>TAIL</strong>';
                nodeDiv.appendChild(label);
            }

            wrapper.appendChild(nodeDiv);

            // Add pointer if not the last element, or if circular and it's the last element
            if (!data.isTail) {
                const pointer = document.createElement('div');
                pointer.className = this.type.includes('doubly') ? 'pointer double' : 'pointer';
                
                const ptrLabel = document.createElement('div');
                ptrLabel.className = 'pointer-label';
                ptrLabel.textContent = this.type.includes('doubly') ? 'prev / next' : 'next';
                pointer.appendChild(ptrLabel);

                wrapper.appendChild(pointer);
            } else if (data.isTail && this.type.startsWith('circular') && this.length > 1) {
                // Visual cue for circular reference going back
                const circularLine = document.createElement('div');
                circularLine.className = 'circular-back-pointer' + (this.type === 'circular-doubly' ? ' doubly' : '');
                
                // Calculate rough width based on number of nodes to draw the back arrow
                // 70px node + 40px gap de canvas + 40px puntero = 150px por nodo
                const width = (this.length - 1) * 150;
                circularLine.style.width = `${width}px`;
                circularLine.style.height = '120px';
                circularLine.style.bottom = '-40px';
                circularLine.style.right = '35px'; // center of last node
                
                wrapper.appendChild(circularLine);
            }

            this.canvas.appendChild(wrapper);
        });
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.visualizer = new LinkedListVisualizer();
});
