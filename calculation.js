
var natureValues = {
    "positive" : 1.1,
    "neutral" : 1,
    "negative" : 0.9
}

// function for converting natures to the value
function natureToValue(nature, stat)
{
    if (nature_stats[nature]["increased_stat"] === stat) return 1.1;
    if (nature_stats[nature]["decreased_stat"] === stat) return 0.9;
    return 1;
}

// calculate hp total based on base stat, evs, ivs, and level
function HPStatCalc(base, iv, ev, level)
{
    calc1 = (2 * base + iv + Math.floor(ev/4)) * level;
    return Math.floor(calc1/100) + level + 10;
}

// calculate stat based on base stat, evs, ivs, level, and nature
function StatCalc(base, iv, ev, level, nature)
{
    calc1 = (2 * base + iv + Math.floor(ev/4)) * level;
    return Math.floor((Math.floor(calc1/100) + 5) * nature);
}

// calculate damage based on level, base power, atk/def stats, and other multipliers
function DamageCalc(level, power, atk, def, stab, type, other)
{
    calc1 = Math.floor(Math.floor((Math.floor((2 * level)/5) + 2) * power * atk / def)/50 + 2)
    calc1 = mult(calc1, stab);
    calc1 = mult(calc1, type);
    calc1 = mult(calc1, other);
    return calc1;
}

// the function that is called when the button is pressed
function CalcLowest()
{
    physical = (document.getElementById("moveCategory").value === "physical");
    // target div
    targetLevel   = parseInt(document.getElementById("targetLevel").value);
    targetBaseHP  = parseInt(document.getElementById("targetBaseHP").value);
    targetHPIV    = parseInt(document.getElementById("targetHPIV").value);

    targetBaseDef = (physical ? 
        parseInt(document.getElementById("targetBaseDef").value) :
        parseInt(document.getElementById("targetBaseSpDef").value)
    );
    targetDefIV   = (physical ? 
        parseInt(document.getElementById("targetDefIV").value) :
        parseInt(document.getElementById("targetSpDefIV").value)
    );

    remainingEVs  = parseInt(document.getElementById("remainingEVs").value);
    targetNature  = document.getElementById("targetNatureMenu").value;

    // attacker div
    attackLevel   = parseInt(document.getElementById("attackLevel").value);

    attackBaseAtk = (physical ? 
        parseInt(document.getElementById("attackBaseAtk").value) :
        parseInt(document.getElementById("attackBaseSpAtk").value) 
    );
    attackAtkIV   = (physical ?
        parseInt(document.getElementById("attackAtkIV").value) :
        parseInt(document.getElementById("attackSpAtkIV").value)
    );
    attackAtkEV   = (physical ? 
        parseInt(document.getElementById("attackAtkEV").value) :
        parseInt(document.getElementById("attackSpAtkEV").value)
    );

    attackNature  = document.getElementById("attackNatureMenu").value;

    // move div
    movePower     = parseInt(document.getElementById("movePower").value);
    STAB          = document.getElementById("STAB").checked;
    typeEffective = Number(document.getElementById("typeEffective").value);
    otherMult     = parseInt(document.getElementById("otherMult").value);

    // handling misc attributes
    targetNature = natureToValue(targetNature, (physical ? "defense" : "special-defense"));
    attackNature = natureToValue(attackNature, (physical ? "attack" : "special-attack"));

    STAB = (STAB ? 1.5 : 1);

    if (errorValues())
    {
        document.getElementById("result").innerHTML = "lol";
        document.getElementById("result").style.visibility = "visible";
        return;
    }

    damages = []

    // loop through and calculate each combination of evs
    for (i = 0; i < remainingEVs; i++)
    {
        HP_EV = Math.min(252, i);
        DEF_EV = Math.min(252, remainingEVs - i);

        damages.push(DamageCalc(attackLevel, movePower, 
            StatCalc(attackBaseAtk, attackAtkIV, attackAtkEV, attackLevel, attackNature), 
            StatCalc(targetBaseDef, targetDefIV, DEF_EV, targetLevel, targetNature), 
            STAB, typeEffective, otherMult)/
            HPStatCalc(targetBaseHP, targetHPIV, HP_EV, targetLevel));
    }

    lowest = 1000;
    lowestIndex = -1;

    // find the smallest amount of damage
    for (i = 0; i < damages.length; i++)
    {
        if (damages[i] < lowest)
        {
            lowest = damages[i];
            lowestIndex = i;
        }
    }
    lowest = round(lowest * 100, 1);

    //console.log(lowest, lowestIndex);
    document.getElementById("result").innerHTML =
    "In order to take a minimum high roll of <b>" + lowest.toString() + 
    "%</b>, you would need to invest <b>" + Math.min(252, lowestIndex).toString() +
    "</b> EV's into HP, and <b>" + Math.min(252, remainingEVs-lowestIndex).toString() +
    "</b> EV's into " + (physical ? "Defense" : "Special Defense") +". Any set besides this is <b>cowardice</b>."
    document.getElementById("result").style.visibility = "visible";
}

// rounded multiplication
function mult(a, b)
{
    result = a * b;
    result = (result - Math.floor(result) == 0.5 ? Math.floor(result) : Math.round(result));
    return result;
}

// round function
function round(n, digits)
{
    tens = Math.pow(10, digits)
    return Math.floor(tens * n)/tens
}

// function for checking if inputted numbers are correct
function errorValues()
{
    values = [
        targetLevel,
        targetBaseHP,
        targetHPIV,
        targetBaseDef,
        targetDefIV,
        remainingEVs,
        targetNature,

        attackLevel,
        attackBaseAtk,
        attackAtkIV,
        attackAtkEV,
        attackNature,

        movePower,
        STAB,
        typeEffective,
        otherMult,
    ]
    
    for (i = 0; i < values.length; i++)
    {
        if (![6, 11, 13, 14].includes(i)) // if the current index is a number
        {
            if (isNaN(values[i])) // if parsing the value
            {
                return true;
            } 
        }
    }
    return false;
}