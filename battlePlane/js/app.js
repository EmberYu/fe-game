// 元素
var container = document.getElementById('game');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.fillStyle = '#fff';
context.font = '20px normal';
window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 30);
  };
// 飞机对象  
function Plane() {
  this.width = 60;
  this.height = 100;
  this.direction = '';
  this.position = {
    x: 320,
    y: 470
  };
  this.img = new Image()
  this.img.src = "img/plane.png";
  this.boundary = {
    // 飞机的左右边界 
    left: 30,
    right: 610
  };
}

Plane.prototype.canMove = function () {
  if (this.direction === 'left') {
    if (this.position.x <= this.boundary.left) {
      return false;
    }
  } else if (this.direction === 'right') {
    if (this.position.x >= this.boundary.right) {
      return false;
    }
  }
  return true;
};

Plane.prototype.move = function () {
  var _this = this;
  if (!this.canMove(this.move)) return;
  this.prePosition = Object.assign({}, this.position);
  switch (this.direction) {
    case 'left':
      this.position.x -= 5;
      break;
    case 'right':
      this.position.x += 5;
      break;
  }
  !!this.bullets && this.bullets.forEach(function (bullet, index) {
    if(bullet.position.y <= 0) {
      _this.bullets.splice(index, 1);
    }
    bullet.move();
  })
};


Plane.prototype.draw = function (context) {
  var _this = this;
  _this.move();
  context.drawImage(_this.img, _this.position.x, _this.position.y, _this.width, _this.height);
  !!_this.bullets && _this.bullets.forEach(function (bullet){
    bullet.draw(context);
  })
};

Plane.prototype.shoot = function () {
  var _this = this;
  if(!!this.bullets) {
    this.bullets.push(new Bullet(_this.position.x, _this.position.y, _this.width))
  } else {
    this.bullets = [new Bullet(_this.position.x, _this.position.y, _this.width)]
  }
}

function Bullet(x, y, width) {
  this.position = {
    x: x + width / 2,
    y: y
  },
  this.len = 10;
}

Bullet.prototype.move = function () {
  this.position.y -= 10;
}

Bullet.prototype.draw = function (context) {
  context.lineWidth = 1;
  context.strokeStyle = '#fff';
  context.beginPath();
  context.moveTo(this.position.x, this.position.y);
  context.lineTo(this.position.x, this.position.y - this.len);
  context.stroke();
}


function Enemy(x, y, width, height) {
  Plane.call(this);    //继承父类的属性  
  this.position = {
    x: x,
    y: y
  }
  this.width = width;
  this.height = height;
  this.destoryImg = new Image();
  this.destoryImg.src = "img/boom.png";
  this.img = new Image();
  this.img.src = "img/enemy.png";
  this.status = 'alive';
}

inheritPrototype(Enemy, Plane);   //继承父类的方法
Enemy.prototype.destory = function () {
  this.status = "destroying";
  this.count = 0;
}

function inheritPrototype(subType, superType) {
  //  该方法实现继承父类原型的方法
  var protoType = Object.create(superType.prototype);
  protoType.constructor = subType;
  subType.prototype = protoType;
}

function EnemyArmy() {
  this.enemys = [
    new Enemy(60, 30, 50, 50),
    new Enemy(120, 30, 50, 50),
    new Enemy(180, 30, 50, 50),
    new Enemy(240, 30, 50, 50),
    new Enemy(300, 30, 50, 50),
    new Enemy(360, 30, 50, 50),
    new Enemy(420, 30, 50, 50)
  ];
  this.direction = 'right';
}
EnemyArmy.prototype.move = function () {
  if(this.enemys[0].position.x <= 30) {
    this.enemys.forEach(function (enemy) {
      enemy.position.y += 50;
    })
    this.direction = 'right';
  } else if (this.enemys[this.enemys.length - 1].position.x >= 620) {
    this.enemys.forEach(function (enemy) {
      enemy.position.y += 50;
      if(enemy.position.y >= 480) {
        GAME.fail();
      }
    })
    this.direction = 'left';
  }
  var dir = 0;
  switch (this.direction) {
    case 'right': dir = 2;break;
    case 'left': dir = -2;break; 
  }
  this.enemys.forEach(function (enemy) {
    enemy.position.x += dir;
  })
}
EnemyArmy.prototype.draw = function (context) {
  this.enemys.forEach(function (enemy, index) {
    if(enemy.status === 'destroying') {
      enemy.img = enemy.destoryImg;
      enemy.count ++;
      if(enemy.count === 3) {
        this.enemys.splice(index, 1);
        if(this.enemys.length === 0) {
          GAME.setStatus('success');
        }
        return;
      }
    }
    enemy.draw(context);
  }, this)
  this.enemys.length && this.move();
}

/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */
  init: function (opts) {
    this.setStatus('start');
    this.score = 0;
    this.bindEvent();
    this.plane = new Plane();
    this.enemyArmy = new EnemyArmy();
  },
  bindEvent: function () {
    var _this = this;
    var playBtn = document.querySelector('.js-play');
    var againBtn = document.getElementsByClassName('js-replay')[0];
    var nextBtn = document.getElementsByClassName('js-next')[0];
    // 开始游戏按钮绑定
    playBtn.onclick = function () {
      _this.play();
    };
    againBtn.onclick = function () {
      _this.init();
      _this.play();
    };
    nextBtn.onclick = function () {
      _this.init();
      _this.play();
    };
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 37:
          _this.plane.direction = 'left';
          break;
        case 39:
          _this.plane.direction = 'right';
          break;
        case 32:
          _this.plane.shoot();
        case 13: {
          if(GAME.status === 'start') {
            _this.play();
          }
        };break;
      }
    }
    document.onkeyup = function (e) {
      switch (e.keyCode) {
        case 37:
          {
            if (_this.plane.direction === 'left') {
              _this.plane.direction = '';
            }
          };
          break;
        case 39:
          {
            if (_this.plane.direction === 'right') {
              _this.plane.direction = '';
            }
          };
          break;
      }
    }
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function (status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function () {
    var _this = this;
    _this.setStatus('playing');
    context.clearRect(0, 0, canvas.width, canvas.height);
    _this.plane.draw(context);
    _this.enemyArmy.draw(context);
    context.fillText('分数:' + _this.score, 30, 54);
    _this.checkCollide(_this.plane, _this.enemyArmy);
    if(GAME.status !== 'playing') {
      var infoNodes = document.getElementsByClassName('game-info-text');
      for(var i = 0; i < infoNodes.length; i++) {
        infoNodes[i].innerText = '最终得分:' + _this.score;
      }
      return;
    }
    requestAnimationFrame(_this.play.bind(_this));
  },
  checkCollide: function (plane, army) {
    var enemys = army.enemys;
    var bullets = plane.bullets;
    if(!!bullets === false) return;
    bullets.forEach(function(bullet, bulletIndex){
      enemys.forEach(function(enemy, enemyIndex) {
        if(enemy.status !== 'alive') return;
        if(isCollide(bullet, enemy)) {
          bullets.splice(bulletIndex, 1);
          enemy.destory();
          GAME.score ++;
        }
      })
    });
    function isCollide(bullet, enemy) {
      if(bullet.position.x >= enemy.position.x && 
        bullet.position.x <= enemy.position.x + enemy.width && 
        bullet.position.y >= enemy.position.y && 
        bullet.position.y <= enemy.position.y + enemy.height + bullet.len) {
          return true;
        }
        return false;
    }
  },
  fail: function () {
    this.setStatus('failed');
  }
};


// 初始化
GAME.init();