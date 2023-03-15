natureValues = {
    "positive" : 1.1,
    "neutral" : 1,
    "negative" : 0.9
}

typeValues = {
    "super" : 2,
    "normal" : 1,
    "weak" : 0.5
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
    calc1 = ((((2 * level)/5) + 2) * power * (atk/def))/50 + 2
    return Math.floor(calc1 * stab * type * other);
}

// the function that is called when the button is pressed
function CalcLowest()
{
    // target div
    targetLevel   = parseInt(document.getElementById("targetLevel").value);
    targetBaseHP  = parseInt(document.getElementById("targetBaseHP").value);
    targetHPIV    = parseInt(document.getElementById("targetHPIV").value);
    targetBaseDef = parseInt(document.getElementById("targetBaseDef").value);
    targetDefIV   = parseInt(document.getElementById("targetDefIV").value);
    remainingEVs  = parseInt(document.getElementById("remainingEVs").value);
    targetNature  = document.getElementById("targetNature").value;

    // attacker div
    attackLevel   = parseInt(document.getElementById("attackLevel").value);
    attackBaseAtk = parseInt(document.getElementById("attackBaseAtk").value);
    attackAtkIV   = parseInt(document.getElementById("attackAtkIV").value);
    attackAtkEV   = parseInt(document.getElementById("attackAtkEV").value);
    attackNature  = document.getElementById("attackNature").value;

    // move div
    movePower     = parseInt(document.getElementById("movePower").value);
    STAB          = document.getElementById("STAB").checked;
    typeEffective = document.getElementById("typeEffective").value;
    otherMult     = parseInt(document.getElementById("otherMult").value);

    // handling misc attributes
    targetNature = natureValues[targetNature];
    attackNature = natureValues[attackNature];
    STAB = (STAB ? 1.5 : 1);
    typeEffective = typeValues[typeEffective];

    if (errorValues())
    {
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
            StatCalc(attackBaseAtk, attackAtkIV, attackAtkEV, attackLevel, 1.1), 
            StatCalc(targetBaseDef, targetDefIV, DEF_EV, targetLevel, 1), 
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

    console.log(lowest, lowestIndex);
    document.getElementById("result").innerHTML =
    "In order to take a minimum high roll of <b>" + lowest.toString() + 
    "%</b>, you would need to invest <b>" + lowestIndex.toString() +
    "</b> EV's into HP, and <b>" + (remainingEVs-lowestIndex).toString() +
    "</b> EV's into Defense / Special Defense."
    document.getElementById("result").style.visibility = "visible";
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

// function for adjusting the input fields
function limitValue(input)
{
    const minValue = parseInt(input.min);
    const roundedValue = Math.round(input.value);
    const newValue = roundedValue < minValue ? minValue : roundedValue;
    input.value = newValue;
}

// round function
function round(n, digits)
{
    tens = Math.pow(10, digits)
    return Math.round(tens * n)/tens
}

