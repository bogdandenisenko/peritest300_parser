
(function ($) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var canvasOffset = $("#canvas").offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var centerX = canvas.width/2;
    var centerY = canvas.height/2;

    var pi2 = Math.PI * 2;
    var resizerRadius = 8;
    var rr = resizerRadius * resizerRadius;
    var draggingResizer = {
        x: 0,
        y: 0
    };
    var imageX = 51;
    var imageY = -238;
    var imageWidth, imageHeight, imageRight, imageBottom;
    var draggingImage = false;
    var startX;
    var startY;
    var img;

    var mapCircle = [
        //{radius:314,width:22,color:{first:'red',second:'black'}},
        //{radius:292,width:24,color:{first:'green',second:'blue'}},
        //{radius:264,width:33,color:{first:'red',second:'black'}},
        //{radius:228,width:40,color:{first:'green',second:'blue'}},
        //{radius:185,width:46,color:{first:'red',second:'black'}},
        //{radius:136,width:50,color:{first:'green',second:'blue'}},
        //{radius:83,width:53,color:{first:'red',second:'black'}},
        //{radius:31,width:50,color:{first:'green',second:'blue'}}
    ];

    var imageMap = [];
    var dataMap = [];
    function polygon(ctx, x, y, radius, sides, startAngle, anticlockwise) {
      if (sides < 3) return;
      var a = (Math.PI * 2)/sides;
      a = anticlockwise?-a:a;
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(startAngle);
      ctx.moveTo(radius,0);
      for (var i = 1; i < sides; i++) {
        ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
        //console.log(radius*Math.cos(a*i),radius*Math.sin(a*i));
      }
      ctx.closePath();
      ctx.restore();
    }

    function findPos(obj) {
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    }

    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    $('#canvas').click(function(e) {
        var pos = findPos(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        var coord = "x=" + x + ", y=" + y;

        //console.log(x,y);
        dataMap.push({x:x,y:y});
        var c = this.getContext('2d');
        var p = c.getImageData(x, y, 1, 1).data;
        console.log(p);
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        $('#status').html(coord + "<br>" + hex);
    });

    $('#canvas').mouseout(function(e) {
        imageMap.push(dataMap);
        dataMap = [];
    });

    function saveToLocalStorage() {
        localStorage.setItem('imageMap',JSON.stringify(imageMap));
    }

    $('#save').click(saveToLocalStorage);

    function openFile(event) {
        var input = event.target;

        var reader = new FileReader();
        reader.onload = function(){

            img = new Image();
            img.src = reader.result;
            img.onload = function () {
                $("#canvas").bind('mousedown',handleMouseDown);
                $("#canvas").bind('mouseup',handleMouseUp);
                $("#canvas").bind('mouseout',handleMouseOut);
                imageWidth = img.width;
                imageHeight = img.height;
                imageRight = imageX + imageWidth;
                imageBottom = imageY + imageHeight;
                draw(true, false);
            };


        };
        reader.readAsDataURL(input.files[0]);
    }

    function unBindMouse() {
        $("#canvas").unbind('mousedown',handleMouseDown);
        $("#canvas").unbind('mouseup',handleMouseUp);
        $("#canvas").unbind('mouseout',handleMouseOut);
    }

    $('#unmouse').click(unBindMouse);

    function degreesToRadians (degrees) {
        return degrees * (Math.PI/180);
    }

    function ff() {
        ctx.moveTo(300,0);
        ctx.lineTo(293, 78)
    }

    function drawMap() {
        //for(var j = 0;j<mapCircle.length;j++) {
        //    var mapObj = mapCircle[j];
        //    for(var i=0;i<24;i++) {
        //        var start = degreesToRadians(i*15) + degreesToRadians(7.5);
        //        var end = degreesToRadians((i+1)*15)+ degreesToRadians(7.5);
        //        ctx.beginPath();
        //        ctx.arc(centerX, centerX, mapObj.radius, start, end, false);
        //        ctx.lineWidth = mapObj.width;
        //
        //        ctx.strokeStyle = ((i % 2) === 0?mapObj.color.first:mapObj.color.second);
        //
        //        ctx.stroke();
        //        ctx.closePath();
        //
        //    }
        //}
        //312


        /*
        *
        * РУЧНОЙ РЕЖИМ
        * */

        var hh = 312;
        ctx.beginPath();
        ctx.strokeStyle = "rgb(21, 21, 197)";
        polygon(ctx,centerX,centerY,hh,24,-Math.PI/2.2);
        ctx.stroke();
        //312 - 20
        ctx.beginPath();
        ctx.strokeStyle = "rgb(242, 14, 14)";
        polygon(ctx,centerX,centerY,hh - 18,24,-Math.PI/2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgb(21, 21, 197)";
        polygon(ctx,centerX,centerY,hh - 18 - 30,24,-Math.PI/2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgb(242, 14, 14)";
        polygon(ctx,centerX,centerY,hh - 18 - 30 - 35 ,24,-Math.PI/2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgb(21, 21, 197)";
        polygon(ctx,centerX,centerY,hh - 18 - 30 - 35 - 43 ,24,-Math.PI/2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgb(242, 14, 14)";
        polygon(ctx,centerX,centerY,hh - 18 - 30 - 35 - 43 - 39 ,24,-Math.PI/2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgb(21, 21, 197)";
        polygon(ctx,centerX,centerY,hh - 18 - 30 - 35 - 43 - 39 - 51 ,24,-Math.PI/2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgb(242, 14, 14)";
        polygon(ctx,centerX,centerY,hh - 18 - 30 - 35 - 43 - 39 - 51 - 27 ,24,-Math.PI/2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgb(21, 21, 197)";
        polygon(ctx,centerX,centerY,hh - 18 - 30 - 35 - 43 - 39 - 51 - 27 - 23 ,24,-Math.PI/2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgb(242, 14, 14)";
        polygon(ctx,centerX,centerY,hh - 18 - 30 - 35 - 43 - 39 - 51 - 27 - 23 - 25 ,24,-Math.PI/2.2);
        ctx.stroke();


        //ctx.beginPath();
        //ctx.strokeStyle = "rgb(21, 21, 197)";
        //ctx.moveTo(centerX-185,centerY-251);
        //ctx.lineTo(centerX-248,centerY-190);
        //ctx.lineTo(centerX-234,centerY-180);
        //ctx.lineTo(centerX-178,centerY-235);
        //ctx.lineTo(centerX-185,centerY-251);
        //ctx.stroke();
        //ctx.closePath();
        //
        //ctx.beginPath();
        //ctx.strokeStyle = "rgb(242, 14, 14)";
        //ctx.moveTo(centerX-248,centerY-190);
        //ctx.lineTo(centerX-290,centerY-119);
        //ctx.lineTo(centerX-271,centerY-113);
        //ctx.lineTo(centerX-234,centerY-180);
        //ctx.lineTo(centerX-248,centerY-190);
        //ctx.stroke();
        //ctx.closePath();
        //
        //ctx.beginPath();
        //ctx.strokeStyle = "rgb(21, 21, 197)";
        //ctx.moveTo(centerX-290,centerY-119);
        //ctx.lineTo(centerX-311,centerY-40);
        //ctx.lineTo(centerX-291,centerY-38);
        //ctx.lineTo(centerX-271,centerY-113);
        //ctx.lineTo(centerX-290,centerY-119);
        //ctx.stroke();
        //ctx.closePath();
        //
        ///////////////////////////////////////////
        //ctx.beginPath();
        //ctx.strokeStyle = "rgb(21, 21, 197)";
        //ctx.moveTo(centerX-233,centerY-179);//prev point #4 (-1)
        //ctx.lineTo(centerX-270,centerY-112);//prev point #3 (-1)
        //ctx.lineTo(centerX-246,centerY-101);
        //ctx.lineTo(centerX-210,centerY-160);
        //ctx.lineTo(centerX-233,centerY-179);
        //ctx.stroke();
        //ctx.closePath();
        //
        //ctx.beginPath();
        //ctx.strokeStyle = "rgb(242, 14, 14)";
        //ctx.moveTo(centerX-209,centerY-159);//prev point #4 (-1)
        //ctx.lineTo(centerX-245,centerY-102);//prev point #3 (-1)
        //ctx.lineTo(centerX-210,centerY-88);
        //ctx.lineTo(centerX-181,centerY-140);
        //ctx.lineTo(centerX-209,centerY-159);
        //ctx.stroke();
        //ctx.closePath();

        //ctx.beginPath();
        //ctx.strokeStyle = "rgb(242, 14, 14)";
        //ctx.moveTo(centerX-180,centerY-139);//prev point #4 (-1)
        //ctx.lineTo(centerX-209,centerY-101);//prev point #3 (-1)
        //ctx.lineTo(centerX-210,centerY-88);
        //ctx.lineTo(centerX-181,centerY-139);
        //ctx.lineTo(centerX-180,centerY-139);
        //ctx.stroke();
        //ctx.closePath();


    }


    function draw(withAnchors, withBorders) {
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw the image
        ctx.drawImage(img, 0, 0, img.width, img.height, imageX, imageY, imageWidth, imageHeight);
        //var imageData = ctx.getImageData(10, 10, 1, 1);
        //var data = imageData.data;
        //console.log(data);
        // optionally draw the draggable anchors
        if (withAnchors) {
            drawDragAnchor(imageX, imageY);
            drawDragAnchor(imageRight, imageY);
            drawDragAnchor(imageRight, imageBottom);
            drawDragAnchor(imageX, imageBottom);
        }

        // optionally draw the connecting anchor lines
        if (withBorders) {
            ctx.beginPath();
            ctx.moveTo(imageX, imageY);
            ctx.lineTo(imageRight, imageY);
            ctx.lineTo(imageRight, imageBottom);
            ctx.lineTo(imageX, imageBottom);
            ctx.closePath();
            ctx.stroke();
        }
        var padding = 75;
        ctx.beginPath();
        ctx.strokeStyle = "rgb(242, 14, 14)";
        ctx.arc(centerX, centerY, 325, 0, 2 * Math.PI, true);
        ctx.moveTo(padding, centerY);
        ctx.lineTo((centerX*2)-padding, centerY);
        ctx.moveTo(centerX, padding);
        ctx.lineTo(centerX, (centerY*2)-padding);
        ctx.lineWidth = 1;
        ctx.closePath();
        ctx.stroke();
        drawMap();
    }

    function drawDragAnchor(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, resizerRadius, 0, pi2, false);
        ctx.closePath();
        ctx.fill();
    }

    function anchorHitTest(x, y) {

        var dx, dy;

        // top-left
        dx = x - imageX;
        dy = y - imageY;
        if (dx * dx + dy * dy <= rr) {
            return (0);
        }
        // top-right
        dx = x - imageRight;
        dy = y - imageY;
        if (dx * dx + dy * dy <= rr) {
            return (1);
        }
        // bottom-right
        dx = x - imageRight;
        dy = y - imageBottom;
        if (dx * dx + dy * dy <= rr) {
            return (2);
        }
        // bottom-left
        dx = x - imageX;
        dy = y - imageBottom;
        if (dx * dx + dy * dy <= rr) {
            return (3);
        }
        return (-1);

    }


    function hitImage(x, y) {
        return (x > imageX && x < imageX + imageWidth && y > imageY && y < imageY + imageHeight);
    }


    function handleMouseDown(e) {
        $("#canvas").bind('mousemove',handleMouseMove);
        startX = parseInt(e.clientX - offsetX);
        startY = parseInt(e.clientY - offsetY);
        draggingResizer = anchorHitTest(startX, startY);
        draggingImage = draggingResizer < 0 && hitImage(startX, startY);
    }

    function handleMouseUp(e) {
        $("#canvas").unbind('mousemove',handleMouseMove);
        draggingResizer = -1;
        draggingImage = false;
        draw(true, false);
    }

    function handleMouseOut(e) {
        handleMouseUp(e);
    }

    function handleMouseMove(e) {

        if (draggingResizer > -1) {

            mouseX = parseInt(e.clientX - offsetX);
            mouseY = parseInt(e.clientY - offsetY);

            // resize the image
            switch (draggingResizer) {
                case 0:
                    //top-left
                    imageX = mouseX;
                    imageWidth = imageRight - mouseX;
                    imageY = mouseY;
                    imageHeight = imageBottom - mouseY;
                    break;
                case 1:
                    //top-right
                    imageY = mouseY;
                    imageWidth = mouseX - imageX;
                    imageHeight = imageBottom - mouseY;
                    break;
                case 2:
                    //bottom-right
                    imageWidth = mouseX - imageX;
                    imageHeight = mouseY - imageY;
                    break;
                case 3:
                    //bottom-left
                    imageX = mouseX;
                    imageWidth = imageRight - mouseX;
                    imageHeight = mouseY - imageY;
                    break;
            }

            if(imageWidth<25){imageWidth=25;}
            if(imageHeight<25){imageHeight=25;}

            // set the image right and bottom
            imageRight = imageX + imageWidth;
            imageBottom = imageY + imageHeight;

            // redraw the image with resizing anchors
            draw(true, true);

        } else if (draggingImage) {

            imageClick = false;

            mouseX = parseInt(e.clientX - offsetX);
            mouseY = parseInt(e.clientY - offsetY);

            // move the image by the amount of the latest drag
            var dx = mouseX - startX;
            var dy = mouseY - startY;
            imageX += dx;
            imageY += dy;
            imageRight += dx;
            imageBottom += dy;
            // reset the startXY for next time
            startX = mouseX;
            startY = mouseY;

            // redraw the image with border
            draw(false, true);

        }


    }

    $('#file').bind('change',openFile);
})(jQuery);


//var example = document.getElementById("canvas");
//     var ctx = example.getContext('2d');
//var cX = canvas.width/2;
//var cY = canvas.height/2;
//
//for(var i=0;i<5;i++) {
//var x = 20;
//var y = 10;
//  if(i===0) {
//    ctx.beginPath();
//ctx.moveTo(cX,cY);
//ctx.lineTo(cX-(x+10),cY-y);
//ctx.lineTo(cX-(x+10),cY+y);
//ctx.lineTo(cX,cY);
//ctx.stroke();
//ctx.closePath();
//  }
//  else {
//    ctx.beginPath();
//ctx.moveTo(cX-(x*i+10+i),cY-(y+1+((i-1)*7)));
//ctx.lineTo(cX-(x*i+10+i),cY+(y+1+((i-1)*7)));
//ctx.lineTo(cX-(x*(i+1)+10+i),cY+(y+1+(i*7)));
//ctx.lineTo(cX-(x*(i+1)+10+i),cY-(y+1+(i*7)));
//ctx.lineTo(cX-(x*i+10+i),cY-(y+1+((i-1)*7)));
//ctx.stroke();
//ctx.closePath();
//  }
//}


// ctx.beginPath();
// ctx.moveTo(cX,cY);
// ctx.lineTo(cX-30,cY-10);
// ctx.lineTo(cX-30,cY+10);
// ctx.lineTo(cX,cY);
// ctx.stroke();
// ctx.closePath();

// ctx.beginPath();
// ctx.moveTo(cX-31,cY-11);
// ctx.lineTo(cX-31,cY+11);
// ctx.lineTo(cX-51,cY+18);
// ctx.lineTo(cX-51,cY-18);
// ctx.lineTo(cX-31,cY-11);
// ctx.stroke();
// ctx.closePath();

// ctx.beginPath();
// ctx.moveTo(cX-52,cY-19);
// ctx.lineTo(cX-52,cY+19);
// ctx.lineTo(cX-72,cY+27);
// ctx.lineTo(cX-72,cY-27);
// ctx.lineTo(cX-52,cY-19);
// ctx.stroke();
// ctx.closePath();