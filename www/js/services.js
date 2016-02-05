'use strict';

/* Notes on forecast.io's API:
 *  - daily.data[0] is today
 */

weatherApp.constant('FORECASTIO_KEY', '74f28a5eb37ac7f45ca31633870c57b0');

/* weatherStore holds data for weatherData service.
 */
weatherApp.factory('weatherStore', function() {
    var weatherStore = {
	current : {}
    };

    return weatherStore;
});

/* weatherData service gets weather data (current, forecasts, and
 * historical), processes it as necessary, and provides it to controllers.
 */
weatherApp.service('weatherData', ['$q', '$resource', '$http',
				   'FORECASTIO_KEY', 'weatherStore', '$filter',
    function($q, $resource, $http, FORECASTIO_KEY, weatherStore, $filter) {
	this.getCurrentWeather = function(lat, lng) {
	    var url = 'https://api.forecast.io/forecast/'
		+ FORECASTIO_KEY + "/" + lat + ',' + lng;

	    // JSONP is only needed for "ionic serve".
	    // Simpler $http.get(url) works on devices.
	    return $http.jsonp(url + '?callback=JSON_CALLBACK').then(
		function success(resp) {
		    weatherStore.current = resp.data;
		    console.log('GOT CURRENT');
		    console.dir(weatherStore.current);
		},
		function failure(error) {
		    alert('Unable to get current conditions');
		    console.error(error);
		});
	};

  this.getLocation = function() {
      return $q(function(resolve, reject) {
          navigator.geolocation.getCurrentPosition(function(position) {
              resolve({
                  latitutde: position.coords.latitude,
                  longitude: position.coords.longitude
              });
          }, function(err) {
              reject(err);
          });
      });
  };

	// TODO: move roundTemp into controller, since it is part of
	// presentation, not weather data.

	// Round temp to tenths of a degree.
	this.roundTemp = function(temp) {
	    if (Math.abs(temp) >= 10) {
		return temp.toPrecision(2);
	    } else {
		return temp.toPrecision(1);
	    }
	};

	//Return current temperature
	this.tempNow = function() {
	    return this.roundTemp(weatherStore.current.currently.temperature);
	};
		
	//Return current wind speed
	this.windSpeed = function() {
		return this.roundTemp(weatherStore.current.currently.windSpeed);
	}
	
	//Returns current weather summary
	this.summary = function() {
		return weatherStore.current.currently.summary;
	}
	
	//Returns current humidity
	this.humidity = function() {
		return weatherStore.current.currently.humidity;
	}
			
	//Returns daily icon
	this.getIcon = function() {
		return weatherStore.current.daily.icon;
	};
			
	//Changes icon name into an icon picture
	this.icon = function(iconNum) {
		if (!iconNum){
			iconNum = 0;
		}
		return weatherStore.current.daily.data[iconNum].icon;
	};
	
	// Return Saturday's high temperature
	this.tempHigh = function(highNum) {
		if (!highNum) {
			highNum = 0;
		}
	    return	this.roundTemp(weatherStore.current.daily.data[highNum].temperatureMax);
	};
			
// Return Saturday's low temperature
	this.tempLow = function(lowNum) {
		if (!lowNum) {
			lowNum = 0;
		}
	    return this.roundTemp(weatherStore.current.daily.data[lowNum].temperatureMin);
	};
			
//Andrew Ware helped write this function
//Gets today's day of the week
	this.currentDay = function(dayNum) {
		if (!dayNum) {
			dayNum = 0;
		}
		var todayTime = weatherStore.current.daily.data[dayNum].time;
		return $filter('date')(todayTime * 1000, 'EEEE');
	}
	  	
			
//	this.tempToMidnightLow = function() {
//	    var low = this.tempNow();
//	    var start = this.findHourNow();
//	    var end = this.findHourMidnight();
//	    if (start >= 0 && end >= 0) {
//		for (var i = start; i <= end; i++) {
//		    low = Math.min(low,
//				   weatherStore.current.hourly.data[i].temperature);
//		}
//	    }
//
//	    return this.roundTemp(low);
//	};

	// Return the index into hourly of the hour, if any, which
	// contains time (unix time in sec).  Return -1 if not found.
	// Assume the time in hourly.data is the start of the hour.
	this.findHour = function(time) {
	    var i = 0;
	    while (i < weatherStore.current.hourly.data.length &&
		   weatherStore.current.hourly.data[i].time > time) {
		i++;
	    }
	    if (i < weatherStore.current.hourly.data.length) {
		return i;
	    } else {
		return -1;
	    }
	};

	// Return findHour() (i.e., index into hourly) for current time.
	this.findHourNow = function() {
	    return this.findHour(Date.now() / 1000); // millisec -> sec
	};

	// Return findHour() (i.e., index into hourly) for 11:50pm today.
	this.findHourMidnight = function() {
	    var d = new Date();
	    d.setHours(23);
	    d.setMinutes(50); // 11:50pm today
	    return this.findHour(d.getTime() / 1000); // millisec -> sec
	};
    }]);

weatherApp.factory('LocationStore', function() {
    //create location store with default values
    var LocationStore = {
        city:       'Wenham',
        latitude:   42.589611,
        longitude:  -70.819806
    };

    return LocationStore;
});
