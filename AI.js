AI = function (grid) {
    var self = {};

    self.grid = grid;
    self.actions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    self.getNextAction = function() {
        let actions = self.getLegalActions(self.grid);
        let rand = Math.floor(Math.random() * actions.length);
        return actions[rand];
    }

    self.getLegalActions = function(state) {
        let emptySpace = state.getPosition(0);
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

    return self;
}

Node = function (board, parent, action, g, h) {
    var self = {};
    self.state = state;
    self.action = action;
    self.parent = parent;
    self.g = g;
    self.h = h;
    return self;
}
