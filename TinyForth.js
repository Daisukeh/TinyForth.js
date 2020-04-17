// TinyForth 3.0 for Node.js

var readline = require('readline');
var util = require('util');

function TinyForth(handler) {
	this.handler = handler;
};

TinyForth.prototype.run = () => {
	var self = this;

	var codeBuffer		= [];
	var dataStack		= [];
	var variableData	= [];
	var addressStack	= [];
	var codeBufferTop	= 0;
	var codeWritePt		= 0;
	var codeExecutePt	= 0;
	var dataStackTop	= 0;
	var dataStackPt		= 0;
	var variableDataPt	= 0;
	var addressStackPt	= 0;

	var pushDataStack = (value) => {

	};

	var popDataStack  = () => {

	};

	var keywords = [
		{ 'code': 0xd0,
		  'word': null,
		  'exec': (code) => {
			pushDataStack(code.value);
		} },
		{ 'code': 0xd1,
		  'word': '.',
		  'exec': (code) => {
			console.log(popDataStack());
		} },
		{ 'code': 0xd2,
		  'word': '."',
		  'exec': (code) => {
			console.log(code.value);
		} },
		{ 'code': 0xd3,	'word': 'EMIT',		'exec': (code) => {} },
		{ 'code': 0xd4,	'word': 'KEY',		'exec': (code) => {} },
		{ 'code': 0xd5,	'word': 'DUP',		'exec': (code) => {} },
		{ 'code': 0xd6,	'word': 'ROLL',		'exec': (code) => {} },
		{ 'code': 0xd7,	'word': 'DEPTH',	'exec': (code) => {} },
		{ 'code': 0xd8,	'word': 'DROP',		'exec': (code) => {} },
		{ 'code': 0xd9,	'word': 'DROPA',	'exec': (code) => {} },
		{ 'code': 0xda,	'word': '@',		'exec': (code) => {} },
		{ 'code': 0xdb,	'word': '!',		'exec': (code) => {} },
		{ 'code': 0xdc,	'word': '@#',		'exec': (code) => {} },
		{ 'code': 0xdd,	'word': '!#',		'exec': (code) => {} },
		{ 'code': 0xde,	'word': '@_',		'exec': (code) => {} },
		{ 'code': 0xdf,	'word': '!_',		'exec': (code) => {} },
		{ 'code': 0xe0,	'word': '+',		'exec': (code) => {} },
		{ 'code': 0xe1,	'word': '-',		'exec': (code) => {} },
		{ 'code': 0xe2,	'word': '*',		'exec': (code) => {} },
		{ 'code': 0xe3,	'word': '/',		'exec': (code) => {} },
		{ 'code': 0xe4,	'word': '%',		'exec': (code) => {} },
		{ 'code': 0xe5,	'word': '&',		'exec': (code) => {} },
		{ 'code': 0xe6,	'word': '|',		'exec': (code) => {} },
		{ 'code': 0xe7,	'word': '^',		'exec': (code) => {} },
		{ 'code': 0xe8,	'word': '~',		'exec': (code) => {} },
		{ 'code': 0xe9,	'word': '<<',		'exec': (code) => {} },
		{ 'code': 0xea,	'word': '>>',		'exec': (code) => {} },
		{ 'code': 0xeb,	'word': '=',		'exec': (code) => {} },
		{ 'code': 0xec,	'word': '<',		'exec': (code) => {} },
		{ 'code': 0xed,	'word': '>',		'exec': (code) => {} },
		{ 'code': 0xee,	'word': '=0',		'exec': (code) => {} },
		{ 'code': 0xef,	'word': '>0',		'exec': (code) => {} },
		{ 'code': 0xf0,	'word': 'IF',		'exec': (code) => {} },
		{ 'code': 0xf1,	'word': 'ELSE',		'exec': (code) => {} },
		{ 'code': 0xf2,	'word': 'THEN',		'exec': (code) => {} },
		{ 'code': 0xf3,	'word': 'DO',		'exec': (code) => {} },
		{ 'code': 0xf4,	'word': 'NEXT',		'exec': (code) => {} },
		{ 'code': 0xf5,	'word': 'LOOP',		'exec': (code) => {} },
		{ 'code': 0xf6,	'word': 'LEAVE',	'exec': (code) => {} },
		{ 'code': 0xf7,	'word': 'WHILE',	'exec': (code) => {} },
		{ 'code': 0xf8,	'word': 'COUNT',	'exec': (code) => {} },
		{ 'code': 0xf9,	'word': 'EXIT',		'exec': (code) => {} },
		{ 'code': 0xfa,	'word': 'STOP',		'exec': (code) => {} },
		{ 'code': 0xfb,	'word': 'VAR',		'exec': (code) => {} },
		{ 'code': 0xfc,	'word': ':',		'exec': (code) => {} },
		{ 'code': 0xfd,	'word': ';',		'exec': (code) => {} },
		{ 'code': 0xfe,	'word': null,		'exec': (code) => {} },
		{ 'code': 0xff,	'word': '(',		'exec': (code) => {} },
	];

	var rli  = readline.createInterface(process.stdin, process.stdout);
	rli.setPrompt('> ');

	rli.on('line', (line) => {
		var words = [];
		line.replace(/("[^"]*"|[^ ]+)/g, function(word) {
			words.push(word);
		});


		words.forEach((word) => {
			console.log(word);
		});

		rli.prompt();
	});

	rli.on('close', () => {
		process.stdin.destroy();
	});

	rli.prompt();
};


function Handler() {}

Handler.prototype.echo = (args, fn) => {
	fn(null, args);
};

Handler.prototype.exit = (args, fn) => {
	this.emit('close');
};


(new TinyForth(new Handler())).run();

/**/