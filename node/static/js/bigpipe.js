var Bigpipe = function(){
    this.callbacks = {};
}

Bigpipe.prototype.ready = function(key, callback){
    this.callbacks[key] = this.callbacks[key] || [];
    this.callbacks[key].push(callback);
}

Bigpipe.prototype.set = function(key, data){
//    console.log(key, data);
    var callbacks = this.callbacks[key] || [];
    for (var i = callbacks.length - 1; i >= 0; i--) {
        callbacks[i].call(this, data);
    };
}
