AI = function (grid, config) {
    var self = {};

    self.grid = grid;
    self.config = config;
    self.actions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    self.startState = null;
    self.inProgress = false;
    self.path = [];
    self.open = [];
    self.isInOpen = {};
    self.closed = [];

    self.solve = function() {
        self.startSearch(self.grid.board);
        while (self.inProgress) {
            self.searchIteration();
        }
    }

    self.startSearch = function(startState) {
        self.inProgress = true;
        self.startState = startState;
        self.path = [];

        self.closed = [];
        self.isInOpen = {};

        var startNode = new Node(startState, null, [-1, -1], 0, 0);
        var f = function(node) { return node.g + node.h; }
        self.open = new BinaryHeap(f);
        self.addToOpen(startNode);
    }

    self.searchIteration = function() {
        if (!self.inProgress) { return; }

        let node = self.open.pop();
        self.removeFromOpen(node);

        if (self.isGoal(node.state)) {
            self.path = self.constructPath(node);
            self.inProgress = false;
            return;
        }

        let nodeString = node.state.toString();

        if (self.closed.includes(nodeString)) {
            return;
        }

        self.closed.push(nodeString);

        let children = self.expand(node);

        children.forEach(function(child) {
            if (self.inOpenWithBetterG(child)) {
                return;
            }
            self.addToOpen(child);
        });
    }

    self.addToOpen = function(node) {
        self.open.push(node);
        let arrString = node.state.toString();
        if (!self.isInOpen.hasOwnProperty(arrString)) {
            self.isInOpen[arrString] = 0;
        }
        self.isInOpen[arrString]++;
    }

    self.removeFromOpen = function(node) {
        self.isInOpen[node.state.toString()]--;
    }

    self.inOpenWithBetterG = function(child) {
        let arrString = child.state.toString();
        if (!self.isInOpen.hasOwnProperty(arrString)) {
            return false;
        }

        if (self.isInOpen[arrString] <= 0) {
            return false;
        }

        self.open.content.forEach(function(node) {
            if (node.state.toString() == arrString && node.g <= child.g) {
                return true;
            }
        });

        return false;
    }

    self.constructPath = function(node) {
        var path = [];
        while (node.parent != null) {
            path.unshift(node.action);
            node = node.parent;
        }
        return path;
    }

    self.getLegalActions = function(state) {
        let emptySpace = self.getPosition(state, 0);
        let x = emptySpace[0];
        let y = emptySpace[1];

        let availableActions = [];

        for (var i = 0; i < self.actions.length; i++) {
            let nx = x + self.actions[i][0];
            let ny = y + self.actions[i][1];

            if (!self.grid.isOOB(nx, ny)) {
                availableActions.push([nx, ny]);
            }
        }

        return availableActions;
    }

    self.isGoal = function(state) {
        for (let i = 0; i < self.grid.size; i++) {
            for (let j = 0; j < self.grid.size; j++) {
                if (state[i][j] != self.grid.goal[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    self.getPosition = function(state, i) {
        for (let y = 0; y < state.length; y++) {
            for (let x = 0; x < state.length; x++) {
                if (state[x][y] == i) {
                    return [x, y];
                }
            }
        }

        return [-1, -1];
    }

    self.getNextState = function(state, action) {
        let x = action[0];
        let y = action[1];

        let nextState = [];
        for (var i = 0; i < state.length; i++) {
            var arr = [];
            for (var j = 0; j < state.length; j++) {
                arr.push(state[i][j]);
            }
            nextState.push(arr);
        }

        let emptySpace = self.getPosition(state, 0);
        let ex = emptySpace[0];
        let ey = emptySpace[1];

        nextState[ex][ey] = nextState[x][y];
        nextState[x][y] = 0;

        return nextState;
    }

    self.computeHammingDistance = function(state) {
        let misplacedTiles = 0;
        for (let i = 0; i < self.grid.size; i++) {
            for (let j = 0; j < self.grid.size; j++) {
                if (state[i][j] != 0 && state[i][j] != self.grid.goal[i][j]) {
                    misplacedTiles++;
                }
            }
        }

        return misplacedTiles;
    }

    self.computeManhattanDistance = function(state) {
        let manhattan = 0;
        for (let i = 0; i < self.grid.size; i++) {
            for (let j = 0; j < self.grid.size; j++) {
                if (state[i][j] != 0) {
                    let val = self.getPosition(self.grid.goal, state[i][j]);
                    let gx = val[0];
                    let gy = val[1];
                    let dx = Math.abs(i - gx);
                    let dy = Math.abs(j - gy);
                    manhattan += (dx + dy);
                }
            }
        }

        return manhattan;
    }

    self.estimateCost = function(state) {
        if (self.config.heuristic == 'hdist') {
            return self.computeHammingDistance(state);
        }
        else if (self.config.heuristic == 'mdist') {
            return self.computeManhattanDistance(state);
        }
        else if (self.config.heuristic == 'zero') {
            return 0;
        }
    }

    self.expand = function(node) {
        let children = [];
        let actions = self.getLegalActions(node.state);

        for (let i = 0; i < actions.length; i++) {
            children.push(self.createChild(node, actions[i]));
        }
        return children;
    }

    self.createChild = function(parent, action) {
        var nextState = self.getNextState(parent.state, action);
        var g = parent.g + 1;
        var h = self.estimateCost(nextState);
        var child = new Node(nextState, parent, action, g, h);
        return child;
    }

    return self;
}

Node = function (state, parent, action, g, h) {
    var self = {};
    self.state = state;
    self.action = action;
    self.parent = parent;
    self.g = g;
    self.h = h;
    return self;
}
