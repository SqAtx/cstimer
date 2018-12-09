"use strict";

window.onerror = function(msg, url, line, col, error) {
	if (error === undefined) {
		error = {};
	}
	$.get('bugReport', {
		'msg': msg,
		'url': url,
		'line': line,
		'col': col,
		'stack': error.stack
	});
	console.log(msg, url, line, col, error);
};

(function() {
	var constants = ['OK_LANG', 'CANCEL_LANG', 'RESET_LANG', 'ABOUT_LANG', 'ZOOM_LANG', 'BUTTON_TIME_LIST', 'BUTTON_OPTIONS', 'BUTTON_EXPORT', 'BUTTON_DONATE', 'PROPERTY_USEINS', 'PROPERTY_USEINS_STR', 'PROPERTY_VOICEINS', 'PROPERTY_VOICEINS_STR', 'PROPERTY_PHASES', 'PROPERTY_TIMERSIZE', 'PROPERTY_USEMILLI', 'PROPERTY_SMALLADP', 'PROPERTY_SCRSIZE', 'PROPERTY_SCRMONO', 'PROPERTY_SCRLIM', 'PROPERTY_SCRALIGN', 'PROPERTY_SCRALIGN_STR', 'EXPORT_DATAEXPORT', 'EXPORT_TOFILE', 'EXPORT_FROMFILE', 'EXPORT_TOSERV', 'EXPORT_FROMSERV', 'EXPORT_FROMOTHER', 'EXPORT_USERID', 'EXPORT_INVID', 'EXPORT_ERROR', 'EXPORT_NODATA', 'EXPORT_UPLOADED', 'BUTTON_SCRAMBLE', 'BUTTON_TOOLS', 'IMAGE_UNAVAILABLE', 'TOOLS_SELECTFUNC', 'TOOLS_CROSS', 'TOOLS_EOLINE', 'TOOLS_ROUX1', 'TOOLS_GIIKER', 'TOOLS_IMAGE', 'TOOLS_STATS', 'TOOLS_DISTRIBUTION', 'TOOLS_TREND', 'TOOLS_METRONOME', 'PROPERTY_IMGSIZE', 'TIMER_INSPECT', 'TIMER_SOLVE', 'PROPERTY_USEMOUSE', 'PROPERTY_TIMEU', 'PROPERTY_TIMEU_STR', 'PROPERTY_PRETIME', 'PROPERTY_ENTERING', 'PROPERTY_ENTERING_STR', 'PROPERTY_COLOR', 'PROPERTY_COLORS', 'PROPERTY_VIEW', 'PROPERTY_VIEW_STR', 'COLOR_EXPORT', 'COLOR_IMPORT', 'COLOR_FAIL', 'PROPERTY_FONTCOLOR_STR', 'PROPERTY_COLOR_STR', 'PROPERTY_FONT', 'PROPERTY_FONT_STR', 'PROPERTY_FORMAT', 'PROPERTY_USEKSC', 'PROPERTY_NTOOLS', 'PROPERTY_AHIDE', 'SCRAMBLE_LAST', 'SCRAMBLE_NEXT', 'SCRAMBLE_SCRAMBLE', 'SCRAMBLE_LENGTH', 'SCRAMBLE_INPUT', 'PROPERTY_VRCMP', 'PROPERTY_VRCMPS', 'PROPERTY_GIIKERVRC', 'PROPERTY_GIISOK_DELAY', 'PROPERTY_GIISOK_DELAYS', 'PROPERTY_GIISOK_KEY', 'PROPERTY_GIISOK_MOVE', 'PROPERTY_GIISOK_MOVES', 'PROPERTY_GIISBEEP', 'PROPERTY_GIIRST', 'PROPERTY_GIIRSTS', 'CONFIRM_GIIRST', 'PROPERTY_GIIAED', 'scrdata', 'SCRAMBLE_NOOBST', 'SCRAMBLE_NOOBSS', 'STATS_CFM_RESET', 'STATS_CFM_DELSS', 'STATS_CFM_DELMUL', 'STATS_CFM_DELETE', 'STATS_COMMENT', 'STATS_CURROUND', 'STATS_CURSESSION', 'STATS_SSMGR_TITLE', 'STATS_SSMGR_NAME', 'STATS_SSMGR_DETAIL', 'STATS_SSMGR_OP', 'STATS_AVG', 'STATS_SOLVE', 'STATS_TIME', 'STATS_SESSION', 'STATS_SESSION_NAME', 'STATS_STRING', 'STATS_PREC', 'STATS_PREC_STR', 'STATS_TYPELEN', 'PROPERTY_PRINTSCR', 'PROPERTY_PRINTDATE', 'PROPERTY_SUMMARY', 'PROPERTY_IMRENAME', 'PROPERTY_SCR2SS', 'PROPERTY_SS2SCR', 'PROPERTY_SS2PHASES', 'PROPERTY_STATINV', 'PROPERTY_STATAL', 'PROPERTY_DELMUL', 'MODULE_NAMES', 'BGIMAGE_URL', 'BGIMAGE_INVALID', 'BGIMAGE_OPACITY', 'BGIMAGE_IMAGE', 'BGIMAGE_IMAGE_STR', 'SHOW_AVG_LABEL', 'TOOLS_SCRGEN', 'SCRGEN_NSCR', 'SCRGEN_PRE', 'SCRGEN_GEN'];
	for (var i = 0; i < constants.length; i++) {
		window[constants[i]] = window[constants[i]] || '';
	}
})();

var mathlib = (function() {
	var DEBUG = false;

	var Cnk = [],
		fact = [1];
	for (var i = 0; i < 32; ++i) {
		Cnk[i] = [];
		for (var j = 0; j < 32; ++j) {
			Cnk[i][j] = 0;
		}
	}
	for (var i = 0; i < 32; ++i) {
		Cnk[i][0] = Cnk[i][i] = 1;
		fact[i + 1] = fact[i] * (i + 1);
		for (var j = 1; j < i; ++j) {
			Cnk[i][j] = Cnk[i - 1][j - 1] + Cnk[i - 1][j];
		}
	}

	function circleOri(arr, a, b, c, d, ori) {
		var temp = arr[a];
		arr[a] = arr[d] ^ ori;
		arr[d] = arr[c] ^ ori;
		arr[c] = arr[b] ^ ori;
		arr[b] = temp ^ ori;
	}

	function circle(arr) {
		var length = arguments.length - 1,
			temp = arr[arguments[length]];
		for (var i = length; i > 1; i--) {
			arr[arguments[i]] = arr[arguments[i - 1]];
		}
		arr[arguments[1]] = temp;
		return circle;
	}

	function getPruning(table, index) {
		return table[index >> 3] >> ((index & 7) << 2) & 15;
	}

	function setNPerm(arr, idx, n) {
		var i, j;
		arr[n - 1] = 0;
		for (i = n - 2; i >= 0; --i) {
			arr[i] = idx % (n - i);
			idx = ~~(idx / (n - i));
			for (j = i + 1; j < n; ++j) {
				arr[j] >= arr[i] && ++arr[j];
			}
		}
	}

	function getNPerm(arr, n) {
		var i, idx, j;
		idx = 0;
		for (i = 0; i < n; ++i) {
			idx *= n - i;
			for (j = i + 1; j < n; ++j) {
				arr[j] < arr[i] && ++idx;
			}
		}
		return idx;
	}

	function getNParity(idx, n) {
		var i, p;
		p = 0;
		for (i = n - 2; i >= 0; --i) {
			p ^= idx % (n - i);
			idx = ~~(idx / (n - i));
		}
		return p & 1;
	}

	function get8Perm(arr, n) {
		if (n === undefined) {
			n = 8;
		}
		var i, idx, v, val;
		idx = 0;
		val = 1985229328;
		for (i = 0; i < n - 1; ++i) {
			v = arr[i] << 2;
			idx = (n - i) * idx + (val >> v & 7);
			val -= 286331152 << v;
		}
		return idx;
	}

	function set8Perm(arr, idx, n) {
		if (n === undefined) {
			n = 8;
		}
		n--;
		var i, m, p, v, val;
		val = 1985229328;
		for (i = 0; i < n; ++i) {
			p = fact[n - i];
			v = ~~(idx / p);
			idx %= p;
			v <<= 2;
			arr[i] = val >> v & 7;
			m = (1 << v) - 1;
			val = (val & m) + (val >> 4 & ~m);
		}
		arr[n] = val & 7;
	}

	function createMove(moveTable, size, doMove, N_MOVES) {
		N_MOVES = N_MOVES || 6;
		for (var j = 0; j < N_MOVES; j++) {
			moveTable[j] = [];
			for (var i = 0; i < size; i++) {
				moveTable[j][i] = doMove(i, j);
			}
		}
	}

	function edgeMove(arr, m) {
		if (m == 0) { //F
			circleOri(arr, 0, 7, 8, 4, 1);
		} else if (m == 1) { //R
			circleOri(arr, 3, 6, 11, 7, 0);
		} else if (m == 2) { //U
			circleOri(arr, 0, 1, 2, 3, 0);
		} else if (m == 3) { //B
			circleOri(arr, 2, 5, 10, 6, 1);
		} else if (m == 4) { //L
			circleOri(arr, 1, 4, 9, 5, 0);
		} else if (m == 5) { //D
			circleOri(arr, 11, 10, 9, 8, 0);
		}
	}

	function CubieCube() {
		this.ca = [0, 1, 2, 3, 4, 5, 6, 7];
		this.ea = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
	}

	CubieCube.EdgeMult = function(a, b, prod) {
		for (var ed = 0; ed < 12; ed++) {
			prod.ea[ed] = a.ea[b.ea[ed] >> 1] ^ (b.ea[ed] & 1);
		}
	}

	CubieCube.CornMult = function(a, b, prod) {
		for (var corn = 0; corn < 8; corn++) {
			var ori = ((a.ca[b.ca[corn] & 7] >> 3) + (b.ca[corn] >> 3)) % 3;
			prod.ca[corn] = a.ca[b.ca[corn] & 7] & 7 | ori << 3;
		}
	}

	CubieCube.CubeMult = function(a, b, prod) {
		CubieCube.CornMult(a, b, prod);
		CubieCube.EdgeMult(a, b, prod);
	}

	CubieCube.prototype.init = function(ca, ea) {
		this.ca = ca.slice();
		this.ea = ea.slice();
		return this;
	}

	CubieCube.prototype.isEqual = function(c) {
		for (var i = 0; i < 8; i++) {
			if (this.ca[i] != c.ca[i]) {
				return false;
			}
		}
		for (var i = 0; i < 12; i++) {
			if (this.ea[i] != c.ea[i]) {
				return false;
			}
		}
		return true;
	}

	var cornerFacelet = [
		[8, 9, 20],
		[6, 18, 38],
		[0, 36, 47],
		[2, 45, 11],
		[29, 26, 15],
		[27, 44, 24],
		[33, 53, 42],
		[35, 17, 51]
	];
	var edgeFacelet = [
		[5, 10],
		[7, 19],
		[3, 37],
		[1, 46],
		[32, 16],
		[28, 25],
		[30, 43],
		[34, 52],
		[23, 12],
		[21, 41],
		[50, 39],
		[48, 14]
	];

	CubieCube.prototype.toFaceCube = function(cFacelet, eFacelet) {
		cFacelet = cFacelet || cornerFacelet;
		eFacelet = eFacelet || edgeFacelet;
		var ts = "URFDLB";
		var f = [];
		for (var i = 0; i < 54; i++) {
			f[i] = ts[~~(i / 9)];
		}
		for (var c = 0; c < 8; c++) {
			var j = this.ca[c] & 0x7; // cornercubie with index j is at
			var ori = this.ca[c] >> 3; // Orientation of this cubie
			for (var n = 0; n < 3; n++)
				f[cFacelet[c][(n + ori) % 3]] = ts[~~(cFacelet[j][n] / 9)];
		}
		for (var e = 0; e < 12; e++) {
			var j = this.ea[e] >> 1; // edgecubie with index j is at edgeposition
			var ori = this.ea[e] & 1; // Orientation of this cubie
			for (var n = 0; n < 2; n++)
				f[eFacelet[e][(n + ori) % 2]] = ts[~~(eFacelet[j][n] / 9)];
		}
		return f.join("");
	}

	CubieCube.prototype.invFrom = function(cc) {
		for (var edge = 0; edge < 12; edge++) {
			this.ea[cc.ea[edge] >> 1] = edge << 1 | cc.ea[edge] & 1;
		}
		for (var corn = 0; corn < 8; corn++) {
			this.ca[cc.ca[corn] & 0x7] = corn | 0x20 >> (cc.ca[corn] >> 3) & 0x18;
		}
		return this;
	}

	CubieCube.prototype.fromFacelet = function(facelet, cFacelet, eFacelet) {
		cFacelet = cFacelet || cornerFacelet;
		eFacelet = eFacelet || edgeFacelet;
		var count = 0;
		var f = [];
		var centers = facelet[4] + facelet[13] + facelet[22] + facelet[31] + facelet[40] + facelet[49];
		for (var i = 0; i < 54; ++i) {
			f[i] = centers.indexOf(facelet[i]);
			if (f[i] == -1) {
				return -1;
			}
			count += 1 << (f[i] << 2);
		}
		if (count != 0x999999) {
			return -1;
		}
		var col1, col2, i, j, ori;
		for (i = 0; i < 8; ++i) {
			for (ori = 0; ori < 3; ++ori)
				if (f[cFacelet[i][ori]] == 0 || f[cFacelet[i][ori]] == 3)
					break;
			col1 = f[cFacelet[i][(ori + 1) % 3]];
			col2 = f[cFacelet[i][(ori + 2) % 3]];
			for (j = 0; j < 8; ++j) {
				if (col1 == ~~(cFacelet[j][1] / 9) && col2 == ~~(cFacelet[j][2] / 9)) {
					this.ca[i] = j | ori % 3 << 3;
					break;
				}
			}
		}
		for (i = 0; i < 12; ++i) {
			for (j = 0; j < 12; ++j) {
				if (f[eFacelet[i][0]] == ~~(eFacelet[j][0] / 9) && f[eFacelet[i][1]] == ~~(eFacelet[j][1] / 9)) {
					this.ea[i] = j << 1;
					break;
				}
				if (f[eFacelet[i][0]] == ~~(eFacelet[j][1] / 9) && f[eFacelet[i][1]] == ~~(eFacelet[j][0] / 9)) {
					this.ea[i] = j << 1 | 1;
					break;
				}
			}
		}
		return this;
	}

	var moveCube = [];
	for (var i = 0; i < 18; i++) {
		moveCube[i] = new CubieCube()
	}
	moveCube[0].init([3, 0, 1, 2, 4, 5, 6, 7], [6, 0, 2, 4, 8, 10, 12, 14, 16, 18, 20, 22]);
	moveCube[3].init([20, 1, 2, 8, 15, 5, 6, 19], [16, 2, 4, 6, 22, 10, 12, 14, 8, 18, 20, 0]);
	moveCube[6].init([9, 21, 2, 3, 16, 12, 6, 7], [0, 19, 4, 6, 8, 17, 12, 14, 3, 11, 20, 22]);
	moveCube[9].init([0, 1, 2, 3, 5, 6, 7, 4], [0, 2, 4, 6, 10, 12, 14, 8, 16, 18, 20, 22]);
	moveCube[12].init([0, 10, 22, 3, 4, 17, 13, 7], [0, 2, 20, 6, 8, 10, 18, 14, 16, 4, 12, 22]);
	moveCube[15].init([0, 1, 11, 23, 4, 5, 18, 14], [0, 2, 4, 23, 8, 10, 12, 21, 16, 18, 7, 15]);
	for (var a = 0; a < 18; a += 3) {
		for (var p = 0; p < 2; p++) {
			CubieCube.EdgeMult(moveCube[a + p], moveCube[a], moveCube[a + p + 1]);
			CubieCube.CornMult(moveCube[a + p], moveCube[a], moveCube[a + p + 1]);
		}
	}

	CubieCube.moveCube = moveCube;

	CubieCube.prototype.edgeCycles = function() {
		var visited = [];
		var small_cycles = [0, 0, 0];
		var cycles = 0;
		var parity = false;
		for (var x = 0; x < 12; ++x) {
			if (visited[x]) {
				continue
			}
			var length = -1;
			var flip = false;
			var y = x;
			do {
				visited[y] = true;
				++length;
				flip ^= this.ea[y] & 1;
				y = this.ea[y] >> 1;
			} while (y != x);
			cycles += length >> 1;
			if (length & 1) {
				parity = !parity;
				++cycles;
			}
			if (flip) {
				if (length == 0) {
					++small_cycles[0];
				} else if (length & 1) {
					small_cycles[2] ^= 1;
				} else {
					++small_cycles[1];
				}
			}
		}
		small_cycles[1] += small_cycles[2];
		if (small_cycles[0] < small_cycles[1]) {
			cycles += (small_cycles[0] + small_cycles[1]) >> 1;
		} else {
			var flip_cycles = [0, 2, 3, 5, 6, 8, 9];
			cycles += small_cycles[1] + flip_cycles[(small_cycles[0] - small_cycles[1]) >> 1];
		}
		return cycles - parity;
	}

	function createPrun(prun, init, size, maxd, doMove, N_MOVES, N_POWER, N_INV) {
		var isMoveTable = $.isArray(doMove);
		N_MOVES = N_MOVES || 6;
		N_POWER = N_POWER || 3;
		N_INV = N_INV || 256;
		maxd = maxd || 256;
		for (var i = 0, len = (size + 7) >>> 3; i < len; i++) {
			prun[i] = -1;
		}
		prun[init >> 3] ^= 15 << ((init & 7) << 2);
		var val = 0;
		// var t = +new Date;
		for (var l = 0; l <= maxd; l++) {
			var done = 0;
			var inv = l >= N_INV;
			var fill = (l + 1) ^ 15;
			var find = inv ? 0xf : l;
			var check = inv ? l : 0xf;

			out: for (var p = 0; p < size; p++, val >>= 4) {
				if ((p & 7) == 0) {
					val = prun[p >> 3];
					if (!inv && val == -1) {
						p += 7;
						continue;
					}
				}
				if ((val & 0xf) != find) {
					continue;
				}
				for (var m = 0; m < N_MOVES; m++) {
					var q = p;
					for (var c = 0; c < N_POWER; c++) {
						q = isMoveTable ? doMove[m][q] : doMove(q, m);
						if (getPruning(prun, q) != check) {
							continue;
						}
						++done;
						if (inv) {
							prun[p >> 3] ^= fill << ((p & 7) << 2);
							continue out;
						}
						prun[q >> 3] ^= fill << ((q & 7) << 2);
					}
				}
			}
			if (done == 0) {
				break;
			}
			if (DEBUG) {
				console.log(done);
			}
		}
	}

	//state_params: [[init, doMove, size, [maxd], [N_INV]], [...]...]
	function Solver(N_MOVES, N_POWER, state_params) {
		this.N_STATES = state_params.length;
		this.N_MOVES = N_MOVES;
		this.N_POWER = N_POWER;
		this.state_params = state_params;
		this.inited = false;
	}

	var _ = Solver.prototype;

	_.search = function(state, minl, MAXL) {
		MAXL = (MAXL || 99) + 1;
		if (!this.inited) {
			this.move = [];
			this.prun = [];
			for (var i = 0; i < this.N_STATES; i++) {
				var state_param = this.state_params[i];
				var init = state_param[0];
				var doMove = state_param[1];
				var size = state_param[2];
				var maxd = state_param[3];
				var N_INV = state_param[4];
				this.move[i] = [];
				this.prun[i] = [];
				createMove(this.move[i], size, doMove, this.N_MOVES);
				createPrun(this.prun[i], init, size, maxd, this.move[i], this.N_MOVES, this.N_POWER, N_INV);
			}
			this.inited = true;
		}
		this.sol = [];
		for (var maxl = minl; maxl < MAXL; maxl++) {
			if (this.idaSearch(state, maxl, -1)) {
				break;
			}
		}
		return maxl == MAXL ? null : this.sol.reverse();
	}

	_.toStr = function(sol, move_map, power_map) {
		var ret = [];
		for (var i = 0; i < sol.length; i++) {
			ret.push(move_map[sol[i][0]] + power_map[sol[i][1]]);
		}
		return ret.join(' ').replace(/ +/g, ' ');
	}

	_.idaSearch = function(state, maxl, lm) {
		var N_STATES = this.N_STATES;
		for (var i = 0; i < N_STATES; i++) {
			if (getPruning(this.prun[i], state[i]) > maxl) {
				return false;
			}
		}
		if (maxl == 0) {
			return true;
		}
		for (var move = 0; move < this.N_MOVES; move++) {
			if (move == lm) {
				continue;
			}
			var cur_state = state.slice();
			for (var power = 0; power < this.N_POWER; power++) {
				for (var i = 0; i < N_STATES; i++) {
					cur_state[i] = this.move[i][move][cur_state[i]];
				}
				if (this.idaSearch(cur_state, maxl - 1, move)) {
					this.sol.push([move, power]);
					return true;
				}
			}
		}
		return false;
	}

	function rndEl(x) {
		return x[~~(Math.random() * x.length)];
	}

	function rn(n) {
		return ~~(Math.random() * n)
	}

	function rndProb(plist) {
		var cum = 0;
		var curIdx = 0;
		for (var i = 0; i < plist.length; i++) {
			if (plist[i] == 0) {
				continue;
			}
			if (Math.random() < plist[i] / (cum + plist[i])) {
				curIdx = i;
			}
			cum += plist[i];
		}
		return curIdx;
	}

	return {
		Cnk: Cnk,
		fact: fact,
		getPruning: getPruning,
		setNPerm: setNPerm,
		getNPerm: getNPerm,
		getNParity: getNParity,
		get8Perm: get8Perm,
		set8Perm: set8Perm,
		createMove: createMove,
		edgeMove: edgeMove,
		circle: circle,
		circleOri: circleOri,
		createPrun: createPrun,
		CubieCube: CubieCube,
		SOLVED_FACELET: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
		rn: rn,
		rndEl: rndEl,
		rndProb: rndProb,
		Solver: Solver
	}

})();

if (window.performance && window.performance.now) {
	$.now = function() {
		return Math.floor(window.performance.now());
	}
}

$.urlParam = function(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results == null) {
		return null;
	} else {
		return results[1] || 0;
	}
}

$.hashParam = function(name) {
	var results = new RegExp('[#&]' + name + '=([^&#]*)').exec(window.location.hash);
	if (results == null) {
		return null;
	} else {
		return results[1] || 0;
	}
}

if ('serviceWorker' in navigator) {
	$(function() {
		navigator.serviceWorker.register('sw.js');
	});
} else if (window.applicationCache) {
	$(function() {
		applicationCache.addEventListener('updateready', function(e) {
			if (applicationCache.status == applicationCache.UPDATEREADY) {
				applicationCache.swapCache();
				location.reload();
			}
		}, false);
	});
}

var TimerDataConverter = (function() {

	// {'name': [regex, converter]}
	var Timers = {}

	Timers['csTimer'] = [/^{"session1"/i, function(data) {
		data = JSON.parse(data);
		var sessionData = {};
		try {
			sessionData = JSON.parse(JSON.parse(data['properties'])['sessionData']);
		} catch (e) {}

		var ret = [];
		for (var key in data) {
			var m = /^session(\d+)$/.exec(key);
			if (!m) {
				continue;
			}
			var curSession = {};
			var times = [];
			try {
				times = JSON.parse(data[key]);
			} catch (e) {}
			// ensure valid times, and do not import empty sessions
			if (!$.isArray(times) || times.length == 0) {
				continue;
			}
			var validTimes = [];
			for (var i = 0; i < times.length; i++) {
				var time = times[i];
				if (!$.isArray(time) || !$.isArray(time[0])) {
					continue;
				}
				time[0] = $.map(time[0], Number);
				validTimes.push(time);
			}
			curSession['times'] = validTimes;
			if (~~m[1] in sessionData) {
				var curData = sessionData[~~m[1]];
				curSession['name'] = curData['name'] || m[1];
				curSession['scr'] = curData['scr'];
				curSession['phases'] = curData['phases'];
				curSession['rank'] = curData['rank'];
			} else {
				curSession['name'] = m[1];
				curSession['rank'] = ret.length + 1;
			}
			ret.push(curSession);
		}
		ret.sort(function(a, b) {
			return a['rank'] - b['rank'];
		});
		return ret;
	}];

	Timers['ZYXTimer'] = [/^Session: /i, function(data) {

	}];

	Timers['TwistyTimer'] = [/^Puzzle,Category,Time\(millis\),Date\(millis\),Scramble,Penalty,Comment/i, function(data) {

	}];

	Timers['BlockKeeper'] = [/^{"puzzles":\[{"name":/i, function(data) {
		data = JSON.parse(data)["puzzles"];
		var ScrambleMap = {
			'3x3x3': '333',
			'2x2x2': '222so',
			'4x4x4': '444wca',
			'5x5x5': '555wca',
			'Pyraminx': 'pyrso',
			'Skewb': 'skbso',
			'Megaminx': 'mgmp',
			'Square-1': 'sqrs',
			'Clock': 'clkwca',
			'6x6x6': '666wca',
			'7x7x7': '777wca',
			'3x3x3 BLD': '333ni',
			'4x4x4 BLD': '444bld',
			'5x5x5 BLD': '555bld'
		};

		var ret = [];
		$.each(data, function(idx, puzzle) {
			var puzzleName = puzzle['name'];
			var puzzleScr = puzzle['scrambler'];
			var puzzleSplit = puzzle['splits'];
			$.each(puzzle['sessions'], function(idx, session) {
				var sessionName = session['name'];
				var timeList = [];
				$.each(session['records'], function(idx, val) {
					var time = [0, Math.round(val['time'] * 1000)];
					switch (val['result']) {
						case '+2':
							time[0] = 2000;
							break;
						case 'DNF':
							time[0] = -1;
							break;
					}
					Array.prototype.push.apply(time, $.map(val['split'].reverse(), function(value) {
						return Math.round(value * 1000);
					}));
					timeList.push([time, val['scramble'], val['comment'] || '', Math.round(val['date'] / 1000)]);
				});
				if (timeList.length == 0) {
					return;
				}
				ret.push({
					'name': (puzzleName + '-' + sessionName),
					'phases': puzzleSplit,
					'scr': ScrambleMap[puzzleScr] || '333',
					'times': timeList
				})
			});
		});
		return ret;
	}];

	Timers['PrismaTimer'] = [/^[^\t\n]*\t[^\t\n]*\t[^\t\n]*\t[^\t\n]*\t[^\t\n]*\n/i, function(data) {

	}];

	function convert(data) {
		var ret = undefined;
		for (var timer in Timers) {
			if (Timers[timer][0].exec(data)) {
				console.log('try read by ' + timer);
				try {
					ret = Timers[timer][1](data);
					break;
				} catch (e) {}
			}
		}
		return ret;
	}

	//return [session1, session2, session3, ...]
	//session = {'name': name, 'scr': scr, 'phases': phases, 'times': times}
	return convert;
})();