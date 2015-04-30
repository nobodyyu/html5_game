var COLS = 10, ROWS = 20;
var board = [];
var lose;
var interval;
var current; // current moving shape
var currentX, currentY; // position of current shape
var shapes = [
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0,
      1 ],
    [ 1, 1, 1, 0,
      0, 0, 1 ],
    [ 1, 1, 0, 0,
      1, 1 ],
    [ 1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 1, 1, 0,
      1, 1 ],
    [ 0, 1, 0, 0,
      1, 1, 1 ]
];

var colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];


var score = 0;


function newGame() {
    clearInterval(interval);
    init();  //重置
    newBrick();  //放新的磚塊
    lose = false;  //判定是否結束
    score = 0;
    document.getElementById( 'score' ).innerHTML = score;
    interval = setInterval( tick, 250 );
}

// clears the board  1－有磚塊  0－沒有磚塊
function init() {
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
}

// 考慮磚磈的形狀，最適合的尺寸是4x4的空間
function newBrick() {
    var id = Math.floor( Math.random() * shapes.length );  //取亂數
    var shape = shapes[ id ]; //取磚塊的形狀

    current = [];  //依設定的形狀畫出新的磚塊
    for ( var y = 0; y < 4; ++y ) {
        current[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            var i = 4 * y + x;
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
                current[ y ][ x ] = id + 1;
            }
            else {
                current[ y ][ x ] = 0;
            }
        }
    }
    //設定初始位置
    currentX = 5;
    currentY = 0;
}

//每一個時間間隔程式要做的事 －－ game loop
function tick() {
    if ( valid( 0, 1 ) ) {  //如果下一格還可以放，那就將current brick往下移動一格
        ++currentY;
    }
    else {  //不能放了的話
        settleBrick();  //到底了，放到棋盤上
        clearLines();  //消去成功填滿的行數
        if (lose) {
            //newGame();
            return false;
        }
        newBrick();
    }
}

// 檢查current brick是否能夠移動
function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
                    if (offsetY == 1) lose = true; // 不能移動時，如果到頂了，則判斷為 lose
                    return false;
                }
            }
        }
    }
    return true;
}


//把目前的current brick 放到棋盤上
function settleBrick() {
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
}

//檢查是否成功填滿一行
function clearLines() {
    for ( var y = ROWS - 1; y >= 0; --y ) {
        var rowFilled = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                rowFilled = false;
                break;
            }
        }
        if ( rowFilled ) {
            document.getElementById( 'clearsound' ).play();  //加入音效
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];  //上一行往下推一行
                }
            }
            ++y;  //每成功一次會多重複一行不取

            score+=100;
            document.getElementById( 'score' ).innerHTML = score;
        }
    }
}

//newGame();  //故事是從這理開始的


//--------對照 controller.js --------------------------------
function keyPress( key ) {
    switch ( key ) {
        case 'left':
            if ( valid( -1 ) ) {
                --currentX;
            }
            break;
        case 'right':
            if ( valid( 1 ) ) {
                ++currentX;
            }
            break;
        case 'down':
            if ( valid( 0, 1 ) ) {
                ++currentY;
            }
            break;
        case 'rotate':
            var rotated = rotate( current );
            if ( valid( 0, 0, rotated ) ) {
                current = rotated;
            }
            break;
    }
}

//4x4 矩陣 逆時針旋轉 
function rotate( current ) {
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
        }
    }

    return newCurrent;
}


