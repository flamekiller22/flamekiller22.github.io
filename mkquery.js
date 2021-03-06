function $(args, options={}) {
    if (typeof args === 'string')
        options.__str__ = true
    else {
        options.__str__ = false
        if (args.__isProxy) {
            options.__isp__ = true
        }
        else {
            options.__isp__ = false
        }
    }
    return new MQ(args, options)
}

class MQ {
    #nl
    constructor (n, o) {
        if (!o.__str__) {
            if (o.__isp__) {
                return new NodeWrapper(n.get())
            }
            return new NodeWrapper(n)
        }
        delete o.__str__
        if (n.startsWith('<') && n.endsWith('>')) {
            return MQ.__create__(n.slice(1,-1), o)
        }
        try {
            this.#nl = [...document.querySelectorAll(n)]
        }
        catch (err) {
            throw new MQInvalidSelectorError("Invalid Selector")
        }
        this.#wrap()
        if (this.#nl.length === 0) {
            this.length = 0
        }
        else {
            this.length = this.#nl.length
        }
        return this.#nl.length == 1 ? this.first() : this
    }

    first() {return this.#nl[0]}

    last() {return this.#nl[this.#nl.length - 1]}

    nth(n) {
        n = parseInt(n)
        if (isNaN(n)) throw new MQIllegalArguementError("Illegal Argument")
        n += n < 0 ? this.#nl.length : 0
        if (!(0 < n < this.#nl.length)) throw new MQIndexOutOfBoundsError("Index Out Of Bounds")
        return this.#nl[n]
    }

    each(c) {
        if (typeof c !== 'function') throw new MQIllegalArguementError("Illegal Argument")
        for(let _ of this.#nl) {
            c(_)
        }
        return this
    }

    static __create__(n, o) {
        let _
        try {
            _ =  new NodeWrapper(document.createElement(n))
        }
        catch (err) {
            console.log(err)
            throw new MQElementCreationError(`Cannot create element ${n}`)
        }
        for(let __ of Object.keys(o)) {
            _.get()[__] = o[__]
        }
        return _
    }

    #wrap() {
        this.#nl = this.#nl.map(_ => new NodeWrapper(_))
    }

    * list() {
            yield* this.#nl
    }

    length() {return this.#nl.length}

    css(p, v) {
        if (!p || !v) throw new MQIllegalArguementError("Poperty and Value must be specified")
        for(let _ of this.#nl) {
            _.css(p, v)
        }
    }

    click() {return this.each(e => e.click())}

    html(t) {
        if (!t) throw new MQIllegalArguementError("No arguments specified for NodeWrapper.html(t)")
        return this.each(e => e.html(t))
    }

    text(t) {
        if (!t) throw new MQIllegalArguementError("No arguments specified for NodeWrapper.text(t)")
        return this.each(e => e.text(t))
    }

    on(e,c,u) {return this.each(q => q.on(e, c, u))}
    appendTo(n) {return this.each(e => e.appendTo(n))}
    addClass(...c) {return this.each(e => e.addClass(...c))}
    removeClass(...c) {return this.each(e => e.removeClass(...c))}
}

class NodeWrapper {
    constructor(n) {
        this.n = n
        this.length = 1
        this.__isProxy = false
        return NodeWrapper.#proxify(this)
    }

    click() {
        this.n.click()
        return this
    }

    html(t) {
        if (!t) return this.n.innerHTML
        this.n.innerHTML = `${t}`
        return this
    }

    text(t) {
        if (!t) return this.n.innerText
        this.n.innerText = `${t}`
        return this
    }

    css(p, v) {
        if (!p) return this.n.style
        if (!v) return getComputedStyle(this.n).getPropertyValue(`${p}`)
        this.n.style.setProperty(`${p}`, `${v}`)
        return this
    }

    on(e, c, u) {
        if (!e || !c) throw new MQEventBindError(`Cannot bind callback ${c} to event ${e}`)
        if (typeof c !== 'function') throw new MQEventBindError(`Cannot bind callback ${c} to event ${e}, because ${c} is not a function`)
        this.n.addEventListener(e, c, u)
        return this
    }

    append(...n) {
        if (!n) return this
        for(let _ of n) {
            if (_ instanceof NodeWrapper) {
                this.n.appendChild(_.get())
            } else {
                this.n.appendChild(_)
            }
        }
        return this
    }

    appendTo(n) {
        let k
        if (typeof n === 'string') k = (new MQ(n, {__str__:true})).get()
        else if (n instanceof NodeWrapper) k = n.get()
        else k = n
        k.appendChild(this.n)
        return this
    }

    get() {return this.n}

    addClass(...c) {
        if (!c) throw new MQIllegalArguementError(`Cannot add class ${c}`)
        for(let _ of c) {
            this.n.classList.add(_)
        }
        return this
    }

    removeClass(...c) {
        if (!c) throw new MQIllegalArguementError(`Cannot add class ${c}`)
        for(let _ of c) {
            this.n.classList.remove(_)
        }
        return this
    }

    find(n) {
        if (typeof n === 'string') {
            const _ = this.n.querySelector(`${n}`)
            if (_) return new NodeWrapper(_)
            return null
        } else {
            throw new MQIllegalArguementError("Can only find by by CSS Selector")
        }
    }

    contains(n) {
        if (n instanceof NodeWrapper) {
            return this.n.contains(n.get())
        }
        else if (n instanceof HTMLElement) {
            return this.n.contains(n)
        }
        else {
            throw new MQIllegalArguementError("contains can only find HTMLElement or NodeWrapper objects")
        }
    }

    static #proxify(t) {
        if (t.__isProxy) return t
        t.__isProxy = true
        return new Proxy(t, {
            get: (_t, p, r) => {
                return (p in _t) ? _t[p] : t.n[p]
            },
            set: (_t, p, v, r) => {
                if (p in _t) {
                    _t[p] = v
                }
                else {
                    t[p] = v
                }
            },
        })
    }

    list() {
        return [this]
    }
}

class MQError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class MQInvalidSelectorError extends MQError {}
class MQEventBindError extends MQError {}
class MQIllegalArguementError extends MQError {}
class MQIndexOutOfBoundsError extends MQError {}
class MQElementCreationError extends MQError {}
