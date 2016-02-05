/* This simple app has only one view, and so only one controller.
 * Its job is to provide data (from the weatherData service) for display
 * by the html page (index.html).
 */
 weatherApp.controller('MainCtrl',
     function($scope,$state,weatherData,LocationStore) {
 	//read default settings into scope
 	console.log('inside home');
 	$scope.city  = LocationStore.city;
 	var latitude  =  LocationStore.latitude;
 	var longitude = LocationStore.longitude;

 	//call getCurrentWeather method in factory
  var weatherInit = function(lat, lng) {
      weatherData.getCurrentWeather(latitude,longitude).then(function () {
				$scope.tempCurrent = weatherData.tempNow();
				$scope.summary = weatherData.summary();
				$scope.humidity = weatherData.humidity();
				$scope.wind = weatherData.windSpeed();
				$scope.icon = weatherData.icon();
				
//Sets today day of the week name
//at the beginning of the weekly forecast.
				$scope.currentDay1 = weatherData.currentDay(1);
				$scope.currentDay2 = weatherData.currentDay(2);
				$scope.currentDay3 = weatherData.currentDay(3);
				$scope.currentDay4 = weatherData.currentDay(4);
				$scope.currentDay5 = weatherData.currentDay(5);
				$scope.currentDay6 = weatherData.currentDay(6);
				$scope.currentDay7 = weatherData.currentDay(7);
//Weekly High and lows
				$scope.tempDayHigh = weatherData.tempHigh(0);
				$scope.tempDayLow = weatherData.tempLow(0);
				//day 1
				$scope.tempDay1High = weatherData.tempHigh(1);
				$scope.tempDay1Low = weatherData.tempLow(1);
				//day 2
				$scope.tempDay2High = weatherData.tempHigh(2);
				$scope.tempDay2Low = weatherData.tempLow(2);
				//day 3
				$scope.tempDay3High = weatherData.tempHigh(3);
				$scope.tempDay3Low = weatherData.tempLow(3);
				//day 4
				$scope.tempDay4High = weatherData.tempHigh(4);
				$scope.tempDay4Low = weatherData.tempLow(4);
				//day 5
				$scope.tempDay5High = weatherData.tempHigh(5);
				$scope.tempDay5Low = weatherData.tempLow(5);
				//day 6
				$scope.tempDay6High = weatherData.tempHigh(6);
				$scope.tempDay6Low = weatherData.tempLow(6);
				//day 7
				$scope.tempDay7High = weatherData.tempHigh(7);
				$scope.tempDay7Low = weatherData.tempLow(7);
				
				
					
	//Returns current day of the week
			$scope.currentDay = weatherData.currentDay();
				
     	});
  };

  weatherData.getLocation() // getLocation returns the position obj
      .then(function(position) {
          weatherInit(position.latitutde, position.longitude);
      }, function(err) {
         	console.log(err);
          weatherInit(latitude, longitude);
      });

});
