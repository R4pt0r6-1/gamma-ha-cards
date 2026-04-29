/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, J = z.ShadowRoot && (z.ShadyCSS === void 0 || z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = Symbol(), ot = /* @__PURE__ */ new WeakMap();
let wt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (J && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = ot.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ot.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ot = (n) => new wt(typeof n == "string" ? n : n + "", void 0, Y), E = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, r, o) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + n[o + 1], n[0]);
  return new wt(e, n, Y);
}, kt = (n, t) => {
  if (J) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = z.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, n.appendChild(i);
  }
}, st = J ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ot(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tt, defineProperty: Pt, getOwnPropertyDescriptor: It, getOwnPropertyNames: Ut, getOwnPropertySymbols: Nt, getPrototypeOf: Mt } = Object, x = globalThis, at = x.trustedTypes, zt = at ? at.emptyScript : "", D = x.reactiveElementPolyfillSupport, O = (n, t) => n, V = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? zt : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, _t = (n, t) => !Tt(n, t), lt = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: _t };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let _ = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = lt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Pt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: o } = It(this.prototype, t) ?? { get() {
      return this[e];
    }, set(s) {
      this[e] = s;
    } };
    return { get: r, set(s) {
      const c = r == null ? void 0 : r.call(this);
      o == null || o.call(this, s), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? lt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const t = Mt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const e = this.properties, i = [...Ut(e), ...Nt(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(st(r));
    } else t !== void 0 && e.push(st(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return kt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var o;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const s = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : V).toAttribute(e, i.type);
      this._$Em = t, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, s;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const c = i.getPropertyOptions(r), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : V;
      this._$Em = r;
      const p = a.fromAttribute(e, c.type);
      this[r] = p ?? ((s = this._$Ej) == null ? void 0 : s.get(r)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, o) {
    var s;
    if (t !== void 0) {
      const c = this.constructor;
      if (r === !1 && (o = this[t]), i ?? (i = c.getPropertyOptions(t)), !((i.hasChanged ?? _t)(o, e) || i.useDefault && i.reflect && o === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(c._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: o }, s) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? e ?? this[t]), o !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, s] of this._$Ep) this[o] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, s] of r) {
        const { wrapped: c } = s, a = this[o];
        c !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, s, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[O("elementProperties")] = /* @__PURE__ */ new Map(), _[O("finalized")] = /* @__PURE__ */ new Map(), D == null || D({ ReactiveElement: _ }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis, ct = (n) => n, H = k.trustedTypes, dt = H ? H.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, At = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, St = "?" + b, Ht = `<${St}>`, w = document, T = () => w.createComment(""), P = (n) => n === null || typeof n != "object" && typeof n != "function", Q = Array.isArray, Rt = (n) => Q(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", L = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ht = /-->/g, pt = />/g, v = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ut = /'/g, gt = /"/g, Et = /^(?:script|style|textarea|title)$/i, Dt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), l = Dt(1), A = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), ft = /* @__PURE__ */ new WeakMap(), $ = w.createTreeWalker(w, 129);
function Ct(n, t) {
  if (!Q(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return dt !== void 0 ? dt.createHTML(t) : t;
}
const Lt = (n, t) => {
  const e = n.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = C;
  for (let c = 0; c < e; c++) {
    const a = n[c];
    let p, u, h = -1, f = 0;
    for (; f < a.length && (s.lastIndex = f, u = s.exec(a), u !== null); ) f = s.lastIndex, s === C ? u[1] === "!--" ? s = ht : u[1] !== void 0 ? s = pt : u[2] !== void 0 ? (Et.test(u[2]) && (r = RegExp("</" + u[2], "g")), s = v) : u[3] !== void 0 && (s = v) : s === v ? u[0] === ">" ? (s = r ?? C, h = -1) : u[1] === void 0 ? h = -2 : (h = s.lastIndex - u[2].length, p = u[1], s = u[3] === void 0 ? v : u[3] === '"' ? gt : ut) : s === gt || s === ut ? s = v : s === ht || s === pt ? s = C : (s = v, r = void 0);
    const m = s === v && n[c + 1].startsWith("/>") ? " " : "";
    o += s === C ? a + Ht : h >= 0 ? (i.push(p), a.slice(0, h) + At + a.slice(h) + b + m) : a + b + (h === -2 ? c : m);
  }
  return [Ct(n, o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class I {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let o = 0, s = 0;
    const c = t.length - 1, a = this.parts, [p, u] = Lt(t, e);
    if (this.el = I.createElement(p, i), $.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = $.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(At)) {
          const f = u[s++], m = r.getAttribute(h).split(b), N = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: N[2], strings: m, ctor: N[1] === "." ? Bt : N[1] === "?" ? Vt : N[1] === "@" ? Wt : R }), r.removeAttribute(h);
        } else h.startsWith(b) && (a.push({ type: 6, index: o }), r.removeAttribute(h));
        if (Et.test(r.tagName)) {
          const h = r.textContent.split(b), f = h.length - 1;
          if (f > 0) {
            r.textContent = H ? H.emptyScript : "";
            for (let m = 0; m < f; m++) r.append(h[m], T()), $.nextNode(), a.push({ type: 2, index: ++o });
            r.append(h[f], T());
          }
        }
      } else if (r.nodeType === 8) if (r.data === St) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(b, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += b.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = w.createElement("template");
    return i.innerHTML = t, i;
  }
}
function S(n, t, e = n, i) {
  var s, c;
  if (t === A) return t;
  let r = i !== void 0 ? (s = e._$Co) == null ? void 0 : s[i] : e._$Cl;
  const o = P(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((c = r == null ? void 0 : r._$AO) == null || c.call(r, !1), o === void 0 ? r = void 0 : (r = new o(n), r._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = S(n, r._$AS(n, t.values), r, i)), t;
}
class jt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? w).importNode(e, !0);
    $.currentNode = r;
    let o = $.nextNode(), s = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (s === a.index) {
        let p;
        a.type === 2 ? p = new U(o, o.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (p = new Ft(o, this, t)), this._$AV.push(p), a = i[++c];
      }
      s !== (a == null ? void 0 : a.index) && (o = $.nextNode(), s++);
    }
    return $.currentNode = w, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class U {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = S(this, t, e), P(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && P(this._$AH) ? this._$AA.nextSibling.data = t : this.T(w.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = I.createElement(Ct(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(e);
    else {
      const s = new jt(r, this), c = s.u(this.options);
      s.p(e), this.T(c), this._$AH = s;
    }
  }
  _$AC(t) {
    let e = ft.get(t.strings);
    return e === void 0 && ft.set(t.strings, e = new I(t)), e;
  }
  k(t) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const o of t) r === e.length ? e.push(i = new U(this.O(T()), this.O(T()), this, this.options)) : i = e[r], i._$AI(o), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = ct(t).nextSibling;
      ct(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class R {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, e = this, i, r) {
    const o = this.strings;
    let s = !1;
    if (o === void 0) t = S(this, t, e, 0), s = !P(t) || t !== this._$AH && t !== A, s && (this._$AH = t);
    else {
      const c = t;
      let a, p;
      for (t = o[0], a = 0; a < o.length - 1; a++) p = S(this, c[i + a], e, a), p === A && (p = this._$AH[a]), s || (s = !P(p) || p !== this._$AH[a]), p === d ? t = d : t !== d && (t += (p ?? "") + o[a + 1]), this._$AH[a] = p;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Bt extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Vt extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Wt extends R {
  constructor(t, e, i, r, o) {
    super(t, e, i, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = S(this, t, e, 0) ?? d) === A) return;
    const i = this._$AH, r = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== d && (i === d || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ft {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const j = k.litHtmlPolyfillSupport;
j == null || j(I, U), (k.litHtmlVersions ?? (k.litHtmlVersions = [])).push("3.3.2");
const qt = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new U(t.insertBefore(T(), o), o, void 0, e ?? {});
  }
  return r._$AI(n), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y = globalThis;
class g extends _ {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = qt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return A;
  }
}
var yt;
g._$litElement$ = !0, g.finalized = !0, (yt = y.litElementHydrateSupport) == null || yt.call(y, { LitElement: g });
const B = y.litElementPolyfillSupport;
B == null || B({ LitElement: g });
(y.litElementVersions ?? (y.litElementVersions = [])).push("4.2.2");
const mt = {
  icon: "mdi:ceiling-light",
  width: "260px",
  height: "64px",
  border_radius: "999px",
  show_state: !0,
  state_display: "state",
  on_color: "#ff8a1c",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, bt = ["toggle", "more-info", "none"], Kt = ["state", "brightness", "auto"];
function Gt(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const X = class X extends g {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return E`
      :host {
        --glow-card-width: 260px;
        --glow-card-height: 64px;
        --glow-card-radius: 999px;
        --glow-on-color: #ff8a1c;
        --glow-off-color: #697382;
        --glow-background: #101722;

        display: block;
        max-width: var(--glow-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .button {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--glow-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            115deg,
            color-mix(in srgb, var(--glow-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--glow-state-color) 8%, transparent) 42%,
            color-mix(in srgb, var(--glow-hot-color) 13%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--glow-background) 92%, #ffffff 6%),
            color-mix(in srgb, var(--glow-background) 92%, #000000 12%)
          );
        border: 1px solid color-mix(
          in srgb,
          var(--glow-border-color) var(--glow-border-strength),
          transparent
        );
        border-radius: var(--glow-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 7%),
          inset 0 0 0 var(--glow-inner-ring-width)
            color-mix(
              in srgb,
              var(--glow-state-color) var(--glow-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--glow-outer-blur)
            color-mix(
              in srgb,
              var(--glow-state-color) var(--glow-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        grid-template-columns: 46px minmax(0, 1fr);
        gap: 8px;
        min-height: var(--glow-card-height);
        overflow: hidden;
        padding: 8px 14px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 42%,
            color-mix(in srgb, var(--glow-warm-color) 10%, transparent) 72%,
            color-mix(in srgb, var(--glow-hot-color) 25%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-warm-color) 9%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--glow-hot-color) 11%, transparent)
          ),
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--glow-hot-color) 11%, transparent),
            transparent 32%,
            transparent 70%,
            color-mix(in srgb, var(--glow-warm-color) 9%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button::after {
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 86%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 12px
            color-mix(in srgb, var(--glow-state-color) 32%, transparent),
          0 0 10px
            color-mix(in srgb, var(--glow-state-color) 56%, transparent),
          0 0 22px
            color-mix(in srgb, var(--glow-state-color) 42%, transparent),
          0 0 46px
            color-mix(in srgb, var(--glow-state-color) 26%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 52%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 6px
            color-mix(in srgb, var(--glow-state-color) 62%, transparent),
          0 0 18px
            color-mix(in srgb, var(--glow-state-color) 46%, transparent),
          0 0 38px
            color-mix(in srgb, var(--glow-state-color) 28%, transparent);
        content: '';
        inset: 2px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 1;
      }

      .button .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--glow-state-color) 22%, transparent),
            transparent 72%
          );
        filter: blur(13px);
        inset: 7px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 0;
      }

      .button.on.animated::after {
        animation: glow-breathe 3s ease-in-out infinite;
      }

      .button:focus-visible {
        outline: 2px solid var(--glow-state-color);
        outline-offset: 3px;
      }

      .button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .icon-shell,
      .content {
        position: relative;
        z-index: 1;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--glow-state-color) 24%, transparent),
            transparent 70%
          ),
          color-mix(in srgb, var(--glow-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--glow-icon-color);
        display: inline-flex;
        height: 38px;
        justify-content: center;
        width: 38px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 1.15;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @keyframes glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .button.on.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("glow-light-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter(
      (r) => r.startsWith("light.")
    );
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...mt,
      ...t
    }, this.style.setProperty("--glow-card-width", this.config.width ?? "260px"), this.style.setProperty("--glow-card-height", this.config.height ?? "64px"), this.style.setProperty(
      "--glow-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--glow-on-color", this.config.on_color ?? "#ff8a1c"), this.style.setProperty("--glow-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--glow-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return 1;
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isOn() {
    var t;
    return ((t = this.entity) == null ? void 0 : t.state) === "on";
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get domain() {
    return this.config.entity.split(".")[0] ?? "light";
  }
  get brightnessPercent() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.brightness;
    if (typeof t == "number")
      return Math.round(t / 255 * 100);
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    if (this.isUnavailable)
      return "Unavailable";
    const t = this.config.state_display ?? "state", e = this.brightnessPercent;
    return this.isOn && e !== void 0 && (t === "brightness" || t === "auto") ? `${e}%` : this.isOn ? "On" : "Off";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || mt.icon;
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  performAction(t) {
    var e;
    if (!(this.isUnavailable || !t || t === "none")) {
      if (t === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      (e = this.hass) == null || e.callService(this.domain, "toggle", {
        entity_id: this.config.entity
      });
    }
  }
  handlePointerDown() {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(this.config.hold_action);
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick() {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performAction(this.config.tap_action);
  }
  render() {
    if (!this.config)
      return l``;
    const t = this.isOn ? this.config.on_color : this.config.off_color, e = this.isOn ? "1" : "0";
    return l`
      <ha-card
        style="
          --glow-state-color: ${t};
          --glow-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #ffd26a)" : t};
          --glow-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 82%, #ff4f00)" : t};
          --glow-border-color: ${t};
          --glow-icon-color: ${t};
          --glow-on-opacity: ${e};
          --glow-border-strength: ${this.isOn ? "78%" : "26%"};
          --glow-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --glow-inner-ring-strength: ${this.isOn ? "28%" : "0%"};
          --glow-outer-blur: ${this.isOn ? "30px" : "0"};
          --glow-outer-strength: ${this.isOn ? "26%" : "0%"};
        "
      >
        <button
          class="button ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="ambient-glow"></span>
          <span class="outline-glow"></span>
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? l`<span class="state">${this.displayState}</span>` : d}
          </span>
        </button>
      </ha-card>
    `;
  }
};
X.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 }
};
let W = X;
customElements.get("glow-light-card") || customElements.define("glow-light-card", W);
const tt = class tt extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return E`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      paper-input,
      ha-select {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, Gt(this, e);
  }
  valueChanged(t) {
    const e = t.target;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : e.value
    });
  }
  renderTextInput(t, e, i = "") {
    return l`
      <paper-input
        label=${t}
        placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></paper-input>
    `;
  }
  renderSwitch(t, e, i) {
    return l`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return l`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => l`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return l`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderTextInput("Entity", "entity", "light.bar_lights")}
            ${this.renderTextInput("Name", "name", "Bar Lights")}
            ${this.renderTextInput("Icon", "icon", "mdi:ceiling-light")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "64px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#ff8a1c")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
            ${this.renderSelect(
      "State Display",
      "state_display",
      Kt,
      "state"
    )}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", bt, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      bt,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
tt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let F = tt;
customElements.get("glow-light-card-editor") || customElements.define("glow-light-card-editor", F);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-light-card",
  name: "Glow Light Card",
  description: "A compact glowing light card for Home Assistant."
});
const xt = {
  title: "Outlets",
  icon_1: "mdi:power-socket-us",
  icon_2: "mdi:power-socket-us",
  width: "320px",
  button_height: "58px",
  gap: "12px",
  layout: "duplex",
  show_title: !0,
  show_state: !0,
  on_color: "#ff3b30",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, vt = ["toggle", "more-info", "none"], Zt = ["duplex", "grid", "stack"];
function Jt(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const et = class et extends g {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return E`
      :host {
        --outlet-card-width: 540px;
        --outlet-button-height: 58px;
        --outlet-gap: 12px;
        --outlet-on-color: #ff3b30;
        --outlet-off-color: #697382;
        --outlet-background: #101722;

        display: block;
        max-width: var(--outlet-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .card {
        display: grid;
        gap: 10px;
        width: 100%;
      }

      .title {
        align-items: center;
        color: var(--primary-text-color, #f4f7fb);
        display: flex;
        font-size: 14px;
        font-weight: 600;
        gap: 8px;
        letter-spacing: 0;
        line-height: 1.2;
        min-height: 20px;
      }

      .title ha-icon {
        --mdc-icon-size: 18px;
        color: var(--outlet-off-color);
      }

      .outlets {
        display: grid;
        gap: var(--outlet-gap);
      }

      .layout-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .layout-stack {
        grid-template-columns: 1fr;
      }

      .duplex-shell {
        background:
          radial-gradient(
            circle at 18% 22%,
            color-mix(in srgb, var(--outlet-any-color) 16%, transparent),
            transparent 36%
          ),
          radial-gradient(
            circle at 82% 78%,
            color-mix(in srgb, var(--outlet-any-color) 12%, transparent),
            transparent 40%
          ),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--outlet-background) 88%, #ffffff 8%),
            color-mix(in srgb, var(--outlet-background) 94%, #000000 16%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--outlet-any-color) var(--outlet-shell-border-strength),
            transparent
          );
        border-radius: 26px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 1px rgb(255 255 255 / 3%),
          0 14px 28px rgb(0 0 0 / 24%),
          0 0 var(--outlet-shell-glow-blur)
            color-mix(
              in srgb,
              var(--outlet-any-color) var(--outlet-shell-glow-strength),
              transparent
            );
        box-sizing: border-box;
        display: grid;
        gap: 0;
        overflow: hidden;
        padding: 0;
        position: relative;
      }

      .duplex-shell::before {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--outlet-any-color) 15%, transparent),
            transparent 70%
          );
        content: '';
        filter: blur(16px);
        inset: 8px;
        opacity: var(--outlet-any-on-opacity);
        pointer-events: none;
        position: absolute;
      }

      .duplex-shell::after {
        border: 1px solid
          color-mix(in srgb, var(--outlet-any-color) 44%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 12px
            color-mix(in srgb, var(--outlet-any-color) 22%, transparent),
          0 0 18px
            color-mix(in srgb, var(--outlet-any-color) 32%, transparent);
        content: '';
        inset: 2px;
        opacity: var(--outlet-any-on-opacity);
        pointer-events: none;
        position: absolute;
      }

      .duplex-outlet {
        align-items: center;
        background:
          linear-gradient(
            115deg,
            color-mix(in srgb, var(--outlet-warm-color) 13%, transparent) 0%,
            color-mix(in srgb, var(--outlet-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--outlet-hot-color) 13%, transparent) 100%
          );
        border: 0;
        border-radius: 0;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 7%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 12px;
        grid-template-columns: 48px minmax(0, 1fr) 14px;
        min-height: calc(var(--outlet-button-height) + 4px);
        overflow: hidden;
        padding: 8px 12px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
        z-index: 1;
      }

      .duplex-outlet.top {
        border-radius: 25px 25px 0 0;
      }

      .duplex-outlet.bottom {
        border-radius: 0 0 25px 25px;
      }

      .duplex-outlet.single {
        border-radius: 25px;
      }

      .duplex-outlet::before,
      .duplex-outlet::after {
        content: '';
        inset: 0;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .duplex-outlet::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 42%,
            color-mix(in srgb, var(--outlet-warm-color) 11%, transparent) 72%,
            color-mix(in srgb, var(--outlet-hot-color) 24%, transparent) 100%
          );
      }

      .duplex-outlet::after {
        border: 0;
        border-radius: inherit;
        box-shadow:
          inset 0 0 0 1px
            color-mix(in srgb, var(--outlet-state-color) 52%, transparent),
          inset 0 0 18px
            color-mix(in srgb, var(--outlet-state-color) 28%, transparent),
          inset 0 1px 0 rgb(255 255 255 / 7%);
      }

      .socket-face {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--outlet-state-color) 18%, transparent),
            transparent 74%
          ),
          color-mix(in srgb, var(--outlet-state-color) 8%, rgb(255 255 255 / 5%));
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 34%, transparent);
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            );
        display: inline-grid;
        height: 36px;
        justify-content: center;
        place-items: center;
        position: relative;
        width: 36px;
        z-index: 2;
      }

      .socket-icon {
        color: color-mix(in srgb, var(--outlet-state-color) 82%, #dce4f0 14%);
        filter: drop-shadow(
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            )
        );
        height: 23px;
        width: 23px;
      }

      .socket-icon path {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2.5;
      }

      .duplex-divider {
        background: linear-gradient(
          90deg,
          transparent,
          rgb(255 255 255 / 10%),
          transparent
        );
        height: 1px;
        margin: 0 16px;
        position: relative;
        z-index: 3;
      }

      .outlet {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--outlet-hot-color) 15%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--outlet-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--outlet-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--outlet-hot-color) 15%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--outlet-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--outlet-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--outlet-state-color) var(--outlet-border-strength),
            transparent
          );
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--outlet-inner-ring-width)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--outlet-outer-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 9px;
        grid-template-columns: 42px minmax(0, 1fr) 18px;
        min-height: var(--outlet-button-height);
        overflow: hidden;
        padding: 8px 12px 8px 9px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .outlet::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--outlet-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--outlet-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--outlet-warm-color) 11%, transparent),
            transparent 34%,
            transparent 67%,
            color-mix(in srgb, var(--outlet-hot-color) 14%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outlet::after {
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 88%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 11px
            color-mix(in srgb, var(--outlet-state-color) 34%, transparent),
          0 0 10px
            color-mix(in srgb, var(--outlet-state-color) 62%, transparent),
          0 0 24px
            color-mix(in srgb, var(--outlet-state-color) 48%, transparent),
          0 0 52px
            color-mix(in srgb, var(--outlet-state-color) 28%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 54%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 6px
            color-mix(in srgb, var(--outlet-state-color) 64%, transparent),
          0 0 18px
            color-mix(in srgb, var(--outlet-state-color) 48%, transparent),
          0 0 40px
            color-mix(in srgb, var(--outlet-state-color) 30%, transparent);
        inset: 2px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--outlet-state-color) 22%, transparent),
            transparent 70%
          );
        filter: blur(13px);
        inset: 7px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 0;
      }

      .icon-shell,
      .socket-face,
      .content,
      .status-light {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--outlet-state-color) 22%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--outlet-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--outlet-state-color);
        display: inline-flex;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-light {
        align-self: center;
        background: color-mix(
          in srgb,
          var(--outlet-state-color) var(--outlet-status-strength),
          #2f3642
        );
        border-radius: 999px;
        box-shadow:
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            ),
          inset 0 1px 0 rgb(255 255 255 / 14%);
        height: 8px;
        justify-self: center;
        width: 8px;
      }

      .outlet:focus-visible {
        outline: 2px solid var(--outlet-state-color);
        outline-offset: 3px;
      }

      .duplex-outlet:focus-visible {
        outline: 2px solid var(--outlet-state-color);
        outline-offset: 3px;
      }

      .outlet.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .duplex-outlet.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .outlet.on.animated::after {
        animation: outlet-glow-breathe 3s ease-in-out infinite;
      }

      .duplex-outlet.on.animated::after {
        animation: outlet-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes outlet-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (max-width: 620px) {
        .layout-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .outlet.on.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("dual-outlet-card-editor");
  }
  static getStubConfig(t, e) {
    const i = e.filter(
      (r) => r.startsWith("switch.") || r.startsWith("light.") || r.startsWith("input_boolean.")
    );
    return {
      entity_1: i[0] ?? "",
      entity_2: i[1] ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity_1))
      throw new Error("Entity 1 is required");
    this.config = {
      ...xt,
      ...t
    }, this.style.setProperty("--outlet-card-width", this.config.width ?? "320px"), this.style.setProperty(
      "--outlet-button-height",
      this.config.button_height ?? "58px"
    ), this.style.setProperty("--outlet-gap", this.config.gap ?? "12px"), this.style.setProperty("--outlet-on-color", this.config.on_color ?? "#ff3b30"), this.style.setProperty("--outlet-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--outlet-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return this.outlets.length + (this.config.show_title ? 1 : 0);
  }
  get anyOutletOn() {
    return this.outlets.some((t) => this.isOn(this.getEntity(t.entityId)));
  }
  get outlets() {
    const t = [
      {
        entityId: this.config.entity_1,
        name: this.config.name_1,
        icon: this.config.icon_1,
        fallbackName: "Outlet 1"
      }
    ];
    return this.config.entity_2 && t.push({
      entityId: this.config.entity_2,
      name: this.config.name_2,
      icon: this.config.icon_2,
      fallbackName: "Outlet 2"
    }), t;
  }
  getEntity(t) {
    var e;
    return (e = this.hass) == null ? void 0 : e.states[t];
  }
  isOn(t) {
    return (t == null ? void 0 : t.state) === "on";
  }
  isUnavailable(t) {
    return !t || ["unavailable", "unknown"].includes(t.state);
  }
  domain(t) {
    return t.split(".")[0] || "switch";
  }
  displayName(t) {
    const e = this.getEntity(t.entityId);
    return t.name || (e == null ? void 0 : e.attributes.friendly_name) || t.fallbackName || t.entityId;
  }
  displayState(t) {
    return this.isUnavailable(t) ? "Unavailable" : this.isOn(t) ? "On" : "Off";
  }
  displayIcon(t) {
    const e = this.getEntity(t.entityId);
    return t.icon || (e == null ? void 0 : e.attributes.icon) || xt.icon_1;
  }
  dispatchMoreInfo(t) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  performAction(t, e) {
    var r;
    const i = this.getEntity(t);
    if (!(this.isUnavailable(i) || !e || e === "none")) {
      if (e === "more-info") {
        this.dispatchMoreInfo(t);
        return;
      }
      (r = this.hass) == null || r.callService(this.domain(t), "toggle", {
        entity_id: t
      });
    }
  }
  handlePointerDown(t) {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(t, this.config.hold_action);
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick(t) {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performAction(t, this.config.tap_action);
  }
  renderOutlet(t) {
    const e = this.getEntity(t.entityId), i = this.isOn(e), r = this.isUnavailable(e), o = i ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382", s = i ? "1" : "0";
    return l`
      <button
        class="outlet ${i ? "on" : "off"} ${r ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        style="
          --outlet-state-color: ${o};
          --outlet-warm-color: ${i ? "color-mix(in srgb, " + o + " 86%, #ff9a64)" : o};
          --outlet-hot-color: ${i ? "color-mix(in srgb, " + o + " 80%, #ff1d1d)" : o};
          --outlet-on-opacity: ${s};
          --outlet-border-strength: ${i ? "78%" : "24%"};
          --outlet-inner-ring-width: ${i ? "1px" : "0px"};
          --outlet-inner-ring-strength: ${i ? "28%" : "0%"};
          --outlet-outer-blur: ${i ? "30px" : "0"};
          --outlet-outer-strength: ${i ? "28%" : "0%"};
          --outlet-status-strength: ${i ? "92%" : "22%"};
          --outlet-status-blur: ${i ? "18px" : "0"};
          --outlet-status-glow: ${i ? "72%" : "0%"};
        "
        aria-label=${this.displayName(t)}
        @click=${() => this.handleClick(t.entityId)}
        @pointerdown=${() => this.handlePointerDown(t.entityId)}
        @pointerup=${this.handlePointerUp}
        @pointerleave=${this.handlePointerUp}
        @pointercancel=${this.handlePointerUp}
      >
        <span class="ambient-glow"></span>
        <span class="outline-glow"></span>
        <span class="icon-shell">
          <ha-icon icon=${this.displayIcon(t)}></ha-icon>
        </span>
        <span class="content">
          <span class="name">${this.displayName(t)}</span>
          ${this.config.show_state ? l`<span class="state">${this.displayState(e)}</span>` : d}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }
  renderDuplexOutlet(t, e) {
    const i = this.getEntity(t.entityId), r = this.isOn(i), o = this.isUnavailable(i), s = r ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382", c = r ? "1" : "0";
    return l`
      <button
        class="duplex-outlet ${e} ${r ? "on" : "off"} ${o ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        style="
          --outlet-state-color: ${s};
          --outlet-warm-color: ${r ? "color-mix(in srgb, " + s + " 86%, #ff9a64)" : s};
          --outlet-hot-color: ${r ? "color-mix(in srgb, " + s + " 80%, #ff1d1d)" : s};
          --outlet-on-opacity: ${c};
          --outlet-border-strength: ${r ? "72%" : "18%"};
          --outlet-inner-ring-width: ${r ? "1px" : "0px"};
          --outlet-inner-ring-strength: ${r ? "26%" : "0%"};
          --outlet-outer-blur: ${r ? "24px" : "0"};
          --outlet-outer-strength: ${r ? "26%" : "0%"};
          --outlet-status-strength: ${r ? "92%" : "22%"};
          --outlet-status-blur: ${r ? "18px" : "0"};
          --outlet-status-glow: ${r ? "72%" : "0%"};
        "
        aria-label=${this.displayName(t)}
        @click=${() => this.handleClick(t.entityId)}
        @pointerdown=${() => this.handlePointerDown(t.entityId)}
        @pointerup=${this.handlePointerUp}
        @pointerleave=${this.handlePointerUp}
        @pointercancel=${this.handlePointerUp}
      >
        <span class="socket-face" aria-hidden="true">
          <svg class="socket-icon" viewBox="0 0 32 32" focusable="false">
            <path d="M12 8v8"></path>
            <path d="M20 8v8"></path>
            <path d="M11.5 22.5c0 3 2 5 4.5 5s4.5-2 4.5-5"></path>
          </svg>
        </span>
        <span class="content">
          <span class="name">${this.displayName(t)}</span>
          ${this.config.show_state ? l`<span class="state">${this.displayState(i)}</span>` : d}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }
  renderDuplex() {
    const t = this.anyOutletOn, e = t ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382";
    return l`
      <div
        class="duplex-shell"
        style="
          --outlet-any-color: ${e};
          --outlet-any-on-opacity: ${t ? "1" : "0"};
          --outlet-shell-border-strength: ${t ? "52%" : "20%"};
          --outlet-shell-glow-blur: ${t ? "34px" : "0"};
          --outlet-shell-glow-strength: ${t ? "28%" : "0%"};
        "
      >
        ${this.outlets.map(
      (i, r) => l`
            ${r > 0 ? l`<span class="duplex-divider"></span>` : d}
            ${this.renderDuplexOutlet(
        i,
        this.outlets.length === 1 ? "single" : r === 0 ? "top" : "bottom"
      )}
          `
    )}
      </div>
    `;
  }
  render() {
    if (!this.config)
      return l``;
    const t = this.config.layout ?? "duplex";
    return l`
      <ha-card>
        <div class="card">
          ${this.config.show_title ? l`
                <div class="title">
                  <span>${this.config.title}</span>
                </div>
              ` : d}
          ${t === "duplex" ? this.renderDuplex() : l`
                <div class="outlets layout-${t}">
                  ${this.outlets.map((e) => this.renderOutlet(e))}
                </div>
              `}
        </div>
      </ha-card>
    `;
  }
};
et.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 }
};
let q = et;
customElements.get("dual-outlet-card") || customElements.define("dual-outlet-card", q);
const it = class it extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return E`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      paper-input,
      ha-select {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, Jt(this, e);
  }
  valueChanged(t) {
    const e = t.target;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : e.value
    });
  }
  renderTextInput(t, e, i = "") {
    return l`
      <paper-input
        label=${t}
        placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></paper-input>
    `;
  }
  renderSwitch(t, e, i) {
    return l`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return l`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => l`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return l`
      <div class="editor">
        <section class="section">
          <h3>Outlets</h3>
          <div class="grid">
            ${this.renderTextInput("Outlet 1 Entity", "entity_1", "switch.outlet_top")}
            ${this.renderTextInput("Outlet 1 Name", "name_1", "Top Outlet")}
            ${this.renderTextInput("Outlet 1 Icon", "icon_1", "mdi:power-socket-us")}
            ${this.renderTextInput(
      "Outlet 2 Entity",
      "entity_2",
      "switch.outlet_bottom"
    )}
            ${this.renderTextInput("Outlet 2 Name", "name_2", "Bottom Outlet")}
            ${this.renderTextInput("Outlet 2 Icon", "icon_2", "mdi:power-socket-us")}
          </div>
        </section>

        <section class="section">
          <h3>Layout</h3>
          <div class="grid">
            ${this.renderTextInput("Title", "title", "Outlets")}
            ${this.renderTextInput("Width", "width", "320px")}
            ${this.renderTextInput("Button Height", "button_height", "58px")}
            ${this.renderTextInput("Gap", "gap", "12px")}
            ${this.renderSelect("Layout", "layout", Zt, "duplex")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show Title", "show_title", !0)}
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#ff3b30")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", vt, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      vt,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
it.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let K = it;
customElements.get("dual-outlet-card-editor") || customElements.define("dual-outlet-card-editor", K);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "dual-outlet-card",
  name: "Dual Outlet Card",
  description: "A two-outlet toggle card with red on-state glow."
});
const $t = {
  icon: "mdi:fan",
  width: "260px",
  height: "64px",
  border_radius: "999px",
  show_state: !0,
  show_speed_buttons: !0,
  off_label: "Off",
  speed_1_label: "1",
  speed_2_label: "2",
  speed_3_label: "3",
  speed_1_percentage: 33,
  speed_2_percentage: 66,
  speed_3_percentage: 100,
  on_color: "#45d158",
  off_color: "#697382",
  background: "#101722",
  tap_action: "cycle",
  hold_action: "more-info",
  animated: !0
}, Yt = ["cycle", "more-info", "none"], Qt = ["more-info", "none"];
function Xt(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function M(n, t) {
  if (typeof n == "number" && Number.isFinite(n))
    return n;
  if (typeof n == "string") {
    const e = Number(n);
    if (Number.isFinite(e))
      return e;
  }
  return t;
}
const rt = class rt extends g {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return E`
      :host {
        --fan-card-width: 260px;
        --fan-card-height: 64px;
        --fan-card-radius: 999px;
        --fan-on-color: #45d158;
        --fan-off-color: #697382;
        --fan-background: #101722;

        display: block;
        max-width: var(--fan-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .fan {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--fan-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--fan-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--fan-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--fan-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--fan-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--fan-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--fan-state-color) var(--fan-border-strength),
            transparent
          );
        border-radius: var(--fan-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--fan-inner-ring-width)
            color-mix(
              in srgb,
              var(--fan-state-color) var(--fan-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--fan-outer-blur)
            color-mix(
              in srgb,
              var(--fan-state-color) var(--fan-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 9px;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        min-height: var(--fan-card-height);
        overflow: hidden;
        padding: 8px 10px 8px 9px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .fan::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--fan-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--fan-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--fan-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--fan-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--fan-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .fan::after {
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 86%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 11px color-mix(in srgb, var(--fan-state-color) 34%, transparent),
          0 0 10px color-mix(in srgb, var(--fan-state-color) 60%, transparent),
          0 0 22px color-mix(in srgb, var(--fan-state-color) 44%, transparent),
          0 0 46px color-mix(in srgb, var(--fan-state-color) 26%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--fan-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .ambient-glow,
      .outline-glow {
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 52%, transparent);
        box-shadow:
          0 0 6px color-mix(in srgb, var(--fan-state-color) 62%, transparent),
          0 0 18px color-mix(in srgb, var(--fan-state-color) 46%, transparent),
          0 0 38px color-mix(in srgb, var(--fan-state-color) 28%, transparent);
        inset: 2px;
        opacity: var(--fan-on-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--fan-state-color) 20%, transparent),
            transparent 70%
          );
        filter: blur(13px);
        inset: 7px;
        opacity: var(--fan-on-opacity);
        z-index: 0;
      }

      .icon-shell,
      .content,
      .speed-buttons {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--fan-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--fan-state-color) 14%, #ffffff 2%);
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--fan-state-color);
        display: inline-flex;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .fan.on.animated .icon-shell ha-icon {
        animation: fan-spin 1.8s linear infinite;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .speed-buttons {
        align-items: center;
        align-self: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 999px;
        display: inline-grid;
        gap: 2px;
        grid-template-columns: repeat(4, minmax(26px, 1fr));
        min-width: 112px;
        padding: 3px;
      }

      .speed {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 11px;
        font-weight: 650;
        height: 26px;
        justify-content: center;
        letter-spacing: 0;
        min-width: 0;
        padding: 0 6px;
      }

      .speed.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--fan-state-color) 22%, transparent),
            transparent 78%
          ),
          color-mix(in srgb, var(--fan-state-color) 22%, #ffffff 3%);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          0 0 14px color-mix(in srgb, var(--fan-state-color) 38%, transparent);
        color: var(--primary-text-color, #f4f7fb);
      }

      .fan:focus-visible,
      .speed:focus-visible {
        outline: 2px solid var(--fan-state-color);
        outline-offset: 3px;
      }

      .fan.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .fan.on.animated::after {
        animation: fan-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes fan-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @keyframes fan-spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 520px) {
        .fan {
          grid-template-columns: 40px minmax(0, 1fr);
        }

        .speed-buttons {
          grid-column: 1 / -1;
          width: 100%;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .fan.on.animated::after,
        .fan.on.animated .icon-shell ha-icon {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("speed-fan-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter((r) => r.startsWith("fan."));
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...$t,
      ...t,
      speed_1_percentage: M(t.speed_1_percentage, 33),
      speed_2_percentage: M(t.speed_2_percentage, 66),
      speed_3_percentage: M(t.speed_3_percentage, 100)
    }, this.style.setProperty("--fan-card-width", this.config.width ?? "260px"), this.style.setProperty("--fan-card-height", this.config.height ?? "64px"), this.style.setProperty(
      "--fan-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--fan-on-color", this.config.on_color ?? "#45d158"), this.style.setProperty("--fan-off-color", this.config.off_color ?? "#697382"), this.style.setProperty("--fan-background", this.config.background ?? "#101722");
  }
  getCardSize() {
    return 1;
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isOn() {
    var t;
    return ((t = this.entity) == null ? void 0 : t.state) === "on";
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get percentage() {
    var t;
    return this.isOn ? M((t = this.entity) == null ? void 0 : t.attributes.percentage, 100) : 0;
  }
  get level() {
    const t = this.percentage;
    if (!this.isOn || t <= 0)
      return 0;
    const e = this.config.speed_1_percentage ?? 33, i = this.config.speed_2_percentage ?? 66;
    return t <= (e + i) / 2 ? 1 : t < (i + (this.config.speed_3_percentage ?? 100)) / 2 ? 2 : 3;
  }
  get domain() {
    return this.config.entity.split(".")[0] || "fan";
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    return this.isUnavailable ? "Unavailable" : this.isOn ? `${this.percentage}%` : this.config.off_label ?? "Off";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || $t.icon;
  }
  percentageForLevel(t) {
    return t === 1 ? this.config.speed_1_percentage ?? 33 : t === 2 ? this.config.speed_2_percentage ?? 66 : this.config.speed_3_percentage ?? 100;
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setLevel(t) {
    var e, i, r;
    if (!this.isUnavailable) {
      if (t === 0) {
        (e = this.hass) == null || e.callService(this.domain, "turn_off", {
          entity_id: this.config.entity
        });
        return;
      }
      if (this.domain === "fan") {
        (i = this.hass) == null || i.callService("fan", "set_percentage", {
          entity_id: this.config.entity,
          percentage: this.percentageForLevel(t)
        });
        return;
      }
      (r = this.hass) == null || r.callService(this.domain, "turn_on", {
        entity_id: this.config.entity
      });
    }
  }
  cycleSpeed() {
    const t = (this.level + 1) % 4;
    this.setLevel(t);
  }
  performTapAction() {
    if (!(this.isUnavailable || this.config.tap_action === "none")) {
      if (this.config.tap_action === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      this.cycleSpeed();
    }
  }
  handlePointerDown() {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.config.hold_action !== "none" && this.dispatchMoreInfo();
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick() {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performTapAction();
  }
  handleSpeedClick(t, e) {
    t.stopPropagation(), this.setLevel(e);
  }
  renderSpeedButtons() {
    const t = [
      { level: 0, label: this.config.off_label ?? "Off" },
      { level: 1, label: this.config.speed_1_label ?? "1" },
      { level: 2, label: this.config.speed_2_label ?? "2" },
      { level: 3, label: this.config.speed_3_label ?? "3" }
    ];
    return l`
      <div class="speed-buttons" aria-label="Fan speed">
        ${t.map(
      (e) => l`
            <button
              class="speed ${this.level === e.level ? "active" : ""}"
              aria-label=${e.label}
              @click=${(i) => this.handleSpeedClick(i, e.level)}
            >
              ${e.label}
            </button>
          `
    )}
      </div>
    `;
  }
  render() {
    if (!this.config)
      return l``;
    const t = this.isOn ? this.config.on_color ?? "#45d158" : this.config.off_color ?? "#697382", e = this.isOn ? "1" : "0";
    return l`
      <ha-card
        style="
          --fan-state-color: ${t};
          --fan-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #a8ffb2)" : t};
          --fan-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 80%, #00ff66)" : t};
          --fan-on-opacity: ${e};
          --fan-border-strength: ${this.isOn ? "78%" : "24%"};
          --fan-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --fan-inner-ring-strength: ${this.isOn ? "28%" : "0%"};
          --fan-outer-blur: ${this.isOn ? "30px" : "0"};
          --fan-outer-strength: ${this.isOn ? "28%" : "0%"};
        "
      >
        <div
          class="fan ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
          role="button"
          tabindex="0"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointerleave=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="ambient-glow"></span>
          <span class="outline-glow"></span>
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? l`<span class="state">${this.displayState}</span>` : d}
          </span>
          ${this.config.show_speed_buttons ? this.renderSpeedButtons() : d}
        </div>
      </ha-card>
    `;
  }
};
rt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 }
};
let G = rt;
customElements.get("speed-fan-card") || customElements.define("speed-fan-card", G);
const nt = class nt extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return E`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      paper-input,
      ha-select {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, Xt(this, e);
  }
  valueChanged(t) {
    const e = t.target;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : e.value
    });
  }
  renderTextInput(t, e, i = "") {
    return l`
      <paper-input
        label=${t}
        placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></paper-input>
    `;
  }
  renderNumberInput(t, e, i = "") {
    return l`
      <paper-input
        type="number"
        label=${t}
        placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></paper-input>
    `;
  }
  renderSwitch(t, e, i) {
    return l`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return l`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => l`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return l`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderTextInput("Entity", "entity", "fan.kitchen_fan")}
            ${this.renderTextInput("Name", "name", "Fan")}
            ${this.renderTextInput("Icon", "icon", "mdi:fan")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "64px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
        </section>

        <section class="section">
          <h3>Speeds</h3>
          <div class="grid">
            ${this.renderTextInput("Off Label", "off_label", "Off")}
            ${this.renderTextInput("Speed 1 Label", "speed_1_label", "1")}
            ${this.renderTextInput("Speed 2 Label", "speed_2_label", "2")}
            ${this.renderTextInput("Speed 3 Label", "speed_3_label", "3")}
            ${this.renderNumberInput("Speed 1 Percent", "speed_1_percentage", "33")}
            ${this.renderNumberInput("Speed 2 Percent", "speed_2_percentage", "66")}
            ${this.renderNumberInput("Speed 3 Percent", "speed_3_percentage", "100")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Show Speed Buttons", "show_speed_buttons", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#45d158")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", Yt, "cycle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Qt,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
nt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let Z = nt;
customElements.get("speed-fan-card-editor") || customElements.define("speed-fan-card-editor", Z);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "speed-fan-card",
  name: "Speed Fan Card",
  description: "A compact fan card with off, 1, 2, and 3 speed controls."
});
//# sourceMappingURL=gamma-ha-cards.js.map
