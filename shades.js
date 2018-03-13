(function (global) {
	'use strict';
	var doc = document;

	function WindowShades() {
		var scale = 768 / 1366;
		this.ele = null;
		this.data = [];
		this.num = 20;
		this.width = Math.ceil(doc.documentElement.clientWidth || doc.body.clientWidth);
		this.height = this.width * scale;
		this.cur = 0;
		this.next = 1;
		this.btn = [];
	}

	WindowShades.prototype = {
		constructor: WindowShades,
		create: function (id) {
			var el = doc.getElementById(id.wrap),
				btn = doc.getElementById(id.btn);
			this.ele = el;
			this.btn = btn;
			el.setAttribute('style', 'margin: 0 auto; overflow: hidden; position: relative; top: 0; left: 0; width: ' + this.width + 'px; height: ' + this.height + 'px;');
			this.css(btn, 'zIndex', '888888888888');
			this.c_element();
			this.bindEvent(this.btn, 'click', this.turn);
			this.bindEvent(this.btn, 'touchstart', this.turn);
		},
		c_element: function () {
			var w = this.width,
				h = this.height,
				data = this.data,
				self = this,
				len = this.num,
				i = 0,
				parent = this.ele,
				s_data = [],
				b_data = [],
				btn = this.btn;

			this.each(data, function (index, item) {
				var section = doc.createElement('section'),
					bar = doc.createElement('span');
				section.setAttribute('style', 'position: absolute; top: 0; left: 0; width: ' + this.width + 'px; height: ' + this.height + 'px;');
				this.css(section, 'zIndex', this.data.length - index);
				bar.setAttribute('style', 'display: block; margin-bottom: 15px; width: 25px; height: 5px; background: gray; -webkit-transition: width .5s; transition: width .5s; cursor: pointer;');

				s_data.push(section);
				b_data.push(bar);
				this.append(section, parent);
				this.append(bar, btn);
			});

			this.each(s_data, function (index, item) {
				var frag = doc.createDocumentFragment(),
					div = doc.createElement('div');

				this.c_div(len, item, index);
			});

			this.data = s_data;
			this.btn = b_data;
		},
		c_div: function (num, ele, index) {
			var div = null,
				i = 0,
				len = num,
				width = this.width,
				height = this.height,
				w = Math.ceil(width / len),
				src = this.data[index];

			for (; i < len; i ++) {
				div = doc.createElement('div');
				div.setAttribute('style', 'position: absolute; top: 0; left: ' + (i * w) + 'px; width: ' + w + 'px; height: ' + height + 'px; background: url(' + src + ') no-repeat left top / ' + width + 'px  100%; background-position: ' + (-i * w) + 'px 0;');
				this.append(div, ele);
			}
		},
		css: function(ele, property, value) {
			if (value) {
				ele.style[property] = value;
			} else {
				try {
					var style = getComputedStyle(ele, null) || ele.currentStyle;
					return style[property];
				} catch(e) {
					return false;
				}
			}
			return this;
		},
		append: function (source, target) {
			target.appendChild(source);
			return this;
		},
		each: function (arr, fn) {
			var i = 0,
				len = arr.length || 0,
				self = this;

			if (!len && len < 0) {
				return false;
			}

			for (; i < len; i ++) {
				(function (n) {
					fn && fn.call(self, n, arr[n]);
				})(i);
			}

		},
		toArray: function (arr) {
			return [].slice.call(arr);
		},
		bindEvent: function (ele, type, fn) {
			var self = this;

			if (Object.prototype.toString.call(ele) !== '[object Array]') {
				ele = [ele];
			}

			this.each(ele, function (index, item) {
				function tri(e) {
					e = e || window.event;
					e.preventDefault();
					item.index = index;
					fn && fn.call(item, e, self);
				}

				try {
					if (item.addEventListener) {
						item.addEventListener(type, tri, false);
					} else if (item.attchEvent) {
						item.attchEvent('on' + type, tri);
					}
				} catch(e) {}
			});
		},
		turn: function (e, self) {
			var index = this.index,
				cur = self.cur,
				next = self.next,
				top = false,
				height = self.height,
				posY = height,
				zIndex = self.data.length;

			self.css(this, 'width', '40px');
			self.css(this, 'background', '#00aff1');
			self.each(self.siblings(this), function (index, item) {
				self.css(item, 'width', '25px');
				self.css(item, 'background', 'gray');
			});

			if (index < cur) {
				top = true;
				posY = - height;
			}

			self.css(self.data[index], 'zIndex', zIndex);
			self.data[index].className = 'show';
			self.each(self.siblings(self.data[index]), function (index, item) {
				item.className = 'hidden';
				self.css(item, 'zIndex', (this.data.length - 1) - index);
				self.css(self.data[index], 'top', '0px');
			});

			self.each(self.data[index].children, function (index, item) {
				var offset = posY < 0 ? -(index * 40) : (posY > 0 ? (index * 40) : (index * 40));
				self.css(item, 'transform', 'translateY(' + offset + 'px)');
			});

			self.css(self.data[index], 'top', '0px');
			self.move(self.data[index].children, posY);

			next = index + 1;
			self.cur = index;
		},
		siblings: function (ele) {
			var data = [],
				e1 = ele,
				e2 = ele;
			while(e1.previousSibling) {
				data.unshift(e1.previousSibling);
				e1 = e1.previousSibling;
			}
			while(e2.nextSibling) {
				data.push(e2.nextSibling);
				e2 = e2.nextSibling;
			}

			return data;
		},
		move: function (ele, target) {
			var self = this,
				timer,
				late;

			this.each(ele, function (index, item) {
				var offset = target < 0 ? -20 : (target > 0 ? 20 : 20),
					cur;

				function run() {
					cur = parseInt(item.style.transform.match(/[^\(]\d*px/i));
					if (cur === 0) {
						// self.css(item, 'transform', 'translateY(0px)');
						return false;
					} else {
						timer = requestAnimationFrame(run);
					}
					self.css(item, 'transform', 'translateY(' + (cur - offset) + 'px)');
					// console.log(cur);

				}

				run();
				
			});
		},
	};

	global.S = new WindowShades();
})(this);