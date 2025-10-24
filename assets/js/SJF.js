class SJF {
    queue = [];
    performance = null;
    constructor(data, backgroundColor) {
        this.data = data;
        this.backgroundColor = backgroundColor;
    }
    results() {
        let time = this.data[0].time,
            lastEntrie = this.data[this.data.length - 1].time,
            finish = true;

        do {
            this.data.forEach((element, index) => {
                if (time == element.time) {
                    element.id = index;
                    element.position = index;
                    element.entries = 0;
                    element.timeSpent = 0;
                    element.waitTime = 0; // Tiempo de espera
                    this.queue.push(element);

                }
            });
            if (this.performance == null && this.queue.length != 0) {
                this.performance = this.Min(); //Sacamos de la cola y lo introducimos a ejecución

                //console.log(this.queue[this.queue.length - 1].id);
                //alert(this.queue);
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
                if (this.performance.timeSpent == this.performance.processingTime) {
                    this.performance.CompletionTime = time; //Registrar el momento que se completó
                    this.data[this.performance.id] = this.performance;
                    this.performance = null;
                }
            }
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
    Min() {
        let al = this.queue.length - 1;
        let minimum = this.queue[al];
        while (al > 0) {
            if (this.queue[al - 1].processingTime <= minimum.processingTime) {
                minimum = this.queue[al - 1];
            }
            al--
        }
        this.queue = this.Delete(this.queue, minimum.position)
        return minimum;
    };
    Delete(array, Aindex) {
        let newArray = [];
        let i = 0;
        array.forEach((element) => {
            if (Aindex != element.position) {
                element.position = i;
                newArray[i] = element;
                i++;
            }
        })
        return newArray;
    }
    exportChart() {
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
}
export default SJF;