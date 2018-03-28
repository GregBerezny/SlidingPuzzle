GUI = function () {

    var self = {};

    self.ctx = document.getElementById("canvas-game").getContext("2d"); 
    self.ctx.font = '14px Arial';

    self.n = 5;
    self.position = [];

    self.start = function() {

        let order = [];
        for (let j=self.n*self.n - 1; j>=0; j--) {
            order.push(j);
        }

        order = self.shuffle(order);

        let i = 0;
        for (let y=0; y<self.n; y++) {
            let row = [];
            for (let x=0; x<self.n; x++) {
                row.push(order[i]);
                i++;
            }
            self.position.push(row);
        }

        self.update();
    }

    self.shuffle = function(a) {
        return a;
    }

    self.getMousePos = function (canvas, evt) {
   
     var rect = canvas.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    }

    self.update = function() {

        self.draw();
    }

    self.draw = function () {

        // clear the foreground to white
        self.ctx.clearRect(0, 0, self.n*100 + self.n, self.n*100+self.n);
        
        self.ctx.fillStyle = "lightgray";
        //self.ctx.strokeStyle = "black";
        self.ctx.beginPath();
        self.ctx.rect(0, 0, self.n*100 + self.n, self.n*100+self.n);
        self.ctx.fill();
        //self.ctx.lineWidth = 0;
        //self.ctx.stroke();

        for (let x=0; x<self.n; x++) {

           for (let y=0; y<self.n; y++) {

               if (self.position[x][y] == 0) { 
                   continue; 
               }

               self.ctx.fillStyle = "gray";
               self.ctx.strokeStyle = "black";
               self.ctx.beginPath();
               self.ctx.rect((100*x)+x+1, (100*y)+y+1, 100, 100);
               self.ctx.fill();
               self.ctx.fillStyle = "black";
               self.ctx.fillText(self.position[x][y], 100*x + 50, 100*y + 50);
               self.ctx.lineWidth = 1;
               self.ctx.stroke();
 
            }

        }

    }

    self.start();

    return self;
}



