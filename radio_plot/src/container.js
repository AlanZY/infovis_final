d3.csv("/radio_plot/data/station_name.csv", function(stations) {
    var season = [
        "2015 Q3",
        "2015 Q4",
        "2016 Q1",
        "2016 Q2",
        "2016 Q3"
    ];
    var stOpt = d3.select('#bar')
    .append('select')
        .attr('id','stOpt')
        .on('change',change)

    var count=0;    
    var options = stOpt
    .selectAll('option')
        .data(stations).enter()
        .append('option')
            .attr('value',function(d){return count++;})
            .text(function (d) { return d.id+" "+d.name; });
    
    var seasonOpt = d3.select('#bar')
    .append('select')
        .attr('id','seasonOpt')
        .on('change',change)

    options = seasonOpt
    .selectAll('option')
        .data(season).enter()
        .append('option')
            .attr('value',function(d){return d.replace(" ","_")})
            .text(function (d) { return d });

    draw(0,"2015_Q3");
});    

    function change() {
        var id = d3.select('#stOpt').property('value');
        var season = d3.select('#seasonOpt').property('value')
        console.log(id);
        console.log(season);

        d3.select("svg").remove();
/*
        var bars = d3.selectAll(".circular-heat");
        var labels = d3.selectAll(".labels");
        bars.remove();
        labels.remove();
 */       draw(id,season);
    };
