function processing(stations,records,id){
    for(var i in stations){
            stations[i].counts = [];
        }
        var format = d3.time.format("%m/%d/%Y");
        var dayNameFormat = d3.time.format("%A");
        
        for(var i=0;i<records.length;i++){
            var station = jQuery.grep(stations, function(st){ return st.id === records[i]["From station id"]; })[0];

            var datestr = records[i]["Starttime"].split(" ")[0];
            var date = format.parse(datestr);

            var weekDay = dayNameFormat(date);
//            console.log(weekDay);

            if(station === undefined){
                console.log(records[i]);
                continue;
            }
            var cLen = station.counts.length;
            if(cLen === 0 || station.counts[cLen-1].datestr != datestr){
                if(cLen!==0){
                    var dif;
                    while((dif = daysBetween(station.counts[cLen-1].date,date))>=2 ){
                        var nextDate = station.counts[cLen-1].date;
                        nextDate.setDate(nextDate.getDate() +1);
                        var nextDateStr = format(nextDate);
//                        console.log("record day: "+datestr+" current count day: "+nextDateStr);
                        var nextDateWeek = dayNameFormat(nextDate);
                        station.counts.push({date:nextDate,datestr:nextDateStr,week:nextDateWeek,count:0});
                    }
                }
                station.counts.push({date:date,datestr:datestr,week:weekDay,count:0});
                cLen++;     
            }
            if(station.counts[cLen-1].datestr === datestr){
                station.counts[cLen-1].count++;
            }
        }

        return stations[id];
}

function draw(stationID,season){
    var file = "/radio_plot/data/Healthy_Ride_Rentals_"+season+".csv";
    d3.csv("/radio_plot/data/station_name.csv", function(stations) {
        d3.csv(file,function(records){
            document.getElementById("head1").innerHTML = "The Radio Plot for "+stations[stationID].name + " in "+season;
            var targetStation = processing(stations,records,stationID);
//            console.log(targetStation);
            var week = [];
            for(var i in targetStation.counts){
                var c = targetStation.counts[i];
                var len = week.length;
                if(len === 7){
                    break;
                }else{
                    var weekDay = c.week;
                    if(weekDay !== week[len-1] || len === 0 ){
                        week.push(weekDay);
                    }
                }
            }
//            console.log(week);
            var chart1 = circularHeatChart()
                            .accessor(function(d1) {return d1.count;})
                            .segmentHeight(20)
                            .innerRadius(20)
                            .numSegments(7)
                            .domain([0,50])
//                            .range(['black', '#24FD95'])
                            .segmentLabels(week);
                        
                        d3.select('#char')
                            .selectAll('svg')
                            .data([targetStation.counts])
                            .enter()
                            .append('svg')
                            .call(chart1);

            d3.selectAll("#char path")
            .on('mouseover', show);
        });
    });
}

function daysBetween( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

function show(d){
   document.getElementById('info').innerHTML = "Date: "+d.datestr+" rent out: "+d.count;
//    console.log(d);
}