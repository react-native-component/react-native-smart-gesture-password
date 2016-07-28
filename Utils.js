//02-2, 35-2, 68-2 y1=y2 && x1-x2=|6 * outerRadius|  gap=1
//06-6, 17-6, 28-6 x1=x2 && y1-y2=|6 * outerRadius|  gap=3
//08-8,            x1-x2=|6 * outerRadius| && y1-y2=|6 * outerRadius|  gap=4
//26-4             x1-x2=|6 * outerRadius| && y1-y2=|6 * outerRadius|  gap=2

function getLineDistance (start, end) {
    return Math.sqrt(Math.pow(Math.abs(start.x - end.x), 2) + Math.pow(Math.abs(start.y - end.y), 2))
}

export function isPointInPath (location, origin, radius) {
    return radius > getLineDistance(location, origin)
}

export function getLineTransform (start, end) {
    let distance = getLineDistance(start, end)
    let rotateRad = Math.acos((end.x - start.x) / distance)
    if (start.y > end.y) {
        rotateRad = Math.PI * 2 - rotateRad
    }

    let translateX = (end.x + start.x) / 2 - start.x - distance / 2
    let translateY = (end.y + start.y) / 2 - start.y

    return {
        distance,
        rotateRad,
        translateX,
        translateY,
    }
}

export function getArrowTransform (start, end, width, borderWidth, vertexDeg) {
    let distance = getLineDistance(start, end)
    let rotateRad = Math.acos((end.x - start.x) / distance)
    if (start.y > end.y) {
        rotateRad = Math.PI * 2 - rotateRad
    }
    let origin = {
        x: start.x + Math.cos(rotateRad) * width * 2,
        y: start.y + Math.sin(rotateRad) * width * 2,
    }

    let vertexRad = vertexDeg / 2 * 2 * Math.PI / 360
    let translateX = -borderWidth
    let translateY = -borderWidth
    if(start.x == end.x) {
        if(end.y > start.y) {
            translateY = -borderWidth / 2
        }
        else {
            translateY = -borderWidth * 1.5
        }
    }
    else if(start.y == end.y) {
        if(end.x > start.x) {
            translateX = -borderWidth / 2
        }
        else {
            translateX = -borderWidth * 1.5
        }
    }
    else {
        if( start.x > end.x && start.y > end.y) {
            translateX = - Math.sqrt(Math.pow(borderWidth * 2.5, 2)) / 2
            translateY = - Math.sqrt(Math.pow(borderWidth * 2.5, 2)) / 2
        }
        else if(start.x > end.x && end.y > start.y) {
            translateX = - Math.sqrt(Math.pow(borderWidth * 2.5, 2)) / 2
            translateY = - Math.sqrt(Math.pow(borderWidth * 1.5, 2)) / 2
        }
        else if(end.x > start.x && start.y > end.y) {
            translateX = - Math.sqrt(Math.pow(borderWidth * 1.5, 2)) / 2
            translateY = - Math.sqrt(Math.pow(borderWidth * 2.5, 2)) / 2
        }
        else {
            translateX = - Math.sqrt(Math.pow(borderWidth * 1.5, 2)) / 2
            translateY = - Math.sqrt(Math.pow(borderWidth * 1.5, 2)) / 2
        }
    }

    return {
        origin,
        rotateRad,
        translateX,
        translateY,
    }
}

export function getPassword (sequence) {
    return sequence.join('')
}

export function getCrossPoint (points, lastPoint, currentPoint, radius) {

    if (lastPoint.index == 4 || currentPoint.index == 4) {
        return null
    }
    let x1 = lastPoint.origin.x
    let y1 = lastPoint.origin.y
    let x2 = currentPoint.origin.x
    let y2 = currentPoint.origin.y
    let crossLineLength = 6 * radius
    if (( y1 == y2 && Math.abs(x1 - x2) == crossLineLength)
        || ( x1 == x2 && Math.abs(y1 - y2) == crossLineLength)
        || ( Math.abs(x1 - x2) == crossLineLength && Math.abs(y1 - y2) == crossLineLength )) {
        let crossPointIndex = (lastPoint.index + currentPoint.index) / 2
        return points[ crossPointIndex ]
    }
    return null
}