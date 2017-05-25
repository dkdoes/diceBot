const Eris = require("eris")

//your bot token goes here
bot = new Eris(token)

//regular expression to recognize some basic dice notation
re = /^([0-9]+)[dD]([0-9]+)([\+-]?)([0-9]*)$/

//regular expression for Cat's dice
re2 = /^[tT][mMhHlL]$/

gmNicks = ['nori']

rollMode = 1

bot.on("ready", () => {
    console.log("Ready!")
})
 
//when bot gets a message
bot.on("messageCreate", (msg) => {
    //check if the message has dice notation
    if(re.test(msg.content)) {
        
        //save the dice notation
        var dice = msg.content.match(re)
        
        //check if the number of dice or the size of the die is 0
        //if they aren't, then roll the dice
        
        var dieCount = dice[1]
        var dieSize = dice[2]
        
        //if you add something to the total, like
        //1d20+5, this deals with the "+5":
        var operator = dice[3]
        var arithmeticOperand = dice[4]
        
        if (dieCount!='0'&&dieSize!='0'){
            //running total, all the dice results added together
            var total = 0
            
            //list of all the dice results
            var dieList = []
            
            //number of dice, max 100
            var dieCount = Math.min(100,parseInt(dieCount))
            
            for(i=0;i<dieCount;i++){
                //roll the die
                var die = parseInt(Math.random()*parseInt(dieSize))+1
                
                //add die result to list of dice
                dieList.push(die)
                
                //add die result to toal
                total += (die)
            }
            if (operator=='-'){
                total -= parseInt(arithmeticOperand)
            }
            else if (operator=='+'){
                total += parseInt(arithmeticOperand)
            }
            var diceMessage = msg.author.username + ' rolled '
            diceMessage += dieCount + 'd' + dieSize + operator + arithmeticOperand
            diceMessage += ':\n' + dieList.join(', ') + ': ' + total
            bot.createMessage(msg.channel.id, diceMessage)
        }
    }
    else if (re2.test(msg.content)){
        //roll 3d20
        var dieList = []
        for (var i = 0; i < 3; i++){
            var die = parseInt(Math.random()*20)+1
            dieList.push(die)
        }
        
        //roll 1d4
        var catRoll = parseInt(Math.random()*4)+1
        console.log(catRoll)
        if (catRoll <= rollMode){
            
            //duplicate and sort the list of dice rolled
            var dieList2 = dieList.slice()
            dieList2.sort(function(a,b){return b-a})
            
            //figure out what kind of roll it is and yeah
            var rollType = msg.content.toLowerCase()[1]
            if (rollType == 'l'){
                for (var i = 0; i < 3; i++){
                    if (dieList[i] == dieList2[2]){
                        dieList[i] = "**" + dieList[i] + "**"
                        break
                    }
                }
            }
            else if (rollType == 'm'){
                for (var i = 0; i < 3; i++){
                    if (dieList[i] == dieList2[1]){
                        dieList[i] = "**" + dieList[i] + "**"
                        break
                    }
                }
            }
            else if (rollType == 'h'){
                for (var i = 0; i < 3; i++){
                    if (dieList[i] == dieList2[0]){
                        dieList[i] = "**" + dieList[i] + "**"
                        break
                    }
                }
            }
        }
        else{
            dieList[0] = "**" + dieList[0] + "**"
        }
        var diceMessage = msg.author.username + ' rolled ' + dieList.join(', ')
        bot.createMessage(msg.channel.id, diceMessage)
    }
    else if (gmNicks.indexOf(msg.author.username) >= 0){
        var caseInsensitiveContent = msg.content.toLowerCase()
        caseInsensitiveContent == 'set 1' ? rollMode = 1 :
        caseInsensitiveContent == 'set 2' ? rollMode = 2 :
        caseInsensitiveContent == 'set 3' ? rollMode = 3 :
        caseInsensitiveContent == 'set 4' && (rollMode = 4)
        console.log("roll mode " + rollMode)
    }
})
 
bot.connect()
