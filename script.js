const form = document.querySelector('form');
const inputField = document.querySelector('input#city');
const responseDiv = document.querySelector('div.response');




form.addEventListener('submit', function(event) {

    const weatherData = {
        Date: new Date(),
        CityName:'',
        TempMin:'',
        TempMax:'',
        Text:'',
    }

    event.preventDefault();
    const cityName = inputField.value;
    const endpoint = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=6Xgg5HgYSSjmARcMmmmHQsAnw8ugSUFM&q=${cityName}`

    function consultaApi(endpoint) {
        fetch(endpoint)
            .then(responseObject => {
                const jsonPromise = responseObject.json();
                console.log(jsonPromise);
                return jsonPromise
            })
            .then(jsData => {
                console.log(jsData);
                const cityKey = jsData[0].Key;
                weatherData.CityName = jsData[0].LocalizedName;

                fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityKey}?apikey=6Xgg5HgYSSjmARcMmmmHQsAnw8ugSUFM&metric=true&language=en`)
                    .then(responseObject => {
                        const jsonPromise = responseObject.json();
                        console.log(jsonPromise);
                        return jsonPromise
                    })
                    .then(jsData => {
                        console.log(jsData);
                        weatherData.TempMax = jsData.DailyForecasts[0].Temperature.Minimum.Value;
                        weatherData.TempMin = jsData.DailyForecasts[0].Temperature.Maximum.Value;
                        weatherData.Text = jsData.Headline.Text;
                        console.log(weatherData);

                        responseDiv.innerHTML = `
        <div class="card mx-auto" style="width: 22rem;">
            <div class="card-body">
                <h5 class="card-title">Weather in ${weatherData.CityName}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${weatherData.Date}</h6>
                <p class="card-text">${weatherData.Text}</p>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Minimum Temperature: ${weatherData.TempMin} &#8451;</li>
                    <li class="list-group-item">Maximum Temperature: ${weatherData.TempMax} &#8451;</li>
                </ul>
            </div>
        </div>`
                    })
                    .catch(error => {
                        alert('Something isnt working with api request - 1')
                    })
                })

            .catch(error => {
                alert('Something isnt working with api request - 2')
            })
    }
    consultaApi(endpoint);
})