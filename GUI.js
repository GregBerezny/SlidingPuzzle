GUI = function () {

    var self = {};

    self.ctx = document.getElementById("canvas-game").getContext("2d"); 
    self.ctx.font = 'bold 32px Arial';

    self.minSize = 3;
    self.maxSize = 6;
    self.size = self.minSize;

    self.mode="Manual";

    self.config = {};

    self.AI = null;

    self.board = [];
    self.goal = [];

    self.setSize = function(size) {
        self.size = size;
        if (self.size > self.maxSize) {
            self.size = self.maxSize;  
        } else if (self.size < self.minSize) {
            self.size = self.minSize;
        }
        self.start();
    }

    self.solve = function() {
        if (self.mode == "AI") {
            self.AI = new AI(self, self.config);
            self.AI.solve();

            for (let i = 0; i < self.AI.path.length; i++) {
                self.moveTile(self.AI.path[i]);
            }
        }
    }

    self.setMode = function(mode) {
        self.mode = mode;
    }

    self.setHeuristic = function(h) {
        self.config.heuristic = h;
    }

    self.onClick = function(e) {
        if (self.mode == "Manual") {
            let x = Math.floor((e.clientX - 1) / 101);
            let y = Math.floor((e.clientY - 1) / 101);
            self.moveTile([x, y]);
        }
    }

    document.getElementById("canvas-game").addEventListener("click", self.onClick, false);

    self.start = function() {
        let positions = [];
        for (let j = 1; j < self.size * self.size; j++) {
            positions.push(j);
        }
        positions.push(0);

        for (let i = 0; i < self.size; i++) {
            self.goal.push(new Array(self.size));
        }

        let k = 0;
        for (let i = 0; i < self.size; i++) {
            for (let j = 0; j < self.size; j++) {
                self.goal[j][i] = positions[k];
                k++;
            }
        }

        positions = self.shuffle(positions);
        for (let i = 0; i < self.size; i++) {
            self.board.push(new Array(self.size));
        }

        let i = 0;
        for (let y = 0; y < self.size; y++) {
            for (let x = 0; x < self.size; x++) {
                self.board[x][y] = positions[i];
                i++;
            }
        }

        self.draw();
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
        for (let y=0; y<self.size; y++) {
            for (let x=0; x<self.size; x++) {
                if (self.board[x][y] == i) {
                    return [x, y];
                }
            }
        }

        return [-1, -1];
    }

    self.getValue = function(x, y) {
        if (self.isOOB(x, y)) {
            return -1;
        }
        return self.board[x][y];
    }

    self.isOOB = function(x, y) {
        if (y >= 0 && y < self.size && x >= 0 && x < self.size) {
            return false;
        }
        return true;
    }

    self.moveTile = function(tile) {
        let x = tile[0];
        let y = tile[1];

        if (!self.isOOB(x, y-1) && self.getValue(x, y-1) == 0) {
            self.board[x][y-1] = self.board[x][y];
            self.board[x][y] = 0;
            self.draw();
            return;
        }

        if (!self.isOOB(x, y+1) && self.getValue(x, y+1) == 0) {
            self.board[x][y+1] = self.board[x][y];
            self.board[x][y] = 0;
            self.draw();
            return;
        }
        if (!self.isOOB(x-1, y) && self.getValue(x-1, y) == 0) {
            self.board[x-1][y] = self.board[x][y];
            self.board[x][y] = 0;
            self.draw();
            return;
        }
        if (!self.isOOB(x+1, y) && self.getValue(x+1, y) == 0) {
            self.board[x+1][y] = self.board[x][y];
            self.board[x][y] = 0;
            self.draw();
            return;
        }
    }

    self.draw = function () {

        self.ctx.clearRect(0, 0, self.maxSize*100 + self.maxSize + 1, self.maxSize*100+self.maxSize + 1);
        self.ctx.fillStyle = "#9A7A49";
        let length = self.size*100 + self.size + 1;
        self.ctx.fillRect(0, 0, length, length);



        for (let x=0; x<self.size; x++) {

           for (let y=0; y<self.size; y++) {

               if (self.board[x][y] == 0) { 
                   self.ctx.rect((100*x)+x+1, (100*y)+y+1, 100, 100);
                   self.ctx.lineWidth = 1;
                   self.ctx.stroke();
                   continue; 
               }

               self.ctx.fillStyle = "#FFFFFF";
               self.ctx.strokeStyle = "#0E0E0E";

               self.ctx.beginPath();
               self.ctx.rect((100*x)+x+1, (100*y)+y+1, 100, 100);
               self.ctx.fill();
               self.ctx.fillStyle = "#6B0000";
               self.ctx.fillText(self.board[x][y], 100*x+42, 100*y + 60);
               self.ctx.lineWidth = 1;
               self.ctx.stroke();
 
            }

        }

    }

    self.start();

    return self;
}



