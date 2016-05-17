'use strict';
(function(data, d3) {

    var scaleLinear = function(values) {
        return d3.scale.linear()
            .domain([values.startDomain, values.endDomain])
            .range([values.startRange, values.endRange]);
    };

    var timeScale = function(values) {
        return d3.time.scale()
            .domain([values.startDomain, values.endDomain])
            .range([values.startRange, values.endRange]);
    };

    var max = function(value, prop) {
        return d3.max(value, function(d) {
            return prop ? d[prop] : d;
        });
    };

    var min = function(value, prop) {
        return d3.min(value, function(d) {
            return prop ? d[prop] : d;
        });
    };

    var formatDate = function(strFormat) {
        return d3.time.format(strFormat);
    };

    var lineFunction = function(values) {

        var x = values.getX;
        var y = values.getY;
        var Vx = values.x;
        var Vy = values.y;

        return d3.svg.line()
            .x(function(d) {
                return x(d[Vx]);
            })
            .y(function(d) {
                return y(d[Vy]);
            });
    };

    var axis = function(prop, orient, ticks) {
        ticks = ticks || 10;
        return d3.svg.axis()
            .scale(prop)
            .ticks(ticks)
            .orient(orient);
    };

    var renderLineChart = function(values) {

        var container = d3.select(values.container);
        var svg = container.append('svg')
            .attr('width', values.outerWidth)
            .attr('height', values.outerHeigth);

        var lineCont = svg.append('g')
            .attr('transform', 'translate(' + values.marginL + ',' + values.marginT + ')');

        // path
        lineCont.append('path')
            .datum(values.data)
            .attr('class', 'line')
            .attr('d', lineFunction(values));

        lineCont.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + values.height + ')')
            .call(axis(values.getX, 'bottom', 5));

        lineCont.append('g')
            .attr('class', 'y axis')
            .call(axis(values.getY, 'left'));

    };

    var init = function(datum) {

        datum = datum.map(function(item) {
            var fd = formatDate('%d-%b-%y');
            return {
                close: item.close,
                date: fd.parse(item.date)
            };
        });

        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 50
            },
            outerWidth = 660,
            outerHeigth = 300;

        var width = outerWidth - margin.left - margin.right;
        var height = outerHeigth - margin.top - margin.bottom;

        var x = timeScale({
            startDomain: min(datum, 'date'),
            endDomain: max(datum, 'date'),
            startRange: 0,
            endRange: width
        });

        var y = scaleLinear({
            startDomain: min(datum, 'close'),
            endDomain: max(datum, 'close'),
            startRange: height,
            endRange: 0
        });

        renderLineChart({
            container: '#root',
            marginL: margin.left,
            marginT: margin.top,
            outerWidth: outerWidth,
            outerHeigth: outerHeigth,
            height: height,
            width: width,
            data: datum,
            x: 'date',
            y: 'close',
            getX: x,
            getY: y
        });
    };

    init(data);

}([{ date: '24-Apr-07', close: 93.24 },
    { date: '25-Apr-07', close: 95.35 },
    { date: '26-Apr-07', close: 98.84 },
    { date: '27-Apr-07', close: 99.47 },
    { date: '28-Apr-07', close: 100.89 },
    { date: '29-Apr-07', close: 102.89 },
    { date: '30-Apr-07', close: 105.45 },
    { date: '1-May-07', close: 113.75 },
    { date: '2-May-07', close: 114.13 },
    { date: '3-May-07', close: 115.25 },
    { date: '4-May-07', close: 116.35 },
    { date: '5-May-07', close: 104.00 }
], window.d3));
