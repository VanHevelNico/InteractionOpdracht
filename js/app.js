let province = "WestVlaanderen";
let color = "";
let htmlHospValues, htmlCasValues, htmlIcon, htmlIconTitle, htmlSuggestions, htmlInput;

//TODO: Knopjes visited enzo aanpassen aan situatie, graph, zokefunctie maken , beetje css

const getTests = async (days, province) => {
    //const endpointHosp = `https://epistat.sciensano.be/Data/COVID19BE_HOSP.json`;
    const endpointTest = `https://epistat.sciensano.be/Data/COVID19BE_tests.json`;
    //const hospData = await getData(endpointHosp);
    const testData = await getData(endpointTest);
    
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    todayString = yyyy + '-' + mm + '-' + dd;
    console.log(todayString);

    let prevDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
    dd = String(prevDate.getDate()).padStart(2, '0');
    mm = String(prevDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    yyyy = prevDate.getFullYear();
    prevDate = yyyy + '-' + mm + '-' + dd;
    console.log(prevDate);

    try {
        let dataset = [];
        let labels = [];
        testData.forEach(element => {
            if(prevDate <= element.DATE && province == element.PROVINCE) {
                dataset.push(element.TESTS_ALL_POS);
                labels.push(element.DATE);
            }
        });
        console.log(dataset);
        console.log(labels);
        fillChart(labels,dataset,"Cases");
    }
    catch (ex) {   
        console.log("Error:",ex);   
    }   
}   

const getKeyData = async (province) => {
    const endpointHosp = `https://epistat.sciensano.be/Data/COVID19BE_HOSP.json`;
    const endpointTest = `https://epistat.sciensano.be/Data/COVID19BE_tests.json`;
    const hospData = await getData(endpointHosp);
    const testData = await getData(endpointTest);

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    todayString = yyyy + '-' + mm + '-' + dd;
    console.log(todayString);

    let prevDate = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    dd = String(prevDate.getDate()).padStart(2, '0');
    mm = String(prevDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    yyyy = prevDate.getFullYear();
    prevDate = yyyy + '-' + mm + '-' + dd;
    console.log(prevDate);

    console.log(testData);

    try {
        let cases = 0;
        testData.forEach(element => {
            if(prevDate == element.DATE && province == element.PROVINCE) {
                cases += element.TESTS_ALL_POS;
            }
        });
        htmlCasValues.innerHTML = "+ " + cases; 

        let hosp = 0;           
        hospData.forEach(element => {
            if(prevDate == element.DATE && province == element.PROVINCE) {
                hosp += element.NEW_IN;
            }
        });
        htmlHospValues.innerHTML = "+ " + hosp;              

        if(hosp < 15 && cases < 200)  {
            //groen
            color = `var(--global-color-beta)`;
            htmlIconTitle.style.color = color;
            htmlIcon.style.fill = color;
            htmlIconTitle.innerHTML = "Code groen";
        }
        else if (hosp <15 || cases <200){
            //oranje
            color = `var(--global-color-orange)`;
            htmlIconTitle.style.color = color;
            htmlIcon.style.fill = color;
            htmlIconTitle.innerHTML = "Code oranje";

        }
        else {
            //rood
            color = `var(--global-color-red-dark)`;
            htmlIconTitle.style.color = color;            
            htmlIcon.style.fill = color;
            htmlIconTitle.innerHTML = "Code rood";

        }
        //Als hospitalisaties < 10 en cases < 50 groen als 1 v/d 2 niet goed oranje, anders rood
    }
    catch (ex) {   
        console.log("Error:",ex);   
    }   
}

const fillChart = (labels,dataset,title) => {
    //todo: colors aanpssen aan de huidige situatie
    color = 'rgba(15, 47, 87, 1)';
    colorbg = 'rgba(15, 47, 87, 0.2)';
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: dataset,
                backgroundColor: [
                    colorbg,
                ],
                borderColor: [
                    color,
                ],
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                tension: {
                    duration: 1000,
                    easing: 'easeInOutCubic',
                    from: 1,
                    to: 0,
                    loop: true
                }
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: '#D2D3DA'
                }
            },    
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: '#D2D3DA',
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#D2D3DA',
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

const searchBar = () => {
    //Provincies ophalen
    //Onclick op de input moet er gekeken worden
    //Onpress list item invullen in de input en de nieuwe data ophalen
    const provinces = ["Antwerpen","Brussels","Liège","Limburg","OostVlaanderen","VlaamsBrabant","BrabantWallon","WestVlaanderen","Hainaut","Namur","Luxembourg"];
    provinces.forEach(element => {
        htmlSuggestions.innerHTML += `<li><a class="c-suggestions__sugest js-search-button" data-province="` + element + `" href="#">` + element + `</a></li>`
    });
    const buttons  = document.querySelectorAll(".js-search-button");
    for(const btn of buttons) {
      btn.addEventListener("click",function() {
        htmlSuggestions.style.display = "none";
        const selectedProvince = this.getAttribute('data-province');
        province = selectedProvince;
        console.log(province);
        getKeyData(province);
        getTests(14,province)
        htmlInput.value = province;
      });
    }
    htmlInput.addEventListener('input', function() {
        let filter, ul, li, a, i, txtValue;
        filter = htmlInput.value.toUpperCase();
        ul = document.querySelector(".js-suggestions");
        li = ul.getElementsByTagName("li");
        if(filter.length > 1) { 
            htmlSuggestions.style.display = "block";
            htmlInput.style.borderRadius = "1rem 1rem 0 0" ;

        } else {
            htmlSuggestions.style.display = "none";
        }

        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";

            } else {
                li[i].style.display = "none";
                htmlInput.style.borderRadius = "1rem";
            }
            }
    });
}

const getData = (endpoint) => {   
    return fetch(endpoint)   
        .then((r) => r.json())
        .catch((error) => {
            console.log(error.response.data);
            return {error: error};
        });
}

listenToChartButtons = function() {
    const buttons  = document.querySelectorAll(".js-chart__button");
    for(const btn of buttons) {
      btn.addEventListener("click",function() {
        const days = this.getAttribute('data-chart-days');
        getTests(days,province);
      });
    }
}

const init = function() {
    htmlCasValues = document.querySelector(".js-casValues");
    htmlHospValues = document.querySelector(".js-hospValues");
    htmlIcon = document.querySelector(".js-icon");
    htmlIconTitle = document.querySelector(".js-icon-title");
    htmlSuggestions = document.querySelector(".js-suggestions");
    htmlInput = document.querySelector(".js-input");
    console.log("Document loaded");
    listenToChartButtons();
    getTests(14,province);
    getKeyData(province);
    searchBar();
    htmlSuggestions.style.display = "none";
    htmlInput.value = province;
    htmlInput.style.borderRadius = "1rem";

}

document.addEventListener("DOMContentLoaded", init);