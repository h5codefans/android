// built.js为js目录下的所有压缩文件
// 输入node r.js -o baseUrl=js name=main out=built.js excludeShallow=selector
define("selector", [], function() {
    function a(a, b) {
        function t(a, b, c) {
            function e(a) {
                var e = b == "className" ? a.className : a.getAttribute(b);
                if (e) {
                    if (!c) return !0;
                    if (d.test(e)) return !0
                }
                return !1
            }
            var d = RegExp("(?:^|\\s+)" + c + "(?:\\s+|$)"),
                f = -1,
                g, h = -1,
                i = [];
            while (g = a[++f]) e(g) && (i[++h] = g);
            return i
        }
        var c = a,
            d = document,
            e = /^#[\w\-]+/,
            f = /^([\w\-]+)?\.([\w\-]+)/,
            g = /^([\w\*]+)$/,
            h = /^([\w\-]+)?\[([\w]+)(=(\w+))?\]/,
            b = b == undefined ? document : typeof b == "string" ? d.getElementById(b.substr(1, b.length)) : b;
        if (e.test(c)) return d.getElementById(c.substr(1, c.length));
        if (b.querySelectorAll) {
            if (b.nodeType == 1) {
                var i = b.id,
                    j = b.id = "__$$__";
                try {
                    return b.querySelectorAll("#" + j + " " + c)
                } catch (k) {} finally {
                    i ? b.id = i : b.removeAttribute("id")
                }
            }
            return b.querySelectorAll(c)
        }
        if (f.test(c)) {
            var l = c.split("."),
                m = l[0],
                n = l[1],
                o, p, q = [];
            if (b.getElementsByClassName) {
                var r = b.getElementsByClassName(n);
                if (m) {
                    for (var s = 0, o = r.length; s < o; s++) r[s].tagName.toLowerCase() == m && q.push(r[s]);
                    return q
                }
                return r
            }
            return p = b.getElementsByTagName(m || "*"), t(p, "className", n)
        }
        if (g.test(c)) return b.getElementsByTagName(c);
        if (h.test(c)) {
            var l = h.exec(c),
                p = b.getElementsByTagName(l[1] || "*");
            return t(p, l[2], l[4])
        }
    }
    return a
}), define("cache", [], function() {
    function d(b) {
        return b[c] || (b[c] = ++a)
    }
    var a = 0,
        b = {},
        c = "_ guid _";
    return {
        set: function(a, c, e) {
            if (!a) throw new Error("setting failed, invalid element");
            var f = d(a),
                g = b[f] || (b[f] = {});
            return c && (g[c] = e), g
        },
        get: function(a, c, e) {
            if (!a) throw new Error("getting failed, invalid element");
            var f = d(a),
                g = b[f] || e && (b[f] = {});
            return g ? c !== undefined ? g[c] || null : g : null
        },
        has: function(a, b) {
            return this.get(a, b) !== null
        },
        remove: function(a, c) {
            var e = typeof a == "object" ? d(a) : a,
                f = b[e];
            return f ? (c !== undefined ? delete f[c] : delete b[e], !0) : !1
        }
    }
}), define("event", ["cache"], function(a) {
    function h() {
        return !1
    }

    function i() {
        return !0
    }

    function j() {
        return (new Date).getTime()
    }

    function k(a) {
        for (var b in a) return !1;
        return !0
    }

    function l(b, c, d, g) {
        if (b.nodeType === 3 || b.nodeType === 8) return;
        if (d === !1) d = h;
        else if (!d) return;
        var i = a.get(b, undefined, !0),
            j = i.events,
            k = i.handle,
            c = c.split(" ");
        j || (i.events = j = {}), k || (i.handle = k = function(a) {
            return e !== a.type ? n.apply(k.elem, arguments) : undefined
        }), k.elem = b;
        var l, m = 0,
            o;
        while (l = c[m++]) {
            var p = {
                    handler: d,
                    data: g
                },
                q = j[l];
            l.indexOf(".") > -1 ? (o = l.split("."), l = o.shift(), p.namespace = o.slice(0).join(".")) : p.namespace = "", q || (q = j[l] = [], f(b, l, k)), q.push(p)
        }
        b = null
    }

    function m(b, c, f, g) {
        var h = c.type || c,
            i = [],
            j;
        h.indexOf("!") >= 0 && (h = h.slice(0, -1), j = !0), h.indexOf(".") >= 0 && (i = h.split("."), h = i.shift(), i.sort());
        if (!b || b.nodeType === 3 || b.nodeType === 8) return;
        c = typeof c == "object" ? c[d] ? c : new Event(h, c) : new Event(h), c.type = h, c.exclusive = j, c.namespace = i.join("."), c.namespace_re = new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)");
        if (g || !b) c.preventDefault(), c.stopPropagation();
        c.result = undefined, c.target = b, f = f != null ? [f] : [], f.unshift(c);
        var k = b,
            l = h.indexOf(":") < 0 ? "on" + h : "";
        do {
            var m = a.get(k, "handle");
            c.currentTarget = k, m && m.apply(k, f), l && k[l] && k[l].apply(k, f) === !1 && (c.result = !1, c.preventDefault()), k = k.parentNode || k.ownerDocument || k === c.target.ownerDocument && window
        } while (k && !c.isPropagationStopped());
        if (!c.isDefaultPrevented()) {
            var n;
            if (h !== "click" || b.nodeName !== "A") {
                try {
                    l && b[h] && (n = b[l], n && (b[l] = null), e = h, b[h]())
                } catch (o) {}
                n && (b[l] = n), e = undefined
            }
        }
        return c.result
    }

    function n(b) {
        b = p(b || window.event);
        var c = ((a.get(this, "events") || {})[b.type] || []).slice(0),
            d = !b.exclusive && !b.namespace,
            e = Array.prototype.slice.call(arguments, 0);
        b.currentTarget = this;
        for (var f = 0, g = c.length; f < g; f++) {
            var h = c[f];
            if (d || b.namespace_re.test(h.namespace)) {
                b.handler = h.handler, b.data = h.data, b.handleObj = h;
                var i = h.handler.apply(this, e);
                i !== undefined && i === !1 && (b.preventDefault(), b.stopPropagation());
                if (b.isImmediatePropagationStopped()) break
            }
        }
        return b.result
    }

    function o(b, c, d) {
        if (b.nodeType === 3 || b.nodeType === 8) return;
        d === !1 && (d = h);
        var e, f, i = 0,
            j, l = a.get(b),
            m = l && l.events;
        if (!l || !m) return;
        if (!c) {
            c = c || "";
            for (e in m) o(b, e);
            return
        }
        c = c.split(" ");
        while (e = c[i++]) {
            f = e, handleObj = null, eventType = m[e] || [];
            if (!eventType) continue;
            if (!d) {
                for (j = 0; j < eventType.length; j++) handleObj = eventType[j], o(b, f, handleObj.handler), eventType.splice(j--, 1);
                continue
            }
            for (j = 0; j < eventType.length; j++) handleObj = eventType[j], d === handleObj.handler && eventType.splice(j--, 1)
        }
        eventType.length === 0 && (g(b, f, l.handle), delete m[f]);
        if (k(m)) {
            var n = l.handle;
            n && (n.elem = null), delete l.events, delete l.handle, k(l) && a.remove(b, "events")
        }
    }

    function p(a) {
        if (a[d]) return a;
        var b = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
            c = b.length,
            e = a;
        a = new Event(e);
        for (var f = c, g; f;) g = b[--f], a[g] = e[g];
        a.target || (a.target = a.srcElement || document), a.target.nodeType === 3 && (a.target = a.target.parentNode), !a.relatedTarget && a.fromElement && (a.relatedTarget = a.fromElement === a.target ? a.toElement : a.fromElement);
        if (a.pageX == null && a.clientX != null) {
            var h = document.documentElement,
                i = document.body;
            a.pageX = a.clientX + (h && h.scrollLeft || i && i.scrollLeft || 0) - (h && h.clientLeft || i && i.clientLeft || 0), a.pageY = a.clientY + (h && h.scrollTop || i && i.scrollTop || 0) - (h && h.clientTop || i && i.clientTop || 0)
        }
        return !a.which && (a.charCode || a.charCode === 0 ? a.charCode : a.keyCode) && (a.which = a.charCode || a.keyCode), !a.metaKey && a.ctrlKey && (a.metaKey = a.ctrlKey), !a.which && a.button !== undefined && (a.which = a.button & 1 ? 1 : a.button & 2 ? 3 : a.button & 4 ? 2 : 0), a
    }

    function q(a, b, c, d) {
        if (!a) return;
        if (typeof b == "object") {
            for (var e in b) q(a, e, b[e], d);
            return
        }
        l(a, b, c, d)
    }

    function r(a, b, c) {
        if (typeof b == "object")
            for (var d in b) r(a, d, b[d]);
        else o(a, b, c)
    }
    var b = window.document,
        c = !!b.addEventListener,
        d = "snandy" + ("" + Math.random()).replace(/\D/g, ""),
        e, f = c ? function(a, b, c) {
            a.addEventListener(b, c, !1)
        } : function(a, b, c) {
            a.attachEvent("on" + b, c)
        },
        g = c ? function(a, b, c) {
            a.removeEventListener(b, c, !1)
        } : function(a, b, c) {
            a.detachEvent("on" + b, c)
        };
    return Event = function(a, b) {
        if (!this.preventDefault) return new Event(a, b);
        a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? i : h) : this.type = a;
        if (b)
            for (var c in b) this[c] = b[c];
        this.timeStamp = j(), this[d] = !0
    }, Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = i;
            var a = this.originalEvent;
            a.preventDefault && a.preventDefault(), a.returnValue = !1
        },
        stopPropagation: function() {
            this.isPropagationStopped = i;
            var a = this.originalEvent;
            a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = i, this.stopPropagation()
        },
        isDefaultPrevented: h,
        isPropagationStopped: h,
        isImmediatePropagationStopped: h
    }, {
        bind: q,
        unbind: r,
        trigger: m
    }
}), require.config({
    baseUrl: "js"
}), require(["selector", "event"], function(a, b) {
    var c = a("p");
    for (var d = 0; d < c.length; d++) b.bind(c[d], "click", function() {
        alert(this.innerHTML)
    })
}), define("main", function() {})