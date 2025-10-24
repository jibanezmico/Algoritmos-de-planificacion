import FCFS from './FCFS.js';
import Chart from './chart.min.js';
import SJF from './SJF.js';
import SRTF from './SRTF.js';
import RR from './RR.js';
let backgroundColor = [
    'rgba(255,99,132,0.8)',
    'rgba(54,162,235,0.8)'
]
let button = document.getElementById("save");
let name = document.getElementById("name");
let time = document.getElementById("time");
let processingTime = document.getElementById("processing-time");
let tBody = document.getElementById("t-body");
let data = [];
let Processchart = document.getElementById('chart').getContext('2d');
let buttonFCFS = document.getElementById("FCFS");
let buttonSJS = document.getElementById("SJF");
let buttonSRTF = document.getElementById("SRTF");
let buttonRR = document.getElementById("RR");

buttonFCFS.onclick = () => {
    if (data.length == 0) {
        alert("Cola vacia");
    } else {
        sort();
        let fcfs = new FCFS(data, backgroundColor);
        let results = fcfs.results();
        mychart.data = results;
        mychart.update();
        createTable(fcfs.data);
        console.log(fcfs.data);
    }
}
buttonSJS.onclick = () => {
    if (data.length == 0) {
        alert("Cola vacia");
    } else {
        sort();
        let sjf = new SJF(data, backgroundColor);
        let results = sjf.results();
        mychart.data = results;
        mychart.update();
        createTable(sjf.data);
        console.log(sjf.data);
    }
}
buttonSRTF.onclick = () => {
    if (data.length == 0) {
        alert("Cola vacia");
    } else {
        sort();
        let srtf = new SRTF(data, backgroundColor);
        let results = srtf.results();
        mychart.data = results;
        mychart.update();
        createTable(srtf.data);
        // console.log(srtf.data);
        // console.log(results);
    }
}
buttonRR.onclick = () => {
    let quantum = prompt("Digita el valor del quatum");
    if (!isNaN(quantum) && quantum != "") {
        quantum = Math.round(quantum);
        if (data.length == 0) {
            alert("Cola vacia");
        } else {
            sort();
            let rr = new RR(data, quantum, backgroundColor);
            let results = rr.results();
            mychart.data = results;
            mychart.update();
            createTable(rr.data);
            // console.log(srtf.data);
            //console.log(results);
        }
    } else {
        alert("Digite un valor numérico");
    }
}
button.onclick = () => {
    if (validateFields()) {
        data[data.length] = {
            name: name.value,
            time: time.value,
            processingTime: processingTime.value
        }
        sort();
        paintTable();
        clear();
    } else {
        alert("Completar los campos");
    }
}

function paintTable() {
    tBody.innerHTML = "";
    data.forEach(element => {
        tBody.innerHTML += '<tr><td>' + element.name + '</td><td>' + element.time + '</td><td>' + element.processingTime + '</td></tr>';
    })
}

function sort() {
    data.sort(function(a, b) {
        if (Number(a.time) > Number(b.time)) {
            return 1;
        }
        if (Number(a.time) < Number(b.time)) {
            return -1;
        }
        return 0;
    });
}

function clear() {
    name.value = "";
    time.value = "";
    processingTime.value = "";
}

function validateFields() {
    return name.value != "" && time.value != "" && processingTime.value != "";
}

function createTable(data) {
    let thead = "<thead><tr><th>Nombre</th><th>Tiempo de llegada</th><th>Duración</th><th>Tiempo de comienzo</th><th>Tiempo de Fin</th><th>Tiempo de retorno</th><th>Tiempo de espera</th></tr></thead>";
    let tBody = "<tbody>";
    data.forEach(element => {
        tBody += "<tr><td>" + element.name + "</td>";
        tBody += "<td>" + element.time + "</td>";
        tBody += "<td>" + element.processingTime + "</td>";
        tBody += "<td>" + element.startTime + "</td>";
        tBody += "<td>" + element.CompletionTime + "</td>";
        tBody += "<td>" + (element.CompletionTime - element.time) + "</td>";
        tBody += "<td>" + element.waitTime + "</td></tr>";
    });
    document.getElementById("summaryTable").innerHTML = thead + tBody;
}

let mychart = new Chart(Processchart, {
    type: 'bar',
    data: {

    },
    options: {
        indexAxis: 'y',
        layout: {
            padding: 0
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Linea de ejecución',
            }
        },
        responsive: true,
        scales: {
            y: {
                stacked: true,
                // barThickness: 5,
            },
            // x: {
            //     barThickness: 5
            // },
            // yAxes: [{

            //     // categorySpacing: 0,
            //     // barPercentage: 0.5
            //     //
            // }],
            // xAxes: [{
            //         barThickness: 5,
            //     }]
            // x: {
            //     stacked: true,
            // },

        },
        elements: {
            bar: {
                borderWidth: 2,
            }
        },
    }
});