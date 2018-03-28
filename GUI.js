GUI = function () {

    var self = {};

    self.ctx = document.getElementById("canvas-game").getContext("2d"); 
    self.ctx.font = '14px Arial';

    self.n = 5;
    self.board = [];

    self.onClick = function(e) {
        let x = Math.floor(e.clientX / 100);
        let y = Math.floor(e.clientY / 100);
        self.moveTile(self.getValue(x, y));
    }

    document.getElementById("canvas-game").addEventListener("click", self.onClick, false);

    self.start = function() {

        let positions = [];
        for (let j=self.n*self.n - 1; j>=0; j--) {
            positions.push(j);
        }

        positions = self.shuffle(positions);

        let i = 0;
        for (let y=0; y<self.n; y++) {
            let row = [];
            for (let x=0; x<self.n; x++) {
                row.push(positions[i]);
                i++;
            }
            self.board.push(row);
        }

        self.update();
    }

    self.shuffle = function(a) {
        for (let i = a.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let x = a[i];
            a[i] = a[j];
            a[j] = x;
        }

        return a;
    }

    self.getPosition = function(i) {
        for (let y=0; y<self.n; y++) {
            for (let x=0; x<self.n; x++) {
                if (self.board[x][y] == i) {
                    return [x, y];
                }
            }
        }

        return [-1, -1];
    }

    self.getValue = function(x, y) {
        return self.board[x][y];
    }

    self.moveTile = function(i) {
        let position = self.getPosition(i);
        let x = position[0];
        let y = position[1];

        if (y > 0) {
            let y2 = y - 1; 
            if (self.getValue(x, y2) == 0) {
                self.board[x][y2] = self.board[x][y];
                self.board[x][y] = 0;
                self.update();
                return;
            }
        }
       if (y < self.n - 1) {
            let y2 = y + 1; 
            if (self.getValue(x, y2) == 0) {
                self.board[x][y2] = self.board[x][y];
                self.board[x][y] = 0;
                self.update();
                return;
            }
        } 
        if (x > 0) {
            let x2 = x - 1; 
            if (self.getValue(x2, y) == 0) {
                self.board[x2][y] = self.board[x][y];
                self.board[x][y] = 0;
                self.update();
                return;
            }
        }
        if (x < self.n - 1) {
            let x2 = x + 1; 
            if (self.getValue(x2, y) == 0) {
                self.board[x2][y] = self.board[x][y];
                self.board[x][y] = 0;
                self.update();
                return;
            }
        }
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

               if (self.board[x][y] == 0) { 
                   continue; 
               }

               self.ctx.fillStyle = "gray";
               self.ctx.strokeStyle = "black";
               self.ctx.beginPath();
               self.ctx.rect((100*x)+x+1, (100*y)+y+1, 100, 100);
               self.ctx.fill();
               self.ctx.fillStyle = "black";
               self.ctx.fillText(self.board[x][y], 100*x + 50, 100*y + 50);
               self.ctx.lineWidth = 1;
               self.ctx.stroke();
 
            }

        }

    }

    self.start();

    return self;
}



