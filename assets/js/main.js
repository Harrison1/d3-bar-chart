$(document).ready(function() {
    $('select').selectpicker({
        style: 'btn-info'
    });
    setChart('AFG');
    $('.name-container').text('Afghan');
    $('select').change(function() {
        var st = $(this).find('option:selected').attr('data-abv');
        $('.name-container').text($(this).find('option:selected').attr('data-name'));
        setChart(st);
    });
    function setChart(state) {
        clearCanvas();
        $.get('data/' + state + '.json', function(data) {
            var sdata = [];
            $.each(data, function(index, value) {
                    var entry = [];
                    entry.push(value['Ancestry']);
                    entry.push(value['percapita']);
                    entry.push(value['State']);
                    sdata.push(entry);
            });
            chart('chart_to', sdata);
        });
    }
    function clearCanvas() {
        $('#container_to').html(' ');
        $('#container_to').html('<div id="chart_to"></div>');
    }
    function chart(name, data) {
        clearCanvas();
        data.sort(function(a, b) {
            return b[1] - a[1];
        });
        var chart = document.getElementById(name),
            axisMargin = 20,
            margin = 0,
            valueMargin = 4,
            width = $('#container_to').width()-35,
            height = 800,
            barHeight = 12,
            barPadding = 12,
            data, bar, svg, xAxis, labelWidth = 0, max = 0, min = 0, scale = '',
            height = (39*(barHeight+barPadding))+valueMargin+5;
            sum = 0,
            sums = 0;
        for (var i = 0; i < data.length; i++) {
            sums += data[i][1] << 0;
        }
        var rmax = parseFloat(data[0][1]);

        max = d3.max(data.map(function(i) {
            return parseFloat(i[1]);
        }));
        min = d3.min(data.map(function(i) {
            return parseFloat(i[1]);
        }));
        svg = d3.select(chart)
            .append("svg")
            .attr("width", width-50)
            .attr("height", height);

        bar = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");
        bar.attr("class", "bar-to")
            .attr("cx", 0)
            .attr("transform", function(d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });
        bar.append("text")
            .attr("class", "label")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function(d) {
                return d[2];
            }).each(function() {
                labelWidth = Math.ceil(Math.max(labelWidth, (this.getBBox().width) + 5));
            }).attr("font-family", "sans-serif");


        scale = d3.scale.linear()
            .domain([0, rmax])
            .range([1, width-labelWidth]);

        
        bar.append("rect")
            .attr("transform", "translate(" + labelWidth + ", 0)")
            .attr("height", barHeight)
            .attr("width", function(d) {                    
                return scale(parseFloat(d[1]));
            });
        bar.append("text")
            .attr("transform", "translate(" + labelWidth + ", 0)")
            .attr("class", "percent-label")
            .attr("y", barHeight / 2)
            .attr("x", function(d){
                    return scale(parseFloat(d[1]))+6;
            })
            .attr("dy", ".35em")
            .text(function(d) {
                return d[1].toFixed(2);
            });

        var div = d3.select("body").append("div").attr("class", "toolTip");

        bar.on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");
                div.html("In " + d[2] + " there are " + d[1].toFixed(2) + " people, per 10K residents, who report " + d[0] + " as their ancestry");
            });
        bar.on("mouseout", function(d){
                div.style("display", "none");
            });
        }
    $(window).resize(function() {
        if ($(window).width() < 1024) {
            var st = $('#accident_state').find('option:selected').attr('data-abv');
            // if(d=='') {setChart(st);}
        }
    });
});
