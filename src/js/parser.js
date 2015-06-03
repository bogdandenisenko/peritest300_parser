
(function ($) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var canvasOffset = $("#canvas").offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;

    var pi2 = Math.PI * 2;
    var resizerRadius = 8;
    var rr = resizerRadius * resizerRadius;
    var draggingResizer = {
        x: 0,
        y: 0
    };
    var imageX = 31;
    var imageY = -258;
    var imageWidth, imageHeight, imageRight, imageBottom;
    var draggingImage = false;
    var startX;
    var startY;
    var img;

    var mapCircle = [
        {radius:314,width:22,color:{first:'red',second:'black'}},
        //{radius:292,width:24,color:{first:'green',second:'blue'}},
        //{radius:264,width:33,color:{first:'red',second:'black'}},
        //{radius:228,width:40,color:{first:'green',second:'blue'}},
        //{radius:185,width:46,color:{first:'red',second:'black'}},
        //{radius:136,width:50,color:{first:'green',second:'blue'}},
        //{radius:83,width:53,color:{first:'red',second:'black'}},
        //{radius:31,width:50,color:{first:'green',second:'blue'}}
    ];


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

    function degreesToRadians (degrees) {
        return degrees * (Math.PI/180);
    }

    function drawMap() {
        for(var j = 0;j<mapCircle.length;j++) {
            var mapObj = mapCircle[j];
            for(var i=0;i<24;i++) {
                var start = degreesToRadians(i*15) + degreesToRadians(7.5);
                var end = degreesToRadians((i+1)*15)+ degreesToRadians(7.5);
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(380, 380, mapObj.radius, start, end, false);
                ctx.lineWidth = mapObj.width;

                ctx.strokeStyle = ((i % 2) === 0?mapObj.color.first:mapObj.color.second);

                ctx.stroke();
                ctx.closePath();

            }
        }
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
        ctx.beginPath();
        ctx.strokeStyle = "rgb(242, 14, 14)";
        ctx.arc(380, 380, 325, 0, 2 * Math.PI, true);
        ctx.moveTo(55, 380);
        ctx.lineTo(706, 380);
        ctx.moveTo(380, 55);
        ctx.lineTo(380, 706);
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