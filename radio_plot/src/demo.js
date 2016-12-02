d3.csv("/data/2015-Q3/HealthyRideStations2015.csv", function(stations) {
    d3.csv("/data/2015-Q3/HealthyRide_Rentals_2015_Q3.csv",function(records){
//        console.log(stations);
//        console.log(records);
        for(var i in stations){
            stations[i].counts = [];
        }

        for(var i in records){
            var station = jQuery.grep(stations, function(st){ return st.StationNum === records[i]["From station id"]; })[0];
            var date = records[i]["Starttime"].split(" ")[0];
            if(station.counts === undefined){
                console.log(records[i]);
                continue;
            }
            var cLen = station.counts.length;
            if(cLen === 0 || station.counts[cLen-1].time != date){
                station.counts.push({time:date,count:0});
                cLen++;
            }else if(station.counts[cLen-1].time === date){
                station.counts[cLen-1].count++;
            }
        }
       
       var demoStation = stations[0];
       var max = 0;
       demoStation.counts.forEach(function(d){
           if(d.count > max){
               max = d.count;
           }
       });
       console.log(demoStation);
       var week = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
       var chart1 = circularHeatChart()
                    .accessor(function(d1) {return d1.count;})
                    .segmentHeight(10)
                    .innerRadius(20)
                    .numSegments(7)
                    .domain([0,max])
                    .range(['black', '#24FD95'])
                    .segmentLabels(week);
                
                d3.select('#chart1')
                    .selectAll('svg')
                    .data([demoStation.counts])
                    .enter()
                    .append('svg')
                    .call(chart1);

    });
});