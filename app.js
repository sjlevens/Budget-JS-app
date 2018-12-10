/*
 * To Do List
 * 1. Set up event handler for click
 * 2. Get input values
 * 3. Add the new items to our data structure
 * 4. Add the new item to the UI
 * 5. Calculate budget
 * 6. Update the UI
 * 
 * Modules
 * UI modules
 * 
 * Data module
 * 
 * Controller module
 * 
 * 
 * */

/*return {
        publicTest: function () {
            console.log('hello');
        }
    }*/


//Budget Controller Module
var budgetController = (function () {
    
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {

        if (totalIncome > 0) {

            this.percentage = Math.round((this.value / totalIncome) * 100);

        } else { this.percentage = -1;}
        

    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1


    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (current) {
            sum += current.value;

        });
        data.totals[type] = sum;

    };

    //Public method

    return {
        addItem: function (type, des, val) {

            var newItem;

            //Creat new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }




            //Create new item
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push in to data structure
            data.allItems[type].push(newItem);

            //Return the new element
            return newItem;

        },

        deleteItem: function (type, ID) {
            var IDs, index;

            IDs = data.allItems[type].map(function (current){
                return current.id;
            });

            index = IDs.indexOf(ID);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            };
        },

        calculateBudget: function () {

            //calc total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else { data.percentage = -1;}


        },
        calculatePercentages: function () {

            //calc exp percentages
            data.allItems.exp.forEach(function (current) {

                current.calcPercentage(data.totals.inc);

            });


        },

        getPercentages: function () {

            var allPercentages = data.allItems.exp.map(function (current) {
                return current.getPercentage();
            });
            return allPercentages;

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage:data.percentage
            };
        }
    };

})();


//UI Controller Module
var UIController = (function () {

    //Private
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'


    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec;
        // 1234.5678 --> + 1,234.56

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    }

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        };
    };


    //Public
    return {
        getInput: function () {
            return {

                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)


            }


        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            //Create HTML string with placeholder
            //console.log(type);
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description" >%description%</div ><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
            } else if (type === 'exp') {

                element = DOMstrings.expenseContainer;


                html = '<div class="item clearfix" id = "exp-%id%" ><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
            }

            //Replace placeholder text

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            //Insert HTML in to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        deleteListItem: function (selectorID) {

            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);

        },

        //Display budget

        displayBudget: function (obj) {

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            };


        },

        displayPercentages: function (percentages) {
            var fields;

            fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                    console.log(current.textContent);

                } else { current.textContent = '--'; };


            });

        },

        displayMonth: function () {
            var now, year, month, months;
            now = new Date();

            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        changedType: function () {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function (current) {

                current.classList.toggle('red-focus');

            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');

        },

        getDOMstrings: function () {
            return DOMstrings;
        },

        //Clear inputs
        clearFields: function () {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue); //returns list

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, array) {
                current.value = "";

            });

            fieldsArray[0].focus();

        },

        
    };


})();


//GLOBAL Controller Module
var controller = (function (budgetCtrl, UICtrl) {

    

    var setupEventListeners = function () {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

        document.addEventListener('keypress', function (event) {

            if (event.keyCode === 13 || event.which === 13) {

                ctrlAddItem();

            }

        });

    };

    var updateBudget = function () {

        //4. Calculate the budget
        budgetCtrl.calculateBudget();

        //4.5 return the budget
        var budget = budgetCtrl.getBudget();

        //5. Display the budget on UI
        UICtrl.displayBudget(budget);

    }

    var updatePercentages = function () {

        //Calc percentages
        budgetCtrl.calculatePercentages();

        //Read from budget controller
        var percentages = budgetCtrl.getPercentages();

        //Update UI

        UICtrl.displayPercentages(percentages);


    }
    var ctrlDeleteItem = function (event) {
        var itemID;
        var splitID;
        var type;
        var ID;
        //Hard coded DOM traversal
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            //inc-1 or exp-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //Delete item from data structure
            budgetCtrl.deleteItem(type, ID);

            //Delete item from UI
            UICtrl.deleteListItem(itemID);

            //Update and show new budget
            updateBudget();
            updatePercentages();

        }

    };
    var ctrlAddItem = function () {

        var input, newItem;

        //To do list

        //1. Get the input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            //2. Add the item to the budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value);

            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //3.5 clear input fields
            UICtrl.clearFields();


            //4. update budget

            updateBudget();
            updatePercentages();




        };
        


    };

    
    //Public init
    return {
        init: function () {
            console.log('App started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
            UICtrl.displayMonth();
        }
    }


})(budgetController, UIController);

controller.init();
