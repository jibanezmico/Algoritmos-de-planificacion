class FCFS {
    queue = [];
    performance = null;
    constructor(data, backgroundColor) {
        this.data = data;
        this.backgroundColor = backgroundColor;
    }
    results() {
        let time = this.data[0].time, //Tiempo de primer proceso en cola
            lastEntrie = this.data[this.data.length - 1].time, // ultima entrada de un proceso
            finish = true; // si se finaliza el algoritmo (Para el while)

        do {
            // Recorremos los datos para ver si llegaron procesos
            this.data.forEach((element, index) => {
                if (time == element.time) {
                    element.id = index; // index para ubicarlo luego
                    element.entries = 0; // las veces que entró a ejecutarse
                    element.timeSpent = 0; // tiempo gastado
                    element.waitTime = 0; // Tiempo de espera
                    this.queue.push(element);
                }
            });
            // Comprobar si no hay nada en la ejecución para pasar un procesp de la cola
            if (this.performance == null && this.queue.length != 0) {
                this.performance = this.queue.shift(); //Sacamos de la cola y lo introducimos a ejecución
                // Añadimos algunas etiquetas
                this.performance.entries += 1; //numero de veces que ha entrado a ejecutar
                if (this.performance.entries == 1) this.performance.startTime = time //Tiempo en que empezó
            }
            time++;
            if (this.performance != null) {
                // Para marcar en tiempo de espera a los procesos en cola
                if (this.queue.length != 0) {
                    this.queue.forEach(element => {
                        element.waitTime += 1;
                    });
                }
                this.performance.timeSpent += 1; // tiempo gastado
                // Comprobamos si ya realizó su tarea
                if (this.performance.timeSpent == this.performance.processingTime) {
                    this.performance.CompletionTime = time; //Registrar el momento que se completó
                    this.data[this.performance.id] = this.performance; // guardamos esos datos
                    this.performance = null; // sacamos el proceso de ejecución
                }
            }
            // Esto es contra fallos, por si quiere poner una cascarita dejando tiempos sin ejecución
            if (this.performance == null && this.queue.length == 0 && time <= lastEntrie) {
                finish = false;
            } else finish = true;
        } while (this.performance != null || this.queue.length != 0 || !finish);
        return this.exportChart();
    }
    returnLabels() {
        return this.data.map(function(obj) {
            return obj.name;
        });
    }
    exportChart() {
            //Convertimos esos datos en objeto para pasarlos al grafico
            let dat = [],
                labels = this.returnLabels();
            this.data.forEach((element, index) => {
                dat[index] = [element.startTime, element.CompletionTime];
            });
            return {
                labels: labels,
                datasets: [{
                    data: dat,
                    //borderColor: [Utils.CHART_COLORS.red, Utils.CHART_COLORS.blue],
                    backgroundColor: this.backgroundColor,
                    borderWidth: 2,
                    borderRadius: 2,
                    borderSkipped: false
                }]
            }
        }
        // Algoritmo viejo, funcional pero poco practico a la realidad
        // results2() {
        //     let dat = [],
        //         labels = [];
        //     let last = 0,
        //         total = 0;
        //     this.data.forEach((element, index) => {
        //         labels[index] = element.name;
        //         if (element.time > last) last = element.time;
        //         total = last + Number(element.processingTime);
        //         dat[index] = [last, total];
        //         last = total;
        //     });
        //     let dataset = {
        //         labels: labels,
        //         datasets: [{
        //             data: dat,
        //             //borderColor: [Utils.CHART_COLORS.red, Utils.CHART_COLORS.blue],
        //             backgroundColor: this.backgroundColor,
        //             borderWidth: 2,
        //             borderRadius: 2,
        //             borderSkipped: false
        //         }]
        //     }
        //     return dataset;
        // }
}

export default FCFS;