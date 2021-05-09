// (:INFO) : choses à faire
// /*!*/ : chose à supprimer en après avoir fait évolution de l'algorithme

class Calculator {

    static clamp = function(nbr) {
        console.log(+nbr.toPrecision(12))
        return +nbr.toPrecision(12)
    }

    // types
    static OPERATOR = "operator"; static DIGIT = "digit"

    constructor(inputList) {

        this.firstOp = { value: 4 }
        this.secondOp = { value: 4 }
        this.entry = { stateChanged: false, value: 0 }
        this.op = {
            type: Calculator.OPERATOR,
            symbol: "×",
            exec: (a, b) => Calculator.clamp(a * b),
            actions: [Calculator.addOperand]
        }

        this.view = document.createElement("div")
        document.body.appendChild(this.view)
        this.view.innerHTML = `${this.firstOp.value ?? ""} ${this.op ? this.op.symbol : ""} ${this.secondOp.value ?? ""}`

        this.display = document.createElement("input")
        this.display.value = 0
        document.body.appendChild(this.display)
        this.display.oninput = () => {this.entry.stateChanged = true; this.entry.value = +this.display.value}

        inputList.forEach(input => {
            const btn = document.createElement("button")
            btn.innerHTML = input.symbol
            btn.onclick = this.onInput.bind(this, input, btn)
            document.body.appendChild(btn)
        })

    }

    // get entry() {
    //     return this._entry.value
    // }

    // set entry(v) {
    //     console.log(this._entry.value)
    //     this._entry.value = v
    // }

    resetEntry(value) { this.entry.value = value; this.entry.stateChanged = false }

    draw() {
        this.display.value = this.entry.value
    }

    update(calc) {
        this.resetEntry(calc)
        this.draw()
    }

    execInputFromType(input) {
        switch(input.type) {
            case Calculator.OPERATOR:
                // s'il y a les deux opérandes (et sous entendu un opérateur) ou que l'entrée a été modifiée
                if((this.firstOp.value && this.secondOp.value) || this.entry.stateChanged) {
                    // si une opérande à déjà été définie on l'utilise et on ajoute la nouvelle
                    const opToExec = this.op ?? input
                    const calc = opToExec.exec(this.firstOp.value, this.secondOp.value ?? this.entry.value)
                    this.firstOp.value = calc
                    this.update(calc)
                    
                    if(this.secondOp.value) this.secondOp.value = null
                }
                // s'il n'y a aucune valeur de première opérande en créer une
                if(this.firstOp.value == null) {this.firstOp.value = this.entry.value; console.log(this.entry.value)}

                this.op = input // si la condition n'a pas été vérifiée changer l'opérande
                console.log(this.firstOp.value)
                /*!*/ this.view.innerHTML = `${this.firstOp.value} ${this.op.symbol} ${this.secondOp.value ?? ""}`
                break
                case Calculator.DIGIT:
                    if(this.secondOp.value) this.secondOp.value = null
                    const calc = input.exec()
                    this.entry.value = this.entry.stateChanged ? +((this.entry.value.toString() + calc).slice(0, 16)) : calc
                    this.entry.stateChanged = true
                    this.draw()
                    /*!*/ this.view.innerHTML = `${this.firstOp.value} ${this.op.symbol} ${this.secondOp.value ?? ""}`
       }
    }

    onInput(input) {
        this.execInputFromType(input)
    }

}

// add: a, substract: s, multiply: m, divide: d,
const inputs = [
    // operators
    {
        type: Calculator.OPERATOR, // détermine un type d'action
        symbol: "+",
        exec: (a, b) => Calculator.clamp(a + b)
    },
    {
        type: Calculator.OPERATOR,
        symbol: "−",
        exec: (a, b) => Calculator.clamp(a - b)
    },
    {
        type: Calculator.OPERATOR,
        symbol: "×",
        exec: (a, b) => Calculator.clamp(a * b),
    },
    {
        type: Calculator.OPERATOR,
        symbol: "÷",
        exec: (a, b) => Calculator.clamp(a / b),
    },
]

new Array(10).fill(null).forEach((_, i) => inputs.push({
    type: Calculator.DIGIT,
    symbol: `${i}`,
    exec: () => i
}))

// "1" entry = 1
// "1 +" entry = 1 | "+" tapé
//  ""

const calculator = new Calculator(inputs)

function addSecondOp(v) {
    calculator.secondOp.value = v
    /*!*/ calculator.view.innerHTML = `${calculator.firstOp.value} ${calculator.op.symbol} ${calculator.secondOp.value ?? ""}`
}