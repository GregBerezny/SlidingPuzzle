AI = function (grid) {
    var self = {};

    self.grid = grid;

    self.getNextAction = function() {
        let actions = self.getAvailableActions();
        let rand = Math.floor(Math.random() * actions.length);
        return actions[rand];
    }

    self.getAvailableActions = function() {
        let emptySpace = self.grid.getPosition(0);
        let x = emptySpace[0];
        let y = emptySpace[1];

        let actions = [];
        if (!gui.isOOB(x+1, y)) {
            actions.push([x+1, y]);
        }
        if (!gui.isOOB(x-1, y)) {
            actions.push([x-1, y]);
        }
        if (!gui.isOOB(x, y+1)) {
            actions.push([x, y+1]);
        }
        if (!gui.isOOB(x, y-1)) {
            actions.push([x, y-1]);
        }

        return actions;
    }

    return self;
}
