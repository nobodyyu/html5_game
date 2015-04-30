document.body.onkeydown = function( e ) {
    var keys = {
        37: 'left',    //鍵盤的定義  
        39: 'right',
        40: 'down',
        38: 'rotate'
    };
    if ( typeof keys[ e.keyCode ] != 'undefined' ) {
        keyPress( keys[ e.keyCode ] );
        render();
    }
};
