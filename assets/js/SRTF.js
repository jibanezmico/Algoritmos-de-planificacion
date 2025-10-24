class SRTF {
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
                    element.process = [];
                    element.timeSpent = 0;
                    element.waitTime = 0;
                    this.queue.push(element);

                    if (this.performance != null) {
                        let TimeRemaining = this.performance.processingTime - this.performance.timeSpent;
                        if (TimeRemaining > element.processingTime) {
                            let aux = this.performance;
                            this.performance = this.queue.pop();
                            this.performance.entries = 1; //Saber intervalos de ejecución
                            this.performance.process[this.performance.entries - 1] = [time];
                            this.performance.startTime = time;
                            aux.process[aux.entries - 1][1] = time;
                            this.queue.push(aux);
                        }
                    }
                }
            });
            if (this.performance == null && this.queue.length != 0) {
                this.performance = this.Min(); //Sacamos de la cola y lo introducimos a ejecución

                //console.log(this.queue[this.queue.length - 1].id);
                //alert(this.queue);
                // Añadimos algunas etiquetas
                this.performance.entries += 1; //numero de veces que ha entrado a ejecutar
                this.performance.process[this.performance.entries - 1] = [time];
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
                    this.performance.process[this.performance.entries - 1][1] = time;
                    this.data[this.performance.id] = this.performance;
                    this.performance = null;
                }
            }
            if (this.performance == null && this.queue.length == 0 && time <= lastEntrie) {
                finish = false;
            } else finish = true;
        } while (this.performance != null || this.queue.length != 0 || !finish);
        //return this.exportChart();
        return this.exportChart();
        //return this.data;
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
            let timeRemaining = this.queue[al - 1].processingTime - this.queue[al - 1].timeSpent;
            let minimunTimeRamaining = minimum.processingTime - minimum.timeSpent;
            if (timeRemaining <= minimunTimeRamaining) {
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
            entries = 0,
            labels = this.returnLabels();
        this.data.forEach((element, index) => {
            let aux = [];
            for (let i = 0; i < element.entries; i++) {

                aux[i] = [element.process[i][0], element.process[i][1]];
                //console.log(aux[i]);

            }
            dat[index] = aux;
            if (element.entries > entries) {
                entries = element.entries;
            }
        });
        console.log(dat);

        let objet = {
            labels: labels,
            datasets: []
        }
        for (let i = 0; i < entries; i++) {
            let dataset = []
            for (let j = 0; j < dat.length; j++) { //POR AQUÍIIIIIIIIIII
                dataset[j] = dat[j][i];
            }
            objet.datasets[i] = {
                data: dataset,
                //borderColor: [Utils.CHART_COLORS.red, Utils.CHART_COLORS.blue],
                backgroundColor: this.backgroundColor,
                borderWidth: 2,
                borderRadius: 2,
                borderSkipped: false
            }
        }
        return objet;
    }
}
export default SRTF;