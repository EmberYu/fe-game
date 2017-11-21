var Local = function () {
    // 游戏对象
    var game;
    // 开始
    var bindKeyEvent = function () {
        document.onkeydown = function (e) {
            if(e.keyCode == 38) {   // up

            } else if (e.keyCode == 39) { // right
                game.right();
            } else if (e.keyCode == 40) { // down
                game.down();
            } else if (e.keyCode == 37) { // left
                game.left();
            } else if (e.keyCode == 32) { // space
                
            }
        }
    }
    var start = function () {
        var doms = {
            gameDiv: document.getElementById('game'),
            nextDiv: document.getElementById('next')
        }
        game = new Game();
        game.init(doms);
        bindKeyEvent();
    }
    // 导出API
    this.start = start;
}