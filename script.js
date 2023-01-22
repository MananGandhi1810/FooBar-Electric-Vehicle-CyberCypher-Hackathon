function compareEVPetrol () {
  console.log('compareEVPetrol')
  var distance = document.getElementById('distance').value
  var yearlyDistance = distance * 365
  var petrolPrice = document.getElementById('price').value
  var mileage = document.getElementById('mileage').value
  var range = document.getElementById('range').value
  var batteryCapacity = document.getElementById('batterycapacity').value
  var electricityPrice = document.getElementById('electricityprice').value
  var costPerKm = petrolPrice / mileage
  var costPerKmElectric = (batteryCapacity * electricityPrice) / range
  var totalCost = costPerKm * yearlyDistance
  var totalCostElectric = costPerKmElectric * yearlyDistance
  var difference = totalCost - totalCostElectric
  console.log('yearlyDistance: ' + yearlyDistance)
  console.log('petrolPrice: ' + petrolPrice)
  console.log('mileage: ' + mileage)
  console.log('range: ' + range)
  console.log('batteryCapacity: ' + batteryCapacity)
  console.log('electricityPrice: ' + electricityPrice)
  console.log('costPerKm: ' + costPerKm)
  console.log('costPerKmElectric: ' + costPerKmElectric)
  console.log('totalCost: ' + totalCost)
  document.getElementById('electricVehicleCost').innerText =
    totalCostElectric.toFixed(0)
  document.getElementById('petrolVehicleCost').innerText = totalCost.toFixed(0)
  if (difference) {
    document.getElementById('result').classList.remove('hidden')
  }
}

function getAnEV () {
  var http = new XMLHttpRequest()
  var url = 'https://foobar.centralindia.cloudapp.azure.com/api/v1/search'
  http.open('POST', url)
  var resp = ''
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  var budget = document.getElementById('budget-dropdown').value
  var bodystyle = document.getElementById('type-dropdown').value
  var seats = document.getElementById('capacity-dropdown').value

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      resp = http.responseText
      console.log(resp)
      var json = JSON.parse(resp)
      console.log(json)
      if (json.length !== {}) {
        document.getElementById('evs').innerHTML = ''
        for (const car in json) {
          document.getElementById('evs').innerHTML += `<div class="card">
        <div class="card-img">
            <img src="${json[car][1]}" alt="car" class="img-fluid">
        </div>
        <div class="card-info">
          <p class="text-title">${car}</p>
        </div>
        <div class="card-footer">
        <span class="text-title">${json[car][0]}</span>
      </div></div>`
        }
      } else {
        document.getElementById('evs').innerHTML = 'No Cars Found'
      }
    }
  }
  http.send(
    JSON.stringify({ budget: budget, bodystyle: bodystyle, seats: seats })
  )
}
