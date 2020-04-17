// TinyForth 3.0 for Node.js

var readline = require('readline');
var util = require('util');

function TinyForth(handler) {
	this.handler = handler;
};

TinyForth.prototype.run = function() {
	var self = this;
	var rli  = readline.createInterface(process.stdin, process.stdout);

	rli.setPrompt('> ');

	rli.on('line', function(line) {

		



		rli.prompt();
	})
	.on('close', function() {
		process.stdin.destroy();
	});

	rli.prompt();
};


function Handler() {}

Handler.prototype.echo = function(args, fn) {
	fn(null, args);
};

Handler.prototype.exit = function(args, fn) {
	util.puts('Exit');
	this.emit('close');
};


(new TinyForth(new Handler())).run();

/**/