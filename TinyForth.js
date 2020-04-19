// TinyForth 3.0 for Node.js CLI

var readline = require('readline');
var util = require('util');

function TinyForth(handler) {
	this.handler = handler;
};

TinyForth.prototype.run = () => {
	var self = this;

	var memory			= [];
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

	var fetchMemory = (address) => {
		var value = memory[address];
		console.log('fetchM[' + address + ']=' + value);
		return value;
	};
	var storeMemory = (value, address) => {
		cconsole.log('storeM[' + address + ']=' + value);
		memory[address] = value;
	};
	var fetchDataStack = (index) => {
		var data = dataStack[dataStackPt - index];
		console.log('fetchD[' + dataStackPt + '-' + index + ']=' + data);
		return data;
	};
	var storeDataStack = (data, index) => {
		console.log('storeD[' + dataStackPt + '-' + index + ']=' + data);
		dataStack[dataStackPt - index] = data;
	};
	var pushDataStack = (data) => {
		console.log('pushD[' + dataStackPt + ']=' + data);
		dataStack[dataStackPt ++] = data;
	};
	var popDataStack  = () => {
		var data = dataStack[-- dataStackPt];
		console.log('popD[' + dataStackPt + ']=' + data);
		return data;
	};
	var fetchAddressStack = (index) => {
		var address = addressStack[addressStackPt - index];
		console.log('fetchA[' + addressStackPt + '-' + index + ']=' + address);
		return value;
	};
	var storeAddressStack = (address, index) => {
		console.log('storeA[' + addressStackPt + '-' + index + ']=' + address);
		addressStack[addressStackPt - index] = address;
	};
	var pushAddressStack = (address) => {
		console.log('pushA[' + addressStackPt + ']=' + address);
		addressStack[addressStackPt ++] = address;
	};
	var popAddressStack = () => {
		var address = addressStack[-- addressStackPt];
		console.log('popA[' + addressStackPt + ']=' + address);
		return address;
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
		{ 'code': 0xd3,
		  'word': 'EMIT',
		  'exec': (code) => {
			console.log(''.charAt(code.value));
		} },
		{ 'code': 0xd4,
		  'word': 'KEY',
		  'exec': (code) => {
			pushDataStack(0);
		} },
		{ 'code': 0xd5,
		  'word': 'DUP',
		  'exec': (code) => {
			pushDataStack(fetchDataStack(1));
		} },
		{ 'code': 0xd6,
		  'word': 'ROLL',
		  'exec': (code) => {
			var index = popDataStack();
			var value = fetchDataStack(index);
			while(index > 1) {
				storeDataStack(fetchDataStack(index - 1), index --);
			}
			storeDataStack(value, 1);
		} },
		{ 'code': 0xd7,
		  'word': 'DEPTH',
		  'exec': (code) => {
			pushDataStack(dataStackPt);
		} },
		{ 'code': 0xd8,
		  'word': 'DROP',
		  'exec': (code) => {
			popDataStack();
		} },
		{ 'code': 0xd9,
		  'word': 'DROPA',
		  'exec': (code) => {
			popAddressStack();
		} },
		{ 'code': 0xda,
		  'word': '@',
		  'exec': (code) => {
			  var address = popDataStack();
			pushDataStack(fetchMemory(address));
		} },
		{ 'code': 0xdb,
		  'word': '!',
		  'exec': (code) => {
			  var address = popDataStack();
			  var value   = popDataStack();
			storeMemory(value, address);
		} },
		{ 'code': 0xdc,
		  'word': '@#',
		  'exec': (code) => {
			var index = popDataStack();
			pushDataStack(fetchDataStack(index));
		} },
		{ 'code': 0xdd,
		  'word': '!#',
		  'exec': (code) => {
			var index = popDataStack();
			var value = popDataStack();
			storeDataStack(value, index);
		} },
		{ 'code': 0xde,
		  'word': '@_',
		  'exec': (code) => {
			var index = popDataStack();
			pushDataStack(fetchAddressStack(index));
		} },
		{ 'code': 0xdf,
		  'word': '!_',
		  'exec': (code) => {
			var index   = popDataStack();
			var address = popDataStack();
			storeAddressStack(address, index);
		} },
		{ 'code': 0xe0,
		  'word': '+',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack(value1 + value2);
		} },
		{ 'code': 0xe1,
		  'word': '-',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack(value1 - value2);
		} },
		{ 'code': 0xe2,
		  'word': '*',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack(value1 * value2);
		} },
		{ 'code': 0xe3,
		  'word': '/',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack(value1 / value2);
		} },
		{ 'code': 0xe4,
		  'word': '%',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack(value1 % value2);
		} },
		{ 'code': 0xe5,
		  'word': '&',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack(value1 && value2);
		} },
		{ 'code': 0xe6,
		  'word': '|',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack(value1 || value2);
		} },
		{ 'code': 0xe7,
		  'word': '^',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack(value1 ^ value2);
		} },
		{ 'code': 0xe8,
		  'word': '~',
		  'exec': (code) => {
			pushDataStack(~popDataStack());
		} },
		{ 'code': 0xe9,
		  'word': '<<',
		  'exec': (code) => {
			var bit   = popDataStack();
			var value = popDataStack();
			pushDataStack(value << bit);
		} },
		{ 'code': 0xea,
		  'word': '>>',
		  'exec': (code) => {
			var bit   = popDataStack();
			var value = popDataStack();
			pushDataStack(value >> bit);
		} },
		{ 'code': 0xeb,
		  'word': '=',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack((value1 == value2) ? 1 : 0);
		} },
		{ 'code': 0xec,
		  'word': '<',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack((value1 < value2) ? 1 : 0);
		} },
		{ 'code': 0xed,
		  'word': '>',
		  'exec': (code) => {
			var value2 = popDataStack();
			var value1 = popDataStack();
			pushDataStack((value1 > value2) ? 1 : 0);
		} },
		{ 'code': 0xee,
		  'word': '=0',
		  'exec': (code) => {
			pushDataStack((popDataStack() == 0) ? 1 : 0);
		} },
		{ 'code': 0xef,
		  'word': '>0',
		  'exec': (code) => {
			pushDataStack((popDataStack() > 0) ? 1 : 0);
		} },
/*
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
*/
		{ 'code': 0xff,
		  'word': '(',
		  'exec': (code) => {}
		},
	];

	var rli  = readline.createInterface(process.stdin, process.stdout);
	rli.setPrompt('> ');

	rli.on('line', (line) => {
		var words = [];
		line.replace(/(\"[^\"]*\"|\([^\)]*\)|[^\s]+)/g, function(word) {
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