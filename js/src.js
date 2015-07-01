window.showIntersections = function(intersectingLines) {
  intersectingLines.forEach(function(line) {
    var points = line.intersection.points;
    appendCircle(points[0]);
  });
};

window.pathToPoints = function(pathString) {
  var segments = pathString.split(/([clhvstqma][\d,.\s]+)/ig)
    .filter(function(segment) {
      return segment.length > 0;
    });

  var output = [];

  for (var i = 1; i < segments.length; i++) {
    var previousSegment = segments[i-1].slice(1);
    var prevPoint = previousSegment.split(',').slice(-2);

    var type = segments[i].slice(0,1);
    var currentSegment = segments[i].slice(1);
    var coords = currentSegment.split(/([\d\.]+,[\d\.]+),?/g)
      .filter(function(segment) {
        return segment.length > 0;
      });

    var points = [prevPoint].concat(coords.map(function(coord) {
      return coord.split(',');
    }));

    output.push({
      type: type,
      points: points.map(function(point) {
        return {
          x: point[0],
          y: point[1]
        };
      })
    });
  }

  return output;
};

window.calcIntersections = function(subjectPath, otherPath) {
  var pa = subjectPath.points,
      pb = otherPath.points,
      result = [];

  for (var i = 0; i < pa.length-1; i++) {
    for (var j = 0; j < pb.length-1; j++) {
      var intersection = Isx.intersectLineLine(pa[i], pa[i+1], pb[j], pb[j+1]);
      if (intersection.status === 'Intersection') {
        result.push({
          fullPath: otherPath,
          points: [pb[j], pb[j+1]],
          intersection: intersection
        });
      }
    }
  }
  return result;
};

window.pathData = function(d) {
  var p = d.points;
  switch (d.type) {
  case 'T':
    return [
      'M', p[0].x, ' ', p[0].y,
      'T', p[1].x, ' ', p[1].y,
      ' ', p[2].x, ' ', p[2].y
    ].join('');
  case 'Q':
    return [
      'M', p[0].x, ' ', p[0].y,
      'Q', p[1].x, ' ', p[1].y,
      ' ', p[2].x, ' ', p[2].y
    ].join('');
  case 'C':
    return [
      'M', p[0].x, ' ', p[0].y,
      'C', p[1].x, ' ', p[1].y,
      ' ', p[2].x, ' ', p[2].y,
      ' ', p[3].x, ' ', p[3].y,
    ].join('');
  case 'L':
  default:
    var path = ['M'+p[0].x+','+p[0].y];

    p.slice(1).forEach(function(coord) {
      path.push('L'+coord.x+','+coord.y);
    });

    return path.join(' ');
  }
};

window.circle = function(d, idx) {
  return {
    label: elemLabel(d, idx),
    cx: d.cx,
    cy: d.cy
  }
};

window.elemLabel = function(d, idx) {
  return d.label || this.tagName + idx;
};

window.getAngle = function(pointA, pointB) {
  var dy = pointB.y - pointA.y;
  var dx = pointB.x - pointA.x;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  //theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  return theta;
};

window.appendCircle = function(datum) {
d3.select('svg g#intersections')
  .append('circle')
  .datum(datum)
  .classed('intersection', true)
  .attr({
    cx: function(d) {return d.x; },
    cy: function(d) {return d.y; },
    r: 5
  });
};

window.getClosestPoint = function(subject, start, end) {
  var thetaStart = subject.y - start.y;
  var thetaEnd = end.y - subject.y;

  if (thetaStart <= thetaEnd) {
    return start;
  } else {
    return end;
  }
};

window.transposePoint = function(point, angle, amount) {
  return {
    x: point.x + (Math.cos(angle) * amount),
    y: point.y + (Math.sin(angle) * amount),
  };
};

window.findIntersections = function(subject, obstacles) {
  return obstacles
    .reduce(function(memo, obstacle, idx) {
      return memo.concat(calcIntersections(subject, obstacle));
    }, [])
    .filter(function(line) {
      return line.intersection.status === 'Intersection';
    });
};

window.KLD = require('../node_modules/kld-intersections/index.js');
window.Isx = KLD.Intersection;
window.d3 = require('../node_modules/d3/d3.js');
window.jQuery = require('../node_modules/jquery/dist/jquery.js');
