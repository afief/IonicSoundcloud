var client_id = "7e747f7d6f9eedfbf64282e8d5ef8673";
var redirect_uri = 'http://afief.net/callback.html';

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
    };
}