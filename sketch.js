function HPStatCalc(base, iv, ev, level)
{
    calc1 = (2 * base + iv + Math.floor(ev/4)) * level;
    return Math.floor(calc1/100) + level + 10;
}

function StatCalc(base, iv, ev, level, nature)
{
    calc1 = (2 * base + iv + Math.floor(ev/4)) * level;
    return Math.floor((Math.floor(calc1/100) + 5) * nature);
}

function DamageCalc(level, power, atk, def, stab, type, other)
{
    calc1 = ((((2 * level)/5) + 2) * power * (atk/def))/50 + 2
    return Math.floor(calc1 * stab * type * other);
}

remainingEVs = 336;
damages = []

for (i = 0; i < remainingEVs; i++)
{
    HP_EV = Math.min(252, i);
    DEF_EV = Math.min(252, remainingEVs - i);
    //console.log(HP_EV, DEF_EV);

    damages.push(DamageCalc(100, 110, 
        StatCalc(92, 31, 252, 100, 1.1), 
        StatCalc(80, 31, DEF_EV, 100, 1), 1.5, 2, 1)/
        HPStatCalc(114, 31, HP_EV, 100));
}

lowest = 1000;
lowestIndex = -1;

for (i = 0; i < damages.length; i++)
{
    if (damages[i] < lowest)
    {
        lowest = damages[i];
        lowestIndex = i;
    }
}
lowest = lowest.toFixed(3);

//console.log(damages);
console.log(lowest, lowestIndex);



