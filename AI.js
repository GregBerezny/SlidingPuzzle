AI = function (grid) {
    var self = {};

    self.grid = grid;
    self.actions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    self.getNextAction = function() {
        let actions = self.getLegalActions(self.grid.board);
        let rand = Math.floor(Math.random() * actions.length);

        return actions[rand];
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

    self.isGoal = function(state, i) {
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

    self.createChild = function(parent, action, cost) {
        var nextState = self.getNextState(parent.state, action);
        var g = cost + node.g;
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
